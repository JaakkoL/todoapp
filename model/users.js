/**
 * model/users.js
 *
 * Provides users data access object.
 */

var bcrypt = require('bcrypt-nodejs');

function UsersDAO(connection) {

  // Adds new user to the database.
  this.addUser = function(data, callback) {

    // Generate password hash.
    var salt = bcrypt.genSaltSync();
    var passwordHash = bcrypt.hashSync(data.password, salt);

    var query = 'INSERT INTO user (email, password, firstname, lastname) ' +
                'VALUES (' +
                  connection.escape(data.email) + ', ' +
                  connection.escape(passwordHash) + ', ' +
                  connection.escape(data.firstName) + ', ' +
                  connection.escape(data.lastName) +
                ')';

    connection.query(query, function(err, results) {
      callback(err, results);
    });

  }

  // Validates provided username and password against db.
  this.validateLogin = function(email, password, callback) {

    // Validates user returned from database.
    function validateUser(err, user) {

        // Something unexpected happened.
        if (err) return callback(err, null);

        // Let's compare password hashes.
        if (user.length === 1) {
            if (bcrypt.compareSync(password, user[0].password)) {
                callback(null, user[0]);
            }
            else {
              callback(invalidCredentialsError(), null);
            }
        }
        else {
          callback(invalidCredentialsError(), null);
        }
    }

    function invalidCredentialsError() {
      var error = new Error('Wrong username or password.');
      error.invalidCredentials = true;

      return error;
    }


    var query = 'SELECT * FROM user WHERE email = ' + connection.escape(email) + ' LIMIT 1';
    connection.query(query, function(err, user) {
      validateUser(err, user);
    });
  };

  // Checks if username is already in use.
  this.usernameExists = function(username, callback) {

    var query = 'SELECT * FROM user WHERE email = ' + connection.escape(username);

    connection.query(query, function(err, results) {
      var exists = (results.length === 0) ? false : true;
      callback(err, exists);
    });

  }

}

module.exports.UsersDAO = UsersDAO;