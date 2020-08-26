import React, { Component } from "react";
import { Provider } from "react-redux";
import { Store } from "redux";
import IAppState from "app/store/IAppState.interface";
import App from "../app/app";

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
