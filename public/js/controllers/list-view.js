define([
  'hbs!templates/list/listing',
  'hbs!templates/list/list-element',
  'hbs!templates/list/edit',
  'hbs!templates/list/share',
  'controllers/right-panel',
  'lodash'
], function (tplListing, tplListElement, tplEdit, tplShare, rightPanel, _) {
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

    listItems.find('.edit').not('.processed').each(function(i, el) {
      $(el).addClass('processed').on('click', function(e) {
         e.preventDefault();
         e.stopPropagation();

         var $this = $(this),
             listId = $this.parent('li').data('listid');

         showEditView(listId);
       });
    });

    listItems.find('.share').not('.processed').each(function(i, el) {
      $(el).addClass('processed').on('click', function(e) {
         e.preventDefault();
         e.stopPropagation();

         var $this = $(this),
             listId = $this.parent('li').data('listid');

         showShareView(listId);
       });
    });

    listItems.not('.processed').each(function(i, el) {
      $(el).addClass('processed').on('click', function(e) {
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

  function showEditView(listId) {
    getListItem(listId).done(function(data) {
      $('body').append(tplEdit(data.data[0]));
      console.log(data.data[0]);
      var modal = $('#modal');
      bindEditEvents(modal);
      modal.fadeIn(300);
    })

    function bindEditEvents(modal) {
      // Cancel.
      modal.find('[data-action="cancel"]').on('click', function(e) {
        e.preventDefault();
        closeModal(modal);
      });

      // Delete.
      modal.find('[data-action="delete"]').on('click', function(e) {
        e.preventDefault();
        var listId = modal.data('listid');
        deleteListItem(listId).done(function(response) {
          var listing = $('#list-listing').find('[data-listid="' + listId + '"]');

          if (listing.hasClass('selected')) {
            $('#right-panel').html('');
          }

          listing.fadeOut(300, function() { listing.remove(); });

          closeModal(modal);
          var options = {
            type : response.type,
            message : response.message,
            autoRemove : true
          }
          notification.show(options);
        });
      });

      // Save.
      modal.find('[data-action="save"]').on('click', function(e) {
        e.preventDefault();
        var listId = modal.data('listid');

        var data = {
          name : modal.find('input.name').val(),
          categoryId : 0,
          listId : listId
        }

        updateListItem(data).done(function(response) {
          var listing = $('#list-listing').find('[data-listid="' + listId + '"]');
          listing.find('.name').text(data.name);
          listing.find('.category').text(data.categoryId);

          closeModal(modal);
          var options = {
            type : response.type,
            message : response.message,
            autoRemove : true
          }
          notification.show(options);
        });
      });

    }
  }

  function showShareView(listId) {
    getListContributors(listId).done(function(data) {
      data.data['listId'] = listId;
      $('body').append(tplShare(data.data));
      console.log(data.data);
      var modal = $('#modal');
      bindShareEvents(modal);
      modal.fadeIn(300);

      var addContributor = modal.find('#add-contributor'),
          addContributorStream = addContributor.asEventStream('keyup')
                                  .filter(enterKey).map(function(e) { return $(e.target).val(); }),
          contributorsList = modal.find('.contributors-list');

          addContributorStream.onValue(function(email) {
            addContributor.val('');

            addNewContributor(listId, email).done(function(response) {
              console.log(response)
              console.log('response')
              contributorsList.append('<li data-uid="' + response.data + '"><span class="email">' + email + '</span> <span class="role role-contributor">contributor</span></li>');
            }).fail(function(err) {
              var options = {
                type : err.responseJSON.type,
                message : err.responseJSON.message,
                autoRemove : true
              }

              notification.show(options);
            });

          });
    })

    function addNewContributor(listId, email) {
        var deferred = $.Deferred();
        var addRequest = Bacon.once({
          type: 'post',
          url: 'list/contributors/add',
          data: {listId : listId, email : email}
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

    function bindShareEvents(modal) {
      // Cancel.
      modal.find('[data-action="cancel"]').on('click', function(e) {
        e.preventDefault();
        closeModal(modal);
      });

    }
  }

  function closeModal(modal) {
    modal.fadeOut(300, function() { modal.remove(); });
  }

  function getListItem(listId) {
    var deferred = $.Deferred();
    var listingRequest = Bacon.once({
      type: 'post',
      url: 'list/get',
      data: {listId : listId}
    }).ajax();

    listingRequest.onValue(function(data) {
      deferred.resolve(data);
    })

    listingRequest.onError(function(err) {
      deferred.reject(err);
    })

    return deferred;
  }

  function getListContributors(listId) {
    var deferred = $.Deferred();
    var contributorsRequest = Bacon.once({
      type: 'post',
      url: 'list/contributors',
      data: {listId : listId}
    }).ajax();

    contributorsRequest.onValue(function(data) {
      deferred.resolve(data);
    })

    contributorsRequest.onError(function(err) {
      deferred.reject(err);
    })

    return deferred;
  }

  function deleteListItem(listId) {
    var deferred = $.Deferred();
    var deleteRequest = Bacon.once({
      type: 'post',
      url: 'list/delete',
      data: {listId : listId}
    }).ajax();

    deleteRequest.onValue(function(data) {
      deferred.resolve(data);
    })

    deleteRequest.onError(function(err) {
      deferred.reject(err);
    })

    return deferred;
  }

  function updateListItem(data) {
    var deferred = $.Deferred();
    var updateRequest = Bacon.once({
      type: 'post',
      url: 'list/update',
      data: data
    }).ajax();

    updateRequest.onValue(function(data) {
      deferred.resolve(data);
    })

    updateRequest.onError(function(err) {
      deferred.reject(err);
    })

    return deferred;
  }


  return {
    init: render,
    add: addNewItem
  }
})
