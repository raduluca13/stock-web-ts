import axios from "axios";
import { of, Observable } from "rxjs";

const baseUrl = "https://swapi.co/api";

export const getCharactersFromApi = (): Promise<any> => {
  return axios.get(`${baseUrl}/people/`);
};

export const searchCharactersFromApi = (term: string): Promise<any> => {
  return axios.get(`${baseUrl}/people/?search=${term}`);
};


const user = require("./user.json");
export const getUsersFromJSON = (): Observable<any> => {
  return of(user);
};
