import { createContext, useState, useEffect } from "react";
import { PropsWithChildren } from "react";
import {
  APIError,
  APIReturnGame,
  AuthContextType,
  LoginError,
  LoginInfo,
  ModelError,
  Token,
  TokenPair,
  User,
  Game,
} from "../utils/types";
import { APIURL } from "../utils/constants";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import sendRequest from "../utils/sendRequest";
import { parseGameInfo } from "../utils/functions";

const AuthContext = createContext({} as AuthContextType);

export default AuthContext;

function parseNull(jsonString: string | null) {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString) as object;
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

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const storage = localStorage.getItem("tokens");
  const storedTokens = parseNull(storage) as TokenPair | null;
  const [tokens, setTokens] = useState(storedTokens);
  const decoded = storedTokens
    ? (jwt_decode<JwtPayload>(storedTokens.access) as Token)
    : null;
  const [user, setUser] = useState(
    storedTokens?.access ? parseUserInfo(storedTokens.access) : null
  );
  const [activeGame, setActiveGame] = useState(undefined as Game | undefined);
  const expired = decoded?.exp
    ? decoded.exp * 1000 < new Date().valueOf()
    : false;

  useEffect(() => {
    if (expired && storedTokens) {
      try {
        refresh(storedTokens.refresh).catch(logout);
      } catch {
        logout();
      }
    }
  }, []);

  function updateAuthStates(tokens: TokenPair, delay = 0) {
    localStorage.setItem("tokens", JSON.stringify(tokens));
    setTokens(tokens);
    const parsedUser = parseUserInfo(tokens.access);
    setTimeout(() => setUser(parsedUser), delay);
    updateGame();
  }

  async function login(credentials: LoginInfo) {
    credentials.username = credentials.username.toLowerCase();
    try {
      const responseJSON = await sendRequest<TokenPair>(
        APIURL + "auth/login",
        "POST",
        credentials
      );
      updateAuthStates(responseJSON, 1500);
    } catch (err) {
      if (err instanceof APIError) {
        throw new LoginError(err.message);
      } else if (err instanceof ModelError) {
        throw new LoginError(err.message);
      }
    }
  }

  async function refresh(refresh: string) {
    try {
      const responseJSON = await sendRequest<TokenPair>(
        APIURL + "auth/refresh",
        "POST",
        {
          refresh,
        }
      );
      updateAuthStates(responseJSON);
    } catch (err) {
      if (err instanceof APIError) {
        throw new Error(err.message);
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
      const responseJSON = await sendRequest<TokenPair>(
        APIURL + "auth/signup",
        "POST",
        signupInfo
      );
      updateAuthStates(responseJSON, 1000);
    } catch (err) {
      if (err instanceof ModelError) {
        throw err;
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

  async function fetchGameInfo() {
    const response = await sendRequest<APIReturnGame>(APIURL + "games/update");
    return response;
  }

  function updateGame() {
    try {
      fetchGameInfo()
        .then(function (x) {
          setActiveGame(parseGameInfo(x));
        })

        .catch(() => setActiveGame(undefined));
    } catch (err) {
      if (err instanceof APIError) {
        throw new Error(err.message);
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
