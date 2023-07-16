import AuthContext from "../auth/AuthContext"
import { useContext } from "react"
import PrivateRoute from "../auth/PrivateRoute";

export default function HomePage() {
    const { user } = useContext(AuthContext);
    return <>
        <PrivateRoute />
        <h1>Hello, {user}</h1>
    </>
}