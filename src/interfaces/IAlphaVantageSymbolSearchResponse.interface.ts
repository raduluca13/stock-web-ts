import { SymbolTypeValue } from "enum/SymbolTypeKeys.enum";

export interface IAlphaVantageSymbolSearchResponse {
  // TODO - change this any maybe
  bestMatches: { key: SymbolTypeValue; value: string }[];
}
