import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "app/components/app/app";


ReactDOM.render(<App />, document.getElementById("root"));

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
