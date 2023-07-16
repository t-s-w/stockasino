export interface LoginInfo {
    username: string,
    password: string
}

export interface LoginFormElement extends HTMLFormElement {
    username: HTMLInputElement
    password: HTMLInputElement
}

export interface TokenPair {
    access: string,
    refresh: string
}

export interface Token {
    token_type: string,
    exp: number,
    iat: number,
    jti: string,
    user_id: number,
    username: string
}