"use client";

import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
    IconBrandGithub,
    IconBrandX,
    IconBrandInstagram,
    IconMail,
    IconHome,
    IconTerminal2,
} from "@tabler/icons-react";

export function SocialFloatingDock() {
    const links = [
        {
            title: "Home",
            icon: (
                <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/",
        },
        {
            title: "Compete",
            icon: (
                <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/compete",
        },
        {
            title: "GitHub",
            icon: (
                <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "https://github.com",
        },
        {
            title: "Twitter",
            icon: (
                <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "https://twitter.com",
        },
        {
            title: "Instagram",
            icon: (
                <IconBrandInstagram className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "https://instagram.com",
        },
        {
            title: "Email",
            icon: (
                <IconMail className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "mailto:contact@kodeclub.com",
        },
    ];

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            <FloatingDock
                items={links}
            />
        </div>
    );
}
