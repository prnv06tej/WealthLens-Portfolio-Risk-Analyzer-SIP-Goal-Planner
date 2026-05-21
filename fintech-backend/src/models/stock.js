const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    ticker: { 
        type: String, 
        required: true, 
        unique: true 
    },//unique short abbreviation eq HUL, TCS
    companyName: { 
        type: String, 
        required: true 
    },
    sector: { 
        type: String 
    } 
});

module.exports = mongoose.model('Stock', stockSchema);