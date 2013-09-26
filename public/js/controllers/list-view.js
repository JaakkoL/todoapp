define([
  'hbars!templates/list/listing',
  'hbars!templates/list/list-element',
  'lodash'
], function (tplListing, tplListElement, _) {
  var element;

  function render(elem) {
    element = elem;

    // Show all lists from db.
    getAllLists().done(function(response) {
      console.log(response)
      element.html(tplListing(response));
    })

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
    console.log(item);
    element.find('ul').prepend(tplListElement(item));
  }


  return {
    init: render,
    add: addNewItem
  }
})
