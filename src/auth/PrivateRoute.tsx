import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./AuthContext";

export default function PrivateRoute() {
    const { user } = useContext(AuthContext)
    return user ? null : <Navigate to="/login" />
}