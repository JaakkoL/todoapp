define([
  'hbars!templates/list/add-list',
  'lodash',
  'bjq'
], function (tplAdd, _, bjq) {
  var element;

  function render(elem) {
    element = elem;

    element.html(tplAdd());
    bindEvents(element);
  }

  function bindEvents(element) {

    var addButtonClick = element.find('[data-action="add-new-list"]').asEventStream('click').doAction('.preventDefault');

    var addRequest = Bacon.once({
       type: 'post',
       url: 'list/add',
       data: {fuu: 'bar'}
     }).sampledBy(addButtonClick);

    var addResponse = addRequest.ajax();
    var addPending = addRequest.awaiting(addResponse);

    addResponse.onValue(function(response) {
      // TODO: Do something.
      console.log('success');
      console.log(response);
      //window.location.reload();
    });

    addResponse.onError(function(err) {
      // TODO: Proper error handling.
      console.log('epic fail');
      console.log(err);
      //window.location.reload();
    });
  }

  return {
    init: render
  }
})
