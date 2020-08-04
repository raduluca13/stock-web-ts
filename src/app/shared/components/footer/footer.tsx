import React, { Component } from "react";
import "./footer.css";

interface IFooterProps {}
interface IFooterState {}

export default class Footer extends Component<IFooterProps, IFooterState> {
  public render() {
    return <footer className="footer">myFooter</footer>;
  }
}
