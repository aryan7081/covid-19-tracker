
const suggestions = [
    "Buy on monday and Exit on friday",
    "Buy on a Friday if the stock's price has risen more than 5% over the week. Exit on monday",
    "Buy today, Exit tomorrow",
    "Buy at the start of the month, sell at the end of the month",
    "Buy when there is a 2% increase in a day with high volume and exit when open price is below the last day's price",
    "Create a strategy to buy when the RSI is below 30 and the price is at a support level, and exit when the RSI is above 70 and the price is at a resistance level.",
    "Create a strategy to buy when the price hits the lower Bollinger Band and exit when the price hits the upper Bollinger Band.",
    "Create a strategy based on moving average crossovers. buy when short-term moving average crosses above long-term moving average and exit when it crosses below"
]

function Suggestions({ handleSuggestionClick }) {
    return (
        <div className="mt-2 od">
            <div className="grid grid-cols-1 gap-4">
                {suggestions.map((suggestion, index) => (
                    <div 
                        key={index} 
                        className="cursor-pointer p-5 bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg"
                        onClick={() => handleSuggestionClick(suggestion)}
                    >
                        {suggestion}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Suggestions;
