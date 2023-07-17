import { APIError, Token, TokenPair } from "./types";
import jwt_decode from "jwt-decode";

export default async function sendRequest(
  url: string,
  method = "GET",
  payload: Object | null = null
) {
  const options = { method } as RequestInit;
  options.headers = new Headers();
  if (payload) {
    options.headers.set("Content-Type", "application/json");
    options.body = JSON.stringify(payload);
  }
  const token = localStorage.getItem("tokens");
  if (token) {
    try {
      const { access } = JSON.parse(token) as TokenPair;
      const accessToken = jwt_decode(access) as Token;
      if (accessToken.exp * 1000 >= Date.now()) {
        options.headers.set("Authorization", `Bearer ${access}`);
      }
    } catch {}
  }
  const res = await fetch(url, options);
  const resBody = await res.json();
  if (res.ok) return resBody;
  throw new APIError(res.status, resBody);
}
