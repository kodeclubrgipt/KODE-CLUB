"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    IconSearch,
    IconUser,
    IconLogout,
    IconSettings,
    IconMenu2,
    IconX,
    IconCode,
    IconChevronDown
} from "@tabler/icons-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { useRouter } from "next/navigation";

const navItems = [
    { name: "DPPs", link: "/dpp" },
    { name: "Quiz", link: "/quiz" },
    { name: "Compiler", link: "/compiler" },
    { name: "Leaderboard", link: "/leaderboard" },
];

export function NavbarDemo() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const openCommandBar = () => {
        if (typeof window !== "undefined" && window.__openCommandBar) {
            window.__openCommandBar();
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <nav className="fixed top-0 z-50 w-full">
            {/* Glass container with proper padding */}
            <div className="mx-4 mt-4">
                <div className="max-w-6xl mx-auto px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="p-1.5 rounded-lg bg-white/10 border border-white/10 group-hover:bg-white/20 transition-all">
                                <IconCode className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white hidden sm:block">Kode Club</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.link}
                                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-all"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-2">
                            {loading ? (
                                <div className="w-8 h-8 rounded-xl bg-white/10 animate-pulse" />
                            ) : user ? (
                                <>
                                    {/* Admin Button */}
                                    {user.isAdmin && (
                                        <Link href="/admin">
                                            <button className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all">
                                                <IconSettings className="w-4 h-4" />
                                            </button>
                                        </Link>
                                    )}

                                    {/* User Profile */}
                                    <Link href="/dashboard">
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-white">
                                                    {(user.username || user.name)?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <span className="text-sm text-white/70 group-hover:text-white transition-colors hidden lg:block max-w-[100px] truncate">
                                                @{user.username || user.name}
                                            </span>
                                        </div>
                                    </Link>

                                    {/* Logout */}
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all"
                                    >
                                        <IconLogout className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <Link href="/login">
                                    <button className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-all">
                                        Sign In
                                    </button>
                                </Link>
                            )}

                            {/* CTA Button */}
                            <Link href="/compiler" className="hidden sm:block">
                                <button className="px-4 py-2 text-sm font-medium text-black bg-white rounded-xl hover:bg-white/90 transition-all">
                                    Try Compiler
                                </button>
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                            >
                                {isMobileMenuOpen ? (
                                    <IconX className="w-5 h-5 text-white" />
                                ) : (
                                    <IconMenu2 className="w-5 h-5 text-white" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden mx-4 mt-2"
                    >
                        <div className="rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 p-4 space-y-2">
                            {navItems.map((item, idx) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Link
                                        href={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
                                {!user && (
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <button className="w-full px-4 py-3 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                                            Sign In
                                        </button>
                                    </Link>
                                )}
                                <Link href="/compiler" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="w-full px-4 py-3 text-black font-medium bg-white rounded-xl hover:bg-white/90 transition-all">
                                        Open Compiler
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
