import { Transaction } from "./types";

class StockHoldings {
  ticker: string;
  holdings: {
    priceBought: number;
    quantity: number;
  }[];
  qtyOwned: number;
  totalCost: number;

  constructor(ticker: string) {
    this.ticker = ticker;
    this.holdings = [];
    this.qtyOwned = 0;
    this.totalCost = 0;
  }

  addTransaction(transaction: Transaction) {
    if (transaction.type == "SELL") {
      let toSell = transaction.quantity;
      if (toSell > this.qtyOwned)
        throw new Error("Insufficient holdings to sell");
      while (toSell) {
        if (this.holdings.length === 0)
          throw new Error("Insufficient holdings to sell");
        const firstIn = this.holdings.shift();
        if (firstIn) {
          if (firstIn.quantity < toSell) {
            this.qtyOwned -= firstIn.quantity;
            this.totalCost -= firstIn.quantity * firstIn.priceBought;
            toSell -= firstIn.quantity;
          } else {
            this.qtyOwned -= toSell;
            this.totalCost -= toSell * firstIn.priceBought;
            firstIn.quantity -= toSell;
            toSell = 0;
            if (firstIn.quantity > 0) {
              this.holdings.unshift(firstIn);
            }
          }
        }
      }
    } else if (transaction.type == "BUY") {
      this.holdings.push({
        priceBought: transaction.unitprice,
        quantity: transaction.quantity,
      });
      this.qtyOwned += transaction.quantity;
      this.totalCost += transaction.quantity * transaction.unitprice;
    }
  }

  avgCost() {
    return Number(
      Math.round(
        (this.totalCost / this.qtyOwned).toString() + "e2"
      ).toString() + "e-2"
    );
  }
}

export default class Holdings {
  cash: number;
  portfolio: Record<string, StockHoldings>;
  constructor(transactions: Transaction[]) {
    this.cash = 0;
    this.portfolio = {};
    transactions.forEach((transaction) => {
      if (transaction.type === "NEW") {
        this.cash += transaction.unitprice;
      } else {
        if (!this.portfolio[transaction.ticker]) {
          this.portfolio[transaction.ticker] = new StockHoldings(
            transaction.ticker
          );
        }
        this.portfolio[transaction.ticker].addTransaction(transaction);
      }
    });
  }
}
