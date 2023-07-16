import { createContext, useState, useEffect } from "react";
import { LoginInfo, TokenPair } from "../utils/types";
import { APIURL } from "../utils/constants";

const AuthContext = createContext({});

export default AuthContext



export function AuthProvider({ children }) {

    const [user, setUser] = useState('')
    const [authTokens, setAuthTokens] = useState({} as TokenPair)

    async function login(credentials: LoginInfo) {
        const response = await fetch(APIURL + "api/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: credentials.username, password: credentials.password })
        })
        if (response.ok) {
            const data = await response.json()
            console.log(data)
        }
        else if (response.status === 401) {
            throw Error("Invalid credentials!")
        }
    }

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        login
    }

    return <AuthContext.Provider value={contextData}>
        {children}
    </AuthContext.Provider>
}