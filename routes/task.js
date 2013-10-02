/**
 * routes/lists.js
 *
 * Handles all lists related functionality.
 */

var TasksDAO = require('../model/tasks').TasksDAO;

function TaskHandler(connection) {
  var tasks = new TasksDAO(connection);


  this.addTask = function(req, res) {
     var data = {
       listId : req.body.listId,
       uid : 666, // TODO: Get current users uid.
       text : req.body.text
     };

     tasks.addTask(data, function(err, results) {
       if (err) {
         console.log(err)
         return res.json(500, {'type' : 'error', 'message' : 'Something went wrong.'});
       }

       return res.json(200, {'type' : 'success', 'data' : results});

     })
   }


  this.getTasks = function(req, res) {
    var listId = req.body.listId;

    tasks.getTasks(listId, function(err, results) {
      if (err) {
        return res.json(500, {'type' : 'error', 'message' : 'Something went wrong.'});
      }
      console.log(results);
      return res.json(200, {'type' : 'success', 'data' : results});

    })
  }

}

module.exports = TaskHandler;
