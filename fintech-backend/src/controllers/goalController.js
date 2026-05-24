const Goal = require('../models/goal');
const { calculateReverseSip } = require('../utils/sipMath');


// @route   POST /api/goals
const createGoal = async (req, res) => {
    try {
        const { userId, name, targetAmount, yearsToGoal, expectedInflationRate, expectedReturnRate } = req.body;

        // Validation for required fields
        if (!userId || !name || !targetAmount || !yearsToGoal) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const inflation = expectedInflationRate || 6.0;
        const returns = expectedReturnRate || 12.0;

        // Run the math utility
        const mathResult = calculateReverseSip(targetAmount, yearsToGoal, returns, inflation);

        // Save everything to the database
        const newGoal = await Goal.create({
            userId,
            name,
            targetAmount,
            yearsToGoal,
            expectedInflationRate: inflation,
            expectedReturnRate: returns,
            requiredMonthlySip: mathResult.requiredMonthlySip
        });

        res.status(201).json({
            message: 'Goal created and SIP calculated successfully',
            data: {
                goal: newGoal,
                inflationAdjustedTarget: mathResult.inflationAdjustedTarget
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// @route   GET /api/goals/user/:userId
const getUserGoals = async (req, res) => {
    try {
        const { userId } = req.params;
        const goals = await Goal.find({ userId });
        res.status(200).json({ count: goals.length, data: goals });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

module.exports = {
    createGoal,
    getUserGoals
};