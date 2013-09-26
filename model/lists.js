/**
 * model/lists.js
 *
 * Provides lists data access object.
 */

function ListsDAO(connection) {

  // Adds a new list entry.
  this.addList = function(data, callback) {

    var name = data.name,
        categoryId = (data.categoryId !== undefined) ? data.categoryId : 0,
        query = 'INSERT INTO list (name, categoryId)' +
                'VALUES (' +
                  connection.escape(name) + ', ' +
                  connection.escape(categoryId) +
                ')';

    connection.query(query, function(err, results) {
      callback(err, results);
    });
  }

  // Returns a certain list.
  this.getList = function(id, callback) {
    var query = 'SELECT * FROM list where listId = ' + connection.escape(id);

    connection.query(query, function(err, results) {
        callback(err, results);
    });
  }

  // Returns all lists.
  this.getAllLists = function(callback) {
    var query = 'SELECT * FROM list ORDER BY created DESC;';

    connection.query(query, function(err, results) {
        callback(err, results);
    });
  }

  // Updates a list.
  this.updateList = function() {}

  // Deletes a list with a specified id.
  this.removeList = function(listId, callback) {
    var query = 'DELETE FROM list where listID = ' + connection.escape(listId);

    connection.query(query, function(err, results) {
        callback(err, results);
    });
  }

}

module.exports.ListsDAO = ListsDAO;