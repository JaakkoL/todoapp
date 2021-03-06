/**
 * app.js
 *
 * Initialises the application.
 */
var express = require('express'),
    app = express()
    mysql = require('mysql'),
    routes = require('./routes'),
    consolidate = require('consolidate'),
    less = require('less-middleware'),
    configs = null;

switch(process.env.NODE_ENV){
    case 'production':
        configs = require('./config/production');
        break;
    case 'development':
        configs = require('./config/development');
        break;

    default:
        throw new Exception('Wrong environment!');
}

// Database connection object.
var connection = mysql.createConnection({
  host     : configs.db.host,
  user     : configs.db.user,
  password : configs.db.password,
  database : configs.db.database,
  multipleStatements : true
});

// Establish database connection.
// TODO: Remember to kill this at some point. Or... is this even needed?
//connection.connect();

// Add application logging.
app.use(express.logger());

// Configure templating.
app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Less configurations.
app.use(less({
  dest: __dirname + '/public/css',
  src: __dirname + '/less',
  prefix: '/css',
  compress: true,
  debug: true
}));

// Static content path.
app.use(express.static(__dirname + '/public'));


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
  console.log('App started on port: ' + port);
});