
const express = require('express');
const router = express.Router();
const { addInvestment,getUserTransactions } = require('../controllers/portfolioController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getUserTransactions); // GET /api/transactions
router.post('/add', addInvestment);    // POST /api/transactions/add

module.exports = router;