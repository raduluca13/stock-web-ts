import IUserName from "./IUserName.interface";
import ILocation from "./ILocation.interface";
import ITimeEvent from "./ITimeEvent.interface";
import IPair from "./IPair.interface";
import IPictureOptimizer from "./IPictureOptimizer.interface";

export default interface IUser {
  gender: string;
  name: IUserName;
  location: ILocation;
  email: string;
  login: {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
  };
  dob: ITimeEvent;
  registered: ITimeEvent;
  phone: string;
  cell: string;
  id: IPair<string>;
  picture: IPictureOptimizer;
  nat: string;
}
