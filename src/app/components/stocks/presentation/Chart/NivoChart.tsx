import { Bar, ResponsiveBar } from "@nivo/bar";
import { line } from "d3";
import React, { Fragment } from "react";
import { StockDetailTypeKey } from "../../data/enum/StockDetailsKeys.enum";
import { TimeSeriesTypeKey } from "../../data/enum/TimeSeriesTypes.enum";
import { IStockDetailData } from "../../data/interfaces/IStockDetailData.interface";

const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

export interface INivoChartProps {
  data: IStockDetailData[];
  stockDetailType: StockDetailTypeKey;
}

export default function NivoChart(props: INivoChartProps) {
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
    // const date = new Date(stockDetail.date);
    // const userFriendlyMonthDate  = ` ${monthNames[date.getMonth()]}  ${date.getFullYear()}`;

    return { date: stockDetail.date, value: values[index], average: average };
  });

  console.log({ mappedData });
  {
    /* <Line
            {...commonProperties}
            curve="monotoneX"
            data={[
                {
                    id: 'fake corp. A',
                    data: [
                        { x: 0, y: 7 },
                        { x: 1, y: 5 },
                        { x: 2, y: 11 },
                        { x: 3, y: 9 },
                        { x: 4, y: 13 },
                        { x: 7, y: 16 },
                        { x: 9, y: 12 },
                    ],
                },
            ]}
            xScale={{
                type: 'linear',
                min: 0,
                max: 'auto',
            }}
            axisLeft={{
                legend: 'linear scale',
                legendOffset: 12,
            }}
            axisBottom={{
                legend: 'linear scale',
                legendOffset: -12,
            }}
        /> */
  }

  return (
    // <Bar
    //   data={mappedData}
    //   layers={["axes" as any, "grid" as any, "bars" as any, "markers" as any, "legends" as any, LineLayer]}
    //   height={200}
    //   width={300}
    // />
    <ResponsiveBar
      data={mappedData}
      // layers={[LineLayer]}
      minValue="auto"
      maxValue="auto"
      keys={[`value`]}
      indexBy="date"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      colors={{ scheme: "nivo" }}
      defs={[
        // {
        //   id: "dots",
        //   type: "patternDots",
        //   background: "inherit",
        //   color: "#38bcb2",
        //   size: 4,
        //   padding: 1,
        //   stagger: true,
        // },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "value",
          },
          id: "dots",
        },
        // {
        //   match: {
        //     id: "sandwich",
        //   },
        //   id: "lines",
        // },
      ]}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      enableGridX={true}
      enableGridY={true}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "date",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: `${props.stockDetailType}`,
        legendPosition: "middle",
        legendOffset: -40,
      }}
      // labelSkipWidth={16}
      // labelSkipHeight={16}
      // labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      enableLabel={false}
      tooltip={({ id, value, color }) => (
        <strong style={{ color }}>
          {id}: {value}
        </strong>
      )}
      theme={{
        tooltip: {
          container: {
            background: "#333",
          },
        },
      }}
    />
  );
}
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

// const LineLayer = () => {
//   const lineGenerator = line()([
//     [1, 3],
//     [2, 7],
//     [3, 2],
//     [5, 2],
//   ]) as string;

//   return (
//     <Fragment>
//       <path d={lineGenerator} fill="none" style={{ pointerEvents: "none" }} />
//       {/* {bars.map((bar) => ( */}
//       <circle r={4} fill="white" style={{ pointerEvents: "none" }} />
//       {/* ))} */}
//     </Fragment>
//   );
// };
