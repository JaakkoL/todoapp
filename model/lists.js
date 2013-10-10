/**
 * model/lists.js
 *
 * Provides lists data access object.
 */

function ListsDAO(connection) {

  // Adds a new list entry.
  this.addList = function(data, callback) {

    var name = connection.escape(data.name),
        categoryId = connection.escape((data.categoryId !== undefined) ? data.categoryId : 0),
        creator = connection.escape(data.creator),
        query = 'INSERT INTO list (name, categoryId) ' +
                'VALUES (' + name + ', ' + categoryId + ')';

    console.log(creator);
    connection.query(query, function(err, results) {
      console.log(results);

      var accessQuery = 'INSERT INTO access (uid, listId, role) ' +
                        'VALUES (' + creator + ', ' + results.insertId + ', "creator")';

      connection.query(accessQuery, function(error, res) {
        console.log(error)
        callback(error, res);
      });

    });
  }

  // Returns a certain list.
  this.getList = function(data, callback) {

    var listId = connection.escape(data.listId),
        uid = connection.escape(data.uid);

    var query = 'SELECT list.listId, list.categoryId, list.name ' +
                'FROM list LEFT JOIN access ON (list.listId = access.listId) ' +
                'WHERE access.uid = ' + uid + ' AND list.listId = ' + listId + ' ' +
                'ORDER BY created DESC;'

    connection.query(query, function(err, results) {
        callback(err, results);
    });
  }

  // Returns all lists.
  this.getAllLists = function(uid, callback) {
    var query = 'SELECT list.listId, list.categoryId, list.name ' +
                'FROM list LEFT JOIN access ON (list.listId = access.listId) ' +
                'WHERE access.uid = ' + connection.escape(uid) + ' ' +
                'ORDER BY created DESC;'

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