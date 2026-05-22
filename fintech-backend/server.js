require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const stockRoutes = require('./src/routes/stockRoutes');
const mutualFundRoutes = require('./src/routes/mutualFundRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/api/health",(req,res)=>{
    res.status(200).json({ message: "Fintech API is running smoothly." });
});

app.use('/api/stocks', stockRoutes);
app.use('/api/funds', mutualFundRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

