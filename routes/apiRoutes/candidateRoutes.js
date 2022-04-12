const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// returns all candidates
router.get('/candidates', (req, res) => {
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
router.get('/candidate/:id', (req, res) => {
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

// deletes a candidate
router.delete('/candidate/:id', (req, res) => {
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

// creates a candidate
// use object destructuring to pull the body property out of the request object
router.post('/candidate', ({ body }, res) => {
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

// updates a candidate's party
router.put('/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];

    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        // check if a record was found
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'success',
          data: req.body,
          changes: result.affectedRows
        });
      }
    });
});

module.exports = router;