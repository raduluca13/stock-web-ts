import React, { Component } from "react";
import { Provider } from "react-redux";
import App, { IAppState } from "../app/app";
import { Store } from "redux";

interface IRootProps {
  store: Store<IAppState>;
}

interface IRootState {}

export default class Root extends Component<IRootProps, IRootState> {
  public render() {
    return (
      <Provider store={this.props.store}>
        <App />
      </Provider>
    );
  }
}
