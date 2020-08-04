import {
  ISetCharacterAction,
  ISearchCharactersAction,
  IGetCharactersStartAction,
  IGetCharactersSuccessAction,
  IGetCharactersFailureAction,
} from "./MainContentActions.interface";

// Combine the action types with a union (we assume there are more)
type MainContentActions =
  | ISetCharacterAction
  | ISearchCharactersAction
  | IGetCharactersStartAction
  | IGetCharactersSuccessAction
  | IGetCharactersFailureAction;

export default MainContentActions;
