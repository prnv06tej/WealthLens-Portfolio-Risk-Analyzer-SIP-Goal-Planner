const MutualFund = require('../models/mutualFund');
const Stock = require('../models/stock');
const { extractHoldingsWithAI } = require('../utils/geminiParser');

const ingestFundData = async (req, res) => {
    try {
        //  ADDED: directHoldings lets you pass a pre-formatted JSON array directly
        const { isin, category, messyText, directHoldings } = req.body;

        if (!isin || !category) {
            return res.status(400).json({ message: "ISIN and category strategy are required fields." });
        }

        let cleanHoldings = [];

        //  AUTOMATIC BYPASS HYBRID ENGINE
        if (directHoldings && Array.isArray(directHoldings) && directHoldings.length > 0) {
            console.log(` Bypassing AI Node: Executing direct database injection for ISIN: ${isin}...`);
            cleanHoldings = directHoldings;
        } else if (messyText) {
            console.log(` Sending data to Gemini API for ISIN: ${isin}...`);
            cleanHoldings = await extractHoldingsWithAI(messyText);
        } else {
            return res.status(400).json({ message: "Provide either a 'messyText' block or a 'directHoldings' JSON array." });
        }

        const processedHoldings = [];

        // The transactional stock mapper loop remains identical and bulletproof
        for (const item of cleanHoldings) {
            if (!item.ticker) continue;

            const stock = await Stock.findOneAndUpdate(
                { ticker: item.ticker.toUpperCase().trim() }, 
                { $set: { companyName: item.companyName.trim() } }, 
                { upsert: true, returnDocument: 'after' }
            );

            // Strip out potential string symbols if parsed text slipped through
            const numericWeight = typeof item.weight === 'string' 
                ? parseFloat(item.weight.replace('%', '').trim()) 
                : item.weight || 0;

            processedHoldings.push({
                stockId: stock._id,
                weightPercentage: numericWeight
            });
        }

        await MutualFund.findOneAndUpdate(
            { isin: isin },
            { 
                category: category,
                isPopular: true, 
                holdings: processedHoldings 
            }
        );

        res.status(200).json({ 
            message: directHoldings ? "Direct JSON Ingest Complete!" : "AI Data ingested successfully!", 
            stocksAdded: processedHoldings.length,
            extractedData: cleanHoldings
        });

    } catch (error) {
        console.error(" INGESTION ENGINE CRASH:", error);
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

const getDatabaseInventory = async (req, res) => {
    try {
        const funds = await MutualFund.find({}, 'isin name category holdings updatedAt');
        
        const summary = funds.map(fund => ({
            isin: fund.isin,
            name: fund.name,
            category: fund.category,
            holdingsCount: fund.holdings ? fund.holdings.length : 0,
            lastUpdated: fund.updatedAt
        }));

        res.status(200).json({ success: true, count: summary.length, inventory: summary });
    } catch (error) {
        res.status(500).json({ error: 'Failed to build database inventory map', details: error.message });
    }
};

module.exports = { 
    ingestFundData,
    getDatabaseInventory,
};