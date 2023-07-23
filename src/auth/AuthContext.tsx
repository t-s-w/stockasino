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
  return decoded as User;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const storage = localStorage.getItem("tokens");
  const storedTokens = parseNull(storage) as TokenPair | null;
  const [tokens, setTokens] = useState(storedTokens);
  const decoded = storedTokens ? jwt_decode(storedTokens.access) : null;
  const [user, setUser] = useState(
    storedTokens?.access ? parseUserInfo(storedTokens.access) : null
  );
  const [activeGame, setActiveGame] = useState();
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

  function updateAuthStates(tokens: TokenPair, delay: number = 0) {
    localStorage.setItem("tokens", JSON.stringify(tokens));
    setTokens(tokens);
    const parsedUser = parseUserInfo(tokens.access);
    setTimeout(() => setUser(parsedUser), delay);
    updateGame();
  }

  async function login(credentials: LoginInfo) {
    credentials.username = credentials.username.toLowerCase();
    try {
      const responseJSON = await sendRequest(
        APIURL + "auth/login",
        "POST",
        credentials
      );
      const tokens = responseJSON as TokenPair;
      updateAuthStates(tokens, 1500);
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
      updateAuthStates(tokens);
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
      updateAuthStates(tokens, 1000);
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
    navigate("/");
  }

  function updateGame() {
    try {
      sendRequest(APIURL + "games/update")
        .then((x) =>
          setActiveGame({
            month: new Date(x.month),
            currentBalance: parseFloat(x.currentBalance),
            id: x.id,
          })
        )
        .catch(console.log);
    } catch (err) {
      if (err instanceof APIError) {
        throw new Error(err.body.detail);
      } else {
        console.log(err);
      }
    }
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
    updateGame,
    activeGame,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}
