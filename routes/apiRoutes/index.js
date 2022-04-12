// this js file acts as a central hub for all the routes

const express = require('express');
const router = express.Router();

router.use(require('./candidateRoutes'));

module.exports = router;