var _ = require('lodash');

/**
 * model/lists.js
 *
 * Provides lists data access object.
 */

function ListsDAO(connection) {

  // Get users all tags.
  this.usersTags = function(uid, callback) {
    var query = 'SELECT * FROM tag WHERE uid = ' + uid + ';';
    connection.query(query, function(err, results) {
      callback(err, results);
    });
  }

  this.addTags = function(tags, uid, callback) {

    this.usersTags(uid, function(err, usersTags) {
      if (err) return new Error('Fetching tags failed');

      var names = _.map(usersTags, function(tag) { return tag.name; }),
          query = '',
          existingTags = [];

        for (var i in tags) {
          if (names.indexOf(tags[i]) == -1) {
            query += 'INSERT INTO tag (name, uid) ' +
                    'VALUES (\'' + tags[i] + '\', ' + uid + ');';
          }
          else {
            existingTags.push(tags[i]);
          }
        }

        // Do the insert. Return existing and inserted tagIgs.
        connection.query(query, function(err, results) {
          var ids = _.map(results, function(result) {return result.insertId; });
          var oldIds = _.filter(usersTags, function(tag) {
            return (existingTags.indexOf(tag.name) > -1);
          }).map(function(tag) { return tag.tagId});
          callback(err, _.union(ids, oldIds));
        });
    });

  }

  // Adds a new list entry.
  this.addList = function(data, callback) {

    var name = connection.escape(data.name),
        creator = connection.escape(data.creator),
        listId = null,
        tagIds = null;

    this.addTags(data.tags, creator, function(err, results) {
      tagIds = results;
      console.log(results);

      // Insert list.
      var query = 'INSERT INTO list (name) ' +
                      'VALUES (' + name + ')';

      connection.query(query, function(err, results) {

        listId = results.insertId;

        // Give access to the creator.
        var q = 'INSERT INTO access (uid, listId, role) ' +
                         'VALUES (' + creator + ', ' + listId + ', "creator");';

        // Add tag reference to database.
        for (var i = 0; i < tagIds.length; i++) {
          q += 'INSERT INTO tag_ref (listId, tagId) VALUES (' + listId + ', ' + tagIds[i]  + ');';
        }

        connection.query(q, function(error, res) {
          callback(error, results);
        });

      });

    })

  }

  // Returns a certain list.
  this.getList = function(data, callback) {

    var listId = connection.escape(data.listId),
        uid = connection.escape(data.uid);

    var query = 'SELECT list.listId, list.name ' +
                'FROM list LEFT JOIN access ON (list.listId = access.listId) ' +
                'WHERE access.uid = ' + uid + ' AND list.listId = ' + listId + ' ' +
                'ORDER BY created DESC;';

    connection.query(query, function(err, results) {
        callback(err, results);
    });
  }

  // Returns all lists.
  this.getAllLists = function(uid, callback) {
    var query = 'SELECT list.listId, list.name ' +
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
        listId = connection.escape(data.listId);

    var query = 'UPDATE list SET name = ' + name + ', edited = CURRENT_TIMESTAMP ' +
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