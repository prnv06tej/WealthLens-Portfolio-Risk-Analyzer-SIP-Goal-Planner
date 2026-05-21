const mongoose = require('mongoose');

const mutualFundSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        enum: ['Large Cap', 'Mid Cap', 'Small Cap', 'Debt', 'Flexi Cap'] 
    },
    riskScore: { 
        type: Number, 
        min: 1, 
        max: 100 
    }, 
    
    // Array of objects linking to the Stock model
    holdings: [{
        stockId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Stock', 
            required: true 
        },
        weightPercentage: { 
            type: Number, 
            required: true 
        } 
    }]
}, { timestamps: true });

module.exports = mongoose.model('MutualFund', mutualFundSchema);