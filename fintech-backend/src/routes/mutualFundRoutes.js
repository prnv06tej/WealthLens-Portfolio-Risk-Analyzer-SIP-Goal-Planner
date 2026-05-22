const express = require('express');
const router = express.Router();
const {  createFund, getAllFunds} = require('../controllers/mutualFundController');

router.post('/', createFund);
router.get('/', getAllFunds);

module.exports = router
