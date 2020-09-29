export interface IStockTimeSeriesMetadata {
  Information: string;
  Symbol: string; // TODO - convert to type so user can choose from multiple. default example is IBM
  LastRefreshed: string;
  TimeZone: string; // TODO - convert to type of timezone (depends which library for timezones will you use. ask if it is needed)
}
