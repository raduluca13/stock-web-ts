import React from "react";
import { IStockDetailData } from "../../../../interfaces/IStockDetailData.interface";
import { StockDetailTypeKey } from "../../../../enum/StockDetailsKeys.enum";
import { VictoryChart } from "victory-chart";
import { VictoryTheme } from "victory-core";
import { VictoryTooltip, VictoryBar } from "victory";

export interface IChartProps {
  data: IStockDetailData[];
  stockDetailType: StockDetailTypeKey;
}

export default function Chart(props: IChartProps) {
  // todo - enum for colors
  const getFillColor = function () {
    switch (props.stockDetailType) {
      case StockDetailTypeKey.CLOSE: {
        return "tomato";
      }
      case StockDetailTypeKey.HIGH: {
        return "purple";
      }
      case StockDetailTypeKey.LOW: {
        return "red";
      }
      case StockDetailTypeKey.OPEN: {
        return "brown";
      }
      case StockDetailTypeKey.VOLUME: {
        return "green";
      }
      case StockDetailTypeKey.NONE:
      default: {
        return "grey";
      }
    }
  };

  // TODO - it can be improved; separate something from here
  const getLabels = function () {
    switch (props.stockDetailType) {
      case StockDetailTypeKey.CLOSE: {
        return props?.data.map(
          (stock) => `${stock.date} (close) : ${stock.stockDetail.close} `
        );
      }
      case StockDetailTypeKey.HIGH: {
        return props?.data.map(
          (stock) => `${stock.date} (high) : ${stock.stockDetail.high} `
        );
      }
      case StockDetailTypeKey.LOW: {
        return props?.data.map(
          (stock) => `${stock.date} (low) : ${stock.stockDetail.low} `
        );
      }
      case StockDetailTypeKey.OPEN: {
        return props?.data.map(
          (stock) => `${stock.date} (open) : ${stock.stockDetail.open} `
        );
      }
      case StockDetailTypeKey.VOLUME: {
        return props?.data.map(
          (stock) => `${stock.date} (volume) : ${stock.stockDetail.volume} `
        );
      }
      case StockDetailTypeKey.NONE:
      default: {
        return [""];
      }
    }
  };

  const updateChartDomain: () => [number, number] | [Date, Date] = function () {
    switch (props.stockDetailType) {
      case StockDetailTypeKey.CLOSE:
      case StockDetailTypeKey.HIGH:
      case StockDetailTypeKey.LOW:
      case StockDetailTypeKey.OPEN:
      case StockDetailTypeKey.VOLUME: {
        const array = props?.data.map((stock) => new Date(stock.date));
        console.log({ array });
        return [array[0], array[1]];
      }
      case StockDetailTypeKey.NONE:
      default: {
        return [0, 0];
      }
    }
  };

  const updateChartData = function () {
    switch (props.stockDetailType) {
      case StockDetailTypeKey.CLOSE: {
        return props?.data.map((stock) => stock.stockDetail.close);
      }
      case StockDetailTypeKey.HIGH: {
        return props?.data.map((stock) => stock.stockDetail.high);
      }
      case StockDetailTypeKey.LOW: {
        return props?.data.map((stock) => stock.stockDetail.low);
      }
      case StockDetailTypeKey.OPEN: {
        return props?.data.map((stock) => stock.stockDetail.open);
      }
      case StockDetailTypeKey.VOLUME: {
        return props?.data.map((stock) => stock.stockDetail.volume);
      }
      case StockDetailTypeKey.NONE:
      default: {
        return [""];
      }
    }
  };

  return (
    <div className="chart">
      <VictoryChart
        theme={VictoryTheme.material}
        // domain={{
        //   x: updateChartDomain(),
        // }}
        // scale={{ x: "linear", y: "linear" }}
        // domainPadding={{ x: [100, 100], y: [50, 50] }}
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
          labels={getLabels()}
          data={updateChartData()}
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
            data: { fill: getFillColor(), width: 1 },
            labels: {
              fontSize: 5,
              fill: "blue",
            },
            parent: {},
          }}
        />
      </VictoryChart>
    </div>
  );
}
