import { useEffect, useState } from "react";
import { ImageGrid } from "./ImageGrid.jsx";

export function AllImages({ authToken }) {
    const [imageData, setImageData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function doFetch() {
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/images", {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (!response.ok) {
                throw new Error(`Error: HTTP ${response.status} ${response.statusText}`);
            }

            const images = await response.json();
            setImageData(images);
        } catch (err) {
            setError(String(err?.message ?? err));
        } finally {
            setIsLoading(false);
        }
        }

        doFetch();
    }, [authToken]);

    return (
        <>
            <h2>All Images</h2>

            {isLoading && <p>Loading...</p>}
            {error !== "" && <p>{error}</p>}
            {!isLoading && error === "" && <ImageGrid images={imageData} />}
        </>
    );
}