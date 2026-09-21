const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function apiRequest(
    endpoint: string,
    options: RequestInit = {}
) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        let message = "Something went wrong.";

        if (typeof data.detail === "string") {
            message = data.detail;
        } else if (Array.isArray(data.detail)) {
            message = data.detail
                .map((error: { msg?: string }) => error.msg || "Invalid input")
                .join(", ");
        }

        throw new Error(message);
    }

    return data;
}