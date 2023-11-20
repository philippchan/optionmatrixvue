function calculateOptionPrice(S, K, T, r, sigma, optionType) {
    // Calculate d1 and d2 using the Black-Scholes formula components
    const { d1, d2 } = calculateD1D2(S, K, T, r, sigma);
    
    // Convert inputs to the correct form
    T = T / 365;  // Time to expiration in years
    r = r / 100;  // Annual interest rate (converted from percentage)

    // Calculate the option price
    let optionPrice;

    if (optionType == 'call') {
        optionPrice = S * NORMSDIST(d1) - K * Math.exp(-r * T) * NORMSDIST(d2); // Calculate the call option price using the normSDist function
    } else if (optionType == 'put') {
        optionPrice = K * Math.exp(-r * T) * NORMSDIST(-d2) - S * NORMSDIST(-d1); // Calculate the put option price using the normSDist function and put-call parity
    } else {
        throw new Error('Invalid option type. Must be "call" or "put".');
    }

    return optionPrice;
    // return 1;
}
console.log(calculateOptionPrice(100,90,91.2,5,.25,'call'))

function NORMSDIST(x) {
    var mean = 0, std = 1;
    var x = (x - mean) / std
    var t = 1 / (1 + .2315419 * Math.abs(x))
    var d =.3989423 * Math.exp( -x * x / 2)
    var prob = d * t * (.3193815 + t * ( -.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    if( x > 0 ) prob = 1 - prob
    return prob
  }

function calculateD1D2(S, K, T, r, sigma) {
    T = T / 365;  // Convert days to years
    r = r / 100;  // Convert percentage to decimal
    const d1 = (Math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    return { d1, d2 };
}

function calculateDaysToExpiration(exprDate) {
    // Assuming exprDate is in the "YYYY-MM-DD" format
    const expirationDate = new Date(exprDate);
    const currentDate = new Date();
    const timeDiff = expirationDate.getTime() - currentDate.getTime();
    const daysToExpiration = timeDiff / (1000 * 60 * 60 * 24); // Convert milliseconds to days
    return Math.ceil(daysToExpiration); // Round up to the nearest whole number
}

function calculateDelta(S, K, T, r, sigma, optionType) {
    const { d1 } = calculateD1D2(S, K, T, r, sigma);
    return optionType === 'call' ? NORMSDIST(d1) : NORMSDIST(d1) - 1;
}
function calculateGamma(S, K, T, r, sigma) {
    const { d1 } = calculateD1D2(S, K, T, r, sigma);
    const pdf = NORMSPDF(d1);
    return pdf / (S * sigma * Math.sqrt(T / 365));
}
function NORMSPDF(z) {
    if (isNaN(z)) return '#VALUE!';
    return jStat.normal.pdf(z, 0, 1);
}