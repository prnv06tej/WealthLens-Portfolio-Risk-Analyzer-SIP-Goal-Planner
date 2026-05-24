const express = require('express');
const router = express.Router();
const { createGoal, getUserGoals } = require('../controllers/goalController');
const { protect } = require('../middlewares/authMiddleware');

//applied to all routes
router.use(protect);
router.post('/', createGoal);
router.get('/user/:userId', getUserGoals);

module.exports = router;