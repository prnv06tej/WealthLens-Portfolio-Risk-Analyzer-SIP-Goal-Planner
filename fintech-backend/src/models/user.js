const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    
    firstName: { 
        type: String,
        required: true, 
        trim: true 
    },
    lastName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
   
    password: { 
        type: String, 
        required: true, 
        select: false 
    }, 
    
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    
    kycStatus: { 
        type: String, 
        enum: ['Pending', 'Verified', 'Rejected'], 
        default: 'Pending' 
    },
    panNumber: { 
        type: String, 
        uppercase: true, 
        trim: true 
    },
    bankName: { 
        type: String, 
        trim: true 
    },
    bankAccountNumber: { 
        type: String, 
        trim: true 
    },
    ifscCode: { 
        type: String, 
        uppercase: true, 
        trim: true 
    },
    riskTolerance: {
        type: String,
        enum: ['Conservative', 'Moderate', 'Aggressive'],
        default: 'Moderate'
    },
    baseCurrency: { 
        type: String, 
        default: 'INR' 
    } 
}, { 
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);