const express = require('express');
const router = express.Router();
const { updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.put('/profile', updateUserProfile);

module.exports = router;