import axios, { AxiosResponse } from "axios";
import { ITimeSeriesStockResponse } from "../interfaces/ITimeSeriesStockResponse.interface";
import { IStockDetailData } from "../interfaces/IStockDetailData.interface";
import { IStockTimeSeriesMetadata } from "../interfaces/IStockTimeSeriesMetadata.interface";
import { StockMetadataKeys } from "../enum/StockMetadataKeys.enum";
import { IStockTimeSeriesData } from "../interfaces/IStockTimeSeries.interface";
import { IPairString } from "../interfaces/IPairString.interface";
import { IKeyVal } from "../interfaces/IKeyVal.interface";
import { IStockDetail } from "../interfaces/IStockDetail.interface";
import { StockDetailTypeValue } from "../enum/StockDetailsKeys.enum";
import { TimeSeriesTypeKey, TimeSeriesTypeValue } from "../enum/TimeSeriesTypes.enum";
import { IAlphaVantageSymbolSearchResponse } from "../interfaces/IAlphaVantageSymbolSearchResponse.interface";
import { SybmolTypeKey, SymbolTypeValue } from "../enum/SymbolTypeKeys.enum";
import { IAlphaVantageSearchMatch } from "../interfaces/IAlphaVantageSearchMatch.interface";
import { ITimeFrame } from "../interfaces/ITimeFrame.interface";
import { ibmMonthlyMock } from "./ibm-monthly";
import { ibmWeeklyMock } from "./ibm-weekly";
import { getSearchSymbolRoute } from "apis/searchAPI";
import { getStockDetailsRoute } from "apis/stockDetailsAPI";

export class StockApiManager {
  private readonly apiKey = "MG13GI1XD3DUU9ZL"; // todo - this is insecure here.
  // private readonly apiKey = "H6AIT30OD8F8OLZD"; // another key, just because alpha vantage has limits of 500 cals/day..
  private stocks: IStockTimeSeriesData = ({} as any) as IStockTimeSeriesData;

  searchSymbol(searchedSymbol: string) {
    return axios.get(
      getSearchSymbolRoute(searchedSymbol)
    );
  }

  getStockDetails(symbol: string, timeSeriesType: TimeSeriesTypeKey): Promise<AxiosResponse> {
    // return Promise.resolve({
    //   data: timeSeriesType === TimeSeriesTypeKey.TIME_SERIES_MONTHLY ? ibmMonthlyMock : ibmWeeklyMock,
    //   status: 200,
    //   statusText: "200",
    //   headers: {},
    // } as AxiosResponse<any>);
    return axios.get(
      getStockDetailsRoute(symbol, timeSeriesType)
    );
  }

  filterStocksOnDate(timeFrame: ITimeFrame): IStockDetailData[] {
    return this.stocks.stockDetails.filter((stock: IStockDetailData) => this.isInTimeFrame(stock.date, timeFrame));
  }



  // TODO - sorting may need a check for isNan because of casting to number
  extractSymbols(symbolSearchResponse: IAlphaVantageSymbolSearchResponse): IAlphaVantageSearchMatch[] {
    return symbolSearchResponse.bestMatches
      .map((match) => this.mapToSymbolDetails(match))
      .sort((symbol1: IAlphaVantageSearchMatch, symbol2: IAlphaVantageSearchMatch) => {
        if (+symbol1.MATCH_SCORE > +symbol2.MATCH_SCORE) {
          return -1;
        }

        if (+symbol1.MATCH_SCORE < +symbol2.MATCH_SCORE) {
          return 1;
        }

        return 0;
      });
  }

  // TODO - can you improve not to have so many ifs?
  mapToSymbolDetails(match: { key: SymbolTypeValue; value: string }): any {
    let mappedMatch: IAlphaVantageSearchMatch = {
      SYMBOL: "",
      NAME: "",
      TYPE: "",
      REGION: "",
      MARKET_OPEN: "",
      MARKET_CLOSE: "",
      TIMEZONE: "",
      CURRENCY: "",
      MATCH_SCORE: "",
    };

    for (const [key, value] of Object.entries(match)) {
      // const niceKey = key.split(" ")[1].toUpperCase()
      // mappedMatch[niceKey] = value
      if (key === SymbolTypeValue.SYMBOL) {
        mappedMatch[SybmolTypeKey.SYMBOL] = value;
        continue;
      }

      if (key === SymbolTypeValue.NAME) {
        mappedMatch[SybmolTypeKey.NAME] = value;
        continue;
      }

      if (key === SymbolTypeValue.TYPE) {
        mappedMatch[SybmolTypeKey.TYPE] = value;
        continue;
      }

      if (key === SymbolTypeValue.REGION) {
        mappedMatch[SybmolTypeKey.REGION] = value;
        continue;
      }

      if (key === SymbolTypeValue.MARKET_OPEN) {
        mappedMatch[SybmolTypeKey.MARKET_OPEN] = value;
        continue;
      }

      if (key === SymbolTypeValue.MARKET_CLOSE) {
        mappedMatch[SybmolTypeKey.MARKET_CLOSE] = value;
        continue;
      }

      if (key === SymbolTypeValue.TIMEZONE) {
        mappedMatch[SybmolTypeKey.TIMEZONE] = value;
        continue;
      }

      if (key === SymbolTypeValue.CURRENCY) {
        mappedMatch[SybmolTypeKey.CURRENCY] = value;
        continue;
      }

      if (key === SymbolTypeValue.MATCH_SCORE) {
        mappedMatch[SybmolTypeKey.MATCH_SCORE] = value;
        continue;
      }
    }

    return mappedMatch;
  }

  // TODO - to mapper
  extractStockDetails(timeSeriesStockResponse: ITimeSeriesStockResponse, timeFrame: ITimeFrame): IStockTimeSeriesData {
    let monthlyStockDetails: IStockDetailData[];
    let weeklyStockDetails: IStockDetailData[];
    let mappedMetadata: IStockTimeSeriesMetadata;

    let stockTimeSeriesData: IStockTimeSeriesData = {
      stockDetails: [],
      metadata: ({} as any) as IStockTimeSeriesMetadata,
    };

    for (const [key, value] of Object.entries(timeSeriesStockResponse)) {
      if (key === TimeSeriesTypeValue.TIME_SERIES_MONTHLY) {
        monthlyStockDetails = this.mapStockDetailData(value, timeFrame);
        stockTimeSeriesData.stockDetails = monthlyStockDetails;
      }

      if (key === TimeSeriesTypeValue.TIME_SERIES_WEEKLY) {
        weeklyStockDetails = this.mapStockDetailData(value, timeFrame);
        stockTimeSeriesData.stockDetails = weeklyStockDetails;
      }

      if (key === "Meta Data") {
        mappedMetadata = this.extractStockMetadata((value as any) as IPairString);
        stockTimeSeriesData.metadata = mappedMetadata;
      }
    }

    // keep stocks before filtering so we can re-filter easily without an API call after dates are changed
    this.stocks = stockTimeSeriesData;
    console.log(this.stocks);
    const filteredStocks: IStockDetailData[] = this.filterStocksOnDate(timeFrame);
    console.log({ filteredStocks });
    return { metadata: stockTimeSeriesData.metadata, stockDetails: filteredStocks };
  }

  // TODO - to mapper
  extractStockMetadata(v: IPairString) {
    const metadata: IStockTimeSeriesMetadata = {
      Information: "",
      Symbol: "",
      LastRefreshed: "",
      TimeZone: "",
    };

    for (let [key, value] of Object.entries(v)) {
      if (key === StockMetadataKeys.INFORMATION) {
        metadata.Information = value;
        continue;
      }

      if (key === StockMetadataKeys.LAST_REFRESHED) {
        metadata.LastRefreshed = value;
        continue;
      }

      if (key === StockMetadataKeys.SYMBOL) {
        metadata.Symbol = value;
        continue;
      }

      if (key === StockMetadataKeys.TIME_ZONE) {
        metadata.TimeZone = value;
        continue;
      }
    }

    return metadata;
  }

  // TODO - to mapper
  mapStockDetailData(v: IKeyVal, timeFrame: ITimeFrame): IStockDetailData[] {
    const datas: IStockDetailData[] = [];

    for (const [date, stockDetails] of Object.entries(v)) {
      const stockDetail: IStockDetail = {
        open: stockDetails[StockDetailTypeValue.OPEN],
        high: stockDetails[StockDetailTypeValue.HIGH],
        close: stockDetails[StockDetailTypeValue.CLOSE],
        low: stockDetails[StockDetailTypeValue.LOW],
        volume: stockDetails[StockDetailTypeValue.VOLUME],
      };

      const stockDetailData: IStockDetailData = {
        date: date,
        stockDetail: stockDetail,
      };

      datas.push(stockDetailData);
    }

    return datas.sort((firstDetail: IStockDetailData, secondDetail: IStockDetailData) => {
      if (firstDetail.date < secondDetail.date) {
        return -1;
      }

      if (firstDetail.date > secondDetail.date) {
        return 1;
      }

      return 0;
    });
  }

  private isInTimeFrame(date: string, timeFrame: ITimeFrame) {
    const dateD = new Date(date);
    const startDate = new Date(timeFrame.startDate);
    const endDate = new Date(timeFrame.endDate);

    return startDate < dateD && dateD < endDate;
  }
}
