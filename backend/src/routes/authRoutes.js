import jwt from "jsonwebtoken";
import { getEnvVar } from "../getEnvVar.js";

function generateAuthToken(username) {
    return new Promise((resolve, reject) => {
        jwt.sign(
        { username },
        getEnvVar("JWT_SECRET"),
        { expiresIn: "1d" },
        (error, token) => {
            if (error) reject(error);
            else resolve(token);
        }
        );
    });
}

export function registerAuthRoutes(app, credentialsProvider) {
    app.post("/api/users", async (req, res) => {
        const username = req.body?.username;
        const email = req.body?.email;
        const password = req.body?.password;

        if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
        res.status(400).send({
            error: "Bad request",
            message: "Missing username, email, or password",
        });
        return;
        }

        try {
        const ok = await credentialsProvider.registerUser(username, email, password);

        if (!ok) {
            res.status(409).send({
            error: "Conflict",
            message: "Username already taken",
            });
            return;
        }

        res.status(201).end();
        return;
        } catch (err) {
        console.error(err);
        res.status(500).end();
        return;
        }
    });

    app.post("/api/auth/tokens", async (req, res) => {
        const username = req.body?.username;
        const password = req.body?.password;

        if (typeof username !== "string" || typeof password !== "string") {
        res.status(400).send({
            error: "Bad request",
            message: "Missing username or password",
        });
        return;
        }

        try {
        const ok = await credentialsProvider.verifyPassword(username, password);

        if (!ok) {
            res.status(401).end();
            return;
        }

        const token = await generateAuthToken(username);
        res.status(200).json({ token });
        return;
        } catch (err) {
        console.error(err);
        res.status(500).end();
        return;
        }
    });
}