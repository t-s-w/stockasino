import { APIError, ModelError, TokenPair } from "./types";
import jwt_decode, { JwtPayload } from "jwt-decode";

export default async function sendRequest(
  url: string,
  method = "GET",
  payload: object | null = null
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
      const accessToken = jwt_decode<JwtPayload>(access);
      if (accessToken.exp && accessToken.exp * 1000 >= Date.now()) {
        options.headers.set("Authorization", `Bearer ${access}`);
      }
    } catch (err) {
      console.log(err);
    }
  }
  const res = await fetch(url, options);
  const resBody = (await res.json()) as object;
  if (res.ok) return resBody;
  if ("detail" in resBody && typeof resBody.detail === "string") {
    // @ts-expect-error: resBody.detail is expected to be "unknown" for some reason even though the above was asserted
    throw new APIError(res.status, resBody);
  }
  // @ts-expect-error: resBody.detail is expected to be "unknown" for some reason even though the above was asserted
  throw new ModelError(res.status, resBody);
}
