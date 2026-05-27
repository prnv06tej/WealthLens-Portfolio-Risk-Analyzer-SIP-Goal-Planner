const axios = require('axios');
const MutualFund = require('../models/mutualFund');

const AMFI_URL = 'https://www.amfiindia.com/spages/NAVAll.txt';

const fetchAndUpdateNAVs = async () => {
    console.log('Starting Daily AMFI NAV Sync (Bulk Upsert)...');
    
    try {
        const response = await axios.get(AMFI_URL);
        const lines = response.data.split('\n');
        
        // This array will hold all our database commands
        const bulkOperations = [];

        for (const line of lines) {
            const parts = line.split(';');

            
            if (parts.length >= 6 && parts[1].trim() !== '') {
                const currentIsin = parts[1].trim();
                const fundName = parts[3].trim();
                const latestNAV = parseFloat(parts[4].trim());
                const navDate = parts[5].trim();

                
                if (isNaN(latestNAV)) continue;

                // Create an "Upsert" operation for MongoDB
                bulkOperations.push({
                    updateOne: {
                        filter: { isin: currentIsin },
                        update: {
                            $set: {
                                name: fundName,
                                currentNAV: latestNAV,
                                navDate: navDate
                                
                            }
                        },
                        upsert: true 
                    }
                });
            }
        }

        console.log(`Preparing to process ${bulkOperations.length} funds...`);

        
        if (bulkOperations.length > 0) {
            await MutualFund.bulkWrite(bulkOperations);
        }

        console.log(`AMFI Sync Complete! Your database is fully populated.`);

    } catch (error) {
        console.error('AMFI Sync Failed:', error.message);
    }
};

module.exports = { fetchAndUpdateNAVs };