const mysql = require('mysql2');

const db_connection =  {
    host: 'localhost',
    database: 'emp_db',
    user: 'root',
};

const connection = mysql.createPool(db_connection);

module.exports = connection;