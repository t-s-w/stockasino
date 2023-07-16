import AuthContext from "../auth/AuthContext"
import { useContext } from "react"

export default function HomePage() {
    const { user } = useContext(AuthContext);
    return <h1>Hello, {user}</h1>
}