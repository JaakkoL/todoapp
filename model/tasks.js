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

  // Returns all tasks related to certain list.
  this.getTasks = function(listId, callback) {
    listId = connection.escape(listId);
    var query = 'SELECT * FROM task WHERE listId = ' + listId + ' ORDER BY created DESC;';

    connection.query(query, function(err, results) {
        callback(err, results);
    });
  }
}

module.exports.TasksDAO = TasksDAO;