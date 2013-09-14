define([
  'hbars!templates/login',
], function(template) {

  function render(element) {
    element.html(template());
  }

  return {
    render: render
  }

});