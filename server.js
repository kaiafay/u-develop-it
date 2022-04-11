const express = require('express');
// import mysql2 package
const mysql = require('mysql2');
// import inputCheck() function
const inputCheck = require('./utils/inputCheck');
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
    // the JOIN statement merges the candidates and parties tables
    const sql = `SELECT candidates.*, parties.name 
                 AS party_name 
                 FROM candidates 
                 LEFT JOIN parties 
                 ON candidates.party_id = parties.id`;

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


// returns a single candidate based off id
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
                 AS party_name 
                 FROM candidates 
                 LEFT JOIN parties 
                 ON candidates.party_id = parties.id 
                 WHERE candidates.id = ?`;

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

// returns all parties
app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;

    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
});

// returns a single party based off id
app.get('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
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

// deletes a candidate
app.delete('/api/candidate/:id', (req, res) => {
    // the question mark denotes a placeholder and makes this a prepared statement
    // a prepared statement can execute repeatedly using different values
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
          res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
          // if there's no affected rows, there was no candidate by that id
          res.json({
            message: 'Candidate not found'
          });
        } else {
          res.json({
            message: 'deleted',
            changes: result.affectedRows,
            id: req.params.id
          });
        }
    });    
});

// deletes a party
app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: res.message });
        // checks if anything was deleted
      } else if (!result.affectedRows) {
        res.json({
          message: 'Party not found'
        });
      } else {
        res.json({
          message: 'deleted',
          changes: result.affectedRows,
          id: req.params.id
        });
      }
    });
});

// creates a candidate
// use object destructuring to pull the body property out of the request object
app.post('/api/candidate', ({ body }, res) => {
    // the inputCheck() function verifies that user info in the request can create a candidate
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    // saves the sql command as a variable
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                 VALUES (?,?,?)`;
    // saves the sql parameters to a variable
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
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