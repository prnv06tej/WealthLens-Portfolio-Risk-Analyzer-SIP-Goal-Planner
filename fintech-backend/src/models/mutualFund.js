const mongoose = require('mongoose');

const mutualFundSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    isin: { 
        type: String, //global identifier
        required: true, 
        unique: true 
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
    currentNAV: { 
        type: Number, 
        required: true 
    },
    navDate: { //lates AMFI updated date
        type: String 
    }, 
    isPopular: { 
        type: Boolean, 
        default: false 
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