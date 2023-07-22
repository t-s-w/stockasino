import { Transaction } from "./types";

export default interface StockHoldings {
  ticker: string;
  holdings: {
    unitprice: number;
    quantity: number;
  }[];
  qtyOwned: number;
  totalCost: number;
  currentPrice: number;
  transactionHistory: Transaction[];
}
