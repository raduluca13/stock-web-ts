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

export class StockApiManager {
  apiKey = "MG13GI1XD3DUU9ZL"; // todo - this is insecure here.

  getStockDetails(timeSeriesType: TimeSeriesTypeKey): Promise<AxiosResponse> {
    return axios.get(`https://www.alphavantage.co/query?function=${timeSeriesType}&symbol=IBM&apikey=${this.apiKey}`);
  }

  extractStockDetails(timeSeriesStockResponse: ITimeSeriesStockResponse) {
    let monthlyStockDetails: IStockDetailData[];
    let weeklyStockDetails: IStockDetailData[];
    let mappedMetadata: IStockTimeSeriesMetadata;

    let stockTimeSeriesData: IStockTimeSeriesData = {
      stockDetails: [],
      metadata: ({} as any) as IStockTimeSeriesMetadata,
    };

    for (const [key, value] of Object.entries(timeSeriesStockResponse)) {
      if (key === TimeSeriesTypeValue.TIME_SERIES_MONTHLY) {
        monthlyStockDetails = this.mapStockDetailData(value);
        stockTimeSeriesData.stockDetails = monthlyStockDetails;
      }

      if (key === TimeSeriesTypeValue.TIME_SERIES_WEEKLY) {
        weeklyStockDetails = this.mapStockDetailData(value);
        stockTimeSeriesData.stockDetails = weeklyStockDetails;
      }

      if (key === "Meta Data") {
        mappedMetadata = this.extractStockMetadata((value as any) as IPairString);
        stockTimeSeriesData.metadata = mappedMetadata;
      }
    }

    return stockTimeSeriesData;
  }

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

  mapStockDetailData(v: IKeyVal): IStockDetailData[] {
    const datas: IStockDetailData[] = [];

    debugger;
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
}
