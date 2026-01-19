"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils.js"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        // Modern glass container
        "inline-flex h-auto items-center justify-center gap-1 p-1.5",
        "rounded-2xl backdrop-blur-xl",
        "bg-white/5 border border-white/10",
        "text-muted-foreground",
        className
      )}
      {...props}
    />
  ))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        // Base styles
        "inline-flex items-center justify-center whitespace-nowrap",
        "px-4 py-2.5 text-sm font-medium",
        "rounded-xl",

        // Transition
        "transition-all duration-300",

        // Focus
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",

        // Disabled
        "disabled:pointer-events-none disabled:opacity-50",

        // Inactive state
        "text-white/60 hover:text-white hover:bg-white/10",

        // Active state - gradient background
        "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500",
        "data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20",

        className
      )}
      {...props}
    />
  ))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-4 ring-offset-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Animation
        "animate-in fade-in-50 slide-in-from-bottom-2 duration-300",
        className
      )}
      {...props}
    />
  ))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
