import React, { useContext } from "react"
import AuthContext from "../auth/AuthContext"
import { LoginFormElement, LoginInfo } from "../utils/types";

export default function Login() {
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