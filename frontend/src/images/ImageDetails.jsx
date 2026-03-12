import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ImageNameEditor } from "./ImageNameEditor.jsx";

export function ImageDetails({ authToken }) {
    const { imageId } = useParams();

    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function doFetch() {
            setIsLoading(true);
            setError("");
            setImage(null);

            try {
                const response = await fetch(`/api/images/${imageId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                if (response.status === 404) {
                    setImage(null);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Error: HTTP ${response.status} ${response.statusText}`);
                }

                const oneImage = await response.json();
                setImage(oneImage);
            } catch (err) {
                setError(String(err?.message ?? err));
            } finally {
                setIsLoading(false);
            }
        }

        doFetch();
    }, [imageId, authToken]);

    if (isLoading) return <p>Loading...</p>;
    if (error !== "") return <p>{error}</p>;
    if (!image) return <h2>Image not found</h2>;

    return (
        <>
            <h2>{image.name}</h2>
            <p>By {image.author?.username ?? "Unknown"}</p>

            <ImageNameEditor
                authToken={authToken}
                imageId={imageId}
                initialValue={image.name}
                onNameUpdated={(newName) =>
                setImage((prev) => (prev ? { ...prev, name: newName } : prev))
                }
            />

            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </>
    );
}