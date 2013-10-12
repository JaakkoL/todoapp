/**
 * routes/index.js
 *
 * Handles all application routes.
 */

var SessionHandler = require('./session'),
    ListHandler = require('./list'),
    TaskHandler = require('./task'),
    ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, connection) {

  var sessions = new SessionHandler(connection),
      list = new ListHandler(connection),
      task = new TaskHandler(connection);

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
  app.post('/register', sessions.handleRegistration);

  // Login callback.
  app.post('/login', sessions.handleLogin);

  // Logout callback.
  app.post('/logout', sessions.handleLogout);

  // Add list.
  app.post('/list/add', list.addList);

  // Update list.
  app.post('/list/update', list.updateList);

  // Delete list.
  app.post('/list/delete', list.removeList);

  // Get all lists.
  app.post('/list/all', list.getAllLists);

  // Get a single.
  app.post('/list/get', list.getList);

  // Get list contributors.
  app.post('/list/contributors', list.getContributors);

  // Add new contributor.
  app.post('/list/contributors/add', list.addContributor);

  // Get list.
  app.post('/list/tasks', task.getTasks);

  // Add task.
  app.post('/task/add', task.addTask);

  // Remove task.
  app.post('/task/delete', task.removeTask);

  // Update task.
  app.post('/task/update', task.updateTask);

  // Set up error handling
  app.use(ErrorHandler);
}