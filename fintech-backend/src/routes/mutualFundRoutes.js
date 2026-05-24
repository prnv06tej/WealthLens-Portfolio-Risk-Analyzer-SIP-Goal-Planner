const express = require('express');
const router = express.Router();
const {  createFund, getAllFunds, compareFunds} = require('../controllers/mutualFundController');

router.get('/overlap', compareFunds);
router.post('/', createFund);
router.get('/', getAllFunds);

module.exports = router
