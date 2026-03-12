import express from "express";

import { getEnvVar } from "./getEnvVar.js";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";
import { SHARED_TEST } from "./shared/example.js";

import { connectMongo } from "./connectMongo.js";
import { ImageProvider } from "./ImageProvider.js";
import { CredentialsProvider } from "./CredentialsProvider.js";

import { registerImageRoutes } from "./routes/imageRoutes.js";
import { registerAuthRoutes } from "./routes/authRoutes.js";
import { verifyAuthToken } from "./routes/verifyAuthToken.js";

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const STATIC_DIR = getEnvVar("STATIC_DIR") || "public";

async function startServer() {
    const mongoClient = connectMongo();
    await mongoClient.connect();
    console.log("Mongo connected");

    const imageProvider = new ImageProvider(mongoClient);
    const credentialsProvider = new CredentialsProvider(mongoClient);

    const app = express();

    app.use(express.json());
    app.use(express.static(STATIC_DIR));

    app.get("/api/hello", (req, res) => {
        res.send("Hello, World " + SHARED_TEST);
        return;
    });

    registerAuthRoutes(app, credentialsProvider);

    app.use("/api/images", verifyAuthToken);
    registerImageRoutes(app, imageProvider);

    app.get(Object.values(VALID_ROUTES), (req, res) => {
        res.sendFile("index.html", { root: STATIC_DIR });
        return;
    });

    const server = app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}.`);
        console.log("CTRL+C to stop.");
    });

    process.on("SIGINT", async () => {
        console.log("Shutting down...");
        server.close();
        await mongoClient.close();
        process.exit(0);
    });
}

startServer().catch((err) => {
    console.error("Fatal startup error:", err);
    process.exit(1);
});