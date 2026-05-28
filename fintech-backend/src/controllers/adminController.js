const MutualFund = require('../models/mutualFund');
const Stock = require('../models/stock');
const { extractHoldingsWithAI } = require('../utils/geminiParser');


const ingestFundData = async (req, res) => {
    try {
        const { isin, messyDataDump } = req.body;

        if (!isin || !messyDataDump) {
            return res.status(400).json({ message: "ISIN and data dump are required." });
        }

        console.log(`Sending data to Gemini for ISIN: ${isin}...`);
        
        
        const cleanHoldings = await extractHoldingsWithAI(messyDataDump);
        const processedHoldings = [];

        
        for (const item of cleanHoldings) {
            const stock = await Stock.findOneAndUpdate(
                { companyName: item.companyName },
                { ticker: item.ticker }, 
                { upsert: true, new: true } // Creates it if it doesn't exist
            );

            processedHoldings.push({
                stockId: stock._id,
                weightPercentage: item.weight
            });
        }

        
        await MutualFund.findOneAndUpdate(
            { isin: isin },
            { 
                isPopular: true, 
                holdings: processedHoldings 
            }
        );

        res.status(200).json({ 
            message: "AI Data ingested successfully!", 
            stocksAdded: processedHoldings.length,
            extractedData: cleanHoldings
        });

    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

module.exports = { ingestFundData };