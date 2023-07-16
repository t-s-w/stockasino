import AuthContext from "../auth/AuthContext"
import { useContext } from "react"
import PrivateRoute from "../auth/PrivateRoute";
import { Link } from "react-router-dom";

export default function HomePage() {
    const { user, logout } = useContext(AuthContext);
    return <>
        <PrivateRoute />
        <h1>Hello, {user?.username}</h1>
        <Link to="" onClick={logout}>Log out</Link>
    </>
}