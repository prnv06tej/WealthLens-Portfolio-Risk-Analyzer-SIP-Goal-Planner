const express = require('express');
const router = express.Router();
const { getPortfolio,getPortfolioReturns } = require('../controllers/portfolioController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); 


router.get('/summary', getPortfolio);
router.get('/returns', getPortfolioReturns);

module.exports = router;