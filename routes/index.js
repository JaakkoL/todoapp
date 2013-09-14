/**
 * routes/index.js
 *
 * Handles all application routes.
 */

var SessionHandler = require('./session'),
    ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, connection) {

  var sessions = new SessionHandler(connection);


  // Checks if users is logged in or not.
  app.use(sessions.isLoggedInMiddleware);

  /**
   *  Get routes.
   */

  // Define the application page based on users login status.
  app.get('/', function(req, res) {
    if (req.uid) {
      res.render('app');
    }
    else {
      res.render('login');
    }
  });



  /**
   *  Application backend.
   */

  // Registration callback
  app.post('/register', sessions.handleRegistration)

  // Login callback.
  app.post('/login', sessions.handleLogin)

  // Logout callback.
  app.post('/logout', sessions.handleLogout)

  // Set up error handling
  app.use(ErrorHandler);
}