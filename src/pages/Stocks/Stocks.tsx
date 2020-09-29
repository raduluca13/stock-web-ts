import React, { Component, ChangeEvent } from "react";
import "./Stocks.css";
import { AxiosResponse } from "axios";
import { Button, IconButton, Snackbar } from "@material-ui/core";
import Loader from "react-loader-spinner";

import { IDropdown } from "../../interfaces/IDropdown.interface";
import { IStockDetailData } from "../../interfaces/IStockDetailData.interface";
import { IStockTimeSeriesMetadata } from "../../interfaces/IStockTimeSeriesMetadata.interface";
import { IStockTimeSeriesData } from "../../interfaces/IStockTimeSeries.interface";
import { ITimeSeriesStockResponse } from "../../interfaces/ITimeSeriesStockResponse.interface";
import { IAlphaVantageSymbolSearchResponse } from "../../interfaces/IAlphaVantageSymbolSearchResponse.interface";
import { ITimeFrame } from "../../interfaces/ITimeFrame.interface";
import { TimeSeriesTypeKey } from "../../enum/TimeSeriesTypes.enum";
import { StockDetailTypeKey } from "../../enum/StockDetailsKeys.enum";

import { StockApiManager } from "../../services/StocksApiService";
import { DropdownMapperService } from "../../services/DropdownMapperService";
import CustomSelect from "./components/CustomSelect/CustomSelect";
import SearchInput from "./components/SearchInput/SearchInput";
import DatePicker from "./components/DatePicker/DatePicker";
import Chart from "./components/Chart/Chart";
import ApexChart from "./components/Chart/ApexChart";

export interface IStocksContainerProps {
  stocks: IStockDetailData[];
  metadata: IStockTimeSeriesMetadata;
}

export interface IStocksContainerState {
  stocks: IStockDetailData[];
  metadata: IStockTimeSeriesMetadata;

  stockApiManager: StockApiManager;
  dropdownMapperService: DropdownMapperService;

  startDate: string;
  endDate: string;

  searchedSymbol: string;
  symbolsDrodpownLabel: string;
  symbolSelected: IDropdown;
  symbolOptions: IDropdown[];
  noSymbolsFound: boolean;
  symbolSearchErrorMessage: string;

  stockDetailSelectLabel: string;
  stockDetailTypeSelected: IDropdown;
  stockDetailTypeOptions: IDropdown[];

  timeSeriesSelectLabel: string;
  timeSeriesTypeSelected: IDropdown;
  timeSeriesTypeOptions: IDropdown[];

  // TODO - change to a more suggestive name for an API error
  errorMessage?: string;

  isOpenedDetailsButton: boolean;
  detailsButtonStateLabel: string;

  showDatePickers: boolean;
  isLoading: boolean;
  showChart: boolean;
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
    dropdownMapperService: new DropdownMapperService(),

    startDate: "2018-05-24",
    endDate: "2020-10-24",

    searchedSymbol: "",
    symbolsDrodpownLabel: "Symbol",
    symbolSelected: {
      id: "",
      value: "",
    } as IDropdown,
    symbolOptions: [],
    noSymbolsFound: false,
    symbolSearchErrorMessage: "No symbols found",

    stockDetailSelectLabel: "Stock Detail Type",
    stockDetailTypeSelected: {
      id: "",
      value: "",
    } as IDropdown,
    stockDetailTypeOptions: [],

    timeSeriesSelectLabel: "Time Series Type",
    timeSeriesTypeSelected: {
      id: "",
      value: "",
    } as IDropdown,
    timeSeriesTypeOptions: [],

    detailsButtonStateLabel: "Open Details",
    isOpenedDetailsButton: false,

    showDatePickers: false,
    isLoading: false,
    showChart: false,
    errorMessage: undefined,
    onCloseSnackbar: () => {
      this.setState({ ...this.state, errorMessage: undefined });
    },
  };

  public componentDidUpdate() {
    // console.log("updated", this.state);
  }

  public render() {
    return (
      <div className="stock-container">
        {this.state.stocks.length > 0 && this.state.symbolSelected.id !== "" && (
          <div className="stock-container__description">
            <div className="stock-container__description__title">
              <h1>Stocks</h1>

              <Button
                className="stock-container__description__button"
                variant="contained"
                onClick={() => this.onClickDetailsButton()}
              >
                {this.state.detailsButtonStateLabel}
              </Button>
            </div>

            {this.state.isOpenedDetailsButton && (
              <div className="stock-container__description__details">
                <p>Information: {this.state?.metadata?.Information}</p>
                <p>Symbol: {this.state?.metadata?.Symbol}</p>
                <p>Last Refreshed: {this.state?.metadata?.LastRefreshed}</p>
                <p>Time Zone: {this.state?.metadata?.TimeZone}</p>
              </div>
            )}
          </div>
        )}

        <div className="stock-container__loader">
          <Loader type="Grid" visible={this.state.isLoading} color="#00BFFF" height={50} width={50} />
        </div>

        <div className="stock-container__snackbar">
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={this.state.errorMessage !== undefined}
            autoHideDuration={6000}
            onClose={this.state.onCloseSnackbar}
            message={this.state.errorMessage}
          ></Snackbar>
          {/* <IconButton size="small" aria-label="close" color="inherit" onClick={this.state.onCloseSnackbar}> */}
          {/* <Icon>close</Icon> */}
          {/* </IconButton> */}
        </div>

        <div className="stock-container__search-input">
          <SearchInput
            errorMessage={this.state.symbolSearchErrorMessage}
            hasError={this.state.noSymbolsFound}
            value={this.state.searchedSymbol}
            label="Search Symbol"
            onChange={(event) => this.onSearchSymbol(event)}
          ></SearchInput>
        </div>

        <div className="stock-container__stock-options">
          <div className="stock-container__stock-options__dropdown-list">
            {this.state.symbolOptions.length > 0 && (
              <CustomSelect
                selectedOption={this.state.symbolSelected}
                label={this.state.symbolsDrodpownLabel}
                options={this.state.symbolOptions}
                handleSelect={(event) => this.handleSelectSymbol(event)}
              />
            )}

            {this.state.timeSeriesTypeOptions.length > 0 && (
              <CustomSelect
                selectedOption={this.state.timeSeriesTypeSelected}
                label={this.state.timeSeriesSelectLabel}
                options={this.state.timeSeriesTypeOptions}
                handleSelect={(event) => this.handleSelectTimeSeriesType(event)}
              />
            )}

            {this.state.stockDetailTypeOptions.length > 0 &&
              this.state.timeSeriesTypeSelected.id !== "" &&
              this.state.timeSeriesTypeSelected.id !== "NONE" && (
                <CustomSelect
                  selectedOption={this.state.stockDetailTypeSelected}
                  label={this.state.stockDetailSelectLabel}
                  options={this.state.stockDetailTypeOptions}
                  handleSelect={(event) => this.handleSelectStockDetailType(event)}
                />
              )}
          </div>

          {this.state.showDatePickers && (
            <div className="stock-container__stock-options__date-pickers">
              <DatePicker
                label="From"
                value={this.state.startDate}
                onChange={(event) => this.handleChangeDateFrom(event)}
              />
              <DatePicker
                label="Until"
                value={this.state.endDate}
                onChange={(event) => this.handleChangeDateUntil(event)}
              />
            </div>
          )}
        </div>

        <div className="stock-container__chart">
          {this.state.showChart && (
            <ApexChart
              data={this.state?.stocks}
              stockDetailType={this.state.stockDetailTypeSelected.id as StockDetailTypeKey}
            />
          )}

          {/* {this.state.showChart && (
          <Chart
            data={this.state?.stocks}
            stockDetailType={this.state.stockDetailTypeSelected.id as StockDetailTypeKey}
          />
        )} */}
        </div>
      </div>
    );
  }

  private onClickDetailsButton(): void {
    if (this.state.isOpenedDetailsButton === false) {
      this.setState({ ...this.state, detailsButtonStateLabel: "Close Details", isOpenedDetailsButton: true });
      return;
    }

    if (this.state.isOpenedDetailsButton === true) {
      this.setState({ ...this.state, detailsButtonStateLabel: "Open Details", isOpenedDetailsButton: false });
      return;
    }
  }

  private filterStocksOnDate(): void {
    const filteredStocks = this.state.stockApiManager.filterStocksOnDate({
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    } as ITimeFrame);

    this.setState({ ...this.state, stocks: filteredStocks });
  }

  private handleChangeDateFrom(event: ChangeEvent<HTMLInputElement>) {
    const dateString = event.target.value;
    this.setState({ ...this.state, startDate: dateString }, () => this.filterStocksOnDate());
  }

  private handleChangeDateUntil(event: ChangeEvent<HTMLInputElement>) {
    const dateString = event.target.value;

    this.setState({ ...this.state, endDate: dateString }, () => this.filterStocksOnDate());
  }

  // TODO - rework and split to methods
  private onSearchSymbol(event: ChangeEvent<HTMLInputElement>): void {
    const searchedSymbol = event.target.value;
    const defaultDropdown = this.state.dropdownMapperService.createDefaultDropdown();

    this.setState(
      {
        ...this.state,
        searchedSymbol: searchedSymbol,
        symbolSelected: defaultDropdown,
        timeSeriesTypeSelected: defaultDropdown,
        stockDetailTypeSelected: defaultDropdown,
        // symbolOptions: [],
        timeSeriesTypeOptions: [],
        stockDetailTypeOptions: [],
        showDatePickers: false,
        showChart: false,
      },
      () => {
        if (searchedSymbol.length >= 2) {
          this.state.stockApiManager
            ?.searchSymbol(searchedSymbol)
            .then((response: AxiosResponse<any>) => {
              const searchMatches = response?.data as IAlphaVantageSymbolSearchResponse;
              const symbols = this.state.stockApiManager.extractSymbols(searchMatches);

              if (symbols.length > 0) {
                const symbolDropdownList = this.state.dropdownMapperService.mapToSymbolDropdowns(symbols);
                this.setState({
                  ...this.state,
                  symbolOptions: symbolDropdownList,
                  noSymbolsFound: false,
                });
              } else {
                this.setState({
                  ...this.state,
                  noSymbolsFound: true,
                });
              }
            })
            .catch((e) => console.error(e));
        }

        // resetted - TODO - check if needed but i don't think so because we did reset in the previous step
        if (searchedSymbol.length === 0) {
          this.setState({
            ...this.state,
            noSymbolsFound: false,
            searchedSymbol: "",
            symbolOptions: [],
          });
        }
      }
    );
  }

  private handleSelectSymbol(event: ChangeEvent<{ name?: string; value: unknown }>): void {
    const selectedOption = event.target.value;
    const newTypeSelected = this.state.symbolOptions.find(
      (symbolOption: IDropdown) => symbolOption.id === selectedOption
    );
    const timeSeriesTypeOptions = this.state.dropdownMapperService.mapToTimeSeriesTypeDropdown();
    const stockDetailTypeOptions = this.state.dropdownMapperService.mapToStockDetailTypeDropdown();
    const defaultDropdown = this.state.dropdownMapperService.createDefaultDropdown();

    this.setState({
      ...this.state,
      symbolSelected: newTypeSelected,
      timeSeriesTypeOptions: timeSeriesTypeOptions,
      stockDetailTypeOptions: stockDetailTypeOptions,
      stockDetailTypeSelected: defaultDropdown,
      timeSeriesTypeSelected: defaultDropdown,
      showDatePickers: true,
      showChart: false,
    });
  }

  private handleSelectTimeSeriesType(event: ChangeEvent<{ name?: string; value: unknown }>): void {
    const selectedOption = event.target.value as string;
    const newTypeSelected = this.state.timeSeriesTypeOptions.find(
      (timeSeriesType: IDropdown) => timeSeriesType.id === selectedOption
    );

    // TODO
    const showChart =
      selectedOption !== "" &&
      selectedOption !== "NONE" &&
      this.state.stockDetailTypeSelected.id !== "" &&
      this.state.stockDetailTypeSelected.id !== "NONE";

    this.setState(
      {
        ...this.state,
        timeSeriesTypeSelected: newTypeSelected,
        showChart: showChart,
      },
      () => {
        this.updateStockDetail(selectedOption);
      }
    );
  }

  private handleSelectStockDetailType(event: ChangeEvent<{ name?: string; value: unknown }>): void {
    const selectedOption = event.target.value;
    const newTypeSelected = this.state.stockDetailTypeOptions.find(
      (stockDetailType: IDropdown) => stockDetailType.id === selectedOption
    );

    // TODO
    const showChart =
      this.state.timeSeriesTypeSelected.id !== "" &&
      this.state.timeSeriesTypeSelected.id !== "NONE" &&
      selectedOption !== "NONE";

    this.setState(
      {
        ...this.state,
        stockDetailTypeSelected: newTypeSelected,
        showChart: showChart,
      },
      () => console.log(this.state)
    );
  }

  private updateStockDetail(selectedOption: string) {
    if (selectedOption === TimeSeriesTypeKey.TIME_SERIES_MONTHLY) {
      this.getStockDetails(TimeSeriesTypeKey.TIME_SERIES_MONTHLY);
      return;
    }

    if (selectedOption === TimeSeriesTypeKey.TIME_SERIES_WEEKLY) {
      this.getStockDetails(TimeSeriesTypeKey.TIME_SERIES_WEEKLY);
      return;
    }
  }

  private getStockDetails(timeSeriesType: TimeSeriesTypeKey) {
    this.setState({ ...this.state, isLoading: true }, () => {
      const defaultDropdown = this.state.dropdownMapperService.createDefaultDropdown();

      this.state.stockApiManager
        ?.getStockDetails(this.state.symbolSelected.id, timeSeriesType)
        .then((val: AxiosResponse) => {
          console.log({ val });
          if (val.status === 200) {
            if (Object.keys(val.data).includes("Error Message")) {
              this.setState({
                ...this.state,
                errorMessage: val.data["Error Message"],
                isLoading: false,
                symbolSelected: defaultDropdown,
                timeSeriesTypeSelected: defaultDropdown,
                stockDetailTypeSelected: defaultDropdown,
                timeSeriesTypeOptions: [],
                stockDetailTypeOptions: [],
                showChart: false,
                showDatePickers: false,
              });
              return;
            }

            const timeSeriesStockResponse = val.data as ITimeSeriesStockResponse;
            const timeFrame: ITimeFrame = {
              startDate: this.state.startDate,
              endDate: this.state.endDate,
            };
            console.log({ timeSeriesStockResponse });

            const stocksData: IStockTimeSeriesData = this.state.stockApiManager.extractStockDetails(
              timeSeriesStockResponse,
              timeFrame
            );

            console.log({ stocksData });

            this.setState({
              ...this.state,
              stocks: stocksData.stockDetails,
              metadata: stocksData.metadata,
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
}