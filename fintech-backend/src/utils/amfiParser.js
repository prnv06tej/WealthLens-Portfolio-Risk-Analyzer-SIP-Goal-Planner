const axios = require('axios');
const MutualFund = require('../models/mutualFund');

const AMFI_URL = 'https://portal.amfiindia.com/spages/NAVAll.txt';

const fetchAndUpdateNAVs = async () => {
    console.log(' Launching Resilient Segmented AMFI Ingestion...');
    
    try {
        const response = await axios.get(AMFI_URL);
        const lines = response.data.split(/\r?\n/);
        
        let batchOperations = [];
        const CHUNK_SIZE = 1000; //  Protects socket payloads from choking
        let processedCount = 0;
        let writtenCount = 0;

        //  CONTEXT TRACKER: Captures category headers as the loop moves down the file
        let currentCategory = 'Equity Scheme - Multi Cap Fund'; 

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            // Detect section headers to update the active context category
            if (trimmedLine.includes('Schemes(')) {
                currentCategory = trimmedLine;
                continue;
            }

            const parts = trimmedLine.split(';');

            // Process valid financial data rows
            if (parts.length >= 6) {
                const schemeCode = parts[0].trim();
                const isinGrowth = parts[1].trim();
                const isinReinvest = parts[2].trim();
                const fundName = parts[3].trim();
                const latestNAV = parseFloat(parts[4].trim());
                const navDate = parts[5].trim();

                // Skip header metrics label lines smoothly
                if (isNaN(latestNAV)) continue;

                // Isolate the true asset key code reference
                let targetIsin = '';
                if (isinGrowth && isinGrowth !== '-') {
                    targetIsin = isinGrowth;
                } else if (isinReinvest && isinReinvest !== '-') {
                    targetIsin = isinReinvest;
                }

                if (!targetIsin) continue;

                batchOperations.push({
                    updateOne: {
                        filter: { isin: targetIsin },
                        update: {
                            $set: {
                                schemeCode: schemeCode,
                                name: fundName,
                                category: currentCategory, // Synchronizes structural category tags
                                currentNAV: latestNAV,
                                navDate: navDate
                            }
                        },
                        upsert: true
                    }
                });

                processedCount++;

                //  CHUNK ENFORCEMENT: Write to the database when the batch hits 1,000 items
                if (batchOperations.length === CHUNK_SIZE) {
                    await MutualFund.bulkWrite(batchOperations);
                    writtenCount += batchOperations.length;
                    console.log(` [Database Sync]: Synchronized ${writtenCount} / ${processedCount} records...`);
                    batchOperations = []; // Flush buffer completely to free up heap memory
                }
            }
        }

        // Commit any remaining items left in the buffer array
        if (batchOperations.length > 0) {
            await MutualFund.bulkWrite(batchOperations);
            writtenCount += batchOperations.length;
        }

        console.log(` [Ingest Complete]: Successfully integrated ${writtenCount} pristine fund items into MongoDB Atlas.`);

    } catch (error) {
        console.error(' AMFI Parser Operational Fault:', error.message);
    }
};

module.exports = { fetchAndUpdateNAVs };