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
