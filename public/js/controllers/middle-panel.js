define([
  'hbars!templates/middle-panel',
  'controllers/list-view'
], function (tplMiddlePanel, listView) {
  var element;

  function render(elem) {
    element = elem;
    element.html(tplMiddlePanel());
    listView.init($('#list-listing'))
  }


  return {
    init: render
  }
})
