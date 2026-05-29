const express = require('express');
const router = express.Router();
const { ingestFundData } = require('../controllers/adminController');


router.post('/ingest', ingestFundData);

module.exports = router;