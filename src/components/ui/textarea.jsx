import * as React from "react";
import { cn } from "@/lib/utils.js";

const Textarea = React.forwardRef(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    // Base layout
                    "flex min-h-[120px] w-full px-4 py-3",
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

                    // Resize
                    "resize-none",

                    // Disabled
                    "disabled:cursor-not-allowed disabled:opacity-50",

                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Textarea.displayName = "Textarea";

export { Textarea };
