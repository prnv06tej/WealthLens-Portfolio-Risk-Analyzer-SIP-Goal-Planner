const express = require('express');
const router = express.Router();
const { ingestFundData,getDatabaseInventory } = require('../controllers/adminController');
const { protect,admin } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(admin);

router.post('/ingest', ingestFundData);
router.get('/inventory',getDatabaseInventory);

module.exports = router;