const Stock = require('../models/stock');

// @desc    Add a new master stock
// @route   POST /api/stocks
const createStock = async (req, res) => {
    try {
        const { ticker, companyName, sector } = req.body;

        // Check if stock already exists
        const stockExists = await Stock.findOne({ ticker });
        if (stockExists) {
            return res.status(400).json({ error: 'Stock ticker already exists' });
        }

        const stock = await Stock.create({ ticker, companyName, sector });
        res.status(201).json({ message: 'Stock added successfully', data: stock });
        
    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
};

// @desc    Get all master stocks
// @route   GET /api/stocks
const getAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.status(200).json({ count: stocks.length, data: stocks });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports={
   createStock,
   getAllStocks
}