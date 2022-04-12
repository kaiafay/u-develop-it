// import mysql2 package
const mysql = require('mysql2');

// connect to mysql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // mysql username
        user: 'root',
        // mysql password
        password: 'codenow18',
        database: 'election'
    }
);

// export db
module.exports = db;