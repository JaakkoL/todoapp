/**
 * model/tasks.js
 *
 * Provides tasks data access object.
 */

function TasksDAO(connection) {

  // Adds a new task entry.
  this.addTask = function(data, callback) {

     var listId = connection.escape(data.listId),
         creator = connection.escape(data.uid),
         text = connection.escape(data.text);

     var query = 'INSERT INTO task (listId, creator, text)' +
                  'VALUES (' + listId + ', ' + creator + ', ' + text + ')';

    connection.query(query, function(err, results) {
      callback(err, results);
    });
  }

  // Removes task entry.
  this.removeTask = function(data, callback) {

     var taskId = connection.escape(data.taskId),
         creator = connection.escape(data.uid);

     var query = 'DELETE FROM task WHERE taskId = ' + taskId;

    connection.query(query, function(err, results) {
      callback(err, results);
    });
  }

  // Updates task entry.
  this.updateTask = function(data, callback) {

     var taskId = connection.escape(data.taskId),
         text = connection.escape(data.text),
         status = connection.escape(data.status),
         uid = connection.escape(data.uid);

     var query = 'UPDATE task SET text = ' + text + ', status = ' + status + ', editedby = ' + uid + ', modified = CURRENT_TIMESTAMP ' +
                 'WHERE taskId = ' + taskId + ';';

    connection.query(query, function(err, results) {
      callback(err, results);
    });
  }

  // Returns all tasks related to certain list.
  this.getTasks = function(data, callback) {
    var listId = connection.escape(data.listId),
        uid = connection.escape(data.uid);

    var query = 'SELECT * FROM task ' +
                'INNER JOIN access ON task.listId = access.listId ' +
                'WHERE task.listId = ' + listId + ' AND uid = ' + uid + ' ' +
                'ORDER BY created ASC;';

    connection.query(query, function(err, results) {
        callback(err, results);
    });
  }
}

module.exports.TasksDAO = TasksDAO;