import React, { Component, SyntheticEvent } from "react";
import { StockApiManager } from "../data/services/StocksApiService";
import {
  StockDetailData,
  StockTimeSeriesData,
} from "../data/models/StockDetails.interface";
import { StockTimeSeriesMetadata } from "../data/models/StockTimeSeriesMetadata.interface";
import {
  StockDetailsKeys,
  StockDetailType,
} from "../data/models/StockDetailsKeys.enum";
import Chart from "../presentation/Chart/Chart";
import Select from "../presentation/select/Select";
import "./StockContainer.css";
import { TimeSeriesType } from "../data/models/TimeSeriesTypes.enum";
import { IDropdown } from "../data/models/IDropdown.interface";
import { AxiosResponse } from "axios";
import { TimeSeriesStockResponse } from "../data/models/TimeSeriesStockResponse.interface";

export interface IStocksContainerProps {
  stocks: StockDetailData[];
  metadata: StockTimeSeriesMetadata;
}

export interface IStocksContainerState {
  stocks: StockDetailData[];
  metadata: StockTimeSeriesMetadata;
  stockApiManager: StockApiManager;

  stockDetailSelectLabel: string;
  stockDetailTypeSelected: IDropdown;
  stockDetailTypeOptions: IDropdown[];

  timeSeriesSelectLabel: string;
  timeSeriesTypeSelected: IDropdown;
  timeSeriesTypeOptions: IDropdown[];
}

export default class StocksContainer extends Component {
  state: IStocksContainerState = {
    stocks: [] as StockDetailData[],
    metadata: {
      Information: "",
      Symbol: "",
      LastRefreshed: "",
      TimeZone: "",
    } as StockTimeSeriesMetadata,
    stockApiManager: new StockApiManager(),
    stockDetailTypeSelected: {
      id: StockDetailType.NONE,
      value: StockDetailType[StockDetailType.NONE],
    } as IDropdown,
    timeSeriesTypeSelected: {
      id: TimeSeriesType.NONE,
      value: TimeSeriesType.NONE,
    } as IDropdown,
    stockDetailTypeOptions: [] as IDropdown[],
    timeSeriesTypeOptions: [] as IDropdown[],
    stockDetailSelectLabel: "Stock Detail Type",
    timeSeriesSelectLabel: "Time Series Type",
  };

  public componentDidUpdate() {
    console.log("updated", this.state);
  }

  public componentDidMount() {
    this.setState({
      ...this.state,
      stockDetailTypeOptions: this.mapToStockDetailTypeDropdown(),
      timeSeriesTypeOptions: this.mapToTimeSeriesTypeDropdown(),
    } as IStocksContainerState);

    this.state.stockApiManager
      ?.getStockDetails(TimeSeriesType.WEEKLY_TIME_SERIES)
      .then((val: AxiosResponse) => {
        if (val.status === 200) {
          const timeSeriesStockResponse = val.data as TimeSeriesStockResponse;
          const data: StockTimeSeriesData = this.state.stockApiManager.extractStockDetails(
            timeSeriesStockResponse
          );

          this.setState({
            ...this.state,
            stocks: data.stockDetails,
            metadata: data.metadata,
          });
        }
      })
      .catch((e) => console.error(e));
  }

  public render() {
    return (
      <div>
        <h1>Stocks</h1>
        <p>Information: {this.state?.metadata?.Information}</p>
        <p>Symbol: {this.state?.metadata?.Symbol}</p>
        <p>Last Refreshed: {this.state?.metadata?.LastRefreshed}</p>
        <p>Time Zone: {this.state?.metadata?.TimeZone}</p>

        <div className="time-series-type-dropdown">
          <Select
            selectedOption={this.state.timeSeriesTypeSelected}
            label={this.state.timeSeriesSelectLabel}
            options={this.state.timeSeriesTypeOptions}
            handleSelect={this.handleSelectTimeSeriesType}
          />
        </div>

        <div className="stock-type-dropdown">
          <Select
            selectedOption={this.state.stockDetailTypeSelected}
            label={this.state.stockDetailSelectLabel}
            options={this.state.stockDetailTypeOptions}
            handleSelect={this.handleSelectStockDetailType}
          />
        </div>
        <Chart
          data={this.state?.stocks}
          stockDetailType={
            this.state.stockDetailTypeSelected.value as StockDetailsKeys
          }
        />
      </div>
    );
  }

  private mapToStockDetailTypeDropdown(): IDropdown[] {
    const dropdownList = [] as IDropdown[];

    Object.entries(StockDetailType).forEach((value) => {
      dropdownList.push({ id: value[0], value: value[1] });
    });

    return dropdownList;
  }

  private mapToTimeSeriesTypeDropdown(): IDropdown[] {
    const dropdownList = [] as IDropdown[];

    Object.entries(TimeSeriesType).forEach((value) => {
      dropdownList.push({ id: value[0], value: value[1] });
    });

    return dropdownList;
  }

  private handleSelectStockDetailType = (
    event: SyntheticEvent<HTMLSelectElement, Event>
  ) => {
    const selectedOption = event.currentTarget.selectedOptions.item(0)?.value;

    this.setState({
      ...this.state,
      stockDetailTypeSelected: this.state.stockDetailTypeOptions.find(
        (stockDetailType: IDropdown) => stockDetailType.id === selectedOption
      ),
    });
  };

  private handleSelectTimeSeriesType = (
    event: SyntheticEvent<HTMLSelectElement, Event>
  ) => {
    const selectedOption = event.currentTarget.selectedOptions.item(0)?.value;

    this.setState({
      ...this.state,
      timeSeriesTypeSelected: this.state.timeSeriesTypeOptions.find(
        (timeSeriesType: IDropdown) => timeSeriesType.id === selectedOption
      ),
    });
  };
}
