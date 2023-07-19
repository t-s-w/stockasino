import { StockInfoParser } from "./types";

const APIURL = "http://localhost:8000/api/";

const stockInfoParsers: StockInfoParser[] = [
  {
    name: "Previous Close",
    condition: (stockInfo) => !!stockInfo.previousClose,
    value: (stockInfo) => stockInfo.previousClose.toString(),
  },

  {
    name: "Day Range",
    condition: (stockInfo) => !!stockInfo.dayLow && !!stockInfo.dayHigh,
    value: (stockInfo) => `${stockInfo.dayLow} - ${stockInfo.dayHigh}`,
  },
];

export { APIURL, stockInfoParsers };
