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

// default response for any other request (not found)
// make sure this is the last route
app.use((req, res) => {
    res.status(404).end();
});

// function that starts server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});