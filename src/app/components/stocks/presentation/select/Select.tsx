import React, { Component, SyntheticEvent } from "react";
import { IStockDetailsKeysDropdown } from "../../container/StocksContainer";
import { StockDetailsKeysDropdown } from "../../data/models/StockDetailsKeys.enum";

export interface ISelectProps {
  options: IStockDetailsKeysDropdown[];
  selectedOption: IStockDetailsKeysDropdown;
  handleSelect: (event: SyntheticEvent<HTMLSelectElement, Event>) => void;
}

export interface ISelectState {
  selectedOption: IStockDetailsKeysDropdown;
}

export default class Select extends Component<ISelectProps, ISelectState> {
  constructor(props: Readonly<ISelectProps>) {
    super(props);
    this.state = {
      selectedOption: {
        id: StockDetailsKeysDropdown.NONE,
        value: StockDetailsKeysDropdown[StockDetailsKeysDropdown.NONE],
      } as IStockDetailsKeysDropdown,
    };

    this.handleSelect = this.props.handleSelect.bind(this);
  }

  handleSelect(event: SyntheticEvent<HTMLSelectElement, Event>) {
    console.log(event.currentTarget.value);
    this.setState({ selectedOption: { ...this.state.selectedOption, value: event.currentTarget.value } });
  }

  render() {
    return (
      <form>
        <label>Name:</label>
        <select value={this.props?.selectedOption.value} onChange={this.props.handleSelect}>
          {this.props?.options?.map((option, key) => (
            <option key={key} value={option.value}>
              {option.value}
            </option>
          ))}
        </select>
      </form>
    );
  }
}
