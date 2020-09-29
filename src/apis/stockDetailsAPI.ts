import { TimeSeriesTypeKey } from "enum/TimeSeriesTypes.enum"
import config from "config"

const getStockDetailsRoute = (symbol: string, timeSeriesType: TimeSeriesTypeKey): string =>
    `https://www.alphavantage.co/query?function=${timeSeriesType}&symbol=${symbol}&apikey=${config.apiKey}`


export { getStockDetailsRoute }