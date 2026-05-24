const Portfolio = require('../models/portfolio');
const MutualFund = require('../models/mutualFund');
const Transaction = require('../models/transaction'); 

const addInvestment = async (req, res) => {
    try {
        const { fundId, amountInvested } = req.body;
        const userId = req.user._id;

        // Validation
        if (amountInvested <= 0) {
            return res.status(400).json({ message: "Invalid amount, enter a positive amount" });
        }

        const fund = await MutualFund.findById(fundId);
        if (!fund) {
            return res.status(404).json({ message: "Invalid FundId" });
        }

       //recipt of transaction
        await Transaction.create({
            userId,
            fundId,
            transactionType: 'BUY',
            amount: amountInvested
        });

        
        let portfolio = await Portfolio.findOne({ userId });

        if (!portfolio) {
            // First time investing ever
            portfolio = await Portfolio.create({
                userId,
                investments: [{ fundId, amountInvested }]
            });
        } else {
            // Find if the fund already exists in the investments array
            // used .toString() because MongoDB ObjectIds can behave weirdly with ===
            const existingFundIndex = portfolio.investments.findIndex(
                (item) => item.fundId.toString() === fundId.toString()
            );

            if (existingFundIndex >= 0) {
                // The fund exists! Add the new money to the old money.
                portfolio.investments[existingFundIndex].amountInvested += amountInvested;
            } else {
                // It's a new fund for this user. Push it to the array.
                portfolio.investments.push({ fundId, amountInvested });
            }
            
            await portfolio.save();
        }

        return res.status(200).json({ 
            message: 'Investment processed and transaction logged', 
            data: portfolio 
        });

    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

const getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user._id })
            .populate('investments.fundId', 'name category riskScore'); 

        if (!portfolio) {
            return res.status(404).json({ message: 'No investments found.' });
        }

        res.status(200).json({ data: portfolio });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = {
     addInvestment, 
     getPortfolio 
    };