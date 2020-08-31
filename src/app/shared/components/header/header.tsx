import React, { Component } from "react";
import "./header.css"; // Tell webpack that Button.js uses these styles

interface IHeaderProps {}
interface IHeaderState {}

export default class Header extends Component<IHeaderProps, IHeaderState> {
  public render() {
    return <header className="header">Stocks Web TS</header>;
  }
}
