/**
 * routes/lists.js
 *
 * Handles all lists related functionality.
 */

var ListsDAO = require('../model/lists').ListsDAO;

function ListHandler(connection) {
  var lists = new ListsDAO(connection);

  this.addList = function(req, res) {
    var data = {
      name: req.body.name,
      creator: req.uid,
      tags: req.body.tags
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
    lists.removeList(req.body.listId, function(err, results) {
      if (err) {
        return res.json(500, {'type' : 'error', 'message' : 'Couldn\'t remove the list (' + req.body.listId + ').'});
      }
      return res.json(200, {'type' : 'success', 'message' : 'List deleted.'});
    })
  }

  this.updateList = function(req, res) {
    var data = {
      name : req.body.name,
      categoryId : req.body.categoryId,
      listId : req.body.listId
    }
    lists.updateList(data, function(err, results) {
        if (err) {
          return res.json(500, {'type' : 'error', 'message' : 'Couldn\'t update the list (' + req.body.listId + ').'});
        }
        return res.json(200, {'type' : 'success', 'message' : 'List updated.'});
      })
  }

  this.getAllLists = function(req, res) {
    lists.getAllLists(req.uid, function(err, results) {
      if (err) {
        return res.json(500, {'type' : 'error', 'message' : err.message});
      }
      return res.json(200, {'type' : 'success', 'data' : results});

    })
  }

  this.getList = function(req, res) {
    var data = {
      uid : req.uid,
      listId : req.body.listId
    };

    lists.getList(data, function(err, results) {
      if (err) {
        return res.json(500, {'type' : 'error', 'message' : err.message});
      }
      return res.json(200, {'type' : 'success', 'data' : results});

    })
  }

  this.getContributors = function(req, res) {
    var data = {
      uid : req.uid,
      listId : req.body.listId
    };

    lists.getContributors(data, function(err, results) {
      if (err) {
        return res.json(500, {'type' : 'error', 'message' : err.message});
      }
      return res.json(200, {'type' : 'success', 'data' : results});

    })
  }

  this.addContributor = function(req, res) {
    var data = {
      uid : req.uid,
      listId : req.body.listId,
      email : req.body.email
    };

    lists.addContributor(data, function(err, results) {
      if (err) {
        if (err.code == 'ER_DUP_ENTRY') {
          err.message = 'User is already contributing.';
        }
        return res.json(500, {'type' : 'error', 'message' : err.message});
      }
      return res.json(200, {'type' : 'success', 'data' : results});

    })
  }

}

module.exports = ListHandler;
