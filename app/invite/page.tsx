"use client";

import { apiRequest } from "@/app/lib/api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function InviteForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token") || "";
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function join() {
        setError("");
        setMessage("");

        if (!token) {
            setError("This invitation is invalid or expired.");
            return;
        }

        try {
            setLoading(true);
            const data = await apiRequest("/api/invites/accept", {
                method: "POST",
                body: JSON.stringify({ token }),
            });
            setMessage(data.message);
            router.push("/members");
        } catch (joinError) {
            setError(
                joinError instanceof Error
                    ? joinError.message
                    : "Unable to join."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto mt-10 px-5 py-8 border-2 border-gray-100 rounded-2xl shadow-md w-100">
            <h1 className="text-2xl text-center">Join workspace</h1>
            <p className="mt-3 text-center text-gray-600">
                Log in with the invited email, then join.
            </p>
            <button
                type="button"
                onClick={join}
                disabled={loading}
                className="mt-6 bg-black text-white py-2 w-full rounded-md"
            >
                {loading ? "Joining..." : "Join"}
            </button>
            {message && <p className="mt-3 text-green-600">{message}</p>}
            {error && <p className="mt-3 text-red-600">{error}</p>}
            <p className="mt-4 text-center">
                <Link href="/auth/login" className="text-blue-600">Log in</Link>
                {" · "}
                <Link href="/auth/register" className="text-blue-600">Register</Link>
            </p>
        </div>
    );
}

export default function InvitePage() {
    return (
        <Suspense fallback={<p className="p-6">Loading...</p>}>
            <InviteForm />
        </Suspense>
    );
}