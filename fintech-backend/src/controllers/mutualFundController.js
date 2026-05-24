const MutualFund = require('../models/mutualFund');
const { calculateFundOverlap } = require('../utils/financialMath');

const createFund = async (req, res) => {
    try {
        const { name, category, riskScore, holdings } = req.body;
        
        const fund = await MutualFund.create({ name, category, riskScore, holdings });
        res.status(201).json({ message: 'Mutual Fund created', data: fund });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

const getAllFunds = async (req, res) => {
    try {
        const funds = await MutualFund.find()
            .populate('holdings.stockId', 'ticker companyName sector');
            
        res.status(200).json({ count: funds.length, data: funds });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};


// @route   GET /api/funds/overlap?fundA=<id>&fundB=<id>
const compareFunds = async (req, res) => {
    try {
        const { fundA, fundB } = req.query; 

        if (!fundA || !fundB) {
            return res.status(400).json({ error: 'Please provide both fundA and fundB IDs in the query' });
        }

        // Fetch both funds AND populate their stock details simultaneously
        const [firstFund, secondFund] = await Promise.all([
            MutualFund.findById(fundA).populate('holdings.stockId', 'ticker companyName'),
            MutualFund.findById(fundB).populate('holdings.stockId', 'ticker companyName')
        ]);

        if (!firstFund || !secondFund) {
            return res.status(404).json({ error: 'One or both funds not found' });
        }

        // Run the heavy lifting through our utility function
        const overlapData = calculateFundOverlap(firstFund, secondFund);

        res.status(200).json({
            fundsCompared: [firstFund.name, secondFund.name],
            overlapData
        });

    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

module.exports={
    createFund,
    getAllFunds,
    compareFunds
}