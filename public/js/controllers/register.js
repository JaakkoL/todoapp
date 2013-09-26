define([
  'hbs!templates/register',
  'bjq'
], function(template, bjq) {

  function render(element) {
    element.html(template());
    bindEvents(element);
  }

  // Login form events.
  function bindEvents(element) {

    var email = bjq.textFieldValue(element.find('.email'), ''),
        password = bjq.textFieldValue(element.find('.password'), ''),
        firstName = bjq.textFieldValue(element.find('.firstName'), ''),
        lastName = bjq.textFieldValue(element.find('.lastName'), '');

    var buttonEnabled = (function() {
      return email.map(nonEmpty)
        .and(password.map(nonEmpty))
        .and(firstName.map(nonEmpty))
        .and(lastName.map(nonEmpty))
        .and(email.map(validEmail));
    })();

    // Login submit handling.
    var registerButtonClick = element.find('[data-action="register"]').asEventStream('click').doAction('.preventDefault');
    var registerResponse = Bacon.combineTemplate( {email : email, password : password, firstName : firstName, lastName : lastName} )
      .sampledBy(registerButtonClick)
      .flatMap(registerRequest);

    registerResponse.onValue(function(response) {
      element.addClass('flipped');
    });

    registerResponse.onError(function(err) {
      var options = {
          type : err.responseJSON.type,
          message : err.responseJSON.message,
          autoRemove : true,
          log : err.responseText
      }

      notification.show(options);
    });

    // Side effects.
    buttonEnabled.not().onValue(element.find('[data-action="register"]'), 'attr', 'disabled');
    // TODO: Ajax throbber for pending requests.
  }

  function registerRequest(data) {
    return Bacon.once({
        url: '/register',
        type: "post",
        data: data
      }).ajax();
  }

  return {
    init: render
  }

});