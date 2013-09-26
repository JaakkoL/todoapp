define([
  'hbs!templates/right-panel'
], function (tplRightPanel) {
  var element;

  function render(elem) {
    element = elem;
    element.html(tplRightPanel());
  }

  return {
    init: render
  }
})
