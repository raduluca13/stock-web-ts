import React, { Component, ChangeEvent, useState } from "react";
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

const Stocks = () => {
  const [state, setState] = useState({
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
    symbolOptions: [] as IDropdown[],
    noSymbolsFound: false,
    symbolSearchErrorMessage: "No symbols found",

    stockDetailSelectLabel: "Stock Detail Type",
    stockDetailTypeSelected: {
      id: "",
      value: "",
    } as IDropdown,
    stockDetailTypeOptions: [] as IDropdown[],

    timeSeriesSelectLabel: "Time Series Type",
    timeSeriesTypeSelected: {
      id: "",
      value: "",
    } as IDropdown,
    timeSeriesTypeOptions: [] as IDropdown[],

    detailsButtonStateLabel: "Open Details",
    isOpenedDetailsButton: false,

    showDatePickers: false,
    isLoading: false,
    showChart: false,
    errorMessage: undefined,
    onCloseSnackbar: () => {
      setState({ ...state, errorMessage: undefined });
    },
  })



  const onClickDetailsButton = (): void => {
    const { isOpenedDetailsButton } = state;

    setState({
      ...state,
      detailsButtonStateLabel: !isOpenedDetailsButton ? "Close Details" : "Open Details",
      isOpenedDetailsButton: !isOpenedDetailsButton
    })
  }

  const filterStocksOnDate = (): void => {
    const { startDate, endDate, stockApiManager } = state;
    const filteredStocks = stockApiManager.filterStocksOnDate({
      startDate,
      endDate
    } as ITimeFrame);


    setState({
      ...state,
      stocks: filteredStocks
    });
  }

  const handleChangeDate = (event: ChangeEvent<HTMLInputElement>, dateType: string) => {
    const dateString = event.target.value;

    setState({
      ...state,
      [dateType]: dateString
    });

    filterStocksOnDate()
  }

  // useCallback(myCallback, [searchedSymbol])

  // useEffect(myCallback)
  // myCallback(){
  // at mount
  // return ... = at unmount
  // }

  // const [prop, setProp] = useState({defaultPropState})

  // TODO - rework and split to methods
  const onSearchSymbol = (event: ChangeEvent<HTMLInputElement>): void => {
    const searchedSymbol = event.target.value;
    searchSymbolCallback(searchedSymbol)
  }

  const searchSymbolCallback = async (searchedSymbol: string) => {
    setState({ ...state, searchedSymbol });
    console.log({ searchedSymbol })
    if (searchedSymbol.length >= 2) {
      let response;
      try {
        response = await state.stockApiManager?.searchSymbol(searchedSymbol);
      }
      catch (e) {
        console.error(e);
      }

      setSymbolDropdown(response);
    }

    resetSymbolChoices(searchedSymbol);
  }

  const setSymbolDropdown = (response: AxiosResponse<any> | undefined) => {
    const searchMatches = response?.data as IAlphaVantageSymbolSearchResponse;
    const symbols = state.stockApiManager.extractSymbols(searchMatches);
    console.log({ symbols })
    if (symbols.length > 0) {
      const symbolDropdownList = state.dropdownMapperService.mapToSymbolDropdowns(symbols);
      setState({
        ...state,
        symbolOptions: symbolDropdownList,
        noSymbolsFound: false,
      });
    } else {
      setState({
        ...state,
        noSymbolsFound: true,
        symbolOptions: []
      });
    }
  }

  const resetSymbolChoices = (searchedSymbol: string) => {
    if (searchedSymbol.length === 0) {
      setState({
        ...state,
        noSymbolsFound: false,
        searchedSymbol: "",
        symbolOptions: [],
      });
    }
  }

  const handleSelectSymbol = (event: ChangeEvent<{ name?: string; value: unknown }>): void => {
    const selectedOption = event.target.value;
    const newTypeSelected = state.symbolOptions.find(
      (symbolOption: IDropdown) => symbolOption.id === selectedOption
    );
    const timeSeriesTypeOptions = state.dropdownMapperService.mapToTimeSeriesTypeDropdown();
    const stockDetailTypeOptions = state.dropdownMapperService.mapToStockDetailTypeDropdown();
    const defaultDropdown = state.dropdownMapperService.createDefaultDropdown();

    setState({
      ...state,
      symbolSelected: newTypeSelected as IDropdown,
      timeSeriesTypeOptions: timeSeriesTypeOptions,
      stockDetailTypeOptions: stockDetailTypeOptions,
      stockDetailTypeSelected: defaultDropdown,
      timeSeriesTypeSelected: defaultDropdown,
      showDatePickers: true,
      showChart: false,
    });
  }

  const handleSelect = (event: ChangeEvent<{ name?: string; value: unknown }>, selectedProp: string): void => {
    const selectedOption = event.target.value;
    const newTypeSelected = state.timeSeriesTypeOptions.find(
      (timeSeriesType: IDropdown) => timeSeriesType.id === selectedOption
    );

    // TODO
    const showChart =
      selectedOption !== "" &&
      selectedOption !== "NONE" &&
      state.stockDetailTypeSelected.id !== "" &&
      state.stockDetailTypeSelected.id !== "NONE" &&
      state.timeSeriesTypeSelected.id !== "" &&
      state.timeSeriesTypeSelected.id !== "NONE"

    setState({
      ...state,
      [selectedProp]: (newTypeSelected != null) ? newTypeSelected : state.dropdownMapperService.createDefaultDropdown(), // TODO
      showChart
    });
  }

  const handleSelectTimeSeriesType = (event: ChangeEvent<{ name?: string; value: unknown }>): void => {
    const selectedOption = event.target.value as string;
    const newTypeSelected = state.timeSeriesTypeOptions.find(
      (timeSeriesType: IDropdown) => timeSeriesType.id === selectedOption
    );

    // TODO
    const showChart =
      selectedOption !== "" &&
      selectedOption !== "NONE" &&
      state.stockDetailTypeSelected.id !== "" &&
      state.stockDetailTypeSelected.id !== "NONE";

    setState(
      {
        ...state,
        timeSeriesTypeSelected: newTypeSelected as IDropdown,
        showChart: showChart,
      }
    );

    updateStockDetail(selectedOption);
  }

  const handleSelectStockDetailType = (event: ChangeEvent<{ name?: string; value: unknown }>): void => {
    const selectedOption = event.target.value;
    const newTypeSelected = state.stockDetailTypeOptions.find(
      (stockDetailType: IDropdown) => stockDetailType.id === selectedOption
    );

    // TODO
    const showChart =
      state.timeSeriesTypeSelected.id !== "" &&
      state.timeSeriesTypeSelected.id !== "NONE" &&
      selectedOption !== "NONE";

    setState(
      {
        ...state,
        stockDetailTypeSelected: newTypeSelected as IDropdown,
        showChart: showChart,
      }
    );
  }

  const updateStockDetail = (selectedOption: string) => {
    getStockDetails(TimeSeriesTypeKey[selectedOption as TimeSeriesTypeKey]);
  }

  const getStockDetails = (timeSeriesType: TimeSeriesTypeKey) => {
    setState({ ...state, isLoading: true });
    getStockDetailsCallback(timeSeriesType);
  }

  const getStockDetailsCallback = async (timeSeriesType: TimeSeriesTypeKey) => {
    const { startDate, endDate, stockApiManager } = state;

    let response;
    try {
      response = await stockApiManager?.getStockDetails(state.symbolSelected.id, timeSeriesType);
    }
    catch (e) {
      setState({
        ...state,
        errorMessage: e,
        isLoading: false,
      });
    }


    if (response?.status !== 200) return;

    if (Object.keys(response?.data).includes("Error Message")) {
      resetDropdownsWhenApiLimitReached(response);
      return;
    }

    const timeSeriesStockResponse = response?.data as ITimeSeriesStockResponse;
    const timeFrame: ITimeFrame = {
      startDate,
      endDate
    };

    const stocksData: IStockTimeSeriesData = stockApiManager.extractStockDetails(
      timeSeriesStockResponse,
      timeFrame
    );

    setState({
      ...state,
      stocks: stocksData.stockDetails,
      metadata: stocksData.metadata,
      isLoading: false,
    });
  }

  const resetDropdownsWhenApiLimitReached = (response: AxiosResponse<any> | undefined) => {
    const defaultDropdown = state.dropdownMapperService.createDefaultDropdown();

    setState({
      ...state,
      errorMessage: response?.data["Error Message"],
      isLoading: false,
      symbolSelected: defaultDropdown,
      timeSeriesTypeSelected: defaultDropdown,
      stockDetailTypeSelected: defaultDropdown,
      timeSeriesTypeOptions: [],
      stockDetailTypeOptions: [],
      showChart: false,
      showDatePickers: false,
    });
  }

  return (
    <div className="stock-container" >
      {
        state.stocks.length > 0 && state.symbolSelected.id !== "" && (
          <div className="stock-container__description">
            <div className="stock-container__description__title">
              <h1>Stocks</h1>

              <Button
                className="stock-container__description__button"
                variant="contained"
                onClick={() => onClickDetailsButton()}
              >
                {state.detailsButtonStateLabel}
              </Button>
            </div>

            {state.isOpenedDetailsButton && (
              <div className="stock-container__description__details">
                <p>Information: {state?.metadata?.Information}</p>
                <p>Symbol: {state?.metadata?.Symbol}</p>
                <p>Last Refreshed: {state?.metadata?.LastRefreshed}</p>
                <p>Time Zone: {state?.metadata?.TimeZone}</p>
              </div>
            )}
          </div>
        )
      }

      < div className="stock-container__loader" >
        <Loader type="Grid" visible={state.isLoading} color="#00BFFF" height={50} width={50} />
      </div>

      <div className="stock-container__snackbar">
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={state.errorMessage !== undefined}
          autoHideDuration={6000}
          onClose={state.onCloseSnackbar}
          message={state.errorMessage}
        ></Snackbar>
        {/* <IconButton size="small" aria-label="close" color="inherit" onClick={state.onCloseSnackbar}> */}
        {/* <Icon>close</Icon> */}
        {/* </IconButton> */}
      </div>

      <div className="stock-container__search-input">
        <SearchInput
          errorMessage={state.symbolSearchErrorMessage}
          hasError={state.noSymbolsFound}
          value={state.searchedSymbol}
          label="Search Symbol"
          onChange={(event) => onSearchSymbol(event)}
        ></SearchInput>
      </div>

      <div className="stock-container__stock-options">
        <div className="stock-container__stock-options__dropdown-list">
          {state.symbolOptions.length > 0 && (
            <CustomSelect
              selectedOption={state.symbolSelected}
              label={state.symbolsDrodpownLabel}
              options={state.symbolOptions}
              handleSelect={(event) => handleSelectSymbol(event)}
            />
          )}

          {state.timeSeriesTypeOptions.length > 0 && (
            <CustomSelect
              selectedOption={state.timeSeriesTypeSelected}
              label={state.timeSeriesSelectLabel}
              options={state.timeSeriesTypeOptions}
              handleSelect={(event) => handleSelect(event, 'timeSeriesTypeSelected')}
            />
          )}

          {state.stockDetailTypeOptions.length > 0 &&
            state.timeSeriesTypeSelected.id !== "" &&
            state.timeSeriesTypeSelected.id !== "NONE" && (
              <CustomSelect
                selectedOption={state.stockDetailTypeSelected}
                label={state.stockDetailSelectLabel}
                options={state.stockDetailTypeOptions}
                handleSelect={(event) => handleSelect(event, 'stockDetailTypeSelected')}
              />
            )}
        </div>

        {state.showDatePickers && (
          <div className="stock-container__stock-options__date-pickers">
            <DatePicker
              label="From"
              value={state.startDate}
              onChange={(event) => handleChangeDate(event, 'startDate')}
            />
            <DatePicker
              label="Until"
              value={state.endDate}
              onChange={(event) => handleChangeDate(event, 'endDate')}
            />
          </div>
        )}
      </div>

      <div className="stock-container__chart">
        {state.showChart && (
          <ApexChart
            data={state?.stocks}
            stockDetailType={state.stockDetailTypeSelected.id as StockDetailTypeKey}
          />
        )}

        {/* {state.showChart && (
          <Chart
            data={state?.stocks}
            stockDetailType={state.stockDetailTypeSelected.id as StockDetailTypeKey}
          />
        )} */}
      </div>
    </div >
  );
}


export default Stocks;