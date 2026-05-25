const express = require('express');
const router = express.Router();
const { addInvestment, getPortfolio,getPortfolioReturns } = require('../controllers/portfolioController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); 

router.post('/invest', addInvestment);
router.get('/returns', getPortfolioReturns);
router.get('/', getPortfolio);

module.exports = router;