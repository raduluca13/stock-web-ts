// Import Reducer type
import { Reducer } from "redux";

// Busines domain imports
import ICharacterState from "../data/ICharacterState.interface";
import MainContentActions from "../types/MainContentActions.type";
import MainContentActionTypes from "../types/MainContentActionTypes.enum";

// Business logic
const initialCharacterState: ICharacterState = {
  character: undefined,
  characters: [],
  isFetching: false,
};

const CharacterReducer: Reducer<ICharacterState, MainContentActions> = (state = initialCharacterState, action) => {
  switch (action.type) {
    case MainContentActionTypes.SET_CHARACTER: {
      return {
        ...state,
        character: action.character,
      };
    }
    case MainContentActionTypes.SEARCH_CHARACTERS: {
      return {
        ...state,
        isFetching: action.isFetching,
      };
    }
    case MainContentActionTypes.GET_CHARACTERS_START: {
      return {
        ...state,
        isFetching: action.isFetching,
      };
    }
    case MainContentActionTypes.GET_CHARACTERS_SUCCESS: {
      return {
        ...state,
        characters: action.characters,
        isFetching: action.isFetching,
      };
    }
    case MainContentActionTypes.GET_CHARACTERS_FAILURE: {
      return {
        ...state,
        isFetching: action.isFetching,
      };
    }
    default:
      return state;
  }
};

export default CharacterReducer;
