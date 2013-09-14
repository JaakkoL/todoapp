/**
 * app.js
 *
 * Initialises the application.
 */
var express = require("express"),
    app = express()
    mysql = require('mysql'),
    routes = require('./routes');

// Database connection object.
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'todoapp'
});

// Establish database connection.
// TODO: Remember to kill this at some point.
connection.connect();

// Add application logging.
app.use(express.logger());

// Express middleware to populate 'req.cookies' so we can access cookies
app.use(express.cookieParser());

// Express middleware to populate 'req.body' so we can access POST variables
app.use(express.bodyParser());


// Application routes.
routes(app, connection);

// Port is set via environment variable.
var port = process.env.PORT || 8080;

// Start server.
app.listen(port, function() {
  console.log("App started on port: " + port);
});