import React, { useActionState } from "react";
import { Link } from "react-router";
import "./LoginPage.css";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";

export function LoginPage({ isRegistering, onAuthToken }) {
    const usernameInputId = React.useId();
    const emailInputId = React.useId();
    const passwordInputId = React.useId();

    async function handleSubmit(prevResult, formData) {
        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");

        if (typeof username !== "string" || typeof password !== "string") {
            return "Missing username or password";
        }

        if (isRegistering) {
            if (typeof email !== "string" || email.length === 0) {
                return "Missing username, email, or password";
            }

            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            if (res.status === 409) {
                return "Username already taken";
            }

            if (res.status === 400) {
                return "Missing username, email, or password";
            }

            if (!res.ok) {
                return `Error: HTTP ${res.status} ${res.statusText}`;
            }

            const data = await res.json();
            const token = data?.token;

            if (typeof token !== "string") {
                return "Registration succeeded but no token was returned";
            }

            console.log("Successfully created account");
            onAuthToken(token);
            return "";
        }

        const res = await fetch("/api/auth/tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (res.status === 401) {
            return "Incorrect username or password";
        }

        if (res.status === 400) {
            return "Missing username or password";
        }

        if (!res.ok) {
            return `Error: HTTP ${res.status} ${res.statusText}`;
        }

        const data = await res.json();
        const token = data?.token;

        if (typeof token !== "string") {
            return "Login succeeded but no token was returned";
        }

        console.log(token);
        onAuthToken(token);
        return "";
    }

    const [result, formAction, isPending] = useActionState(handleSubmit, "");

    return (
        <>
            <h2>{isRegistering ? "Register a new account" : "Login"}</h2>

            <div aria-live="polite">{result !== "" && <p>{result}</p>}</div>

            <form className="LoginPage-form" action={formAction}>
                <label htmlFor={usernameInputId}>Username</label>
                <input id={usernameInputId} name="username" required disabled={isPending} />

                {isRegistering && (
                <>
                    <label htmlFor={emailInputId}>Email</label>
                    <input id={emailInputId} name="email" required disabled={isPending} />
                </>
                )}

                <label htmlFor={passwordInputId}>Password</label>
                <input
                id={passwordInputId}
                name="password"
                type="password"
                required
                disabled={isPending}
                />

                <input type="submit" value="Submit" disabled={isPending} />
            </form>

            {isRegistering ? (
                    <p>
                    Already have an account? <Link to={VALID_ROUTES.LOGIN}>Login here</Link>
                    </p>
                ) : (
                    <p>
                    Do not have an account? <Link to={VALID_ROUTES.REGISTER}>Register here</Link>
                    </p>
            )}
        </>
    );
}