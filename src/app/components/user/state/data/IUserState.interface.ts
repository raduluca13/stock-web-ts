import IUser from "./IUser.interface";

export default interface IUserState {
  readonly user?: IUser;
  readonly users: IUser[];
  readonly isFetching: boolean;
}
