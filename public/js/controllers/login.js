define([
  'hbars!templates/login',
  'lib/helpers',
  'bjq'
], function(template, helpers, bjq) {

  // Renders the login form inside element.
  function render(element) {
    element.html(template());
    bindEvents(element);
  }

  // Login form events.
  function bindEvents(element) {

    var email = bjq.textFieldValue(element.find('.email'), ''),
        password = bjq.textFieldValue(element.find('.password'), '');

    var buttonEnabled = (function() {
      return email.map(nonEmpty)
        .and(password.map(nonEmpty))
        .and(email.map(validEmail));
    })();

    // Login submit handling.
    var loginButtonClick = element.find('[data-action="login"]').asEventStream('click').doAction('.preventDefault');
    var loginResponse = Bacon.combineTemplate( {email : email, password : password} )
      .sampledBy(loginButtonClick)
      .flatMap(loginRequest);

    loginResponse.onValue(function(response) {
      // TODO: Redirect to application page.
      console.log('success');
      console.log(response);
      window.location.reload();
    });

    loginResponse.onError(function(err) {
      // TODO: Show error message.
      console.log('error occured');
      console.log(err);
    });

    // Side effects.
    buttonEnabled.not().onValue(element.find('[data-action="login"]'), 'attr', 'disabled');
    // TODO: Ajax throbber for pending requests.
  }

  function loginRequest(credentials) {
    return Bacon.once({
        url: '/login',
        type: "post",
        data: credentials
      }).ajax();
  }


  return {
    init: render
  }

});