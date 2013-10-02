define([
  'hbs!templates/list/listing',
  'hbs!templates/list/list-element',
  'controllers/right-panel',
  'lodash'
], function (tplListing, tplListElement, rightPanel, _) {
  var element;

  function render(elem) {
    element = elem;

    // Show all lists from db.
    getAllLists().done(function(response) {
      // TODO: Needs category name.
      element.html(tplListing(response));
      bindEvents();
    })

  }

  function bindEvents() {
    var listItems = element.find('.list-items li');

    listItems.not('.processed').on('click', function(e) {
      e.preventDefault();
      var $this = $(this),
          listId = $this.data('listid');

      $this.addClass('processed');
      $this.siblings().removeClass('selected');
      $this.addClass('selected');

      loadListTasks(listId).done(function(response) {
        console.log(response)
        var data = {
          tasks : response.data,
          listId : listId
        };
        rightPanel.init($('#right-panel'), data);
      });
    });
  }

  // Gets all lists from database.
  function getAllLists() {
    var deferred = $.Deferred();
    var listingRequest = Bacon.once({
      type: 'post',
      url: 'list/all'
    }).ajax();

    listingRequest.onValue(function(data) {
      deferred.resolve(data);
    })

    listingRequest.onError(function(err) {
      deferred.reject(err);
    })

    return deferred;
  }

  function addNewItem(item) {
    element.find('.no-lists').remove();
    element.find('ul').prepend(tplListElement(item));
    bindEvents()
  }

  function loadListTasks(listId) {
    var deferred = $.Deferred();
      var listingRequest = Bacon.once({
        type: 'post',
        url: 'list/tasks',
        data: {listId : listId}
      }).ajax();

      listingRequest.onValue(function(data) {
        console.log(data);
        deferred.resolve(data);
      })

      listingRequest.onError(function(err) {
        console.log(err);
        deferred.reject(err);
      })

      return deferred;
  }


  return {
    init: render,
    add: addNewItem
  }
})
