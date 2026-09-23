"use client";

import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/api";
import Link from "next/link";
import { SubmitEvent, useState } from "react";

export default function Login(){

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        try {
            setLoading(true);

            const data = await apiRequest("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            });

            router.push("/dashboard");

        } catch (error) {
            console.error("Login error:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Login failed."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto mt-10 px-5 py-8 border-2 border-gray-100 rounded-2xl shadow-md w-100">
            <div className="signup-heading text-center mb-8">
                <h1 className="text-2xl">ClickLite</h1>
                <h2 className="text-md text-gray-600">Sign in to your account</h2>
            </div>

            <div className="signup-form">
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="border border-blue-300 rounded-md p-1" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="border border-blue-300 rounded-md p-1" />
                    </div>
                    <div className="mt-3 text-center">
                        <button type="submit" disabled={loading} className="bg-blue-500 py-2 px-1 w-full rounded-md text-white hover:bg-blue-600">{loading ? "Loading...":'Submit'}</button>
                        {error && (
                            <p className="text-sm text-red-500">
                                {error}
                            </p>
                        )}
                    </div>
                    <div className="text-center">
                        <p>Do not have an account? <Link href="/auth/register">Signup</Link></p>
                    </div>
                </form>
            </div>

        </div>
    );
}