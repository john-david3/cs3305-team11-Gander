import { useEffect, useState } from "react"

export function useSameUser({ username }: { username: string | undefined }) {
    const [isSame, setIsSame] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch(`/api/user/same/${username}`);
                if (!response.ok) {
                    throw new Error("Failed to validate user");
                }
                const data = await response.json();
                setIsSame(data.same);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchStatus();
    }, []);

    return isSame;
}