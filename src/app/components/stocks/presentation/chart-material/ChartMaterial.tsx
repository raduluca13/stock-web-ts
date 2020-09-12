import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  BarSeries,
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
  console.log({ props });
  const getValue = (stockDetail: IStockDetailData) => {
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
        return [""];
      }
    }
  };

  console.log(props.data);

  const mappedData = props.data.map((stockDetail: IStockDetailData) => {
    return { argument: stockDetail.date, value: getValue(stockDetail) };
  });

  console.log({ mappedData });

  return (
    <Paper>
      <Chart data={mappedData} rotated>
        <ValueAxis />
        <ArgumentAxis />

        <LineSeries valueField="value" argumentField="argument" />
        <ZoomAndPan />
      </Chart>
    </Paper>
  );
}
