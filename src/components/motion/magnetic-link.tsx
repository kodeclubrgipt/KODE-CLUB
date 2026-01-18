"use client";

import { motion } from "framer-motion";
import { Magnetic } from "./magnetic";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MagneticLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export function MagneticLink({ href, children, className }: MagneticLinkProps) {
    return (
        <Magnetic>
            <Link
                href={href}
                className={cn(
                    "relative block px-4 py-2 text-sm font-medium transition-colors hover:text-foreground/80",
                    className
                )}
            >
                {children}
                <span className="absolute inset-x-0 -bottom-px h-px scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
        </Magnetic>
    );
}
