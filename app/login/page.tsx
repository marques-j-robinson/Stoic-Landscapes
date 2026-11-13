"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
                rememberMe: true,
                callbackURL: "/admin",
            });

            if (error) {
                setError("Invalid email or password.");
                return;
            }

            router.replace("/admin");
            router.refresh();
        } catch {
            setError("Unable to sign in. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F7F7F3] px-4">
            <div className="w-full max-w-md rounded-xl border border-[#E5E5DD] bg-white p-8 shadow-sm">

                <div className="mb-8 text-center">
                    <div className="mb-4 text-3xl text-[#777D62]">
                        ◈
                    </div>

                    <h1 className="text-2xl font-semibold tracking-wide text-[#34372F]">
                        STOIC LANDSCAPES
                    </h1>

                    <p className="mt-2 text-sm tracking-widest text-[#858779]">
                        STUDIO ADMINISTRATION
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-[#34372F]"
                        >
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-md border border-[#DADBD2] text-black px-4 py-3 outline-none focus:border-[#777D62] focus:ring-1 focus:ring-[#777D62]"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-[#34372F]"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-md border border-[#DADBD2] text-black px-4 py-3 outline-none focus:border-[#777D62] focus:ring-1 focus:ring-[#777D62]"
                        />
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-[#34372F] px-4 py-3 font-medium text-white transition hover:bg-[#4A4D42] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-[#929487]">
                    Stoic Landscape — The Art of Quiet Strength
                </p>
            </div>
        </main>
    );
}
