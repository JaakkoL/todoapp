/**
 * model/sessions.js
 *
 * Provides sessions data access object.
 */

var crypto = require('crypto');

function SessionsDAO(connection) {

  // Creates new session for the user to the sessions table.
  this.startSession = function(uid, callback) {
    // Create session id.
    var now = (new Date()).valueOf().toString(),
        rnd = Math.random().toString(),
        sessionId = crypto.createHash('sha1').update(now + rnd).digest('hex');


    var query = 'INSERT INTO session (uid, sessionid)' +
                'VALUES (' +
                  connection.escape(uid) + ', ' +
                  connection.escape(sessionId) +
                ')';

    connection.query(query, function(err, results) {
      callback(err, sessionId);
    });
  }

  // Removes the session entry for the user.
  this.endSession = function(sessionId, callback) {
    var query = 'DELETE FROM session WHERE sessionid = ' + connection.escape(sessionId);

    connection.query(query, function(err, results) {
      callback(err, results);
    });
  }


  // Validates provided session cookie against database.
  this.validateSession = function(sessionId, callback) {

    if (!sessionId) {
        callback(Error('Session is not set.'), null);
        return;
    }

    var query = 'SELECT * FROM session WHERE sessionid = ' + connection.escape(sessionId) + ' LIMIT 1';

    connection.query(query, function(err, session) {
      if (err) return callback(err, null);

      if (session.length === 0) {
        callback(new Error('Session doesn\'t exist.'), null);
        return;
      }

      callback(null, session[0].uid);
    });

    }

}

module.exports.SessionsDAO = SessionsDAO;