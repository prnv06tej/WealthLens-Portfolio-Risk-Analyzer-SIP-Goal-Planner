const Portfolio = require("../models/portfolio");
const MutualFund = require("../models/mutualFund");
const Transaction = require("../models/transaction");
const { calculateXIRR } = require("../utils/xirrMath");

const addInvestment = async (req, res) => {
  try {
    const { fundIsin, amount, type, brokerage } = req.body;
    const userId = req.user._id;
    
    const transactionAmount = parseFloat(amount);
    const transactionType = type || "BUY";
    
    // Convert brokerage input percentage to ratio (Default to 0.05% if missing)
    const brokeragePercent = parseFloat(brokerage) || 0.05;
    const feeMultiplier = brokeragePercent / 100;

    if (!fundIsin || isNaN(transactionAmount) || transactionAmount <= 0) {
      return res.status(400).json({ message: "Transaction values must be greater than zero." });
    }

    const fund = await MutualFund.findOne({ isin: fundIsin.trim() });
    if (!fund) {
      return res.status(404).json({ message: `Mutual Fund with ISIN ${fundIsin} could not be located.` });
    }

    // 🌟 AUTOMATIC INTERNAL UNIT MATH ENGINE W/ BROKERAGE
    let unitsAllocated = 0;
    if (transactionType === "BUY") {
      // Fee reduces the capital that actually goes toward buying units
      const netInvestedAmount = transactionAmount * (1 - feeMultiplier);
      unitsAllocated = netInvestedAmount / fund.currentNAV;
    } else {
      // Fee forces the user to liquidate extra units to clear the payout target
      const netLiquidatedAmount = transactionAmount * (1 + feeMultiplier);
      unitsAllocated = netLiquidatedAmount / fund.currentNAV;
    }

    let portfolio = await Portfolio.findOne({ userId });
    let currentUnitsOwned = 0;
    let existingFundIndex = -1;

    if (portfolio) {
      existingFundIndex = portfolio.investments.findIndex(
        (item) => item.fundId.toString() === fund._id.toString()
      );
      if (existingFundIndex >= 0) {
        currentUnitsOwned = portfolio.investments[existingFundIndex].accumulatedUnits || 0;
      }
    }

    // 🛑 LONG-ONLY RISK SAFEGUARD: Block shorts or overdraft liquidation events
    if (transactionType === "SELL") {
      if (!portfolio || existingFundIndex < 0 || currentUnitsOwned <= 0) {
        return res.status(400).json({ 
          message: `Transaction Aborted: Balance is zero. You cannot sell units before buying.` 
        });
      }

      if (unitsAllocated > (currentUnitsOwned + 0.0001)) {
        return res.status(400).json({
          message: `Transaction Aborted: Insufficient asset balance. You own ${currentUnitsOwned.toFixed(3)} units, but this sale requires ${unitsAllocated.toFixed(3)} units (including brokerage fees).`
        });
      }
    }

    const newBalanceUnits = transactionType === "SELL" 
      ? currentUnitsOwned - unitsAllocated 
      : currentUnitsOwned + unitsAllocated;

    // Persist receipt into your validated Transaction model database sheet
    await Transaction.create({
      userId,
      fundId: fund._id, 
      mutualFundId: fund._id, 
      fundIsin: fund.isin,
      transactionType: transactionType,
      amount: transactionAmount,
      unitsAllocated: parseFloat(unitsAllocated.toFixed(3)),
      navAtTransaction: fund.currentNAV,
      balanceUnits: parseFloat(Math.max(0, newBalanceUnits).toFixed(3)),
      transactionDate: req.body.transactionDate || new Date()
    });

    // Update aggregate Portfolio balances sheet fields
    const assignedFolioNumber = "FOL-" + Math.floor(10000000 + Math.random() * 90000000);

    if (!portfolio) {
      portfolio = await Portfolio.create({
        userId,
        investments: [{ 
          fundId: fund._id, 
          accumulatedUnits: unitsAllocated, 
          totalInvested: transactionAmount,
          folioNumber: assignedFolioNumber
        }],
      });
    } else {
      if (existingFundIndex >= 0) {
        if (transactionType === "SELL") {
          portfolio.investments[existingFundIndex].accumulatedUnits -= unitsAllocated;
          
          // Proportional cost reduction rule to maintain accurate average cost records
          const reductionRatio = unitsAllocated / currentUnitsOwned;
          portfolio.investments[existingFundIndex].totalInvested *= (1 - reductionRatio);
          
          if (portfolio.investments[existingFundIndex].accumulatedUnits <= 0.001) {
            portfolio.investments.splice(existingFundIndex, 1);
          }
        } else {
          portfolio.investments[existingFundIndex].accumulatedUnits += unitsAllocated;
          portfolio.investments[existingFundIndex].totalInvested += transactionAmount;
        }
      } else {
        portfolio.investments.push({
          fundId: fund._id,
          accumulatedUnits: unitsAllocated,
          totalInvested: transactionAmount,
          folioNumber: assignedFolioNumber
        });
      }
      await portfolio.save();
    }

    return res.status(200).json({
      message: "Ledger transaction updated successfully.",
      data: portfolio,
    });

  } catch (error) {
    console.error("❌ BACKEND TRANSACTION LOG ENGINE DEVIATION:", error);
    res.status(500).json({ error: "Server Error Engine Failure", details: error.message });
  }
};

const getPortfolio = async (req, res) => {
    try {
        // 🌟 STEP 1: Ensure 'category' is included in the populated fields list!
        const portfolio = await Portfolio.findOne({ userId: req.user._id })
            .populate('investments.fundId', 'name currentNAV category');

        if (!portfolio || portfolio.investments.length === 0) {
            return res.status(200).json({ 
                success: true,
                data: {
                    summary: { totalInvested: 0, currentValue: 0, absoluteReturn: 0, returnPercentage: 0, xirr: 0 },
                    holdings: [],
                    allocation: []
                }
            });
        }

        let totalPortfolioValue = 0;
        let totalPortfolioInvested = 0;
        
        // 🌟 STEP 2: Initialize a hash map to accumulate current value totals by category
        const categoryMap = {};

        const enrichedInvestments = portfolio.investments.map(inv => {
            if (!inv.fundId) return null;

            const currentValue = inv.accumulatedUnits * inv.fundId.currentNAV;
            
            totalPortfolioValue += currentValue;
            totalPortfolioInvested += inv.totalInvested;

            // 🌟 STEP 3: Read the category field and group the absolute current valuations
            const categoryName = inv.fundId.category || 'Uncategorized';
            categoryMap[categoryName] = (categoryMap[categoryName] || 0) + currentValue;

            const absoluteReturn = ((currentValue - inv.totalInvested) / inv.totalInvested) * 100;

            return {
                fundName: inv.fundId.name,
                units: inv.accumulatedUnits,
                invested: inv.totalInvested,
                currentValue: parseFloat(currentValue.toFixed(2)),
                returnPercentage: parseFloat(absoluteReturn.toFixed(2))
            };
        }).filter(Boolean);

        // 🌟 STEP 4: Convert the aggregated category map into the structural array format Recharts expects
        const allocationArray = Object.keys(categoryMap).map(key => ({
            name: key,
            value: parseFloat(categoryMap[key].toFixed(2))
        }));

        const absoluteReturn = totalPortfolioValue - totalPortfolioInvested;
        const totalReturnPercentage = totalPortfolioInvested > 0 ? ((absoluteReturn / totalPortfolioInvested) * 100).toFixed(2) : 0;

        // 🌟 STEP 5: Send everything wrapped inside the unified "data" key matching your dashboard
        res.status(200).json({ 
            success: true,
            data: {
                summary: {
                    totalInvested: parseFloat(totalPortfolioInvested.toFixed(2)),
                    currentValue: parseFloat(totalPortfolioValue.toFixed(2)),
                    absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
                    returnPercentage: parseFloat(totalReturnPercentage),
                    xirr: 0 
                },
                holdings: enrichedInvestments,
                allocation: allocationArray // 🎯 Recharts Pie Chart reads this directly!
            }
        });

    } catch (error) {
        console.error("❌ PORTFOLIO FETCH ENGINE EXCEPTION:", error);
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

const getPortfolioReturns = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({ userId }).sort({
      createdAt: 1,
    });

    if (!transactions || transactions.length === 0) {
      return res.status(200).json({
        message: "No transactions found to calculate returns.",
        xirr: 0,
      });
    }

    const cashFlows = transactions.map((tx) => {
      // BUY = Negative (Money leaving bank), SELL = Positive (Money entering bank)
      const flowAmount =
        tx.transactionType === "BUY"
          ? -Math.abs(tx.amount)
          : Math.abs(tx.amount);

      return {
        amount: flowAmount,
        date: tx.createdAt,
      };
    });

    const portfolio = await Portfolio.findOne({ userId }).populate(
      "investments.fundId",
    );
    let currentPortfolioValue = 0;

    if (portfolio) {
      portfolio.investments.forEach((inv) => {
        currentPortfolioValue += inv.accumulatedUnits * inv.fundId.currentNAV;
      });
    }

    //The "Sell All" Simulation (Add today's value as a final positive cash flow)
    cashFlows.push({
      amount: currentPortfolioValue,
      date: new Date(), // Today
    });

    //Run the Newton-Raphson Engine!
    const annualizedReturn = calculateXIRR(cashFlows);

    res.status(200).json({
      dataPointsAnalyzed: cashFlows.length,
      currentPortfolioValue: parseFloat(currentPortfolioValue.toFixed(2)),
      annualizedReturnXIRR:
        annualizedReturn !== null ? annualizedReturn : "Insufficient data span",
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

const getUserTransactions = async (req, res) => {
    try {
        // 🌟 FIXED: Populate 'fundId' because that's the exact key defined in your Transaction schema
        // 🌟 FIXED: Sorted by 'createdAt' since your schema uses { timestamps: true }
        const list = await Transaction.find({ userId: req.user._id })
            .populate('fundId', 'name')
            .sort({ createdAt: -1 });

        // Map the fields to match the frontend key names exactly
        const formatted = list.map(tx => ({
            _id: tx._id,
            transactionDate: tx.createdAt, // Maps schema timestamp to frontend UI date field
            fundIsin: tx.fundIsin,
            // 🌟 ALIGNMENT: Map the populated fundId reference object to the 'mutualFundId' key 
            // that your frontend Dashboard.jsx component is explicitly trying to read!
            mutualFundId: tx.fundId, 
            type: tx.transactionType,
            units: tx.unitsAllocated,      // Maps schema's unitsAllocated key cleanly
            amount: tx.amount
        }));

        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        console.error("❌ LEDGER COMPILER EXCEPTION:", error);
        res.status(500).json({ error: 'Failed to compile ledger arrays', details: error.message });
    }
};

module.exports = {
  addInvestment,
  getPortfolio,
  getPortfolioReturns,
  getUserTransactions,
};
