const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    }, 
    targetAmount: { 
        type: Number, 
        required: true 
    },
    yearsToGoal: { 
        type: Number, 
        required: true 
    },
    expectedInflationRate: { 
        type: Number, 
        default: 6.0 
    }, 
    expectedReturnRate: { 
        type: Number, 
        default: 12.0 
    },   
    requiredMonthlySip: { 
        type: Number 
    } 
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);