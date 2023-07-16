import AuthContext from "../auth/AuthContext"
import { useContext } from "react"

export default function HomePage() {
    const { username } = useContext(AuthContext);
    return <h1>Hello, {username}</h1>
}