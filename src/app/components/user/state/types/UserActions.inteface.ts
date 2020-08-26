// TODO - split in separate files ?
// TODO 2 - are the extends needed? at least for clarity where the type comes in from?
import UserActionTypes from "./UserActionTypes.enum";
import IUser from "../data/IUser.interface";
import { Action } from "redux";

export interface ISetUserAction extends Action<UserActionTypes> {
  type: UserActionTypes.SET_USER;
  user: IUser;
  isFetching: false;
}

export interface ISearchUserAction extends Action<UserActionTypes> {
  type: UserActionTypes.SEARCH_USERS;
  searchTerm: string;
  isFetching: true;
}

export interface IGetUsersStartAction extends Action<UserActionTypes> {
  type: UserActionTypes.GET_USERS_START;
  isFetching: true;
}

export interface IGetUsersSuccessAction extends Action<UserActionTypes> {
  type: UserActionTypes.GET_USERS_SUCCESS;
  users: IUser[];
  isFetching: false;
}

export interface IGetUsersFailureAction extends Action<UserActionTypes> {
  type: UserActionTypes.GET_USERS_FAILURE;
  isFetching: false;
}
