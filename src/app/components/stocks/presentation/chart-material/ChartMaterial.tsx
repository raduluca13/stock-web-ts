import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  SplineSeries,
  ZoomAndPan,
} from "@devexpress/dx-react-chart-material-ui";
import { StockDetailTypeKey } from "../../data/enum/StockDetailsKeys.enum";
import { IStockDetailData } from "../../data/interfaces/IStockDetailData.interface";
import { Animation } from "@devexpress/dx-react-chart";

export interface IChartMaterialProps {
  data: IStockDetailData[];
  stockDetailType: StockDetailTypeKey;
}

export default function ChartMaterial(props: IChartMaterialProps) {
  const getValue: (stockDetail: IStockDetailData) => number = (stockDetail: IStockDetailData) => {
    switch (props.stockDetailType) {
      case StockDetailTypeKey.CLOSE: {
        return +stockDetail.stockDetail.close;
      }
      case StockDetailTypeKey.HIGH: {
        return +stockDetail.stockDetail.close;
      }
      case StockDetailTypeKey.LOW: {
        return +stockDetail.stockDetail.close;
      }
      case StockDetailTypeKey.OPEN: {
        return +stockDetail.stockDetail.open;
      }
      case StockDetailTypeKey.VOLUME: {
        return +stockDetail.stockDetail.volume;
      }
      case StockDetailTypeKey.NONE:
      default: {
        return 0;
      }
    }
  };

  const values = props.data.map((stockDetail: IStockDetailData) => getValue(stockDetail));
  let averageFn = (array: number[]): number => array.reduce((a: number, b: number) => a + b) / array.length;
  
  // TODO - better check than this ternary
  const avg: number = values.length > 0 ? averageFn(values) : 0;
  const average: number = Math.round((avg + Number.EPSILON) * 100) / 100;

  const mappedData = props.data.map((stockDetail: IStockDetailData, index: number) => {
    return { argument: stockDetail.date, value: values[index], average: average };
  });

  return (
    <Paper>
      <Chart data={mappedData} rotated>
        <ValueAxis />
        <ArgumentAxis />

        <SplineSeries valueField="average" argumentField="argument" />
        <LineSeries valueField="value" argumentField="argument" />
        <ZoomAndPan />
        {/* <Animation /> */}
      </Chart>
    </Paper>
  );
}
