import { useState } from "react";

export function ImageNameEditor({ authToken, imageId, initialValue, onNameUpdated }) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(initialValue || "");
    const [isRenaming, setIsRenaming] = useState(false);
    const [error, setError] = useState("");

    function handleEditPressed() {
        setIsEditingName(true);
        setNameInput(initialValue || "");
        setError("");
    }

    async function handleSubmitPressed() {
        setIsRenaming(true);
        setError("");

        try {
            const response = await fetch(`/api/images/${imageId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ name: nameInput }),
            });

            if (response.status !== 204) {
                let message = `Error: HTTP ${response.status} ${response.statusText}`;
                try {
                    const data = await response.json();
                    if (data?.message) message = data.message;
                } catch {}
                throw new Error(message);
            }

            setIsEditingName(false);
            if (typeof onNameUpdated === "function") onNameUpdated(nameInput);
        } catch (err) {
            setError(String(err?.message ?? err));
        } finally {
            setIsRenaming(false);
        }
    }

    if (!isEditingName) {
        return (
            <div style={{ margin: "1em 0" }}>
                <button onClick={handleEditPressed}>Edit name</button>
            </div>
        );
    }

    return (
        <div style={{ margin: "1em 0" }}>
        <div aria-live="polite">
            {isRenaming && <p>Renaming image...</p>}
            {error !== "" && <p>{error}</p>}
        </div>

        <label>
            New Name
            <input
            required
            style={{ marginLeft: "0.5em" }}
            value={nameInput}
            disabled={isRenaming}
            onChange={(e) => setNameInput(e.target.value)}
            />
        </label>

        <button disabled={isRenaming || nameInput.length === 0} onClick={handleSubmitPressed}>
            Submit
        </button>
        <button disabled={isRenaming} onClick={() => setIsEditingName(false)}>
            Cancel
        </button>
        </div>
    );
}