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

    console.log('validating session: ' + sessionId);

    sessions.validateSession(sessionId, function(err, uid) {

      console.log(err);
      console.log(uid);

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

    // TODO: Get credentials from request body.
    // TODO: Make sure only on instance is created in the session table or that it's properly cleaned after.
    var email = "jaakko@meedoc.com",
        password = "jaakko";

    users.validateLogin(email, password, function(err, user) {

      if (err) {
        if (err.invalidCredentials) {
          return res.send('wrong credentials');
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

        res.send('user logged in and session set');
      });

    });

  }

  // Logs user out of the app.
  this.handleLogout = function(req, res) {
    var sessionId = req.cookies.session;
    sessions.endSession(sessionId, function(err, result) {
      console.log(result);
      res.cookie('session', '', { httpOnly: true });
      res.send('user logged out');
    });
  }

  // Registers users into the application.
  this.handleRegistration = function(req, res) {
    // TODO: Validate input parameters. Email is used as username so it needs to be unique.

    var testData = {
      email : "pasi@meedoc.com",
      password : "jaakko",
      firstName : "Jaakko",
      lastName : "Laurila"
    };

    // First check if username is available;
    users.usernameExists(testData.email, function(err, exists) {
      console.log('users.usernameExists ' + exists);
      if (err) {
        console.log(err);
      }

      if (exists) {
        res.send("Email already exists.");
      } else {
        // Try to add user into database.
        users.addUser(testData, function(err, results) {
          if (err) {
            console.log(err);
          }
          console.log(results);
          res.send("User registered");
        });
      }

    })
  }

}

module.exports = SessionHandler;