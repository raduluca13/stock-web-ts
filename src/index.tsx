import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Root from "app/components/root/root";
import configureStore from "app/store/Store";

const store = configureStore();


ReactDOM.render(<Root store={store} />, document.getElementById("root") as HTMLElement);

// nice reference for testing, though deprecated?
// https://github.com/draffauf/react-redux-typescript-demo/tree/master/src/store

// ----------------OLD-APP--------------------
// eslint-disable-next-line
// import * as serviceWorker from "./serviceWorker";
// import { createStore, Action } from "redux";
// import { enthusiasm } from "./screens/old-app/state/reducers/index";
// import { StoreState } from "./screens/old-app/state/types/index";
// import Hello from "./screens/old-app/containers/Hello";
// import { Provider } from "react-redux";

// const store = createStore<StoreState, Action<any>, any, any>(enthusiasm, {
//   enthusiasmLevel: 1,
//   languageName: "TypeScript",
// });

// ReactDOM.render(
//   <Provider store={store}>
//     <Hello />
//   </Provider>,
//   document.getElementById("root") as HTMLElement
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
