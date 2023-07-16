import React, { useContext } from "react"
import AuthContext from "../auth/AuthContext"
import { LoginFormElement, LoginInfo } from "../utils/types";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)

    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        const form = evt.target as LoginFormElement
        const credentials = {
            username: form.username.value,
            password: form.password.value
        } as LoginInfo
        try {
            await login(credentials)
            navigate('/')
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(err.message)
            }
        }
    }

    return <form onSubmit={(evt) => void handleSubmit(evt)}>
        <fieldset>
            <input name="username" type="text" />
            <input name="password" type="password" />
            <button>Log in!</button>
        </fieldset>
    </form>
}