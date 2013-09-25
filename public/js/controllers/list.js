define([
  'hbars!templates/list/listing',
  'lodash'
], function (tplMain, _) {
  var element;

  function render(elem) {
    element = elem;

    // Show all lists from db.
    getAllLists().done(function(response) {
      element.html(tplMain(response));
    })

    bindEvents();
  }

  function bindEvents() {
//    addListBindings();
  }

  function getAllLists() {

    var deferred = $.Deferred();

//    var listingRequest = Bacon.once({
//      type: 'post',
//      url: 'list/all',
//      data: {fuu: "bar"}
//    }).ajax();
//
//    listingRequest.onValue(function(data) {
//      deferred.resolve(data);
//      console.log(data);
//    })

    return deferred;

  }


  return {
    init: render
  }
})
