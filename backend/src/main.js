import express from "express";
import { getEnvVar } from "./getEnvVar.js";
import { connectMongo } from "./connectMongo.js";
import { ImageProvider } from "./ImageProvider.js";
import { registerImageRoutes } from "./routes/imageRoutes.js";

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const STATIC_DIR = getEnvVar("STATIC_DIR") || "public";

async function startServer() {
    const mongoClient = connectMongo();
    await mongoClient.connect();

    const imageProvider = new ImageProvider(mongoClient);

    const app = express();
    app.use(express.json());
    app.use(express.static(STATIC_DIR));

    registerImageRoutes(app, imageProvider);

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

startServer().catch((err) => {
    console.error(err);
    process.exit(1);
});