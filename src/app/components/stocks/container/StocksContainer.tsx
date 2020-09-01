import React, { Component, ChangeEvent } from "react";
import Chart from "../presentation/Chart/Chart";
import "./StockContainer.css";
import { StockApiManager } from "../data/services/StocksApiService";
import { AxiosResponse } from "axios";
import { IDropdown } from "../data/interfaces/IDropdown.interface";
import { IStockDetailData } from "../data/interfaces/IStockDetailData.interface";
import { IStockTimeSeriesMetadata } from "../data/interfaces/IStockTimeSeriesMetadata.interface";
import { IStockTimeSeriesData } from "../data/interfaces/IStockTimeSeries.interface";
import { ITimeSeriesStockResponse } from "../data/interfaces/ITimeSeriesStockResponse.interface";
import { TimeSeriesTypeKey } from "../data/enum/TimeSeriesTypes.enum";
import { StockDetailTypeKey } from "../data/enum/StockDetailsKeys.enum";

import CustomSelect from "../presentation/select/CustomSelect";
import Loader from "react-loader-spinner";
import { Snackbar } from "@material-ui/core";
// import Alert from '@material-ui/lab/Alert';

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
  isLoading: boolean;
  showChart: boolean;
  errorMessage?: string;
  onCloseSnackbar: () => void;
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
      id: "",
      value: "",
    } as IDropdown,
    stockDetailTypeOptions: this.mapToStockDetailTypeDropdown() as IDropdown[],
    timeSeriesSelectLabel: "Time Series Type",
    timeSeriesTypeSelected: {
      id: "",
      value: "",
    } as IDropdown,
    timeSeriesTypeOptions: this.mapToTimeSeriesTypeDropdown() as IDropdown[],
    isLoading: false,
    showChart: false,
    errorMessage: undefined,
    onCloseSnackbar: () => {
      this.setState({ ...this.state, errorMessage: undefined });
    },
  };

  public componentDidUpdate() {
    console.log("updated", this.state);
  }

  public render() {
    return (
      <div className="stock-container">
        {this.state.stocks.length > 0 && (
          <div className="stock-container__description">
            <h1>Stocks</h1>
            <p>Information: {this.state?.metadata?.Information}</p>
            <p>Symbol: {this.state?.metadata?.Symbol}</p>
            <p>Last Refreshed: {this.state?.metadata?.LastRefreshed}</p>
            <p>Time Zone: {this.state?.metadata?.TimeZone}</p>
          </div>
        )}

        <div className="stock-container__loader">
          <Loader
            type="Grid"
            visible={this.state.isLoading}
            color="#00BFFF"
            height={50}
            width={50}
          />
        </div>

        <div className="stock-container__snackbar">
          <Snackbar
            open={this.state.errorMessage !== undefined}
            autoHideDuration={6000}
            onClose={this.state.onCloseSnackbar}
          >
            <p>{this.state.errorMessage}</p>
          </Snackbar>
        </div>

        <div className="stock-container__dropdown-list">
          <CustomSelect
            selectedOption={this.state.timeSeriesTypeSelected}
            label={this.state.timeSeriesSelectLabel}
            options={this.state.timeSeriesTypeOptions}
            handleSelect={this.handleSelectTimeSeriesType}
          />
          <CustomSelect
            selectedOption={this.state.stockDetailTypeSelected}
            label={this.state.stockDetailSelectLabel}
            options={this.state.stockDetailTypeOptions}
            handleSelect={this.handleSelectStockDetailType}
          />
        </div>
        {/* <div className="stock-container__dropdown__time-series-type">
          </div>

        <div className="stock-container__dropdown__stock-detail-type">
        </div> */}

        {this.state.showChart && (
          <Chart
            data={this.state?.stocks}
            stockDetailType={
              this.state.stockDetailTypeSelected.id as StockDetailTypeKey
            }
          />
        )}
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
    this.setState({ ...this.state, isLoading: true }, () => {
      this.state.stockApiManager
        ?.getStockDetails(timeSeriesType)
        .then((val: AxiosResponse) => {
          if (val.status === 200) {
            const timeSeriesStockResponse = val.data as ITimeSeriesStockResponse;
            const data: IStockTimeSeriesData = this.state.stockApiManager.extractStockDetails(
              timeSeriesStockResponse
            );

            this.setState({
              ...this.state,
              stocks: data.stockDetails,
              metadata: data.metadata,
              isLoading: false,
            });
          }
        })
        .catch((error) => {
          this.setState({
            ...this.state,
            errorMessage: error,
            isLoading: false,
          });
        });
    });
  }

  private handleSelectStockDetailType = (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>,
    node: React.ReactNode
  ) => {
    const selectedOption = event.target.value;
    const newTypeSelected = this.state.stockDetailTypeOptions.find(
      (stockDetailType: IDropdown) => stockDetailType.id === selectedOption
    );

    const showChart =
      this.state.timeSeriesTypeSelected.id !== "" &&
      this.state.timeSeriesTypeSelected.id !== "NONE" &&
      selectedOption !== "NONE";

    this.setState({
      ...this.state,
      stockDetailTypeSelected: newTypeSelected,
      showChart: showChart,
    });
  };

  private handleSelectTimeSeriesType = (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>,
    node: React.ReactNode
  ) => {
    const selectedOption = event.target.value;
    const newTypeSelected = this.state.timeSeriesTypeOptions.find(
      (timeSeriesType: IDropdown) => timeSeriesType.id === selectedOption
    );

    this.setState(
      {
        ...this.state,
        timeSeriesTypeSelected: newTypeSelected,
      },
      () => {
        this.updateStockDetail(selectedOption);
      }
    );
  };

  updateStockDetail(selectedOption: unknown) {
    if (selectedOption === TimeSeriesTypeKey.TIME_SERIES_MONTHLY) {
      this.getStockDetails(TimeSeriesTypeKey.TIME_SERIES_MONTHLY);
      return;
    }

    if (selectedOption === TimeSeriesTypeKey.TIME_SERIES_WEEKLY) {
      this.getStockDetails(TimeSeriesTypeKey.TIME_SERIES_WEEKLY);
      return;
    }
  }
}
