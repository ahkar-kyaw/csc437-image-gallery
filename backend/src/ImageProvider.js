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
        const dbName = getEnvVar("DB_NAME");
        const usersCollectionName = getEnvVar("USERS_COLLECTION_NAME");
        const users = this.mongoClient.db(dbName).collection(usersCollectionName);

        const image = await this.collection.findOne({ _id: new ObjectId(imageId) });
        if (!image) return null;

        const author = await users.findOne({ username: image.authorId });
        const { authorId, ...rest } = image;

        return { ...rest, author: author || null };
    }

    async updateImageName(imageId, newName) {
        const result = await this.collection.updateOne(
            { _id: new ObjectId(imageId) },
            { $set: { name: newName } }
        );

        return result.matchedCount;
    }
}