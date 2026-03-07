import { useEffect, useState } from "react";

import { ImageGrid } from "./ImageGrid.jsx";

export function AllImages() {
    const [imageData, setImageData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function doFetch() {
            try {
                const response = await fetch("/api/images");
                if (!response.ok) {
                    throw new Error(`Error: HTTP ${response.status} ${response.statusText}`);
                }

                const images = await response.json();
                setImageData(images);
                setError("");
            } catch (err) {
                setError(String(err?.message ?? err));
            } finally {
                setIsLoading(false);
            }
        }

        doFetch();
    }, []);

    return (
        <>
            <h2>All Images</h2>

            {isLoading && <p>Loading...</p>}
            {error !== "" && <p>{error}</p>}

            {!isLoading && error === "" && <ImageGrid images={imageData} />}
        </>
    );
}