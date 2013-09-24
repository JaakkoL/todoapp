/**
 * model/lists.js
 *
 * Provides lists data access object.
 */

function ListsDAO(connection) {

  this.addList(data, callback) {

    var name = data.name,
        categoryId = (data.categoryId !== undefined) ? data.categoryId : 0,
        query = 'INSERT INTO list (name, categoryId)' +
                'VALUES (' +
                  connection.escape(name) + ', ' +
                  connection.escape(categoryId) +
                ')';

    connection.query(query, function(err, results) {
        callback(err, results);
    });

  }

  this.getList() {}
  this.getAllLists() {
    var query = 'SELECT * FROM list';

    connection.query(query, function(err, results) {
        callback(err, results);
    });
  }

  this.updateList() {}
  this.deleteList() {}

}