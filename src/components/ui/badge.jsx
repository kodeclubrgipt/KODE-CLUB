import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils.js";

const badgeVariants = cva(
    // Base styles
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 border",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-300 hover:from-purple-500/30 hover:to-blue-500/30",
                secondary:
                    "bg-white/10 border-white/10 text-white/70 hover:bg-white/20 hover:text-white",
                destructive:
                    "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30",
                success:
                    "bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30",
                warning:
                    "bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/30",
                outline:
                    "bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:text-white",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

function Badge({ className, variant, ...props }) {
    return (
        <span className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
