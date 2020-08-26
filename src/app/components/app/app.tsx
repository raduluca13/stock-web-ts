import React, { Component } from "react";
import "./app.css";
// import MainContent from "../main-content/main-content";
import Header from "app/shared/components/header/header";
import Footer from "app/shared/components/footer/footer";
import IAppState from "app/store/IAppState.interface";
import StocksContainer from "../stocks/container/StocksContainer";

export interface IAppProps {}

export default class App extends Component<IAppProps, IAppState> {
  public render() {
    return (
      <div className="app">
        <Header />
        <StocksContainer />
        {/* <MainContent /> */}
        <Footer />
      </div>
    );
  }
}
