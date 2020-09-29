import React from 'react';
import "./Shell.css";
import StocksContainer from "../../pages/Stocks/Stocks";
import Footer from 'components/Footer/Footer';
import Header from 'components/Header/Header';
import MainContent from 'pages/MainContent/MainContent';
import { Route, Switch, useRouteMatch } from 'react-router-dom';


const Shell = () => {
  // const { path } = useRouteMatch();

  return (
    <div className="shell">
      <Header />
      <Switch>
        <Route exact path={`/stocks`} component={StocksContainer} />
        <Route exact path={`/main-content`} component={MainContent} />
      </Switch>
      <Footer />
    </div>
  )
};


export default Shell;
