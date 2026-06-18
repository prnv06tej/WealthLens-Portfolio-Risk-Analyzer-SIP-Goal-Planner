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
            return res.status(400).json({ message: "Both Fund A and Fund B ID criteria parameters are required." });
        }

        // 1. Fetch both mutual fund profiles and populate their underlying stock relations
        const firstFund = await MutualFund.findById(fundA).populate('holdings.stockId');
        const secondFund = await MutualFund.findById(fundB).populate('holdings.stockId');

        if (!firstFund || !secondFund) {
            return res.status(404).json({ message: "One or both selected mutual funds could not be located." });
        }

        const commonStocks = [];
        let totalOverlapPercentage = 0;

        const holdingsA = firstFund.holdings || [];
        const holdingsB = secondFund.holdings || [];

        // 2. Cross-reference intersection nodes
        for (const itemA of holdingsA) {
            // Guard against unparsed or corrupted stock nodes
            if (!itemA.stockId) continue; 

            for (const itemB of holdingsB) {
                if (!itemB.stockId) continue;

                //  THE CRITICAL FIX: Convert ObjectIds to strings before running comparisons!
                const isSameStock = itemA.stockId._id.toString() === itemB.stockId._id.toString();

                if (isSameStock) {
                    // Extract allocation parameters safely
                    const weightInA = itemA.weightPercentage || 0;
                    const weightInB = itemB.weightPercentage || 0;

                    //  OVERLAP FORMULA: Capture the absolute minimum common intersection metric
                    const overlapWeight = Math.min(weightInA, weightInB);
                    totalOverlapPercentage += overlapWeight;

                    commonStocks.push({
                        name: itemA.stockId.companyName || "Unknown Asset",
                        ticker: itemA.stockId.ticker,
                        weightInA: weightInA,
                        weightInB: weightInB,
                        overlapWeight: parseFloat(overlapWeight.toFixed(2))
                    });
                }
            }
        }

        // 3. Dispatch structured payload aligned perfectly with frontend key targets
        res.status(200).json({
            fundAName: firstFund.name,
            fundBName: secondFund.name,
            overlapPercentage: parseFloat(totalOverlapPercentage.toFixed(2)),
            commonStocks: commonStocks
        });

    } catch (error) {
        console.error(" OVERLAP COMPILER CRASHED:", error);
        res.status(500).json({ error: "Failed to compile common position intersections", details: error.message });
    }
};
const getPopularFunds = async (req, res) => {
    try {
        // Fetch only funds where isPopular is true
        const popularFunds = await MutualFund.find({ isPopular: true });
        
        res.status(200).json({
            count: popularFunds.length,
            data: popularFunds
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

const searchFunds = async (req, res) => {
    try {
        const searchQuery = req.query.q; 

        if (!searchQuery) {
            return res.status(400).json({ message: "Please provide a search term" });
        }

        
        const searchResults = await MutualFund.find({ 
            name: { $regex: searchQuery, $options: 'i' } 
        }).limit(15); //preotects from crash

        res.status(200).json({
            count: searchResults.length,
            data: searchResults
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

module.exports={
    createFund,
    getAllFunds,
    compareFunds,
    getPopularFunds,
    searchFunds
}