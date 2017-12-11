var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 3,
    host: '125.131.73.28',
    port: '53306',
    user: 'root',
    database: 'rmanager',
    password: 'wook1136'
});

module.exports = pool;