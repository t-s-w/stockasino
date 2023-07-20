import { createContext, useState, useEffect } from "react";
import {
  APIError,
  AuthContextType,
  LoginError,
  LoginInfo,
  ModelError,
  Token,
  TokenPair,
  User,
} from "../utils/types";
import { APIURL } from "../utils/constants";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import sendRequest from "../utils/sendRequest";

const AuthContext = createContext({} as AuthContextType);

export default AuthContext;

function parseNull(jsonString: string | null) {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

function parseUserInfo(accessToken: string) {
  if (!accessToken) return null;
  const decoded = jwt_decode(accessToken);
  if (!decoded) return null;
  if (decoded.game && decoded.game.month && decoded.game.currentBalance) {
    decoded.game.month = new Date(decoded.game?.month);
    decoded.game.currentBalance = parseFloat(decoded.game.currentBalance);
  } else {
    decoded.game = undefined;
  }
  return decoded as User;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const storage = localStorage.getItem("tokens");
  const storedTokens = parseNull(storage) as TokenPair | null;
  const [tokens, setTokens] = useState(storedTokens);
  const decoded = storedTokens
    ? (jwt_decode(storedTokens.access) as Token)
    : null;
  const userInfo = parseUserInfo(storedTokens?.access);
  const [user, setUser] = useState(userInfo);
  const expired = decoded?.exp
    ? decoded.exp * 1000 < new Date().valueOf()
    : false;

  useEffect(() => {
    if (expired) {
      try {
        refresh(storedTokens.refresh).catch(logout);
      } catch {
        logout();
      }
    }
  }, []);

  async function login(credentials: LoginInfo) {
    credentials.username = credentials.username.toLowerCase();
    try {
      const responseJSON = await sendRequest(
        APIURL + "auth/login",
        "POST",
        credentials
      );
      const tokens = responseJSON as TokenPair;
      localStorage.setItem("tokens", JSON.stringify(tokens));
      setTokens(tokens);
      const user = parseUserInfo(tokens.access) as Token;
      setTimeout(() => setUser(user), 2000);
    } catch (err) {
      if (err instanceof APIError) {
        throw new LoginError(err.body.detail);
      }
    }
  }

  async function refresh(refresh: string) {
    try {
      const responseJSON = await sendRequest(APIURL + "auth/refresh", "POST", {
        refresh,
      });
      const tokens = responseJSON as TokenPair;
      localStorage.setItem("tokens", JSON.stringify(tokens));
      setTokens(tokens);
      const user = parseUserInfo(tokens.access) as Token;
      setUser(user);
    } catch (err) {
      if (err instanceof APIError) {
        throw new Error(err.body.detail);
      }
    }
  }

  async function signup(signupInfo: {
    username: string;
    email: string;
    password: string;
  }) {
    signupInfo.username = signupInfo.username.toLowerCase();
    try {
      const responseJSON = await sendRequest(
        APIURL + "auth/signup",
        "POST",
        signupInfo
      );
      const tokens = responseJSON as TokenPair;
      localStorage.setItem("tokens", JSON.stringify(tokens));
      setTokens(tokens);
      const user = jwt_decode(tokens.access) as Token;
      setTimeout(() => setUser(user), 1000);
    } catch (err) {
      if (err instanceof APIError) {
        throw new ModelError(err.status, err.body);
      } else {
        console.log(err);
      }
    }
  }

  function logout() {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("tokens");
    navigate("/login");
  }

  const contextData = {
    user,
    setUser,
    tokens,
    setTokens,
    login,
    logout,
    signup,
    refresh,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}
