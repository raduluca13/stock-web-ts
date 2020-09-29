import config from "config";

const getSearchSymbolRoute = (searchedSymbol: string): string =>
    `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchedSymbol}&apikey=${config.apiKey}`

export { getSearchSymbolRoute }