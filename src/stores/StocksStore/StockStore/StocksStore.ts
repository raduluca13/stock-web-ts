import { IStockDetailData } from "interfaces/IStockDetailData.interface";
import { IStockTimeSeriesMetadata } from "interfaces/IStockTimeSeriesMetadata.interface";

export type Stocks = {
    stocks: IStockDetailData[],
    metadata: IStockTimeSeriesMetadata,
    startdate: string,
    enddate: string,
    searchedSymbol: string
}

export function createStore() {
    const stocks = {} as Stocks;

    return {
        get stock() {
            return "asd"
        }
    }
}

export type TStore = ReturnType<typeof createStore>