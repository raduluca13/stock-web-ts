import ICharacter from "../data/ICharacter.interface";
import MainContentActionTypes from "./MainContentActionTypes.enum";

export interface ISetCharacterAction {
  type: MainContentActionTypes.SET_CHARACTER;
  character: ICharacter;
  isFetching: false;
}

export interface ISearchCharactersAction {
  type: MainContentActionTypes.SEARCH_CHARACTERS;
  term: string;
  isFetching: true;
}

export interface IGetCharactersStartAction {
  type: MainContentActionTypes.GET_CHARACTERS_START;
  isFetching: true;
}

export interface IGetCharactersSuccessAction {
  type: MainContentActionTypes.GET_CHARACTERS_SUCCESS;
  characters: ICharacter[];
  isFetching: false;
}

export interface IGetCharactersFailureAction {
  type: MainContentActionTypes.GET_CHARACTERS_FAILURE;
  isFetching: false;
}
