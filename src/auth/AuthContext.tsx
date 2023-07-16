import { createContext, useState, useEffect } from "react";
import { LoginInfo, TokenPair } from "../utils/types";
import { APIURL } from "../utils/constants";
import jwt_decode from 'jwt-decode';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export default AuthContext



export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const storage = localStorage.getItem('tokens')
    const storedTokens = storage ? JSON.parse(storage) as TokenPair : null
    const [authTokens, setAuthTokens] = useState(storedTokens)
    const decoded = storedTokens.access ? jwt_decode(storedTokens.access) : null
    const [user, setUser] = useState(decoded)

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
            const tokens = data as TokenPair
            localStorage.setItem('tokens', JSON.stringify(tokens))
            setAuthTokens(tokens)
            const user = jwt_decode(tokens.access)
            setUser(user)
        }
        else if (response.status === 401) {
            throw Error("Invalid credentials!")
        }
    }

    function logout() {
        setUser(null)
        setAuthTokens(null)
        localStorage.removeItem('authTokens')
        navigate('/')
    }

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        login,
        logout
    }

    return <AuthContext.Provider value={contextData}>
        {children}
    </AuthContext.Provider>
}