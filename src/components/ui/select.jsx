"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils.js"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
                // Base layout
                "flex h-11 w-full items-center justify-between px-4 py-2",
                "rounded-xl text-sm",

                // Glassmorphism
                "bg-white/5 backdrop-blur-xl",
                "border border-white/10",

                // Text
                "text-white placeholder:text-white/40",
                "[&>span]:line-clamp-1",

                // Transition
                "transition-all duration-300",

                // Focus
                "ring-offset-background focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50",

                // Hover
                "hover:bg-white/10 hover:border-white/20",

                // Disabled
                "disabled:cursor-not-allowed disabled:opacity-50",

                className
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDown className="h-4 w-4 text-white/50 transition-transform duration-200" />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    ))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef(
    ({ className, ...props }, ref) => (
        <SelectPrimitive.ScrollUpButton
            ref={ref}
            className={cn(
                "flex cursor-default items-center justify-center py-1 text-white/50",
                className
            )}
            {...props}
        >
            <ChevronUp className="h-4 w-4" />
        </SelectPrimitive.ScrollUpButton>
    ))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef(
    ({ className, ...props }, ref) => (
        <SelectPrimitive.ScrollDownButton
            ref={ref}
            className={cn(
                "flex cursor-default items-center justify-center py-1 text-white/50",
                className
            )}
            {...props}
        >
            <ChevronDown className="h-4 w-4" />
        </SelectPrimitive.ScrollDownButton>
    ))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef(
    ({ className, children, position = "popper", ...props }, ref) => (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                ref={ref}
                className={cn(
                    // Base layout
                    "relative z-50 max-h-96 min-w-[8rem] overflow-hidden",
                    "rounded-xl",

                    // Glassmorphism
                    "bg-black/80 backdrop-blur-xl",
                    "border border-white/10",
                    "shadow-2xl shadow-black/50",

                    // Animations
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
                    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",

                    position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                    className
                )}
                position={position}
                {...props}
            >
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                    className={cn(
                        "p-1.5",
                        position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
                    )}
                >
                    {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    ))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef(
    ({ className, ...props }, ref) => (
        <SelectPrimitive.Label
            ref={ref}
            className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold text-white/50", className)}
            {...props}
        />
    ))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <SelectPrimitive.Item
            ref={ref}
            className={cn(
                // Base layout
                "relative flex w-full cursor-default select-none items-center",
                "rounded-lg py-2.5 pl-9 pr-3 text-sm",

                // Text
                "text-white/70",

                // Focus/hover
                "outline-none transition-colors",
                "focus:bg-white/10 focus:text-white",

                // Disabled
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",

                className
            )}
            {...props}
        >
            <span className="absolute left-2.5 flex h-4 w-4 items-center justify-center">
                <SelectPrimitive.ItemIndicator>
                    <Check className="h-4 w-4 text-purple-400" />
                </SelectPrimitive.ItemIndicator>
            </span>

            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    ))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef(
    ({ className, ...props }, ref) => (
        <SelectPrimitive.Separator
            ref={ref}
            className={cn("-mx-1 my-1 h-px bg-white/10", className)}
            {...props}
        />
    ))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
}
