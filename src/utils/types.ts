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