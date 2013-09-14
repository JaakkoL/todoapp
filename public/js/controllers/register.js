define([
  'hbars!templates/register',
], function(template) {

  function render(element) {
    element.html(template());
  }

  return {
    render: render
  }

});