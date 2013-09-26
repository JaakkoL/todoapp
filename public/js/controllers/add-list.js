define([
  'hbars!templates/list/add-list',
  'bjq',
  'controllers/list-view'
], function (tplAdd, bjq, listView) {
  var element;

  function render(elem) {
    element = elem;

    element.html(tplAdd());
    bindEvents(element);
  }

  function bindEvents(element) {

    var name = bjq.textFieldValue(element.find('.name'), ''),
        category = bjq.textFieldValue(element.find('.category'), '');

    var addButtonClick = element.find('[data-action="add-new-list"]').asEventStream('click').doAction('.preventDefault');

    var addRequest = name.combine(category, function(n, c) {
      return {
        type: 'post',
        url: 'list/add',
        data: {name: n, category: c}
      };
    }).sampledBy(addButtonClick);

    var addResponse = addRequest.ajax();
    var addPending = addRequest.awaiting(addResponse);

    addResponse.onValue(function(response) {
      listView.add(response);
    });

    addResponse.onError(function(err) {
      // TODO: Proper error handling.
      console.log('adding new list failed');
      console.log(err);
    });
  }

  return {
    init: render
  }
})
