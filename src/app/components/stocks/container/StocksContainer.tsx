import React, { Component, ChangeEvent } from "react";
import "./StockContainer.css";
import { AxiosResponse } from "axios";
import { Snackbar } from "@material-ui/core";
import Loader from "react-loader-spinner";

import { IDropdown } from "../data/interfaces/IDropdown.interface";
import { IStockDetailData } from "../data/interfaces/IStockDetailData.interface";
import { IStockTimeSeriesMetadata } from "../data/interfaces/IStockTimeSeriesMetadata.interface";
import { IStockTimeSeriesData } from "../data/interfaces/IStockTimeSeries.interface";
import { ITimeSeriesStockResponse } from "../data/interfaces/ITimeSeriesStockResponse.interface";
import { IAlphaVantageSymbolSearchResponse } from "../data/interfaces/IAlphaVantageSymbolSearchResponse.interface";
import { TimeSeriesTypeKey } from "../data/enum/TimeSeriesTypes.enum";
import { StockDetailTypeKey } from "../data/enum/StockDetailsKeys.enum";

import { StockApiManager } from "../data/services/StocksApiService";
import { DropdownMapperService } from "../data/services/DropdownMapperService";
import CustomSelect from "../presentation/custom-select/CustomSelect";
import SearchInput from "../presentation/search-input/SearchInput";
import DatePicker from "../presentation/date-picker/DatePicker";
import Chart from "../presentation/Chart/Chart";

export interface IStocksContainerProps {
  stocks: IStockDetailData[];
  metadata: IStockTimeSeriesMetadata;
}

export interface IStocksContainerState {
  stocks: IStockDetailData[];
  metadata: IStockTimeSeriesMetadata;

  stockApiManager: StockApiManager;
  dropdownMapperService: DropdownMapperService;

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
          <Loader type="Grid" visible={this.state.isLoading} color="#00BFFF" height={50} width={50} />
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
                handleSelect={this.handleSelectTimeSeriesType}
              />
            )}

            {this.state.stockDetailTypeOptions.length > 0 && (
              <CustomSelect
                selectedOption={this.state.stockDetailTypeSelected}
                label={this.state.stockDetailSelectLabel}
                options={this.state.stockDetailTypeOptions}
                handleSelect={this.handleSelectStockDetailType}
              />
            )}
          </div>

          {this.state.showDatePickers && (
            <div className="stock-container__stock-options__date-pickers">
              <DatePicker label="From" value="2015-05-24" />
              <DatePicker label="Until" value="2020-05-24" />
            </div>
          )}
        </div>

        {this.state.showChart && (
          <Chart
            data={this.state?.stocks}
            stockDetailType={this.state.stockDetailTypeSelected.id as StockDetailTypeKey}
          />
        )}
      </div>
    );
  }

  private onSearchSymbol(event: ChangeEvent<HTMLInputElement>): void {
    const searchedSymbol = event.target.value;

    this.setState({ ...this.state, searchedSymbol: searchedSymbol }, () => {
      if (searchedSymbol.length >= 2) {
        this.state.stockApiManager
          ?.searchSymbol(searchedSymbol)
          .then((response: AxiosResponse<any>) => {
            const searchMatches = response?.data as IAlphaVantageSymbolSearchResponse;
            const symbols = this.state.stockApiManager.extractSymbols(searchMatches);

            if (symbols.length > 0) {
              const symbolDropdownList = this.state.dropdownMapperService.mapToSymbolDropdowns(symbols);
              this.setState({ ...this.state, symbolOptions: symbolDropdownList, noSymbolsFound: false });
            } else {
              this.setState({
                ...this.state,
                noSymbolsFound: true,
                symbolOptions: [],
                timeSeriesTypeOptions: [],
                stockDetailTypeOptions: [],
                showDatePickers: false,
              });
            }
          })
          .catch((e) => console.error(e));
      }

      // resetted
      if (searchedSymbol.length === 0) {
        this.setState({
          ...this.state,
          noSymbolsFound: false,
          searchedSymbol: "",
          symbolOptions: [],
          timeSeriesTypeOptions: [],
          stockDetailTypeOptions: [],
          showDatePickers: false,
        });
      }
    });
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
      showDatePickers: true,
      stockDetailTypeSelected: defaultDropdown,
      timeSeriesTypeSelected: defaultDropdown,
      showChart: false,
    });
  }

  private handleSelectStockDetailType = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
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

  private handleSelectTimeSeriesType = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
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

  private updateStockDetail(selectedOption: unknown) {
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
      this.state.stockApiManager
        ?.getStockDetails(this.state.symbolSelected.id, timeSeriesType)
        .then((val: AxiosResponse) => {
          if (val.status === 200) {
            const timeSeriesStockResponse = val.data as ITimeSeriesStockResponse;
            const data: IStockTimeSeriesData = this.state.stockApiManager.extractStockDetails(timeSeriesStockResponse);

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
}
