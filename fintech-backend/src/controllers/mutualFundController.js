const MutualFund = require('../models/mutualFund');

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

module.exports={
    createFund,
    getAllFunds
}