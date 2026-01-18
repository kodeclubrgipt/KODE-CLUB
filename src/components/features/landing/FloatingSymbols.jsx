"use client";

import { motion } from "framer-motion";

const symbols = ["{", "}", "<", ">", "(", ")", "[", "]", "/", "*", "+", "-", "=", "&", "|"];

export function FloatingSymbols() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {symbols.map((symbol, i) => (
                <motion.div
                    key={i}
                    className="absolute text-primary/20 text-4xl font-mono"
                    initial={{
                        x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                        y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
                        opacity: 0,
                    }}
                    animate={{
                        y: typeof window !== 'undefined' ? [null, Math.random() * window.innerHeight] : 0,
                        opacity: [0, 0.3, 0],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                >
                    {symbol}
                </motion.div>
            ))}
        </div>
    );
}
