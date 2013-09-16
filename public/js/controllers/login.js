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


    // Login submit handling.
    var loginButtonClick = element.find('[data-action="login"]').asEventStream('click').doAction('.preventDefault');

    var loginRequest = email.combine(password, function(e, p) {
      return {
         url: '/login',
         type: "post",
         data: {email: e, password: p}
       };

    }).sampledBy(loginButtonClick);

    var loginResponse = loginRequest.ajax();

    var loginPending = loginRequest.awaiting(loginResponse);


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
    var buttonEnabled = (function() {
          return email.map(nonEmpty)
            .and(password.map(nonEmpty))
            .and(email.map(validEmail));
        })();


    var throbber = element.find('.throbber');
    buttonEnabled.onValue(setEnabled, element.find('[data-action="login"]'));
    loginPending.onValue(setVisibility, throbber);
    loginPending.onError(setVisibility, throbber);
    // TODO: Ajax throbber for pending requests.
  }


  return {
    init: render
  }

});