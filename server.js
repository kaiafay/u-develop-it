const express = require('express');
// import mysql2 package
const mysql = require('mysql2');
// PORT designation
const PORT = process.env.PORT || 3001;
// app expression
const app = express();
// express.js middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// connect to mysql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // mysql username
        user: 'root',
        // mysql password
        password: 'codenow18',
        database: 'election'
    },
    console.log("Connected to the election database.")
);

// returns all data from the candidates table
// the query method executes the callback with all the resulting rows that match the query
// the callback function captures the responses from the query
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });

// returns a single candidate based off id
db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
    if(err) {
        console.log(err);
    }
    console.log(row);
});

// default response for any other request (not found)
// make sure this is the last route
app.use((req, res) => {
    res.status(404).end();
});

// function that starts server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});