import bcrypt from "bcrypt";
import { getEnvVar } from "./getEnvVar.js";

export class CredentialsProvider {
    constructor(mongoClient) {
        const dbName = getEnvVar("DB_NAME");
        const usersCollectionName = getEnvVar("USERS_COLLECTION_NAME");
        const credsCollectionName = getEnvVar("CREDS_COLLECTION_NAME");

        const db = mongoClient.db(dbName);
        this.usersCollection = db.collection(usersCollectionName);
        this.credsCollection = db.collection(credsCollectionName);
    }

    async registerUser(username, email, password) {
        const existingCreds = await this.credsCollection.findOne({ username });
        if (existingCreds) return false;

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        await this.credsCollection.insertOne({
            username,
            password: hashed,
        });

        const existingUser = await this.usersCollection.findOne({ username });
        if (!existingUser) {
            await this.usersCollection.insertOne({ 
                username, 
                email 
            });
        }

        return true;
    }

    async verifyPassword(username, plaintextPassword) {
        const creds = await this.credsCollection.findOne({ username });
        if (!creds) return false;
        return await bcrypt.compare(plaintextPassword, creds.password);
    }
}