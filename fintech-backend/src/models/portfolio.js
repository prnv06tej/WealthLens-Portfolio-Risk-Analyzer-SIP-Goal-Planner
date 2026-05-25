const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    folioNumber: { 
        type: String, // E.g., FOLIO-98765432
        required: true, 
        unique: true 
    }, 
    
    investments: [{
        fundId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'MutualFund', 
            required: true 
        },
       accumulatedUnits: { 
        type: Number, 
        default: 0, 
        required: true 
       },
       totalInvested: { 
        type: Number, 
        default: 0, 
        required: true 
       }
    }],
    
    aggregateRiskScore: { 
        type: Number, 
        default: 0 
    } 
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);