import {
  ISetUserAction,
  ISearchUserAction,
  IGetUsersStartAction,
  IGetUsersSuccessAction,
  IGetUsersFailureAction,
} from "./UserActions.inteface";

// Combine the action types with a union (we assume there are more)
type UserActions =
  | ISetUserAction
  | ISearchUserAction
  | IGetUsersStartAction
  | IGetUsersSuccessAction
  | IGetUsersFailureAction;

export default UserActions;
