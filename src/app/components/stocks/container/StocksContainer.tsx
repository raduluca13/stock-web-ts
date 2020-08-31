import React, { Component, SyntheticEvent } from "react";
import Chart from "../presentation/Chart/Chart";
import Select from "../presentation/select/Select";
import "./StockContainer.css";
import { StockApiManager } from "../data/services/StocksApiService";
import { AxiosResponse } from "axios";
import { IDropdown } from "../data/interfaces/IDropdown.interface";
import { IStockDetailData } from "../data/interfaces/IStockDetailData.interface";
import { IStockTimeSeriesMetadata } from "../data/interfaces/IStockTimeSeriesMetadata.interface";
import { IStockTimeSeriesData } from "../data/interfaces/IStockTimeSeries.interface";
import { ITimeSeriesStockResponse } from "../data/interfaces/ITimeSeriesStockResponse.interface";
import { TimeSeriesTypeKey, TimeSeriesTypeValue } from "../data/enum/TimeSeriesTypes.enum";
import { StockDetailTypeKey } from "../data/enum/StockDetailsKeys.enum";

export interface IStocksContainerProps {
  stocks: IStockDetailData[];
  metadata: IStockTimeSeriesMetadata;
}

export interface IStocksContainerState {
  stocks: IStockDetailData[];
  metadata: IStockTimeSeriesMetadata;
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
    stocks: [] as IStockDetailData[],
    metadata: {
      Information: "",
      Symbol: "",
      LastRefreshed: "",
      TimeZone: "",
    } as IStockTimeSeriesMetadata,
    stockApiManager: new StockApiManager(),

    stockDetailSelectLabel: "Stock Detail Type",
    stockDetailTypeSelected: {
      id: StockDetailTypeKey.NONE,
      value: StockDetailTypeKey.NONE,
    } as IDropdown,
    stockDetailTypeOptions: [] as IDropdown[],

    timeSeriesSelectLabel: "Time Series Type",
    timeSeriesTypeSelected: {
      id: TimeSeriesTypeKey.NONE,
      value: TimeSeriesTypeValue.NONE,
    } as IDropdown,
    timeSeriesTypeOptions: [] as IDropdown[],
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
          stockDetailType={this.state.stockDetailTypeSelected.id as StockDetailTypeKey}
        />
      </div>
    );
  }

  private mapToStockDetailTypeDropdown(): IDropdown[] {
    const dropdownList = [] as IDropdown[];

    Object.entries(StockDetailTypeKey).forEach((value) => {
      dropdownList.push({ id: value[0], value: value[1] });
    });

    return dropdownList;
  }

  private mapToTimeSeriesTypeDropdown(): IDropdown[] {
    const dropdownList = [] as IDropdown[];

    Object.entries(TimeSeriesTypeKey).forEach((value) => {
      dropdownList.push({ id: value[0], value: value[1] });
    });

    return dropdownList;
  }

  private getStockDetails(timeSeriesType: TimeSeriesTypeKey) {
    // todo - extract this in use effect
    this.state.stockApiManager
      ?.getStockDetails(timeSeriesType)
      .then((val: AxiosResponse) => {
        if (val.status === 200) {
          const timeSeriesStockResponse = val.data as ITimeSeriesStockResponse;
          const data: IStockTimeSeriesData = this.state.stockApiManager.extractStockDetails(timeSeriesStockResponse);

          this.setState({
            ...this.state,
            stocks: data.stockDetails,
            metadata: data.metadata,
          });
        }
      })
      .catch((e) => console.error(e));
  }

  private handleSelectStockDetailType = (event: SyntheticEvent<HTMLSelectElement, Event>) => {
    const selectedOption = event.currentTarget.selectedOptions.item(0)?.value;

    this.setState({
      ...this.state,
      stockDetailTypeSelected: this.state.stockDetailTypeOptions.find(
        (stockDetailType: IDropdown) => stockDetailType.id === selectedOption
      ),
    });
  };

  private handleSelectTimeSeriesType = (event: SyntheticEvent<HTMLSelectElement, Event>) => {
    const selectedOption = event.currentTarget.selectedOptions.item(0)?.value;

    this.setState({
      ...this.state,
      timeSeriesTypeSelected: this.state.timeSeriesTypeOptions.find(
        (timeSeriesType: IDropdown) => timeSeriesType.id === selectedOption
      ),
    });

    if (selectedOption === TimeSeriesTypeKey.TIME_SERIES_MONTHLY) {
      this.getStockDetails(TimeSeriesTypeKey.TIME_SERIES_MONTHLY);
    }

    if (selectedOption === TimeSeriesTypeKey.TIME_SERIES_WEEKLY) {
      this.getStockDetails(TimeSeriesTypeKey.TIME_SERIES_WEEKLY);
    }
  };
}
