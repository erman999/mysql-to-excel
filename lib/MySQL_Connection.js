const mysql = require('mysql');

class MySQL_Connection {
  constructor() {
    this.conn = {};
    this.config = {};
    this.query = '';

    this.getConfig();
    this.createConnection();
    // this.checkConnection();
    this.getQuery();
  }

  getConfig() {
    this.config = require('./MySQL_Config');
  }

  createConnection() {
    this.conn = new mysql.createConnection(this.config);
  }

  checkConnection(callback) {
    this.conn.connect(function(err) {
      if (err) throw err;
      callback(true);
    });
  }

  getQuery() {
    this.query = require('./MySQL_Query');
  }

  parseRows(data) {
    return Object.values(JSON.parse(JSON.stringify(data)));
  }

  parseCols(data) {
    return Object.keys(data[0]);
  }

}

module.exports = MySQL_Connection;
