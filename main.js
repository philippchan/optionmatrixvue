const { createApp, ref, onMounted } = Vue
createApp({
    setup() {
        const message = ref('Hello vue!')
        return {
            message
        }

    },
    data() {
        return {
            price: 100,
            daysToExpr: 91,
            standardDeviation: 0.25,
            precision: 8, // default precision
            selectedModel: 'black-scholes', // default model
            interestRate: 5, // Interest rate as a percentage
            results: [],

            // real time update
            isRealTime: false,
            realTimeInterval: null,

            // strike price interval
            selectedIncrement: '1', // Default increment
            customStrike: 1, // Custom strike price
            displayCount: 5,

            // date engine
            useDateEngine: false, // Data property to track if the Date Engine is being used
            showDatePropertiesDialog: false, // Data property to control the visibility of the Date Engine Properties dialog
            dateEngineProperties: { // Data property to store the Date Engine configuration
                expirationWeekday: 'Friday',
                occurrence: 'Last', // '1st', '2nd', '3rd', '4th', 'Last'
                dayOffset: 0,
                expirationTime: '11:59',
            },
            calculatedExpirationDate: null,

        };
    },
    computed: {
        yearsToExpr() {
            // Convert years to days, considering leap years
            return this.daysToExpr / 365.25;
        },
        exprDate() {
            if (this.daysToExpr < 0 || isNaN(this.daysToExpr)) {
                return null;
            }
            // Compute the expiration date based on the current date and dte
            const currentDate = new Date();
            const exprDate = new Date(currentDate.getTime() + this.daysToExpr * 86400000);
            return exprDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
        },
        currentDate() {
            // Compute the expiration date based on the current date and yearsToExpr
            const currentDate = new Date();

            return currentDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
        },

    },
    watch: {
        isRealTime(newValue) { // Watch for changes in the real-time toggle
            if (newValue) {
                this.startRealTimeUpdates();
            } else {
                this.stopRealTimeUpdates();
            }
        },

        daysToExpr(newVal, oldVal) { // React to changes in daysToExpr, no matter how they were triggered
            if (newVal !== oldVal) {
                this.calculateResults();
            }
        },

        selectedIncrement() {
            this.updateStrikePrices();
        },
        price() {
            this.updateStrikePrices();
        }
    },
    methods: {
        calculateResults() {
            // Implement the calculation logic here
            this.results = [];

            this.strikePriceList.forEach(strikePrice => {
                let result = {
                    price: this.price,
                    strikePrice: strikePrice,
                    daysToExpr: this.daysToExpr,
                    yearsToExpr: this.yearsToExpr,
                    callPrice: calculateOptionPrice(this.price, strikePrice, this.daysToExpr, this.interestRate, this.standardDeviation, 'call'),
                    putPrice: calculateOptionPrice(this.price, strikePrice, this.daysToExpr, this.interestRate, this.standardDeviation, 'put'),
                    callDelta: calculateDelta(this.price, strikePrice, this.daysToExpr, this.interestRate, this.standardDeviation, 'call'),
                    putDelta: calculateDelta(this.price, strikePrice, this.daysToExpr, this.interestRate, this.standardDeviation, 'put'),
                    gamma: calculateGamma(this.price, strikePrice, this.daysToExpr, this.interestRate, this.standardDeviation),
                };

                // Now push the result to the reactive property
                this.results.push(result);
            });


        },

        // Start an interval to update the option chain every second
        // Clear the interval to stop updates
        startRealTimeUpdates() {
            if (this.realTimeInterval) {
                // If an interval already exists, clear it before starting a new one
                clearInterval(this.realTimeInterval);
            }
            this.realTimeInterval = setInterval(() => {
                const currentTime = new Date();
                const exprTime = new Date(this.calculatedExpirationDate || this.exprDate);
                const realTimeToExpr = exprTime - currentTime;
                this.daysToExpr = realTimeToExpr / (1000 * 60 * 60 * 24);

                this.calculateResults();
            }, 1000);
        },
        stopRealTimeUpdates() {
            if (this.realTimeInterval) {
                clearInterval(this.realTimeInterval);
                this.realTimeInterval = null;
            }
        },

        // Update yearsToExpr based on the days input
        // Update yearsToExpr based on the selected calendar date
        updateFromYears(years) {
            this.daysToExpr = years * 365.25; // Use 365.25 to account for leap years
        },
        updateFromCalendar(dateString) {
            const currentDate = new Date();
            const selectedDate = new Date(dateString);
            const timeDiff = selectedDate - currentDate;
            this.daysToExpr = timeDiff / (1000 * 60 * 60 * 24);
        },

        // Update strike prices with different increment
        updateStrikePrices() {
            this.strikePriceList = []; // Reset the strikePriceList

            let displayCount = (this.displayCount);
            if (this.selectedIncrement === 'CUST') { // If custom strike is selected, use the entered strike price
                for (let i = -displayCount; i <= displayCount; i++) {
                    this.strikePriceList.push(this.price + this.customStrike * i);
                }
            } else {
                // Calculate strike prices based on the selected increment
                const increment = parseFloat(this.selectedIncrement);
                for (let i = -displayCount; i <= displayCount; i++) {
                    this.strikePriceList.push(this.price + increment * i);
                }
            }
            this.calculateResults();
        },

        // date engine
        toggleDateEngine() {// Method to handle changes in the "Use Date Engine" checkbox
            if (this.useDateEngine) {
                this.daysToExpr = moment(this.calculatedExpirationDate).diff(moment()) / (1000 * 60 * 60 * 24);
            }
        },
        calculateExpirationDate(month, attempts = 0) {// Method to calculate the expiration date based on the Date Engine properties
            // Guard against infinite recursion
            if (attempts > 1) {
                throw new Error("Expiration date calculation recursion incorrect.");
            }
            // Start with the first day of the current month
            month = month || moment().month();
            let expirationMoment = moment().month(month).startOf('month');

            // Find the first occurrence of the specified weekday in the month
            expirationMoment = expirationMoment.day(this.dateEngineProperties.expirationWeekday);
            // If the first occurrence is in the previous month, add one week
            if (expirationMoment.month() !== moment().month()) {
                expirationMoment.add(1, 'weeks');
            }

            // Add weeks based on the occurrence specified
            const occurrenceToAdd = {
                '1st': 0,
                '2nd': 1,
                '3rd': 2,
                '4th': 3,
                'Last': 3 // Start with the 4th occurrence
            };

            expirationMoment.add(occurrenceToAdd[this.dateEngineProperties.occurrence], 'weeks');

            // If 'Last' is selected, check if adding another week stays in the same month
            if (this.dateEngineProperties.occurrence === 'Last') {
                if (expirationMoment.add(1, 'weeks').month() !== moment().month()) {
                    // If not, revert to the 4th occurrence
                    expirationMoment.subtract(1, 'weeks');
                }
            }

            // Apply the day offset
            expirationMoment.add(this.dateEngineProperties.dayOffset, 'days');

            // Set the expiration time
            expirationMoment.hour(11).minute(59);

            // If the calculated expiration date has passed, add one month and recalculate
            if (expirationMoment.isBefore(moment())) {
                expirationMoment.add(1, 'month');
                this.calculateExpirationDate(expirationMoment.month(), attempts + 1); // Recursion to find the next valid expiration date
                return; // Exit the current call to avoid further execution after recursion
            }

            // Calculate daysToExpr based on the expiration date
            this.calculatedExpirationDate = expirationMoment.format();
        },
        openDateEngineProperties() {// Method to open the Date Engine Properties dialog
            this.showDatePropertiesDialog = true;
        },
        applyDateEngineProperties() {// Method to apply the Date Engine Properties and recalculate the expiration date
            this.showDatePropertiesDialog = false;
            this.calculateExpirationDate();
        },
        closeDateEngineProperties() {// Method to close the Date Engine Properties dialog without saving
            this.showDatePropertiesDialog = false;
        },

    },
    mounted() {
        this.updateStrikePrices();
        this.calculateResults();
        this.calculateExpirationDate();
    },
    updated() {
    },
    beforeDestroy() {
        // Make sure to clean up the interval when the component is destroyed
        this.stopRealTimeUpdates();
    }



}).mount('#app');
