// Import Reducer type
import { Reducer } from "redux";

// Busines domain imports
import IUserState from "../data/IUserState.interface";
import UserActions from "../types/UserActions.type";
import UserActionTypes from "../types/UserActionTypes.enum";

// Business logic
const initialUserState: IUserState = {
  user: undefined,
  users: [],
  isFetching: false,
};

const UserReducer: Reducer<IUserState, UserActions> = (state = initialUserState, action: UserActions) => {
  switch (action.type) {
    case UserActionTypes.SET_USER: {
      return {
        ...state,
        user: action.user,
      };
    }
    case UserActionTypes.SEARCH_USERS: {
      return {
        ...state,
        isFetching: action.isFetching,
      };
    }
    case UserActionTypes.GET_USERS_START: {
      return {
        ...state,
        isFetching: action.isFetching,
      };
    }
    case UserActionTypes.GET_USERS_SUCCESS: {
      return {
        ...state,
        characters: action.users,
        isFetching: action.isFetching,
      };
    }
    case UserActionTypes.GET_USERS_FAILURE: {
      return {
        ...state,
        isFetching: action.isFetching,
      };
    }
    default:
      return state;
  }
};

export default UserReducer;
