import {
  //   ISearchUserAction - todo maybe,
  ISetUserAction,
  IGetUsersStartAction,
  IGetUsersSuccessAction,
  IGetUsersFailureAction,
} from "../types/UserActions.inteface";
import UserActionTypes from "../types/UserActionTypes.enum";
import IUser from "../data/IUser.interface";

export const setUserActionCreator = (user: IUser): ISetUserAction => {
  return {
    type: UserActionTypes.SET_USER,
    user: user,
    isFetching: false,
  };
};

export const getUsersStartActionCreator = (): IGetUsersStartAction => {
  return {
    type: UserActionTypes.GET_USERS_START,
    isFetching: true,
  };
};

export const getUsersSuccessActionCreator = (users: IUser[]): IGetUsersSuccessAction => {
  return {
    type: UserActionTypes.GET_USERS_SUCCESS,
    users: users,
    isFetching: false,
  };
};

export const getUsersFailureActionCreator = (): IGetUsersFailureAction => {
  return {
    type: UserActionTypes.GET_USERS_FAILURE,
    isFetching: false,
  };
};
