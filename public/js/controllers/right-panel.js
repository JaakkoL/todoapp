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

      addTask(listId, text).done(function(response) {
        console.log(response);
        var listItem =  tplTask({text : text, taskId : response.data.insertId});
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

    listItems.find('.delete').not('.processed').on('click', function(e) {
      e.preventDefault();
      $(this).addClass('processed');
      var $this = $(this).parents('li');
      console.log($this.data('taskid'));

      removeTask($this.data('taskid')).done(
        $this.fadeOut(300, function() {
          $this.remove();
        })
      );
    });

    listItems.find('.status').not('.processed').on('click', function(e) {
      $(this).addClass('processed');

      var $list = $(this).parents('li'),
          taskId = $list.data('taskid'),
          status = ($list.find('.status').is(':checked')) ? 1 : 0,
          text = $list.find('.edit').val();

      updateTask(taskId, text, status).done(function(data) {
        console.log(data);
      });

    });

    var updateStream = listItems.find('.edit').asEventStream('keyup')
                        .filter(enterKey).map(function(e) { return $(e.target); });

    updateStream.onValue(function(field) {
      var $list = field.parents('li'),
          taskId = $list.data('taskid'),
          status = ($list.find('.status').is(':checked')) ? 1 : 0,
          text = field.val();

      updateTask(taskId, text, status).done(function(data) {
        field.blur();
        $list.removeClass('editing');
        $list.find('.label').text(text);
      });
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

  function removeTask(taskId) {
    var deferred = $.Deferred();
    var deleteRequest = Bacon.once({
      type: 'post',
      url: 'task/delete',
      data: {taskId : taskId}
    }).ajax();

    deleteRequest.onValue(function(data) {
      deferred.resolve(data);
    })

    deleteRequest.onError(function(err) {
      console.log(err);
      deferred.reject(err);
    })

    return deferred;
  }

 function updateTask(taskId, text, status) {
    var deferred = $.Deferred();
    var updateRequest = Bacon.once({
      type: 'post',
      url: 'task/update',
      data: {taskId : taskId, text : text, status: status}
    }).ajax();

    updateRequest.onValue(function(data) {
      deferred.resolve(data);
    })

    updateRequest.onError(function(err) {
      console.log(err);
      deferred.reject(err);
    })

    return deferred;
  }

  return {
    init: render
  }
})
