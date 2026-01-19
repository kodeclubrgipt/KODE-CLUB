import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils.js";

const buttonVariants = cva(
    // Base styles:
    // - Changed rounded-md to rounded-xl to match cards
    // - Added transition-all for smooth hover effects
    // - Added active:scale-95 for a "click" press effect
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default:
                    // Primary: Added shadow and slight lift on hover
                    "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5",
                
                destructive:
                    "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg hover:-translate-y-0.5",
                
                outline:
                    // Outline: Made border translucent for glass effect
                    "border border-white/20 dark:border-white/10 bg-transparent shadow-sm hover:bg-white/10 hover:text-accent-foreground backdrop-blur-sm",
                
                secondary:
                    // Secondary: Full Glassmorphism (blur + transparency)
                    "bg-white/20 dark:bg-slate-900/40 text-secondary-foreground backdrop-blur-md border border-white/10 shadow-sm hover:bg-white/30 dark:hover:bg-slate-900/60 hover:shadow-md hover:-translate-y-0.5",
                
                ghost:
                    // Ghost: Subtle glass hover
                    "hover:bg-white/10 dark:hover:bg-white/5 hover:text-accent-foreground",
                
                link: 
                    "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-lg px-3",
                lg: "h-11 rounded-xl px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };