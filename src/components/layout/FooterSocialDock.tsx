"use client";
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
    IconBrandGithub,
    IconBrandX,
    IconBrandLinkedin,
    IconMail,
    IconBrandDiscord,
} from "@tabler/icons-react";

export function FooterSocialDock() {
    const socialIcons = [
        {
            title: "GitHub",
            icon: <IconBrandGithub className="h-full w-full" />,
            href: "https://github.com/kodeclub-rgipt",
        },
        {
            title: "LinkedIn",
            icon: <IconBrandLinkedin className="h-full w-full" />,
            href: "https://linkedin.com",
        },
        {
            title: "Discord",
            icon: <IconBrandDiscord className="h-full w-full" />,
            href: "https://discord.com",
        },
        {
            title: "X (Twitter)",
            icon: <IconBrandX className="h-full w-full" />,
            href: "https://twitter.com",
        },
        {
            title: "Email",
            icon: <IconMail className="h-full w-full" />,
            href: "mailto:kodeclub@rgipt.ac.in",
        },
    ];

    const socialLinks = socialIcons.map((item) => ({
        ...item,
        icon: <div className="h-full w-full flex items-center justify-center text-neutral-400 hover:text-blue-400 transition-colors">{item.icon}</div>,
    }));

    return (
        <div className="w-full py-12 flex flex-col items-center gap-4 border-t border-neutral-800 bg-black">
            <p className="text-xs text-neutral-500 tracking-wide">
                Connect with Kode Club • RGIPT
            </p>

            <FloatingDock
                items={socialLinks}
                desktopClassName="bg-black/40 border border-neutral-800 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:bg-black/60"
                mobileClassName="translate-y-0"
            />

            <p className="text-[11px] text-neutral-600">
                Built by students. Maintained by coders.
            </p>
        </div>
    );
}
