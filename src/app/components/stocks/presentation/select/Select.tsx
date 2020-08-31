import React, { Component, SyntheticEvent } from "react";
import { IDropdown } from "../../data/models/IDropdown.interface";

export interface ISelectProps {
  label: string;
  options: IDropdown[];
  selectedOption: IDropdown;
  handleSelect: (event: SyntheticEvent<HTMLSelectElement, Event>) => void;
}

export interface ISelectState {
  selectedOption: IDropdown;
}

export default class Select extends Component<ISelectProps, ISelectState> {
  constructor(props: Readonly<ISelectProps>) {
    super(props);

    // this.setState({
    //   ...this.state,
    //   selectedOption:
    //     this.props.selectedOption ||
    //     ({
    //       id: "",
    //       value: "",
    //     } as IDropdown),
    // });

    this.handleSelect = this.props.handleSelect.bind(this);
  }

  handleSelect: (event: SyntheticEvent<HTMLSelectElement, Event>) => void;

  render() {
    return (
      <form>
        <label>{this.props.label}</label>
        <select
          value={this.props?.selectedOption?.id}
          onChange={this.props.handleSelect}
        >
          {this.props?.options?.map((option, key) => (
            <option key={key} value={option.id}>
              {option.value}
            </option>
          ))}
        </select>
      </form>
    );
  }
}
