define([
  'hbs!templates/toolbar',
  'lib/helpers',
  'bjq'
], function(template, helpers, bjq) {

  // Renders the login form inside element.
  function render(element) {

    element.html(template({firstname : 'User'}));
    bindEvents(element);
  }

  // Login form events.
  function bindEvents(element) {


    var logoutButtonClick = element.find('[data-action="logout"]').asEventStream('click').doAction('.preventDefault');

    function logoutRequest() {
      return Bacon.once({
          url: '/logout',
          type: "post",
          data: {}
        }).sampledBy(logoutButtonClick).ajax();
    }

    var logoutResponse = logoutRequest();

    logoutResponse.onValue(function(response) {
      console.log('logout success');
      console.log(response)
      window.location.reload();
    });

    logoutResponse.onError(function(err) {
      console.log('logout error');
      console.log(err)
    });
  }

  return {
    init: render
  }

});