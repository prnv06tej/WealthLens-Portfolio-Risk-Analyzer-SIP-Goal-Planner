const express = require('express');
const router = express.Router();
const { createGoal, getUserGoals } = require('../controllers/goalController');

router.post('/', createGoal);
router.get('/user/:userId', getUserGoals);

module.exports = router;