const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    investments: [{
        fundId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'MutualFund', 
            required: true 
        },
        amountInvested: { 
            type: Number, 
            required: true 
        }
    }],
    
    aggregateRiskScore: { 
        type: Number, 
        default: 0 
    } 
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);