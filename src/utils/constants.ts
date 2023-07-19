import { StockInfoParser } from "./types";

const APIURL = "http://localhost:8000/api/";

function twoDp(num: number) {
  return Number(Math.round(num * 100).toString() + "e-2").toFixed(2);
}

const stockInfoParsers: StockInfoParser[] = [
  {
    name: "Previous Close",
    condition: (stockInfo) => !!stockInfo.previousClose,
    value: (stockInfo) => stockInfo.previousClose.toString(),
  },
  {
    name: "Open",
    condition: (stockInfo) => !!stockInfo.open,
    value: (stockInfo) => stockInfo.open.toString(),
  },
  {
    name: "Bid",
    condition: (stockInfo) => !!stockInfo.bid && !!stockInfo.bidSize,
    value: (stockInfo) => `${stockInfo.bid} × ${stockInfo.bidSize}`,
  },
  {
    name: "Ask",
    condition: (stockInfo) => !!stockInfo.ask && !!stockInfo.askSize,
    value: (stockInfo) => `${stockInfo.ask} × ${stockInfo.askSize}`,
  },
  {
    name: "Day Range",
    condition: (stockInfo) => !!stockInfo.dayLow && !!stockInfo.dayHigh,
    value: (stockInfo) => `${stockInfo.dayLow} - ${stockInfo.dayHigh}`,
  },
  {
    name: "52 Week Range",
    condition: (stockInfo) =>
      !!stockInfo.fiftyTwoWeekLow && !!stockInfo.fiftyTwoWeekHigh,
    value: (stockInfo) =>
      `${stockInfo.fiftyTwoWeekLow} - ${stockInfo.fiftyTwoWeekHigh}`,
  },
  {
    name: "Volume",
    condition: (stockInfo) => !!stockInfo.volume,
    value: (stockInfo) => stockInfo.volume.toLocaleString(),
  },
  {
    name: "Average Volume",
    condition: (stockInfo) => !!stockInfo.averageVolume,
    value: (stockInfo) => stockInfo.averageVolume.toLocaleString(),
  },
  {
    name: "Market Cap",
    condition: (stockInfo) => !!stockInfo.marketCap,
    value: (stockInfo) =>
      "$" + Math.round(stockInfo.marketCap / 1000000).toLocaleString() + "M",
  },
  {
    name: "Beta (5Y Monthly)",
    condition: (stockInfo) => !!stockInfo.beta,
    value: (stockInfo) => twoDp(stockInfo.beta),
  },
  {
    name: "PE Ratio (Trailing 12M)",
    condition: (stockInfo) => !!stockInfo.trailingPE,
    value: (stockInfo) => twoDp(stockInfo.trailingPE),
  },
  {
    name: "EPS (Trailing 12M)",
    condition: (stockInfo) => !!stockInfo.trailingEps,
    value: (stockInfo) => twoDp(stockInfo.trailingPE),
  },
  {
    name: "Forward Dividend & Yield",
    condition: (stockInfo) =>
      !!stockInfo.dividendRate && !!stockInfo.dividendYield,
    value: (stockInfo) =>
      `${twoDp(stockInfo.dividendRate)} (${twoDp(
        stockInfo.dividendYield * 100
      )}%)`,
  },
  {
    name: "Ex-Dividend Date",
    condition: (stockInfo) => !!stockInfo.exDividendDate,
    value: (stockInfo) =>
      new Date(stockInfo.exDividendDate * 1000).toLocaleDateString(undefined, {
        year: "numeric",
        day: "numeric",
        month: "long",
      }),
  },
  {
    name: "1 Year Target",
    condition: (stockInfo) => !!stockInfo.targetMeanPrice,
    value: (stockInfo) => twoDp(stockInfo.targetMeanPrice),
  },
];

export { APIURL, stockInfoParsers };
