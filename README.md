# OptionMatrixVue

OptionMatrixVue is a standalone, single-page web application for real-time option pricing. Built with Vue.js, it offers a modern and interactive interface for financial derivatives calculations directly in your browser.

## Features

- **Real-time Option Pricing**: View the prices of options in real-time with instant updates as input values change.
- **Future Implementations**: The application will evolve to include spreads, bonds, multi-model support, and more in upcoming updates.

## Quick Start

No installation or setup is required. Simply download the project, and open the `index.html` file in your modern web browser to get started.

## Tutorial

### Running VueOptionMatrix
- **Initial Screen**: Displays with Black-Scholes model by default, recalculating option prices every second.
- **Price Impact**: Changes in price are due to the time decay between the current time and expiration.

### Input Controls
- **Price/Interest/Standard Deviation**: Configurable via spin buttons.
- **Time to Expiration**: Set in years using spin buttons; synchronizes with "Days to Expiration".
- **Days to Expiration**: Set in days; updates time in years automatically.
- **Leap Day Adjustment**: Accounts for leap years when calculating expiration dates.
- **Real-Time Updating**: Spin buttons' values decrease every second; toggle with the "RealTime" checkbox.
- **Calendar Picker**: Select a specific expiration date; updates time controls upon selection.
- **Strikes Dropdown**: Choose strike increments (5, 1, .5, .1, .01, .001, or CUST for custom).
- **Strike Adjuster**: Scroll through strike prices in the selected increment.
- **Custom Strikes**: Available when "CUST" is selected from the dropdown.
- **Use Date Engine Checkbox**: Enables the Date Engine for mapping standard option expirations.
- **Date Engine**: Defaults to 3rd Friday+1 @11:59AM; configurable for other industry-standard dates.
- **Date Engine Properties**: Accessed via a button to change default expiration settings.

Remember, as you interact with the controls, the option chain's pricing will dynamically update to reflect the changes.

## Project Structure

Below is an overview of the key files in the OptionMatrixVue project:

- **index.html**: This is the main file of the application. Double-click to open this file in your web browser to start using the calculator with full styling.
- **index-vanilla.html**: This file offers the same functionality as `index.html` but omits the Materialize CSS styling for a more basic appearance.
- **main.js**: The core JavaScript file that handles Vue.js interactions and binds the logic to the user interface.
- **math.js**: Contains the implementation of mathematical models used in option pricing, such as the Black-Scholes formula, calculations of 'd1' and 'd2', and the Greeks.

### Note on Implementation

To expedite the development process, this project uses CDNs to load all of the necessary libraries. While this approach may increase payload times slightly, for a project as streamlined as this one, the impact on performance is negligible. This decision was made to prioritize development speed for this initial release.

## Tools Used

- **Vue.js**: The progressive JavaScript framework used for building the user interface.
- **Materialize CSS**: A modern responsive front-end framework based on Material Design used for crafting the application's layout. For a no-frills experience, use the `index-vanilla.html` which provides the app without styling.
- **Moment.js**: A comprehensive library for parsing, validating, manipulating, and displaying dates and times in JavaScript. Utilized for calculating complex option expiration dates, such as the 3rd Friday of each month.
- **jStat**: A JavaScript library for statistical operations. While this project only uses two simple functions from jStat, it demonstrates the potential for integrating complex statistical analysis.

## Project Motivation

This project was a challenge to myself: to see what I could accomplish in 5 days, dedicating 3 hours daily. It's a showcase of efficient development with a focus on user experience in the front-end where the primary challenge was crafting a user-friendly interface that can handle dynamic interactions and state mutations efficiently. The backend calculations, which include different pricing models, are less complex, relying on established mathematical functions. These additional features are planned for future updates when time allows.
