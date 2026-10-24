"use client";

import { apiRequest } from "@/app/lib/api";
import Link from "next/link";
import { SubmitEvent, useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        try {
            setLoading(true);

            const data = await apiRequest("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email: email.trim() }),
            });

            setMessage(data.message);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not send the reset link."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto mt-10 px-5 py-8 border-2 border-gray-100 rounded-2xl shadow-md w-100">
            <div className="text-center mb-8">
                <h1 className="text-2xl">ClickLite</h1>
                <h2 className="text-md text-gray-600">Reset your password</h2>
            </div>

            {message ? (
                <p className="text-center">{message}</p>
            ) : (
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="border border-blue-300 rounded-md p-1"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 py-2 px-1 w-full rounded-md text-white hover:bg-blue-600"
                    >
                        {loading ? "Loading..." : "Send reset link"}
                    </button>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </form>
            )}

            <p className="text-center mt-5">
                <Link href="/auth/login">Back to login</Link>
            </p>
        </div>
    );
}