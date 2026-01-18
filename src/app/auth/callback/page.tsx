'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

export const dynamic = 'force-dynamic';

function AuthCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { updateUser } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        
        if (token) {
            localStorage.setItem('token', token);
            
            // Fetch user data and update context
            apiClient.getCurrentUser()
                .then((response) => {
                    if (response.success && response.user) {
                        updateUser(response.user);
                        router.push('/dashboard');
                    } else {
                        router.push('/login?error=authentication_failed');
                    }
                })
                .catch(() => {
                    router.push('/login?error=authentication_failed');
                });
        } else {
            router.push('/login?error=no_token');
        }
    }, [searchParams, router, updateUser]);

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                <p className="text-muted-foreground">Completing authentication...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <AuthCallbackContent />
        </Suspense>
    );
}
