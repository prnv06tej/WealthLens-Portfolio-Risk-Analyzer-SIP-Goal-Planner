const express = require('express');
const router = express.Router();
const { updateUserProfile,getUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.put('/profile', updateUserProfile);
router.get('/profile', getUserProfile);

module.exports = router;