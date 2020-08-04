import React, { Component } from "react";
import "./app.css";
import MainContent from "../main-content/main-content";
import Header from "app/shared/components/header/header";
import Footer from "app/shared/components/footer/footer";

export default class App extends Component {
  public render() {
    return (
      <div className="app">
        <Header />
        <MainContent />
        <Footer />
      </div>
    );
  }
}
