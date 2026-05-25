
const calculateXIRR = (transactions, guess = 0.1) => {
    // transactions must be an array of objects: { amount: Number, date: Date }
    // Investments should be negative amounts, Current Value should be a positive amount
    
    if (!transactions || transactions.length < 2) return 0;

    const maxIterations = 100;
    const tolerance = 0.000001; // Accuracy down to 6 decimal places
    let rate = guess;

    // Helper 1: Calculate Net Present Value (NPV)
    const xnpv = (rate, txs) => {
        return txs.reduce((acc, tx) => {
            const days = (tx.date - txs[0].date) / (1000 * 60 * 60 * 24);
            return acc + tx.amount / Math.pow(1 + rate, days / 365);
        }, 0);
    };

    // Helper 2: Calculate the Derivative of NPV (Calculus required for Newton-Raphson)
    const xnpvDerivative = (rate, txs) => {
        return txs.reduce((acc, tx) => {
            const days = (tx.date - txs[0].date) / (1000 * 60 * 60 * 24);
            if (days === 0) return acc;
            return acc - (days / 365) * tx.amount / Math.pow(1 + rate, (days / 365) + 1);
        }, 0);
    };

    // The Newton-Raphson Loop
    for (let i = 0; i < maxIterations; i++) {
        const fValue = xnpv(rate, transactions);
        const fDerivative = xnpvDerivative(rate, transactions);

        // If we found the rate that makes NPV close to 0, we are done!
        if (Math.abs(fValue) < tolerance) {
            const percentageReturn = rate * 100;
            return parseFloat(percentageReturn.toFixed(2));
        }

        // Adjust the guess and try again
        rate = rate - fValue / fDerivative;
    }

    return null; // Returns null if the math fails to converge (highly unlikely)
};

module.exports = {
    calculateXIRR
};