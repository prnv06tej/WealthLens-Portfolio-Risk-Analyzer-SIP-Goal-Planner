
const calculateReverseSip = (targetAmount, years, expectedReturnRate, inflationRate) => {
    
    // Calculate the Inflation-Adjusted Target
    // Formula: Future Cost = Current Cost * (1 + inflation/100) ^ years
    const futureTargetAmount = targetAmount * Math.pow(1 + inflationRate / 100, years);

    //Convert annual return rate to monthly rate
    const monthlyReturnRate = (expectedReturnRate / 100) / 12;
    
    // Total number of months
    const totalMonths = years * 12;

    // 4. Reverse SIP Formula (Future Value of an Annuity algebraically reversed)
    // Formula: SIP = FV * (r / (((1 + r)^n) - 1)) * (1 / (1 + r))
    const numerator = futureTargetAmount * monthlyReturnRate;
    const denominator = (Math.pow(1 + monthlyReturnRate, totalMonths) - 1) * (1 + monthlyReturnRate);
    
    const requiredMonthlySip = numerator / denominator;

    return {
        originalTarget: targetAmount,
        inflationAdjustedTarget: Math.round(futureTargetAmount),
        requiredMonthlySip: Math.round(requiredMonthlySip) // Round to nearest Rupee
    };
};

module.exports = {
    calculateReverseSip
};