var express = require('express'),
    app = express(),
    cons = require('consolidate'),
    swig = require('swig'),
    less = require('less-middleware');

// Swig configurations.
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views')
swig.init({ root: __dirname + '/views' });

// Less configurations.
app.use(less({
  dest: __dirname + '/public/css',
  src: __dirname + '/src/less',
  prefix: '/css',
  compress: true,
  debug: true
}));

// Static content path.
app.use(express.static(__dirname + '/public'));

/**
 *  Routing.
 */

// Main page.
app.get('/', function(req, res) {
  return res.render('index');
});

// Bind the app to listen for connections on a specified port.
var port = process.env.PORT || 8080;
app.listen(port);

console.log('Express server started on port ' + port);
