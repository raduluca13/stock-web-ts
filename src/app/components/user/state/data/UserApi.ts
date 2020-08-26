import { of, Observable } from "rxjs";
import GetUsersMock from "./mocks/GetUsersMock";
import IUser from "./IUser.interface";
import GetUserMock from "./mocks/GetUserMock";

// const baseUrl = "to-add";

export const getUsersFromJSON = (): Observable<IUser[]> => {
  return of(GetUsersMock);
};

export const getUserFromJSON = (): Observable<IUser> => {
  return of(GetUserMock);
};
