define([
  'hbars!templates/list/listing',
  'lodash'
], function (tplMain, _) {
  var element;

  function render(elem) {
    element = elem;
    element.html(tplMain());
    bindEvents();
  }

  function bindEvents() {
    var addButtonClick = element.find('[data-action="add-new-list"]').asEventStream('click').doAction('.preventDefault');

    addButtonClick.onValue(function() {
      console.log('aaaaa')
    });

  }

  return {
    init: render
  }
})
