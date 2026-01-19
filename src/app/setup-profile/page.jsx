'use client';

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api.js";
import { IconUser, IconAt, IconCheck, IconX, IconLoader2 } from "@tabler/icons-react";

function SetupProfileForm() {
    const { user, loading: authLoading, refreshUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [usernameStatus, setUsernameStatus] = useState(null); // 'checking', 'available', 'taken', 'invalid'
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            // Pre-fill name from Google
            if (user.name) {
                setName(user.name);
            }
            // If profile is already complete, redirect to dashboard
            if (user.profileComplete && user.username) {
                router.push('/dashboard');
            }
        }
    }, [user, authLoading, router]);

    // Debounced username check
    useEffect(() => {
        if (!username || username.length < 3) {
            setUsernameStatus(null);
            return;
        }

        // Validate format
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setUsernameStatus('invalid');
            return;
        }

        const timer = setTimeout(async () => {
            setUsernameStatus('checking');
            try {
                // Build API URL - handle both with and without /api suffix
                let apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
                // Remove trailing slash
                apiUrl = apiUrl.replace(/\/$/, '');

                const checkUrl = `${apiUrl}/auth/check-username/${username}`;
                console.log('Checking username at:', checkUrl);

                const res = await fetch(checkUrl, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!res.ok) {
                    console.error('Username check failed:', res.status);
                    // On error, allow username (server will validate on submit)
                    setUsernameStatus('available');
                    return;
                }

                const data = await res.json();
                console.log('Username check response:', data);
                setUsernameStatus(data.available ? 'available' : 'taken');
            } catch (err) {
                console.error('Username check error:', err);
                // On network error, allow username (server validates on submit)
                setUsernameStatus('available');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim() || name.length < 2) {
            setError("Name must be at least 2 characters");
            return;
        }

        if (!username || username.length < 3) {
            setError("Username must be at least 3 characters");
            return;
        }

        if (usernameStatus !== 'available') {
            setError("Please choose a valid available username");
            return;
        }

        setLoading(true);

        try {
            const res = await apiClient.request('/auth/setup-profile', {
                method: 'POST',
                body: JSON.stringify({ name, username }),
            });

            if (res.success) {
                // Refresh user data and redirect
                await refreshUser();
                router.push('/dashboard');
            } else {
                setError(res.message || 'Setup failed');
            }
        } catch (err) {
            setError(err.message || 'Setup failed');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 mb-4">
                        <IconUser className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h1>
                    <p className="text-white/50">Choose a username to display across the platform</p>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Display Name
                            </label>
                            <div className="relative">
                                <IconUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                    maxLength={50}
                                />
                            </div>
                        </div>

                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <IconAt className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                    placeholder="username"
                                    className="w-full h-12 pl-12 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                    maxLength={20}
                                />
                                {/* Status indicator */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {usernameStatus === 'checking' && (
                                        <IconLoader2 className="w-5 h-5 text-white/40 animate-spin" />
                                    )}
                                    {usernameStatus === 'available' && (
                                        <IconCheck className="w-5 h-5 text-green-400" />
                                    )}
                                    {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
                                        <IconX className="w-5 h-5 text-red-400" />
                                    )}
                                </div>
                            </div>
                            {/* Username feedback */}
                            <p className={`text-xs mt-2 ${usernameStatus === 'available' ? 'text-green-400' :
                                usernameStatus === 'taken' ? 'text-red-400' :
                                    usernameStatus === 'invalid' ? 'text-red-400' :
                                        'text-white/40'
                                }`}>
                                {usernameStatus === 'available' && '✓ Username is available'}
                                {usernameStatus === 'taken' && '✗ Username is already taken'}
                                {usernameStatus === 'invalid' && '✗ Only letters, numbers, and underscores allowed'}
                                {!usernameStatus && username.length > 0 && username.length < 3 && 'Username must be at least 3 characters'}
                                {!usernameStatus && username.length === 0 && 'This will be shown on leaderboards and across the site'}
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || usernameStatus !== 'available' || !name.trim()}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <IconLoader2 className="w-5 h-5 animate-spin" />
                                    Setting up...
                                </span>
                            ) : (
                                'Complete Setup'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/40 text-xs mt-6">
                    Your username cannot be changed later
                </p>
            </motion.div>
        </div>
    );
}

export default function SetupProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
            </div>
        }>
            <SetupProfileForm />
        </Suspense>
    );
}
