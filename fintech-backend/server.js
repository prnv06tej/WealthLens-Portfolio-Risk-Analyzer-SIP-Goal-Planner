require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const cron = require('node-cron');
const { fetchAndUpdateNAVs } = require('./src/utils/amfiParser');
const stockRoutes = require('./src/routes/stockRoutes');
const mutualFundRoutes = require('./src/routes/mutualFundRoutes');
const goalRoutes = require('./src/routes/goalRoutes');
const authRoutes = require('./src/routes/authRoutes');
const portfolioRoutes = require('./src/routes/portfolioRoutes');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/api/health",(req,res)=>{
    res.status(200).json({ message: "Fintech API is running smoothly." });
});

app.use('/api/stocks', stockRoutes);
app.use('/api/funds', mutualFundRoutes);
app.use('/api/goals',goalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/portfolio',portfolioRoutes);
app.use('/api/users',userRoutes);
app.use('/api/admin', adminRoutes);

//Auto update at 11pm everyday
cron.schedule('0 23 * * *', () => {
    fetchAndUpdateNAVs();
});

//For manually performing update
app.get('/api/admin/sync-amfi', async (req, res) => {
    await fetchAndUpdateNAVs();
    res.status(200).json({ message: "Manual sync triggered. Check server console." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

