define([
  'hbs!templates/right-panel',
  'hbs!templates/task/task-element'
], function (tplRightPanel, tplTask) {
  var element;

  function render(elem, data) {
    element = elem;
    console.log(data)
    element.html(tplRightPanel(data));

    bindEvents(element);
  }

  function bindEvents(element) {
    var addNewTask = element.find('#add-new-task'),
        addNewTaskStream = addNewTask.asEventStream('keyup')
                            .filter(enterKey).map(function(e) { return $(e.target).val(); }),
        taskList = element.find('.tasks-list');

    addNewTaskStream.onValue(function(text) {
      addNewTask.val('');
      var listId = addNewTask.data('listid');
      console.log(listId)

      // TODO: Insert into database.
      addTask(listId, text).done(function(response) {
        var listItem =  tplTask({text : text});
        taskList.append(listItem);
        bindListEvents(taskList.children('li'));
      })

    });

    bindListEvents(taskList.children('li'));

    // Stop editing mode on outside click.
    $('body').on('click', function(e) {
      if (!$(e.target).hasClass('edit')) {
        taskList.find('li').removeClass('editing');
      }
    });
  }

  function addTask(listId, text) {
    var deferred = $.Deferred();
      var addRequest = Bacon.once({
        type: 'post',
        url: 'task/add',
        data: {listId : listId, text : text}
      }).ajax();

      addRequest.onValue(function(data) {
        deferred.resolve(data);
      })

      addRequest.onError(function(err) {
        console.log(err);
        deferred.reject(err);
      })

      return deferred;
  }

  // List item events.
  function bindListEvents(listItems) {
    listItems.find('.label').not('.processed').on('dblclick', function(e) {
      e.preventDefault();
      $(this).addClass('processed');
      var $this = $(this).parents('li');
      $this.siblings().removeClass('editing');
      $this.addClass('editing');
      var $input = $this.find('.edit')
      $input.focus();
      $input.val($input.val());
    });
  }

  return {
    init: render
  }
})
