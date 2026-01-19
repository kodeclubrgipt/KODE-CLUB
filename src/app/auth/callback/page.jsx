'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { apiClient } from '@/lib/api.js';

export const dynamic = 'force-dynamic';

function AuthCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { updateUser } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const needsSetup = searchParams.get('setup') === 'true';

        if (error) {
            router.replace(`/login?error=${error}`);
            return;
        }

        if (token) {
            localStorage.setItem('token', token);

            // Fetch user data
            apiClient.getCurrentUser()
                .then((response) => {
                    if (response.success && response.user) {
                        updateUser(response.user);

                        // Check if profile setup is needed
                        if (needsSetup || !response.user.profileComplete || !response.user.username) {
                            router.replace('/setup-profile');
                        } else {
                            router.replace('/dashboard');
                        }
                    } else {
                        router.replace('/login?error=authentication_failed');
                    }
                })
                .catch((err) => {
                    console.error('Auth callback error:', err);
                    router.replace('/login?error=authentication_failed');
                });
        } else {
            router.replace('/login?error=no_token');
        }
    }, [searchParams, router, updateUser]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-white/50">Completing authentication...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
