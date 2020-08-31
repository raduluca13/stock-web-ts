import React, { Component } from "react";
import "./chart.css";

import { VictoryChart } from "victory-chart";
import { VictoryTheme } from "victory-core";
import { VictoryTooltip, VictoryBar } from "victory";
import { StockDetailData } from "../../data/models/StockDetails.interface";
import { StockDetailsKeys } from "../../data/models/StockDetailsKeys.enum";

export interface IChartState {
  data: StockDetailData[];
  stockDetailType: StockDetailsKeys;
}

export interface IChartProps {
  data: StockDetailData[];
  stockDetailType: StockDetailsKeys;
}

export default class Chart extends Component<IChartState, IChartProps> {
  public componentDidUpdate() {
    console.log(" did update Chart", this.state, this.props);
  }

  public render() {
    console.log(this.state);
    return (
      <div className="chart">
        {this.props.stockDetailType !== StockDetailsKeys.NONE && (
          <VictoryChart
            theme={VictoryTheme.grayscale}
            domain={{
              x: [0, 249],
            }}
          >
            <VictoryBar
              labelComponent={
                <VictoryTooltip
                  cornerRadius={({ datum }) => (datum.x > 6 ? 20 : 0)}
                  pointerLength={({ datum }) => (datum.y > 0 ? 20 : 5)}
                  flyoutStyle={{
                    stroke: ({ datum }) => {
                      return datum.x > 100 ? "tomato" : "black";
                    },
                  }}
                />
              }
              labels={this.getLabels()}
              data={this.updateChartData()}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onMouseOver: () => {
                      return [
                        {
                          target: "data",
                          mutation: () => ({
                            style: { fill: "gold", width: 1 },
                          }),
                        },
                        {
                          target: "labels",
                          mutation: () => ({ active: true }),
                        },
                      ];
                    },
                    onMouseOut: () => {
                      return [
                        {
                          target: "data",
                          mutation: () => {},
                        },
                        {
                          target: "labels",
                          mutation: () => ({
                            style: { width: 20 },
                            active: false,
                          }),
                        },
                      ];
                    },
                  },
                },
              ]}
              style={{
                data: { fill: this.getFillColor(), width: 1 },
                labels: { fontFamily: "MV Boli", fontSize: 5, fill: "blue" },
              }}
            />
          </VictoryChart>
        )}
      </div>
    );
  }
  getFillColor():
    | string
    | number
    | import("victory-core").VictoryStringOrNumberCallback
    | undefined {
    switch (this.props.stockDetailType) {
      case StockDetailsKeys.CLOSE: {
        return "tomato";
      }
      case StockDetailsKeys.HIGH: {
        return "purple";
      }
      case StockDetailsKeys.LOW: {
        return "red";
      }
      case StockDetailsKeys.OPEN: {
        return "brown";
      }
      case StockDetailsKeys.VOLUME: {
        return "green";
      }
      case StockDetailsKeys.NONE:
      default: {
        return "grey";
      }
    }
  }

  updateChartData(): any[] | undefined {
    switch (this.props.stockDetailType) {
      case StockDetailsKeys.CLOSE: {
        return this.props?.data.map((stock) => stock.stockDetail.close);
      }
      case StockDetailsKeys.HIGH: {
        return this.props?.data.map((stock) => stock.stockDetail.high);
      }
      case StockDetailsKeys.LOW: {
        return this.props?.data.map((stock) => stock.stockDetail.low);
      }
      case StockDetailsKeys.OPEN: {
        return this.props?.data.map((stock) => stock.stockDetail.open);
      }
      case StockDetailsKeys.VOLUME: {
        return this.props?.data.map((stock) => stock.stockDetail.volume);
      }
      case StockDetailsKeys.NONE:
      default: {
        return [""];
      }
    }
  }

  // TODO - it can be improved; separate something from here
  getLabels():
    | number[]
    | string[]
    | ((data: any) => string | number | null)
    | undefined {
    switch (this.props.stockDetailType) {
      case StockDetailsKeys.CLOSE: {
        return this.props?.data.map(
          (stock) => `${stock.date}: 'close' : ${stock.stockDetail.close} `
        );
      }
      case StockDetailsKeys.HIGH: {
        return this.props?.data.map(
          (stock) => `${stock.date}: 'high' : ${stock.stockDetail.high} `
        );
      }
      case StockDetailsKeys.LOW: {
        return this.props?.data.map(
          (stock) => `${stock.date}: 'low' : ${stock.stockDetail.low} `
        );
      }
      case StockDetailsKeys.OPEN: {
        return this.props?.data.map(
          (stock) => `${stock.date}: 'open' : ${stock.stockDetail.open} `
        );
      }
      case StockDetailsKeys.VOLUME: {
        return this.props?.data.map(
          (stock) => `${stock.date}: 'volume' : ${stock.stockDetail.volume} `
        );
      }
      case StockDetailsKeys.NONE:
      default: {
        return [""];
      }
    }
  }
}
