import { createContext, useState, useEffect } from "react";
import { LoginInfo, Token, TokenPair } from "../utils/types";
import { APIURL } from "../utils/constants";
import jwt_decode from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import sendRequest from "../utils/sendRequest";

const AuthContext = createContext({});

export default AuthContext

function parseNull(jsonString: string | null) {
    if (!jsonString) return null
    try {
        return JSON.parse(jsonString)
    }
    catch {
        return null
    }
}


export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const storage = localStorage.getItem('tokens')
    const storedTokens = parseNull(storage) as TokenPair | null
    const [tokens, setTokens] = useState(storedTokens)
    const decoded = tokens ? parseNull(tokens.access) as Token | null : null
    const [user, setUser] = useState(decoded);

    async function login(credentials: LoginInfo) {
        try {
            const responseJSON = await sendRequest(APIURL + 'auth/login', 'POST', credentials)
            const tokens = responseJSON as TokenPair
            localStorage.setItem('tokens', JSON.stringify(tokens))
            setAuthTokens(tokens)
            const user = jwt_decode(tokens.access)
            setUser(user)
        }
        catch (err) {
            if (err instanceof Error) {
                throw new Error(err.message)
            }
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