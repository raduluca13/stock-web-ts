import ILatLng from "./ILatLng.interface";
import ITimezone from "./ITimezone.interface";

export default interface ILocation {
  street: string;
  city: string;
  state: string;
  postcode: string;
  coordinates: ILatLng;
  timezone: ITimezone;
}
