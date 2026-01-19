"use client";

import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import React from "react";

export const Navbar = ({ children, className }) => {
    return (
        <nav className={cn("relative", className)}>
            {children}
        </nav>
    );
};

export const NavBody = ({ children, className }) => {
    return (
        <div className={cn("hidden md:flex items-center justify-between py-3 px-6", className)}>
            {children}
        </div>
    );
};

export const NavItems = ({ items, className, onItemClick }) => {
    return (
        <div className={cn("flex items-center gap-6", className)}>
            {items.map((item, idx) => (
                <Link
                    key={idx}
                    href={item.link}
                    onClick={onItemClick}
                    className="text-neutral-300 hover:text-white transition-colors"
                >
                    {item.name}
                </Link>
            ))}
        </div>
    );
};

export const NavbarLogo = ({ className }) => {
    return (
        <Link href="/" className={cn("flex items-center gap-2", className)}>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">KC</span>
            </div>
            <span className="text-lg font-bold text-white">Kode Club</span>
        </Link>
    );
};

export const NavbarButton = React.forwardRef(
    ({ children, variant = "primary", className, ...props }, ref) => {
        const variants = {
            primary: "bg-primary text-white hover:bg-primary/90",
            secondary: "bg-transparent text-neutral-300 hover:text-white",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);
NavbarButton.displayName = "NavbarButton";

export const MobileNav = ({ children, className }) => {
    return (
        <div className={cn("md:hidden", className)}>
            {children}
        </div>
    );
};

export const MobileNavHeader = ({ children, className }) => {
    return (
        <div className={cn("flex items-center justify-between py-3 px-4", className)}>
            {children}
        </div>
    );
};

export const MobileNavToggle = ({ isOpen, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors",
                className
            )}
        >
            {isOpen ? (
                <IconX className="w-5 h-5 text-white" />
            ) : (
                <IconMenu2 className="w-5 h-5 text-white" />
            )}
        </button>
    );
};

export const MobileNavMenu = ({ isOpen, onClose, children, className }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn("overflow-hidden px-4 pb-4", className)}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
