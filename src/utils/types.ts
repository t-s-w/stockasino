import React from "react";
import StockHoldings from "./Holdings";

// Auth related types

export interface AuthContextType {
  login: (credentials: LoginInfo) => Promise<void>;
  logout: () => void;
  signup: (signupInfo: {
    username: string;
    password: string;
    email: string;
  }) => Promise<void>;
  setTokens: React.Dispatch<React.SetStateAction<TokenPair | null>>;
  tokens: TokenPair | null;
  user: User | null;
  refresh: (refresh: string) => Promise<void>;
  updateGame: () => void;
  activeGame: Game | undefined;
}

export interface User {
  username: string;
}

export interface LoginInfo {
  username: string;
  password: string;
}

export interface LoginFormElement extends HTMLFormElement {
  username: HTMLInputElement;
  password: HTMLInputElement;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface Token extends User {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
}

// Fetch related types

export interface FetchOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: {
    "Content-Type"?: string;
    Authorization?: string;
  };
  body?: object;
}

export class ModelError extends Error {
  status: number;
  body: object;

  constructor(status: number, body: Record<string, string[]>) {
    let msg = undefined;
    for (const key in body) {
      msg = body[key][0];
      break;
    }
    super(msg);
    this.body = body;
    this.status = status;
  }
}

export class APIError extends Error {
  status: number;
  body: Record<string, string | string[]>;

  constructor(status: number, body: Record<string, string | string[]>) {
    super();
    this.body = body;
    this.status = status;
  }
}

export class LoginError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export interface PriceHistoryMetadata {
  interval?: string;
}

export interface PriceHistoryFetchResult {
  metadata: PriceHistoryMetadata;
  data: StockPriceDataPoint[];
}

// Model related types

export interface StockInformation {
  previousClose: number;
  dayLow: number;
  dayHigh: number;
  open: number;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  volume: number;
  averageVolume: number;
  marketCap: number;
  beta: number;
  trailingPE: number;
  trailingEps: number;
  dividendRate: number;
  dividendYield: number;
  currentPrice: number;
  exDividendDate: number;
  targetMeanPrice: number;
  symbol: string;
  longName: string;
}

export interface StockPriceDataPoint {
  Datetime: Date;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
  Dividends: number;
  "Stock Splits": number;
}

export interface StockInfoParser {
  name: string;
  condition: (stockInfo: StockInformation) => boolean;
  value: (stockInfo: StockInformation) => string;
}

export interface APIReturnGame {
  value?: number;
  starting?: number;
  month: string;
  currentBalance: string;
  id: number;
  ended?: boolean;
  portfolio?: Record<string, StockHoldings>;
}

export interface Game {
  value?: number;
  starting?: number;
  month: Date;
  currentBalance: number;
  id: number;
  user?: string | number;
  ended?: boolean;
  portfolio?: Record<string, StockHoldings>;
}

export interface Transaction {
  id?: number;
  game_id?: number;
  game: number;
  ticker: string;
  quantity: number;
  unitprice: number;
  created: Date;
  type: "NEW" | "BUY" | "SELL";
}

export interface Quote {
  industry?: string;
  exchDisp: string;
  index: string;
  symbol: string;
  quoteType: string;
  longname: string;
  shortname: string;
  exchange: string;
  sector?: string;
}
