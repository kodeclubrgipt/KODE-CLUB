import * as React from "react";
import { cn } from "@/lib/utils.js";

const Input = React.forwardRef(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    // Base layout
                    "flex h-11 w-full px-4 py-2",
                    "rounded-xl text-sm",

                    // Glassmorphism
                    "bg-white/5 backdrop-blur-xl",
                    "border border-white/10",

                    // Text
                    "text-white placeholder:text-white/40",

                    // Focus state
                    "transition-all duration-300",
                    "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50",
                    "focus:bg-white/10",

                    // Hover
                    "hover:bg-white/10 hover:border-white/20",

                    // Disabled
                    "disabled:cursor-not-allowed disabled:opacity-50",

                    // File input
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium",

                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
