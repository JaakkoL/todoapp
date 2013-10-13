define([
  'hbs!templates/list/add-list',
  'bjq',
  'controllers/list-view',
  'tagit'
], function (tplAdd, bjq, listView, tags) {
  var element;

  function render(elem) {
    element = elem;

    element.html(tplAdd());
    bindEvents(element);
  }

  function bindEvents(element) {

    var name = bjq.textFieldValue(element.find('.name'), ''),
        tags = bjq.textFieldValue(element.find('.tags'), '');

    var tagit = element.find('.tags');

    tagit.tagit({
      availableTags: ["c++", "java", "php", "javascript", "ruby", "python", "c"],
      allowSpaces: true,
      placeholderText: 'add tag'
    });

    var addButtonClick = element.find('[data-action="add-new-list"]').asEventStream('click').doAction('.preventDefault');

    var addRequest = name.combine(tags, function(n, t) {
      return {
        type: 'post',
        url: 'list/add',
        data: {name: n, tags: tagit.tagit("assignedTags")}
      };
    }).sampledBy(addButtonClick);

    var addResponse = addRequest.ajax();
    var addPending = addRequest.awaiting(addResponse);

    addResponse.onValue(function(response) {
      clearForm(element.find('form'));
      $('#left-panel-nav').find('a').first().trigger('click');
      listView.add(response.data);
    });

    addResponse.onError(function(err) {
      // TODO: Proper error handling.
      console.log('adding new list failed');
      console.log(err);
    });

    var buttonEnabled = (function() {
      return name.map(nonEmpty);
    })();

    buttonEnabled.onValue(setEnabled, element.find('[data-action="add-new-list"]'));
  }

  function clearForm(form) {
    form.find('input').each(function(i, el) {
      $(el).val('');
    });
  }

  return {
    init: render
  }
})
