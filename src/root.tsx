import React, { Component } from "react";
import Shell from "./components/Shell/Shell";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NotFound from "components/NotFound/NotFound";
import storeContext from './stores/StoresContext'

interface IRootProps {
  // store: Store<IAppState>;
}

interface IRootState { }

const Root = () => {
    React.useContext(storeContext);

    return (
      // <Provider store={this.props.store}>
    
      <Router>
        <Switch>
          <Route path="/" component={Shell} />
          <Route path="*" component={NotFound} />
        </Switch>

      </Router>
      // </Provider>
    );
}

export default Root;