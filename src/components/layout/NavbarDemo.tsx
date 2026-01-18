"use client";

import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconSearch } from "@tabler/icons-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export function NavbarDemo() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();

    const navItems = [
        { name: "DPPs", link: "/dpp" },
        { name: "Quiz", link: "/quiz" },
        { name: "Compiler", link: "/compiler" },
        { name: "Leaderboard", link: "/leaderboard" },
        ...(user?.isAdmin ? [{ name: "Admin", link: "/admin" }] : []),
    ];

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    const userInitials = user?.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '';

    const openCommandBar = () => {
        if (typeof window !== "undefined" && (window as any).__openCommandBar) {
            (window as any).__openCommandBar();
        }
    };

    return (
        <div className="fixed top-0 z-50 w-full px-4 pt-4">
            <Navbar className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg max-w-7xl mx-auto">
                {/* Desktop */}
                <NavBody>
                    <NavbarLogo />

                    <NavItems items={navItems} className="text-sm font-medium tracking-wide text-neutral-200" />

                    <div className="flex items-center gap-3">
                        {/* Quick Actions Button */}
                        <button
                            onClick={openCommandBar}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 hover:border-white/30 hover:bg-white/20 transition-all text-sm group"
                        >
                            <IconSearch className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                            <span className="text-neutral-400 group-hover:text-white transition-colors hidden lg:inline">Quick Actions</span>
                            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-neutral-400 font-mono border border-white/10">
                                ⌘K
                            </kbd>
                        </button>

                        {user ? (
                            <>
                                <Link href="/dashboard">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 hover:border-white/30 hover:bg-white/20 transition-all cursor-pointer">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-neutral-200 hidden md:inline">{user.name}</span>
                                    </div>
                                </Link>
                                <NavbarButton
                                    variant="secondary"
                                    onClick={handleLogout}
                                    className="text-neutral-200 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10"
                                >
                                    Logout
                                </NavbarButton>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <NavbarButton
                                        variant="secondary"
                                        className="text-neutral-200 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10"
                                    >
                                        Sign In
                                    </NavbarButton>
                                </Link>
                                <Link href="/compiler">
                                    <NavbarButton variant="primary" className="font-medium shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white border-0">
                                        Open Compiler
                                    </NavbarButton>
                                </Link>
                            </>
                        )}
                    </div>
                </NavBody>

                {/* Mobile */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                        className="backdrop-blur-xl bg-black/90"
                    >
                        <div className="flex flex-col gap-4 pt-6">
                            {navItems.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        href={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-lg font-medium text-neutral-200 hover:text-white hover:pl-2 transition-all"
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <div className="flex flex-col gap-3 pt-4 border-t border-white/10 mt-2">
                                {user ? (
                                    <>
                                        <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.avatar} alt={user.name} />
                                                    <AvatarFallback>{userInitials}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-neutral-200">{user.name}</span>
                                            </div>
                                        </Link>
                                        <NavbarButton 
                                            variant="secondary" 
                                            onClick={handleLogout}
                                            className="w-full bg-white/5 border border-white/10"
                                        >
                                            Logout
                                        </NavbarButton>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <NavbarButton variant="secondary" className="w-full bg-white/5 border border-white/10">
                                                Sign In
                                            </NavbarButton>
                                        </Link>
                                        <Link href="/dpp" onClick={() => setIsMobileMenuOpen(false)}>
                                            <NavbarButton variant="primary" className="w-full">
                                                Solve Today&apos;s DPP
                                            </NavbarButton>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div>
    );
}
