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
    const decoded = storedTokens ? jwt_decode(storedTokens.access) as Token | null : null
    const [user, setUser] = useState(decoded);
    const expired = decoded?.exp ? decoded.exp * 1000 < (new Date()).valueOf() : false

    useEffect(
        () => {
            if(expired) {
            try {
                refresh(storedTokens.refresh).catch(logout)
            } catch{
                logout()
            }
        }
    }
    ,[])


    async function login(credentials: LoginInfo) {
        try {
            const responseJSON = await sendRequest(APIURL + 'auth/login', 'POST', credentials)
            const tokens = responseJSON as TokenPair
            localStorage.setItem('tokens', JSON.stringify(tokens))
            setTokens(tokens)
            const user = jwt_decode(tokens.access)
            setUser(user)
        }
        catch (err) {
            if (err instanceof Error) {
                throw new Error(err.message)
            }
        }
    }

    async function refresh(refresh: string) {
        try {
            const responseJSON = await sendRequest(APIURL + 'auth/refresh', 'POST', {refresh})
            const tokens = responseJSON as TokenPair
            localStorage.setItem('tokens',JSON.stringify(tokens))
            setTokens(tokens)
            const user = jwt_decode(tokens.access)
            setUser(user)
        }
        catch(err) {
            if (err instanceof Error) {
                throw new Error(err.message)
            }
        }
    }

    function logout() {
        setUser(null)
        setTokens(null)
        localStorage.removeItem('tokens')
        navigate('/login')
    }

    const contextData = {
        user,
        setUser,
        tokens,
        setTokens,
        login,
        logout
    }

    return <AuthContext.Provider value={contextData}>
        {children}
    </AuthContext.Provider>
}