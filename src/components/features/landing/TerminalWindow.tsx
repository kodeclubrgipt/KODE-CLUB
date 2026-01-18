"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

export function TerminalWindow() {
    const [text, setText] = useState("");
    const fullText = `const CLUB = "Kode Club";\n\nfunction join() {\n  return "Master your craft.";\n}\n\nconsole.log(join());`;
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
                setTimeout(() => setShowResult(true), 500);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg rounded-xl border bg-black/90 text-sm shadow-2xl backdrop-blur font-mono"
        >
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500/80" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                        <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="ml-2 text-xs text-muted-foreground flex items-center gap-1">
                        <Terminal className="h-3 w-3" /> main.ts
                    </span>
                </div>
            </div>
            <div className="p-4 min-h-[200px]">
                <div className="whitespace-pre-wrap text-blue-400">
                    {text}
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block h-4 w-2 bg-blue-500 ml-1 align-middle"
                    />
                </div>
                {showResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 border-t border-white/10 pt-2 text-green-400"
                    >
                        {">"} "Master your craft."
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
