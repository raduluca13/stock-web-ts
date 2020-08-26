import { StockTimeSeriesMetadata } from "./StockTimeSeriesMetadata.interface";

export interface KeyVal {
  [key: string]: { [k: string]: number }; // key of type StockDetailsKeys; this is too generic and useless
}

export interface PairString {
  [key: string]: string;
}

export interface StockDetail {
  open: number;
  high: number;
  close: number;
  low: number;
  volume: number;
}

export interface StockDetailData {
  date: string;
  stockDetail: StockDetail;
}

export interface StockTimeSeriesData {
  stockDetails: StockDetailData[];
  metadata: StockTimeSeriesMetadata;
}
