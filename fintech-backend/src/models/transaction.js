const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    fundId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'MutualFund', 
        required: true 
    },
    transactionType: { 
        type: String, 
        enum: ['BUY', 'SELL'], 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    // We don't need to manually add a "date" field because { timestamps: true } 
    // automatically creates createdAt and updatedAt fields for us!
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);