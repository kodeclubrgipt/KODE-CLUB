"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    IconBrandTwitter,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconMail,
    IconCode,
    IconHome,
    IconTerminal2,
    IconTrophy,
    IconBook
} from "@tabler/icons-react";

const footerLinks = {
    product: [
        { name: "DPPs", href: "/dpp" },
        { name: "Quizzes", href: "/quiz" },
        { name: "Compiler", href: "/compiler" },
        { name: "Leaderboard", href: "/leaderboard" },
    ],
    resources: [
        { name: "Documentation", href: "/docs" },
        { name: "Blog", href: "/blog" },
        { name: "Tutorials", href: "/tutorials" },
        { name: "FAQ", href: "/faq" },
    ],
    company: [
        { name: "About", href: "/about" },
        { name: "Team", href: "/team" },
        { name: "Contact", href: "/contact" },
        { name: "Privacy", href: "/privacy" },
    ],
};

const socialLinks = [
    { icon: IconBrandTwitter, href: "https://twitter.com/kodeclub", label: "Twitter" },
    { icon: IconBrandInstagram, href: "https://instagram.com/kodeclub", label: "Instagram" },
    { icon: IconBrandLinkedin, href: "https://linkedin.com/company/kodeclub", label: "LinkedIn" },
];

// Dock items - removed GitHub
const dockItems = [
    { icon: IconHome, href: "/", label: "Home", isExternal: false },
    { icon: IconTerminal2, href: "/compiler", label: "Compiler", isExternal: false },
    { icon: IconBook, href: "/quiz", label: "Quizzes", isExternal: false },
    { icon: IconTrophy, href: "/leaderboard", label: "Leaderboard", isExternal: false },
    { icon: IconBrandTwitter, href: "https://twitter.com/kodeclub", label: "Twitter", isExternal: true },
    { icon: IconBrandInstagram, href: "https://instagram.com/kodeclub", label: "Instagram", isExternal: true },
    { icon: IconMail, href: "mailto:kodeclubrgipt@gmail.com", label: "Email", isExternal: true },
];

// Floating Dock Item with original hover effect
const DockItem = ({ icon: Icon, href, label, isExternal }) => {
    const content = (
        <motion.div
            whileHover={{
                scale: 1.4,
                y: -12,
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="relative group cursor-pointer"
        >
            {/* Icon container with glow */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 group-hover:shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-300">
                <Icon className="h-7 w-7 text-white/70 group-hover:text-white transition-colors" />
            </div>

            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/90 backdrop-blur-sm border border-white/10 text-xs font-medium text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 whitespace-nowrap pointer-events-none">
                {label}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45" />
            </div>
        </motion.div>
    );

    if (isExternal) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                {content}
            </a>
        );
    }

    return (
        <Link href={href} aria-label={label}>
            {content}
        </Link>
    );
};

export function Footer() {
    return (
        <footer className="relative mt-auto border-t border-white/10 bg-black/40 backdrop-blur-xl">
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4 group">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                                <IconCode className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Kode Club</span>
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
                            Empowering students to learn, code, and compete. Join our community of passionate developers and level up your skills.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-2">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/50 hover:text-white hover:translate-x-1 inline-block transition-all"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/50 hover:text-white hover:translate-x-1 inline-block transition-all"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/50 hover:text-white hover:translate-x-1 inline-block transition-all"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar with Copyright */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center gap-6">
                    {/* Floating Dock - Centered above copyright (Hidden on mobile to prevent overflow) */}
                    <div className="hidden md:flex items-center gap-3 p-3 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
                        {dockItems.map((item) => (
                            <DockItem key={item.label} {...item} />
                        ))}
                    </div>

                    {/* Copyright */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                        <p className="text-white/40 text-sm">
                            © {new Date().getFullYear()} Kode Club. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/terms" className="text-sm text-white/40 hover:text-white transition-colors">
                                Terms
                            </Link>
                            <Link href="/privacy" className="text-sm text-white/40 hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <a
                                href="mailto:kodeclubrgipt@gmail.com"
                                className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                            >
                                <IconMail className="h-4 w-4" />
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
