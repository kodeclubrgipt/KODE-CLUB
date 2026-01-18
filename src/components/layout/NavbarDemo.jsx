"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { Button } from "@/components/ui/button";

export function NavbarDemo() {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur">
            <div className="container flex items-center justify-between h-16 px-4">
                <Link href="/" className="text-xl font-bold">
                    Kode Club
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/dpp">
                        <Button variant="ghost">DPP</Button>
                    </Link>
                    <Link href="/quiz">
                        <Button variant="ghost">Quiz</Button>
                    </Link>
                    <Link href="/compiler">
                        <Button variant="ghost">Compiler</Button>
                    </Link>
                    {user ? (
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                            <Button onClick={logout} variant="outline">
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button>Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
