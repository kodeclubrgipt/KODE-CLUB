"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import React from "react";

// Navbar Container
export function Navbar({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <nav
            className={cn(
                "relative w-full px-4 py-3",
                className
            )}
        >
            {children}
        </nav>
    );
}

// Desktop Nav Body
export function NavBody({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "hidden lg:flex items-center justify-between max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
}

// Nav Items
export function NavItems({
    items,
    className,
}: {
    items: { name: string; link: string }[];
    className?: string;
}) {
    return (
        <div className={cn("flex items-center gap-8", className)}>
            {items.map((item, idx) => (
                <Link
                    key={idx}
                    href={item.link}
                    className="relative text-neutral-400 hover:text-white transition-colors duration-200 group"
                >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
            ))}
        </div>
    );
}

// Logo
export function NavbarLogo({ className }: { className?: string }) {
    return (
        <Link
            href="/"
            className={cn(
                "flex items-center gap-2 text-lg font-bold text-white",
                className
            )}
        >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-sm font-bold">
                KC
            </div>
            <span className="hidden sm:inline">Kode Club</span>
        </Link>
    );
}

// Button
export function NavbarButton({
    children,
    variant = "primary",
    className,
    onClick,
}: {
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    className?: string;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                variant === "primary" &&
                "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
                variant === "secondary" &&
                "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white",
                className
            )}
        >
            {children}
        </button>
    );
}

// Mobile Nav Container
export function MobileNav({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("lg:hidden", className)}>
            {children}
        </div>
    );
}

// Mobile Header
export function MobileNavHeader({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex items-center justify-between",
                className
            )}
        >
            {children}
        </div>
    );
}

// Mobile Toggle
export function MobileNavToggle({
    isOpen,
    onClick,
}: {
    isOpen: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="p-2 text-neutral-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
        >
            <div className="w-6 h-5 relative flex flex-col justify-between">
                <motion.span
                    animate={{
                        rotate: isOpen ? 45 : 0,
                        y: isOpen ? 8 : 0,
                    }}
                    className="block h-0.5 w-full bg-current origin-center"
                />
                <motion.span
                    animate={{
                        opacity: isOpen ? 0 : 1,
                    }}
                    className="block h-0.5 w-full bg-current"
                />
                <motion.span
                    animate={{
                        rotate: isOpen ? -45 : 0,
                        y: isOpen ? -8 : 0,
                    }}
                    className="block h-0.5 w-full bg-current origin-center"
                />
            </div>
        </button>
    );
}

// Mobile Menu
export function MobileNavMenu({
    children,
    isOpen,
    onClose,
    className,
}: {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={cn(
                        "overflow-hidden px-4 pb-6",
                        className
                    )}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
