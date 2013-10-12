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

    connection.query(query, function(err, results) {

      var accessQuery = 'INSERT INTO access (uid, listId, role) ' +
                        'VALUES (' + creator + ', ' + results.insertId + ', "creator")';

      connection.query(accessQuery, function(error, res) {
        console.log(error)
        callback(error, results);
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
                'ORDER BY created DESC;';

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
  this.updateList = function(data, callback) {
    var name = connection.escape(data.name),
        categoryId = connection.escape(data.categoryId),
        listId = connection.escape(data.listId);

    var query = 'UPDATE list SET name = ' + name + ', categoryId = ' + categoryId + ', edited = CURRENT_TIMESTAMP ' +
                'WHERE listId = ' + listId + ';';

    connection.query(query, function(err, results) {
      callback(err, results);
    });
  }

  // Deletes a list with a specified id.
  this.removeList = function(listId, callback) {
    // Delete the data from list, task and access tables.
    var query = 'DELETE FROM list WHERE listID = ' + connection.escape(listId) + ';';
    query += 'DELETE FROM task WHERE listID = ' + connection.escape(listId) + ';';
    query += 'DELETE FROM access WHERE listID = ' + connection.escape(listId) + ';';

    connection.query(query, function(err, results) {
      callback(err, results);
    });
  }

  // Returns users for a list.
  this.getContributors = function(data, callback) {
    var uid = connection.escape(data.uid),
        listId = connection.escape(data.listId);

    // TODO: Check user requesting has access to the list.
    var query = 'SELECT u.uid, u.email, a.role ' +
                'FROM user u ' +
                'JOIN access a on a.uid = u.uid ' +
                'WHERE a.listId = ' + listId + ';'

    connection.query(query, function(err, results) {
      callback(err, results);
    });
  }

  // Adds new contributor for a list.
  this.addContributor = function(data, callback) {
    var uid = connection.escape(data.uid),
        listId = connection.escape(data.listId),
        email = connection.escape(data.email),
        role = 'contributor';


    // First we get users uid.
    var query = 'SELECT uid FROM user WHERE email = ' + email + ';';

    connection.query(query, function(err, results) {
      if (results.length === 0) {
        callback(new Error("User not found."), results);
      }
      else {
        var contUid = results[0].uid,
            query = 'INSERT INTO access (uid, listId, role) ' +
                    'VALUES (' + contUid + ', ' + listId + ', "' + role + '");';

        console.log(query);

        connection.query(query, function(err, results) {
          callback(err, contUid);
        });

      }

    });
  }

}

module.exports.ListsDAO = ListsDAO;