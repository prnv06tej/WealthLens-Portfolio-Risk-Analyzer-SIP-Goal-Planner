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
    navAtTransaction: { 
        type: Number, // Price on that day
        required: true 
    }, 
    unitsAllocated: { 
        type: Number, //no. of units purchased
        required: true 
    },
    balanceUnits: { 
        type: Number, //total units owned
        required: true 
    },
    //date recorded via created at as timestamps True
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);