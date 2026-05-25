const Portfolio = require("../models/portfolio");
const MutualFund = require("../models/mutualFund");
const Transaction = require("../models/transaction");
const { calculateXIRR } = require('../utils/xirrMath');

const addInvestment = async (req, res) => {
  try {
    const { fundId, amountInvested } = req.body;
    const userId = req.user._id;

    // Validation
    if (amountInvested <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid amount, enter a positive amount" });
    }

    const fund = await MutualFund.findById(fundId);
    if (!fund) {
      return res.status(404).json({ message: "Invalid FundId" });
    }

    //recipt of transaction
    await Transaction.create({
      userId,
      fundId,
      transactionType: "BUY",
      amount: amountInvested,
    });

    let portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      // First time investing ever
      portfolio = await Portfolio.create({
        userId,
        investments: [{ fundId, amountInvested }],
      });
    } else {
      // Find if the fund already exists in the investments array
      // used .toString() because MongoDB ObjectIds can behave weirdly with ===
      const existingFundIndex = portfolio.investments.findIndex(
        (item) => item.fundId.toString() === fundId.toString(),
      );

      if (existingFundIndex >= 0) {
        // The fund exists! Add the new money to the old money.
          portfolio.investments[existingFundIndex].accumulatedUnits +=
          unitsAllocated;
          portfolio.investments[existingFundIndex].totalInvested +=
          amountInvested;
      } else {
        portfolio.investments.push({
          fundId,
          accumulatedUnits: unitsAllocated,
          totalInvested: amountInvested,
        });
      }

      await portfolio.save();
    }

    return res.status(200).json({
      message: "Investment processed and transaction logged",
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

const getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user._id })
            .populate('investments.fundId', 'name currentNAV');

        if (!portfolio) {
            return res.status(404).json({ message: 'No investments found.' });
        }

        let totalPortfolioValue = 0;
        let totalPortfolioInvested = 0;

        
        const enrichedInvestments = portfolio.investments.map(inv => {
            const currentValue = inv.accumulatedUnits * inv.fundId.currentNAV;
            const absoluteReturn = ((currentValue - inv.totalInvested) / inv.totalInvested) * 100;

            totalPortfolioValue += currentValue;
            totalPortfolioInvested += inv.totalInvested;

            return {
                fundName: inv.fundId.name,
                units: inv.accumulatedUnits,
                invested: inv.totalInvested,
                currentValue: parseFloat(currentValue.toFixed(2)),
                returnPercentage: parseFloat(absoluteReturn.toFixed(2))
            };
        });

        res.status(200).json({ 
            summary: {
                totalInvested: totalPortfolioInvested,
                currentValue: totalPortfolioValue,
                totalReturnPercentage: (((totalPortfolioValue - totalPortfolioInvested) / totalPortfolioInvested) * 100).toFixed(2)
            },
            holdings: enrichedInvestments 
        });

    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

const getPortfolioReturns = async (req, res) => {
    try {
        const userId = req.user._id;

       
        const transactions = await Transaction.find({ userId }).sort({ createdAt: 1 });
        
        if (!transactions || transactions.length === 0) {
            return res.status(200).json({ message: "No transactions found to calculate returns.", xirr: 0 });
        }

       
        const cashFlows = transactions.map(tx => {
            // BUY = Negative (Money leaving bank), SELL = Positive (Money entering bank)
            const flowAmount = tx.transactionType === 'BUY' ? -Math.abs(tx.amount) : Math.abs(tx.amount);
            
            return {
                amount: flowAmount,
                date: tx.createdAt
            };
        });

        const portfolio = await Portfolio.findOne({ userId }).populate('investments.fundId');
        let currentPortfolioValue = 0;

        if (portfolio) {
            portfolio.investments.forEach(inv => {
                
                currentPortfolioValue += inv.accumulatedUnits * inv.fundId.currentNAV;
            });
        }

        //The "Sell All" Simulation (Add today's value as a final positive cash flow)
        cashFlows.push({
            amount: currentPortfolioValue,
            date: new Date() // Today
        });

        //Run the Newton-Raphson Engine!
        const annualizedReturn = calculateXIRR(cashFlows);

        res.status(200).json({
            dataPointsAnalyzed: cashFlows.length,
            currentPortfolioValue: parseFloat(currentPortfolioValue.toFixed(2)),
            annualizedReturnXIRR: annualizedReturn !== null ? annualizedReturn : "Insufficient data span"
        });

    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

module.exports = {
  addInvestment,
  getPortfolio,
  getPortfolioReturns
};
