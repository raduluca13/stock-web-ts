import { StockDetailTypeKey } from "enum/StockDetailsKeys.enum";
import { TimeSeriesTypeKey } from "enum/TimeSeriesTypes.enum";
import { IAlphaVantageSearchMatch } from "interfaces/IAlphaVantageSearchMatch.interface";
import { IDropdown } from "interfaces/IDropdown.interface";

export class DropdownMapperService {
  mapToStockDetailTypeDropdown(): IDropdown[] {
    const dropdownList = [] as IDropdown[];

    Object.entries(StockDetailTypeKey).forEach((value) => {
      dropdownList.push({ id: value[0], value: value[1] });
    });

    return dropdownList;
  }

  mapToTimeSeriesTypeDropdown(): IDropdown[] {
    const dropdownList = [] as IDropdown[];

    Object.entries(TimeSeriesTypeKey).forEach((value) => {
      dropdownList.push({ id: value[0], value: value[1] });
    });

    return dropdownList;
  }

  mapToSymbolDropdowns(symbols: IAlphaVantageSearchMatch[]): IDropdown[] {
    return symbols.map((symbol: IAlphaVantageSearchMatch) => {
      return {
        id: symbol.SYMBOL,
        value: symbol.NAME,
      } as IDropdown;
    });
  }

  createDefaultDropdown(): IDropdown {
    return {
      id: "",
      value: "",
    };
  }
}
