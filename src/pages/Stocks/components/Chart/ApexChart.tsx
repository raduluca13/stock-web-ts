import { StockDetailTypeKey } from "enum/StockDetailsKeys.enum";
import { IStockDetailData } from "interfaces/IStockDetailData.interface";
import React from "react";
import Chart from "react-apexcharts";

export interface IApexChartProps {
  data: IStockDetailData[];
  stockDetailType: StockDetailTypeKey;
}

export default function ApexChart(props: IApexChartProps) {
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

    return { x: stockDetail.date, y: values[index], average: average };
  });

  console.log({ mappedData });

  const optionsMixedChart = {
    chart: {
      id: "basic-bar",
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        endingShape: "arrow",
      },
    },
    stroke: {
      width: [4, 0, 0],
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    markers: {
      size: 6,
      strokeWidth: 3,
      fillOpacity: 0,
      strokeOpacity: 0,
      hover: {
        size: 8,
      },
    },
    yaxis: {
      tickAmount: 5,
      // min: 0,
      // max: 100,
    },
    annotations: {
      yaxis: [
        {
          y: average,
          borderColor: "#00E396",
          label: {
            borderColor: "#00E396",
            style: {
              color: "#fff",
              background: "#00E396",
            },
            text: `average value ${average}`,
          },
        },
      ],
    },
  };
  const seriesMixedChart = [
    {
      name: props.stockDetailType,
      type: "line",
      data: mappedData,
    },
  ];

  const optionsBar = {
    // chart: {
    //   stacked: true,
    //   stackType: "100%",
    //   toolbar: {
    //     show: false,
    //   },
    // },
    // plotOptions: {
    //   bar: {
    //     horizontal: true,
    //   },
    // },
    // dataLabels: {
    //   dropShadow: {
    //     enabled: true,
    //   },
    // },
    // stroke: {
    //   width: 0,
    // },
    // xaxis: {
    //   categories: ["Fav Color"],
    //   labels: {
    //     show: false,
    //   },
    //   axisBorder: {
    //     show: false,
    //   },
    //   axisTicks: {
    //     show: false,
    //   },
    // },
    // fill: {
    //   opacity: 1,
    //   type: "gradient",
    //   gradient: {
    //     shade: "dark",
    //     type: "vertical",
    //     shadeIntensity: 0.35,
    //     gradientToColors: undefined,
    //     inverseColors: false,
    //     opacityFrom: 0.85,
    //     opacityTo: 0.85,
    //     stops: [90, 0, 100],
    //   },
    // },
    // legend: {
    //   position: "bottom",
    //   horizontalAlign: "right",
    // },
  };

  return <Chart options={optionsMixedChart} series={seriesMixedChart} type="line" width="960" />;
}
