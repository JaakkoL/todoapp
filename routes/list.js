/**
 * routes/lists.js
 *
 * Handles all lists related functionality.
 */

var ListsDAO = require('../model/lists').ListsDAO;

function ListHandler(connection) {
  var lists = new ListsDAO(connection);

  this.addList = function(req, res) {
    // TODO: Get data from body.
    var data = {
      name: req.body.name
      //categoryId: TODO
    }

    lists.addList(data, function(err, results) {
      if (err) {
        return res.json(500, {'type' : 'error', 'message' : 'Couldn\'t add new list.'});
      }

      console.log(results);

      var ret = {
        listId : results.insertId,
        categoryId : 0,
        categoryName : 'Uncategorized',
        name : req.body.name
      }

      return res.json(200, {'type' : 'success', 'data' : ret});
    })
  }

  this.removeList = function(req, res) {
    var listId = 1;
    lists.removeList(listId, function(err, results) {
      if (err) {
        return res.json(500, {'type' : 'error', 'message' : 'Couldn\'t remove the list (' + listId + ').'});
      }
      return res.json(200, {'type' : 'success', 'message' : 'List deleted.'});
    })
  }




  this.updateList = function(req, res) {
    return res.json(200, {'type' : 'success', 'message' : 'Needs to be implemented.'});
  }

  this.getAllLists = function(req, res) {
    lists.getAllLists(function(err, results) {
      if (err) {
        return res.json(500, {'type' : 'error', 'message' : 'Something went wrong.'});
      }
      return res.json(200, {'type' : 'success', 'data' : results});

    })
  }

}

module.exports = ListHandler;
