import AuthContext from "../auth/AuthContext";
import { useContext } from "react";

import { Link } from "react-router-dom";
import sendRequest from "../utils/sendRequest";
import { APIURL } from "../utils/constants";

export default function HomePage() {
  const { user, logout } = useContext(AuthContext);
  return user ? (
    <>
      <h1>Hello, {user.username}</h1>
      <Link to="" onClick={logout}>
        Log out
      </Link>
    </>
  ) : null;
}
