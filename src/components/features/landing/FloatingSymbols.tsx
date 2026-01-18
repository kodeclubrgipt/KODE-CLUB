"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SYMBOLS = ["{ }", "</>", "&&", "||", "()", "=>", "[]", ";", "#", "$"];

export function FloatingSymbols() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {SYMBOLS.map((symbol, i) => (
                <FloatingSymbol key={i} symbol={symbol} index={i} />
            ))}
        </div>
    );
}

function FloatingSymbol({ symbol, index }: { symbol: string; index: number }) {
    const randomX = Math.random() * 100;
    const randomDelay = Math.random() * 5;
    const randomDuration = 10 + Math.random() * 10;

    return (
        <motion.div
            initial={{ y: "110vh", x: `${randomX}vw`, opacity: 0 }}
            animate={{
                y: "-10vh",
                opacity: [0, 0.1, 0.2, 0.1, 0],
                rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
                duration: randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: "linear"
            }}
            className="absolute text-4xl font-bold text-foreground/5 font-mono select-none"
        >
            {symbol}
        </motion.div>
    );
}
