import React, { Component, SyntheticEvent } from "react";
import { StockApiManager } from "../data/services/StocksApiService";
import { TimeSeriesStockResponse } from "../data/models/TimeSeriesStockResponse.interface";
import { StockDetailData, StockTimeSeriesData } from "../data/models/StockDetails.interface";
import { StockTimeSeriesMetadata } from "../data/models/StockTimeSeriesMetadata.interface";
import { AxiosResponse } from "axios";
import { StockDetailsKeys, StockDetailsKeysDropdown } from "../data/models/StockDetailsKeys.enum";
import Chart from "../presentation/Chart/Chart";
import Select from "../presentation/select/Select";

export interface IStocksContainerProps {
  stocks: StockDetailData[];
  metadata: StockTimeSeriesMetadata;
}
export interface IStocksContainerState {
  stocks: StockDetailData[];
  metadata: StockTimeSeriesMetadata;
  stockApiManager: StockApiManager;
  selectFormSelectedOption: IStockDetailsKeysDropdown;
  stockDetailType: StockDetailsKeys;
}

export interface IStockDetailsKeysDropdown {
  id: string;
  value: string;
}

export default class StocksContainer extends Component {
  state: IStocksContainerState = {
    stocks: [],
    metadata: {
      Information: "",
      Symbol: "",
      LastRefreshed: "",
      TimeZone: "",
    },
    stockApiManager: new StockApiManager(),
    selectFormSelectedOption: {
      id: StockDetailsKeysDropdown.NONE,
      value: StockDetailsKeysDropdown[StockDetailsKeysDropdown.NONE],
    },
    stockDetailType: StockDetailsKeys.NONE,
  };

  public render() {
    return (
      <div>
        <h1>Stocks</h1>
        <p>Information: {this.state?.metadata?.Information}</p>
        <p>Symbol: {this.state?.metadata?.Symbol}</p>
        <p>Last Refreshed: {this.state?.metadata?.LastRefreshed}</p>
        <p>Time Zone: {this.state?.metadata?.TimeZone}</p>

        <Select
          selectedOption={this.state.selectFormSelectedOption}
          options={this.mapToDropdown()}
          handleSelect={this.handleSelect}
        />
        <Chart data={this.state?.stocks} stockDetailType={this.state.stockDetailType} />
      </div>
    );
  }

  handleStockDetailTypeShown(selectedOption: string): StockDetailsKeys {
    switch (selectedOption) {
      case "OPEN": {
        return StockDetailsKeys.OPEN;
      }
      case "CLOSE": {
        return StockDetailsKeys.CLOSE;
      }
      case "LOW": {
        return StockDetailsKeys.LOW;
      }
      case "HIGH": {
        return StockDetailsKeys.HIGH;
      }
      case "VOLUME": {
        return StockDetailsKeys.VOLUME;
      }
      case "NONE":
      default: {
        return StockDetailsKeys.NONE;
      }
    }
  }

  handleSelect = (event: SyntheticEvent<HTMLSelectElement, Event>) => {
    const selectedOption = event.currentTarget.selectedOptions.item(0)?.value;

    const newType: StockDetailsKeys = this.handleStockDetailTypeShown(selectedOption ?? "NONE");
    this.setState({ ...this.state, selectFormSelectedOption: selectedOption, stockDetailType: newType });
  };

  mapToDropdown(): IStockDetailsKeysDropdown[] {
    const arr = [] as IStockDetailsKeysDropdown[];

    Object.entries(StockDetailsKeysDropdown).forEach((value) => {
      arr.push({ id: value[0], value: value[1] });
    });

    return arr;
  }

  public componentDidUpdate() {
    console.log("component did update StocksContainer", this.state);
  }

  public componentDidMount() {
    this.state.stockApiManager
      ?.getStockDetails()
      .then((val: AxiosResponse) => {
        if (val.status === 200) {
          const timeSeriesStockResponse = val.data as TimeSeriesStockResponse;
          const data: StockTimeSeriesData = this.state.stockApiManager.extractStockDetails(timeSeriesStockResponse);

          this.setState({
            ...this.state,
            stocks: data.stockDetails,
            metadata: data.metadata,
          });
        }
      })
      .catch((e) => console.error(e));
  }
}
