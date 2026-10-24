"use client";

import { apiRequest } from "@/app/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SubmitEvent, Suspense, useState } from "react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!token) {
            setError("This reset link is invalid or expired.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const data = await apiRequest("/api/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, password }),
            });

            setMessage(data.message);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not update the password."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto mt-10 px-5 py-8 border-2 border-gray-100 rounded-2xl shadow-md w-100">
            <div className="text-center mb-8">
                <h1 className="text-2xl">ClickLite</h1>
                <h2 className="text-md text-gray-600">Choose a new password</h2>
            </div>

            {message ? (
                <div className="text-center">
                    <p>{message}</p>
                    <p className="mt-5">
                        <Link href="/auth/login">Go to login</Link>
                    </p>
                </div>
            ) : (
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label>New password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="border border-blue-300 rounded-md p-1"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label>Confirm password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            className="border border-blue-300 rounded-md p-1"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 py-2 px-1 w-full rounded-md text-white hover:bg-blue-600"
                    >
                        {loading ? "Loading..." : "Update password"}
                    </button>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordForm />
        </Suspense>
    );
}