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

// returns all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;

    // the query method executes the callback with all the resulting rows that match the query
    // the callback function captures the responses from the query
    db.query(sql, (err, rows) => {
        if(err) {
            // if error, return status 500 (server error) with the error's message
            res.status(500).json({ error: err.message });
            // exit the database if error is encountered
            return;
        }
        // if success, return response data with a 'success' message
        res.json({
            message: 'success',
            data: rows
        });
    });
});


// // returns a single candidate based off id
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    // saves the id as a parameter
    const params = [req.params.id];
  
    db.query(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: row
      });
    });
});


// // deletes a candidate
// // the question mark denotes a placeholder and makes this a prepared statement
// // a prepared statement can execute repeatedly using different values
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if(err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// // saves the sql command as a variable
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//              VALUES (?,?,?,?)`;

// // saves the sql parameters to a variable
// const params = [1, 'Ronald', 'Firbank', 1];

// // creates a candidate
// db.query(sql, params, (err, result) => {
//     if(err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// default response for any other request (not found)
// make sure this is the last route
app.use((req, res) => {
    res.status(404).end();
});

// function that starts server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});