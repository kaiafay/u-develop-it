const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
// import db
const db = require('./db/connection');
// PORT designation
const PORT = process.env.PORT || 3001;
// app expression
const app = express();
// express.js middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
// adding the /api prefix here allows us to remove it from the individual route expressions
app.use('/api', apiRoutes);

// default response for any other request (not found)
// make sure this is the last route
app.use((req, res) => {
    res.status(404).end();
});

// start server after db connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});