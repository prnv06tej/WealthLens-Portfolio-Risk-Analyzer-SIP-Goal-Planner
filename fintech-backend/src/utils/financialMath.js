
//calculate the overlapfunds
const calculateFundOverlap = (fundA, fundB) => {
    let totalOverlapPercentage = 0;
    const overlappingStocks = [];

  //map for  fast access
    // const fundAMap = new Map();
    // fundA.holdings.forEach(holding => {
    //     fundAMap.set(holding.stockId._id.toString(), holding);
    // });

    const fundAMap = new Map();
    for (const holding of fundA.holdings) {
         fundAMap.set(holding.stockId._id.toString(), holding);
    }

//check intersection
    fundB.holdings.forEach(holdingB => {
        const stockId = holdingB.stockId._id.toString();

        if (fundAMap.has(stockId)) {
            const holdingA = fundAMap.get(stockId);
            
            // get the minimum of 2 weigth
            const overlapWeight = Math.min(holdingA.weightPercentage, holdingB.weightPercentage);
            totalOverlapPercentage += overlapWeight;

            // Save the specific stock details
            overlappingStocks.push({
                ticker: holdingB.stockId.ticker,
                companyName: holdingB.stockId.companyName,
                fundAWeight: holdingA.weightPercentage,
                fundBWeight: holdingB.weightPercentage,
                overlapPercentage: overlapWeight
            });
        }
    });
    return {
        totalOverlapPercentage: parseFloat(totalOverlapPercentage.toFixed(2)), // Round to 2 decimals
        overlappingStocks
    };
};

module.exports={
    calculateFundOverlap
}