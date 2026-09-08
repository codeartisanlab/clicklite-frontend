"use client";

import Link from "next/link";
import { useState } from "react";
import type { SubmitEvent } from "react";

export default function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        // Clear previous messages
        setError("");
        setSuccess("");

        // Frontend validation
        if (!fullName.trim()) {
            setError("Full name is required.");
            return;
        }

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!password) {
            setError("Password is required.");
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

            const response = await fetch(
                "http://127.0.0.1:8000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        full_name: fullName.trim(),
                        email: email.trim(),
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.detail || "Registration failed."
                );
                return;
            }

            setSuccess(
                "Account created successfully!"
            );

            // Clear form
            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error("Registration error:", error);

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto mt-10 w-100 rounded-2xl border-2 border-gray-100 px-5 py-8 shadow-md">

            {/* Heading */}
            <div className="signup-heading mb-8 text-center">

                <h1 className="text-2xl">
                    ClickLite
                </h1>

                <h2 className="text-md text-gray-600">
                    Sign up to get started.
                </h2>

            </div>


            {/* Form */}
            <div className="signup-form">

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                >

                    {/* Full Name */}
                    <div className="flex flex-col gap-1">

                        <label htmlFor="fullName">
                            Full Name
                        </label>

                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(event) =>
                                setFullName(event.target.value)
                            }
                            placeholder="Enter your full name"
                            className="rounded-md border border-blue-300 p-2 outline-none focus:border-blue-500"
                        />

                    </div>


                    {/* Email */}
                    <div className="flex flex-col gap-1">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="Enter your email"
                            className="rounded-md border border-blue-300 p-2 outline-none focus:border-blue-500"
                        />

                    </div>


                    {/* Password */}
                    <div className="flex flex-col gap-1">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            className="rounded-md border border-blue-300 p-2 outline-none focus:border-blue-500"
                        />

                    </div>


                    {/* Confirm Password */}
                    <div className="flex flex-col gap-1">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Confirm your password"
                            className="rounded-md border border-blue-300 p-2 outline-none focus:border-blue-500"
                        />

                    </div>


                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}


                    {/* Success */}
                    {success && (
                        <p className="text-sm text-green-500">
                            {success}
                        </p>
                    )}


                    {/* Submit */}
                    <div className="mt-3 text-center">

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-blue-500 px-1 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"
                            }
                        </button>

                    </div>


                    {/* Login */}
                    <div className="text-center">

                        <p>
                            Already have an account?{" "}

                            <Link
                                href="/auth/login"
                                className="text-blue-500 hover:underline"
                            >
                                Login
                            </Link>
                        </p>

                    </div>

                </form>

            </div>

        </div>
    );
}