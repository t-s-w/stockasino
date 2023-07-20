import React from "react";
import { NumberSchema } from "yup";

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

export interface Token {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  username: string;
}

export interface FetchOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: {
    "Content-Type"?: string;
    Authorization?: string;
  };
  body?: Object;
}

export class ModelError extends Error {
  status: number;
  body: object;

  constructor(status: number, body: Record<string, string[]>) {
    let msg = undefined;
    for (let key in body) {
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
  body: object;

  constructor(status: number, body: object) {
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

export interface StockInfo {
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
}

export interface StockInfoParser {
  name: string;
  condition: (stockInfo: StockInfo) => boolean;
  value: (stockInfo: StockInfo) => string;
}

export interface Game {
  month: Date;
  currentBalance: number;
}

export interface User {
  username: string;
  id: number;
  game: Game;
}

export interface AuthContextType {
  login: (credentials: LoginInfo) => Promise<void>;
  logout: () => void;
  signup: (signupInfo: {
    username: string;
    password: string;
    email: string;
  }) => Promise<void>;
  setTokens: React.Dispatch<React.SetStateAction<TokenPair | null>>;
  setToken: React.Dispatch<React.SetStateAction<Token | null>>;
  tokens: TokenPair | null;
  user: User | null;
}
