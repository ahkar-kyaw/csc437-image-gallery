import { ObjectId } from "mongodb";

const MAX_NAME_LENGTH = 100;

function waitDuration(numMs) {
  return new Promise((resolve) => setTimeout(resolve, numMs));
}

export function registerImageRoutes(app, imageProvider) {
    app.get("/api/images", async (req, res) => {
        try {
            await waitDuration(1000);
            const images = await imageProvider.getAllImagesDenormalized();
            res.json(images);
            return;
        } catch (err) {
            console.error(err);
            res.status(500).send();
            return;
        }
    });

    app.get("/api/images/:imageId", async (req, res) => {
        const { imageId } = req.params;

        if (!ObjectId.isValid(imageId)) {
            res.status(404).send({ error: "Not Found", message: "No image with that ID" });
            return;
        }

        try {
            const image = await imageProvider.getOneImage(imageId);

            if (!image) {
                res.status(404).send({ error: "Not Found", message: "No image with that ID" });
                return;
            }

            res.json(image);
            return;
        } catch (err) {
            console.error(err);
            res.status(500).send();
            return;
        }
    });

    app.patch("/api/images/:imageId", async (req, res) => {
        const { imageId } = req.params;

        if (!ObjectId.isValid(imageId)) {
            res.status(404).send({ error: "Not Found", message: "Image does not exist" });
            return;
        }

        const newName = req.body?.name;

        if (typeof newName !== "string") {
            res.status(400).send({
                error: "Bad Request",
                message: "Body must be JSON with a string field named name",
            });
            return;
        }

        if (newName.length > MAX_NAME_LENGTH) {
            res.status(413).send({
                error: "Content Too Large",
                message: `Image name exceeds ${MAX_NAME_LENGTH} characters`,
            });
            return;
        }

        try {
            const matchedCount = await imageProvider.updateImageName(imageId, newName);

            if (matchedCount === 0) {
                res.status(404).send({ error: "Not Found", message: "Image does not exist" });
                return;
            }

            res.status(204).send();
            return;
        } catch (err) {
            console.error(err);
            res.status(500).send();
            return;
        }
    });
}