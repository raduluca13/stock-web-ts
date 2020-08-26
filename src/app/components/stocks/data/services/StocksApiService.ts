import { Observable, from } from "rxjs";
import axios, { AxiosResponse } from "axios";
import { TimeSeriesStockResponse } from "../models/TimeSeriesStockResponse.interface";
import { TimeSeriesType } from "../models/TimeSeriesTypes.enum";
import {
  KeyVal,
  StockDetail,
  StockDetailData,
  PairString,
  StockTimeSeriesData,
} from "../models/StockDetails.interface";
import { StockDetailsKeys } from "../models/StockDetailsKeys.enum";
import { StockTimeSeriesMetadata } from "../models/StockTimeSeriesMetadata.interface";
import { StockMetadataKeys } from "../models/StockMetadataKeys.enum";

type TimeSeriesFields = { [key in TimeSeriesType]: string };

export function getStockDetails$(): Observable<AxiosResponse> {
  return from(axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=demo"));
}

export class StockApiManager {
  getStockDetails(): Promise<AxiosResponse> {
    return axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=demo");
  }

  extractStockDetails(timeSeriesStockResponse: TimeSeriesStockResponse) {
    let monthlyStockDetails: StockDetailData[];
    // let weeklyStockDetails: StockDetailData[]
    let mappedMetadata: StockTimeSeriesMetadata;

    let stockTimeSeriesData: StockTimeSeriesData = {
      stockDetails: [],
      metadata: ({} as any) as StockTimeSeriesMetadata,
    };

    for (const [k, v] of Object.entries(timeSeriesStockResponse)) {
      if (k === TimeSeriesType.MONTHLY_TIME_SERIES) {
        monthlyStockDetails = this.extractMonthlyStockDetails(v);
        stockTimeSeriesData.stockDetails = monthlyStockDetails;
      }

      if (k === TimeSeriesType.WEEKLY_TIME_SERIES) {
        debugger;
      }

      if (k === "Meta Data") {
        mappedMetadata = this.extractStockMetadata((v as any) as PairString);
        stockTimeSeriesData.metadata = mappedMetadata;
      }
    }

    return stockTimeSeriesData;
  }

  extractStockMetadata(v: PairString) {
    const metadata: StockTimeSeriesMetadata = {
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

  extractMonthlyStockDetails(v: KeyVal): StockDetailData[] {
    const datas: StockDetailData[] = [];

    for (const [date, stockDetails] of Object.entries(v)) {
      const stockDetail: StockDetail = {
        open: stockDetails[StockDetailsKeys.OPEN],
        high: stockDetails[StockDetailsKeys.HIGH],
        close: stockDetails[StockDetailsKeys.CLOSE],
        low: stockDetails[StockDetailsKeys.LOW],
        volume: stockDetails[StockDetailsKeys.VOLUME],
      };

      const stockDetailData: StockDetailData = {
        date: date,
        stockDetail: stockDetail,
      };

      datas.push(stockDetailData);
    }

    return datas.sort((a: StockDetailData, b: StockDetailData) => {
      if (a.date < b.date) return -1;

      if (a.date > b.date) return 1;

      return 0;
    });
  }
}
