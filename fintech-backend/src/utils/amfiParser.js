const axios = require('axios');
const MutualFund = require('../models/mutualFund');

const AMFI_URL = 'https://www.amfiindia.com/spages/NAVAll.txt';

const fetchAndUpdateNAVs = async () => {
    console.log('Starting Daily AMFI NAV Sync...');
    
    try {
        // 1. Download the raw text file from the Indian Government/AMFI
        const response = await axios.get(AMFI_URL);
        const rawText = response.data;

        // 2. Split the giant text into an array of individual lines
        const lines = rawText.split('\n');

        // 3. Get a list of all ISINs currently saved in our database
        // .select('isin') ensures we only download the IDs, saving memory
        const ourFunds = await MutualFund.find({}).select('isin');
        const ourIsins = ourFunds.map(fund => fund.isin);

        let updateCount = 0;

        // 4. Loop through every line in the AMFI file
        for (const line of lines) {
            // Semicolon is the delimiter in the AMFI format
            const parts = line.split(';');

            // AMFI format: [0]SchemeCode, [1]ISIN, [2]ISIN_Reinvest, [3]Name, [4]NAV, [5]Date
            if (parts.length >= 6) {
                const currentIsin = parts[1].trim();
                
                // If the ISIN in the text file matches an ISIN in our database
                if (ourIsins.includes(currentIsin)) {
                    const latestNAV = parseFloat(parts[4].trim());
                    const navDate = parts[5].trim();

                    // 5. Update our database with the fresh price
                    await MutualFund.findOneAndUpdate(
                        { isin: currentIsin },
                        { 
                            currentNAV: latestNAV, 
                            navDate: navDate 
                        }
                    );
                    updateCount++;
                }
            }
        }

        console.log(` AMFI Sync Complete! Successfully updated ${updateCount} funds.`);

    } catch (error) {
        console.error(' AMFI Sync Failed:', error.message);
    }
};

module.exports = { fetchAndUpdateNAVs };