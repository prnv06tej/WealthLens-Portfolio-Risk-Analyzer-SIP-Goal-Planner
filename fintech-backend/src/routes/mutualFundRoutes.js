const express = require('express');
const router = express.Router();
const {  createFund, getAllFunds, compareFunds, getPopularFunds,searchFunds} = require('../controllers/mutualFundController');

router.get('/overlap', compareFunds);
router.post('/', createFund);
router.get('/', getAllFunds);
router.get('/popular',getPopularFunds);
router.get('/search',searchFunds);

module.exports = router
