'use client';

import { Button } from "@/components/ui/button";
import { useState, Suspense, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useRouter, useSearchParams } from "next/navigation";
import { getGoogleAuthUrl } from "@/lib/api.js";
import { motion } from "framer-motion";
import { IconBrandGoogle, IconCode } from "@tabler/icons-react";

export const dynamic = 'force-dynamic';

function LoginForm() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // If already logged in, redirect
        if (user) {
            if (!user.profileComplete || !user.username) {
                router.push('/setup-profile');
            } else {
                router.push('/dashboard');
            }
        }
    }, [user, router]);

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError('Authentication failed. Please try again.');
        }
    }, [searchParams]);

    const handleGoogleAuth = () => {
        setLoading(true);
        const googleAuthUrl = getGoogleAuthUrl();

        if (!googleAuthUrl) {
            setError("Configuration Error: API URL is not set.");
            setLoading(false);
            return;
        }

        window.location.href = googleAuthUrl;
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20 mb-4">
                        <IconCode className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome to Kode Club</h1>
                    <p className="text-white/50">Sign in to start your coding journey</p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 space-y-6">
                    {/* Google Sign In Button */}
                    <button
                        onClick={handleGoogleAuth}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-white text-black font-medium hover:bg-white/90 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </button>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Info */}
                    <div className="text-center">
                        <p className="text-white/40 text-xs">
                            By signing in, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                    {[
                        { label: 'Quizzes', emoji: '📝' },
                        { label: 'Compete', emoji: '🏆' },
                        { label: 'Learn', emoji: '💡' },
                    ].map((item) => (
                        <div key={item.label} className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-2xl mb-1">{item.emoji}</div>
                            <div className="text-xs text-white/50">{item.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
