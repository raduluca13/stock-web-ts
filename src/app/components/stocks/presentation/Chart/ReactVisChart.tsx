// / <reference types="react-vis-types" />
import React, { useState } from "react";
import { StockDetailTypeKey } from "../../data/enum/StockDetailsKeys.enum";
import { IStockDetailData } from "../../data/interfaces/IStockDetailData.interface";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  MarkSeries,
  Voronoi,
  LineMarkSeries,
  VerticalBarSeries,
  Highlight,
} from "react-vis";

export interface IReactVisChartProps {
  data: IStockDetailData[];
  stockDetailType: StockDetailTypeKey;
}

export default function ReactVisChart(props: IReactVisChartProps) {
  const [lastDrawLocation, setLastDrawLocation] = useState(null);

  console.log({ props });
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
    return { x: new Date(stockDetail.date).getTime(), y: values[index] };
  });
  console.log({ mappedData });

  return (
    <div>
      {/* <XYPlot xType="time" width={800} height={500} animation xDomain={lastDrawLocation && [
          lastDrawLocation.left, lastDrawLocation.right
      ]}  yDomain={
        lastDrawLocation && [
          lastDrawLocation.bottom,
          lastDrawLocation.top
        ]
      }>
        <XAxis />
        <YAxis />
        <HorizontalGridLines />
        <VerticalGridLines />
        <VerticalBarSeries barWidth={2} data={mappedData} />
        <Highlight
          drag
          onBrushEnd={area => setLastDrawLocation(area)}
              onDrag={area => {
                this.setState({
                  lastDrawLocation: {
                    bottom: lastDrawLocation.bottom + (area.top - area.bottom),
                    left: lastDrawLocation.left - (area.right - area.left),
                    right: lastDrawLocation.right - (area.right - area.left),
                    top: lastDrawLocation.top + (area.top - area.bottom)
                  }
                });
              }}
        />
      </XYPlot> */}
    </div>
  );
}
