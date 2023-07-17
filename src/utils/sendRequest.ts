import { Token, TokenPair } from "./types";
import jwt_decode from 'jwt-decode'

export default async function sendRequest(url: string, method = "GET", payload : Object | null = null) {
    const options = { method } as RequestInit
    options.headers = new Headers()
    if (payload) {
        options.headers.set("Content-Type","application/json")
        options.body = JSON.stringify(payload)
    }
    const token = localStorage.getItem('tokens');
    if(token) {
        const {access} = JSON.parse(token) as TokenPair
        const accessToken = jwt_decode(access) as Token
        if(accessToken.exp * 1000 >= Date.now()) {
            options.headers.set("Authorization",`Bearer ${access}`)
        }
    }
    const res = await fetch(url, options);
    if (res.ok) return res.json();
    throw new Error(res.statusText);
}