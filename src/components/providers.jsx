"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext.jsx";

export function ThemeProvider({
    children,
    ...props
}) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function Providers({ children }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
    );
}
