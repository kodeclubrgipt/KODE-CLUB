"use client";

import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    IconBrandGithub,
    IconCode,
    IconHome,
    IconSearch,
    IconTerminal2,
    IconTrophy,
} from "@tabler/icons-react";
import Link from "next/link";

const commands = [
    { id: "home", label: "Go to Home", icon: IconHome, href: "/", shortcut: "G H" },
    { id: "compiler", label: "Open Compiler", icon: IconTerminal2, href: "/compiler", shortcut: "G C" },
    { id: "dpp", label: "Today's DPP", icon: IconCode, href: "/dpp", shortcut: "G D" },
    { id: "leaderboard", label: "View Leaderboard", icon: IconTrophy, href: "/leaderboard", shortcut: "G L" },
    { id: "github", label: "GitHub Repo", icon: IconBrandGithub, href: "https://github.com", shortcut: "G G" },
];

// Context to control command bar from outside
const CommandBarContext = createContext<{
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
} | null>(null);

export function useCommandBar() {
    const context = useContext(CommandBarContext);
    if (!context) {
        throw new Error("useCommandBar must be used within CommandBar");
    }
    return context;
}

// Trigger button component to use in Navbar
export function CommandBarTrigger({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700/50 hover:border-neutral-600 transition-all text-sm"
        >
            <IconSearch className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-400 hidden sm:inline">Quick Actions</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-neutral-700 text-[10px] text-neutral-400 font-mono">
                ⌘K
            </kbd>
        </button>
    );
}

export function CommandBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(search.toLowerCase())
    );

    // Keyboard shortcut to open
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Expose setIsOpen globally for navbar to use
    useEffect(() => {
        (window as any).__openCommandBar = () => setIsOpen(true);
        return () => {
            delete (window as any).__openCommandBar;
        };
    }, []);

    return (
        <>

            {/* Command Palette Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
                        >
                            <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                                {/* Search Input */}
                                <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-700/50">
                                    <IconSearch className="w-5 h-5 text-neutral-500" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Type a command or search..."
                                        className="flex-1 bg-transparent text-neutral-200 placeholder-neutral-500 outline-none text-sm"
                                    />
                                    <kbd className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-500 font-mono">
                                        ESC
                                    </kbd>
                                </div>

                                {/* Commands List */}
                                <div className="max-h-[300px] overflow-y-auto p-2">
                                    {filteredCommands.length === 0 ? (
                                        <div className="py-8 text-center text-neutral-500 text-sm">
                                            No commands found
                                        </div>
                                    ) : (
                                        filteredCommands.map((cmd) => (
                                            <Link
                                                key={cmd.id}
                                                href={cmd.href}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-neutral-800/80 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <cmd.icon className="w-4 h-4 text-neutral-500 group-hover:text-primary transition-colors" />
                                                    <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">
                                                        {cmd.label}
                                                    </span>
                                                </div>
                                                <kbd className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-600 font-mono group-hover:text-neutral-400 transition-colors">
                                                    {cmd.shortcut}
                                                </kbd>
                                            </Link>
                                        ))
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-700/50 bg-neutral-800/30 text-[10px] text-neutral-500">
                                    <span>Kode Club • RGIPT</span>
                                    <div className="flex items-center gap-2">
                                        <span>↑↓ Navigate</span>
                                        <span>↵ Select</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
