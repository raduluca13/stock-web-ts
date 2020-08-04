// Business domain imports
import ICharacter from "../data/ICharacter.interface";
import {
  ISetCharacterAction,
  ISearchCharactersAction,
  IGetCharactersStartAction,
  IGetCharactersSuccessAction,
  IGetCharactersFailureAction,
} from "../types/MainContentActions.interface";
import MainContentActionTypes from "../types/MainContentActionTypes.enum";

export const setCharacterActionCreator = (character: ICharacter): ISetCharacterAction => {
  return {
    type: MainContentActionTypes.SET_CHARACTER,
    character: character,
    isFetching: false,
  };
};

export const searchCharactersActionCreator = (term: string): ISearchCharactersAction => {
  return {
    type: MainContentActionTypes.SEARCH_CHARACTERS,
    term,
    isFetching: true,
  };
};

export const getCharactersStartActionCreator = (): IGetCharactersStartAction => {
  return {
    type: MainContentActionTypes.GET_CHARACTERS_START,
    isFetching: true,
  };
};

export const getCharactersSuccessActionCreator = (characters: ICharacter[]): IGetCharactersSuccessAction => {
  return {
    type: MainContentActionTypes.GET_CHARACTERS_SUCCESS,
    characters,
    isFetching: false,
  };
};

export const getCharactersFailureActionCreator = (): IGetCharactersFailureAction => {
  return {
    type: MainContentActionTypes.GET_CHARACTERS_FAILURE,
    isFetching: false,
  };
};
