import { IStockDetailData } from "./IStockDetailData.interface";
import { IStockTimeSeriesMetadata } from "./IStockTimeSeriesMetadata.interface";

export interface IStockTimeSeriesData {
  stockDetails: IStockDetailData[];
  metadata: IStockTimeSeriesMetadata;
}
