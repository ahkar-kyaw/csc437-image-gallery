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

        const pipeline = [];

        pipeline.push({
            $lookup: {
            from: usersCollectionName,
            localField: "authorId",
            foreignField: "username",
            as: "author",
            },
        });

        pipeline.push({
            $set: { author: { $first: "$author" } },
        });

        pipeline.push({
            $unset: ["authorId"],
        });

        return this.collection.aggregate(pipeline).toArray();
    }
}