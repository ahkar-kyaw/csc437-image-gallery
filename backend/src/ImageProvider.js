import { ObjectId } from "mongodb";
import { getEnvVar } from "./getEnvVar.js";

export class ImageProvider {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;

        const dbName = getEnvVar("DB_NAME");
        const imagesCollectionName = getEnvVar("IMAGES_COLLECTION_NAME");

        this.collection = this.mongoClient.db(dbName).collection(imagesCollectionName);
    }

    getAllImages() {
        return this.collection.find().toArray();
    }

    getAllImagesDenormalized() {
        const usersCollectionName = getEnvVar("USERS_COLLECTION_NAME");

        const pipeline = [
        {
            $lookup: {
            from: usersCollectionName,
            localField: "authorId",
            foreignField: "username",
            as: "author",
            },
        },
        { $set: { author: { $first: "$author" } } },
        { $unset: ["authorId"] },
        ];

        return this.collection.aggregate(pipeline).toArray();
    }

    async getOneImage(imageId) {
        const usersCollectionName = getEnvVar("USERS_COLLECTION_NAME");

        const pipeline = [
        { $match: { _id: new ObjectId(imageId) } },
        {
            $lookup: {
            from: usersCollectionName,
            localField: "authorId",
            foreignField: "username",
            as: "author",
            },
        },
        { $set: { author: { $first: "$author" } } },
        { $unset: ["authorId"] },
        ];

        const results = await this.collection.aggregate(pipeline).toArray();
        return results[0] || null;
    }

    async updateImageName(imageId, newName) {
        const result = await this.collection.updateOne(
        { _id: new ObjectId(imageId) },
        { $set: { name: newName } }
        );
        return result.matchedCount;
    }

    async getImageAuthorId(imageId) {
        const doc = await this.collection.findOne(
        { _id: new ObjectId(imageId) },
        { projection: { authorId: 1 } }
        );
        return doc?.authorId ?? null;
    }
}