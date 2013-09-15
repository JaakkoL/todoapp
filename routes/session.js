/**
 * routes/session.js
 *
 * Handles all session related functionality.
 */

var UsersDAO = require('../model/users').UsersDAO,
    SessionsDAO = require('../model/sessions').SessionsDAO;

function SessionHandler(connection) {
  var users = new UsersDAO(connection);
  var sessions = new SessionsDAO(connection);

  // Session validation middleware.
  this.isLoggedInMiddleware = function(req, res, next) {
    var sessionId = req.cookies.session;

    sessions.validateSession(sessionId, function(err, uid) {

        // If session exists, pass the user id to the request.
        if (!err && uid) {
          req.uid= uid;
        }

       // Continue request.
       return next();
    });

  }

  // Handles login form.
  this.handleLogin = function(req, res, next) {
    users.validateLogin(req.body.email, req.body.password, function(err, user) {

      if (err) {
        if (err.invalidCredentials) {
          return res.json(401, {'error': 'Wrong username or password.'});
        }
        else {
          // Some funky error.
          return next(err);
        }
      }

      // Start new session for the user.
      sessions.startSession(user.uid, function(err, sessionId) {
        if (err) return next(err);
        res.cookie('session', sessionId, { httpOnly: true });

        return res.json(200, {'success': 'User logged in.'});
      });

    });
  }

  // Logs user out of the app.
  this.handleLogout = function(req, res) {
    var sessionId = req.cookies.session;
    sessions.endSession(sessionId, function(err, result) {
      res.cookie('session', '', { httpOnly: true });
      return res.json(200, {'success': 'User logged out.'});
    });
  }

  // Registers users into the application.
  this.handleRegistration = function(req, res) {
    // TODO: Validate input parameters. Email is used as username so it needs to be unique.

    // First check if username is available;
    users.usernameExists(req.body.email, function(err, exists) {
      console.log('users.usernameExists ' + exists);
      if (err) {
        console.log(err);
      }

      if (exists) {
        res.json(500, {'error' : 'Email already exists.'});
      } else {
        // Try to add user into database.
        users.addUser(req.body, function(err, results) {
          if (err) {
            console.log(err);
          }

          res.json(200, {'success' : 'Registration successful.'});
        });
      }

    })
  }

}

module.exports = SessionHandler;