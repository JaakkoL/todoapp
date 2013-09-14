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


  app.get('/', function(request, response) {
//    response.json(quotes);
    response.send('Hello World!');
  });

  app.get('/register', sessions.handleRegistration)

  app.get('/login', sessions.handleLogin)
  app.get('/logout', sessions.handleLogout)

  // Set up error handling
  app.use(ErrorHandler);
}