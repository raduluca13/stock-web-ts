// Third-Party dependencies
import { applyMiddleware, combineReducers, createStore, Store } from "redux";

// React Sagas
//   import createSagaMiddleware from 'redux-saga';

// Chrome Dev Tools
import { composeWithDevTools } from "redux-devtools-extension";

// Business domain imports
// import CharacterReducer from "../character/reducers/CharacterReducer";
// import { charactersSaga } from "../character/sagas/Character";
import { IAppState } from "app/components/app/app";

// Saga Middleware
// const sagaMiddleware = createSagaMiddleware();

// Create the root reducer
const rootReducer = combineReducers<IAppState>({
  characterState: CharacterReducer,
});

// Create a configure store function of type `IAppState`
export default function configureStore(): Store<IAppState, any> {
  const store = createStore(
    rootReducer,
    undefined
    // composeWithDevTools(applyMiddleware(sagaMiddleware))
  );

  sagaMiddleware.run(charactersSaga);

  return store;
}
