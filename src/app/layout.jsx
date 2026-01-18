import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { NavbarDemo } from "@/components/layout/NavbarDemo";
import { Footer } from "@/components/layout/Footer";
import { GlobalVideoBackground } from "@/components/layout/GlobalVideoBackground";
import { cn } from "@/lib/utils.js";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { CommandBar } from "@/components/features/navigation/CommandBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Kode Club - Learn, Code, Compete",
    description: "The official platform for Kode Club.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "min-h-screen bg-transparent font-sans antialiased",
                    inter.className
                )}
            >
                <Providers>
                    <GlobalVideoBackground />
                    <SmoothScroll>
                        <div className="relative z-10 flex min-h-screen flex-col">
                            <NavbarDemo />
                            <main className="flex-1 pt-16">{children}</main>
                            <Footer />
                            <CommandBar />
                        </div>
                    </SmoothScroll>
                </Providers>
            </body>
        </html>
    );
}
