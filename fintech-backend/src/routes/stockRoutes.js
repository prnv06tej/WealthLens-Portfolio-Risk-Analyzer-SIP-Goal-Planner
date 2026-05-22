const express = require('express');
const router = express.Router();
const { createStock, getAllStocks } = require('../controllers/stockController');

router.post('/', createStock);
router.get('/', getAllStocks);

module.exports = router;