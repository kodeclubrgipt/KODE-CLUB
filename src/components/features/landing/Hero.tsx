"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Terminal, Trophy } from "lucide-react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { STAGGER_CHILD_VARIANTS } from "@/lib/motion";
import { FloatingSymbols } from "./FloatingSymbols";

const codeLines = [
    { text: "// Today's DPP: Two Sum", delay: 0 },
    { text: "function solve(nums, target) {", delay: 400 },
    { text: "  const map = new Map();", delay: 300 },
    { text: "  for (let i = 0; i < nums.length; i++) {", delay: 350 },
    { text: "    const complement = target - nums[i];", delay: 300 },
    { text: "    if (map.has(complement)) {", delay: 350 },
    { text: "      return [map.get(complement), i];", delay: 300 },
    { text: "    }", delay: 200 },
    { text: "    map.set(nums[i], i);", delay: 300 },
    { text: "  }", delay: 200 },
    { text: "  return [];", delay: 250 },
    { text: "}", delay: 200 },
];

function LiveCodeBlock() {
    const [lines, setLines] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState<string | null>(null);

    useEffect(() => {
        let i = 0;
        let totalDelay = 800;

        codeLines.forEach((line, index) => {
            setTimeout(() => {
                setLines(prev => [...prev, line.text]);
            }, totalDelay);
            totalDelay += line.delay;
        });
    }, []);

    const handleRun = () => {
        setIsRunning(true);
        setOutput(null);
        setTimeout(() => {
            setOutput("✓ Output: [0, 1]\n✓ Runtime: 4ms\n✓ Memory: 42.1 MB");
            setIsRunning(false);
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="w-full max-w-2xl mx-auto"
        >
            {/* Editor Window */}
            <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/90 backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Title Bar */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-700/50 bg-neutral-800/50">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-xs text-neutral-400 ml-2 font-mono">solution.js</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-mono">JavaScript</span>
                    </div>
                </div>

                {/* Code Area */}
                <div className="p-4 font-mono text-sm min-h-[280px] relative">
                    {lines.map((line, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex"
                        >
                            <span className="text-neutral-600 w-6 text-right mr-4 select-none">{idx + 1}</span>
                            <span className="text-neutral-200">{line}</span>
                        </motion.div>
                    ))}
                    {lines.length < codeLines.length && (
                        <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-10" />
                    )}
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-700/50 bg-neutral-800/30">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Terminal className="w-3 h-3" />
                        <span>Kode Club • RGIPT</span>
                    </div>
                    <Button
                        size="sm"
                        onClick={handleRun}
                        disabled={isRunning || lines.length < codeLines.length}
                        className="gap-2 bg-green-600 hover:bg-green-500 text-white"
                    >
                        <Play className="w-3 h-3" />
                        {isRunning ? "Running..." : "Run Code"}
                    </Button>
                </div>
            </div>

            {/* Output Panel */}
            {output && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 rounded-lg border border-green-500/30 bg-green-950/30 p-3 font-mono text-xs text-green-400"
                >
                    <pre>{output}</pre>
                </motion.div>
            )}
        </motion.div>
    );
}

export function Hero() {
    const ref = useRef(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 15;
        const y = (clientY / innerHeight - 0.5) * 15;
        mouseX.set(x);
        mouseY.set(y);
    };

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    return (
        <section ref={ref} onMouseMove={handleMouseMove} className="relative min-h-screen overflow-hidden py-20">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <FloatingSymbols />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
                <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
            </div>

            <div className="container relative z-10">
                {/* Top Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-8"
                >
                    <div className="flex items-center gap-2 rounded-full bg-neutral-800/80 backdrop-blur px-4 py-1.5 text-sm border border-neutral-700/50">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span className="text-neutral-300">Daily Coding Challenge Active</span>
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                </motion.div>

                {/* Hero Content */}
                <motion.div
                    style={{ x: springX, y: springY }}
                    className="text-center mb-12"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
                    >
                        <span className="text-neutral-200">Master Coding</span>{" "}
                        <br />
                        <span className="text-neutral-200">with </span>
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            Kode Club
                        </span>
                    </motion.h1>

                    <div className="text-2xl md:text-3xl font-mono font-medium tracking-tight mb-10 h-10 flex items-center justify-center gap-1">
                        {/* Typewriter Effect Container */}
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.1, staggerChildren: 0.1 }}
                            className="flex items-center gap-3"
                        >
                            {/* "Code." */}
                            <span className="flex">
                                {"Code.".split("").map((char, i) => (
                                    <motion.span
                                        key={`code-${i}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0, delay: i * 0.1 + 0.5 }} // Start after 0.5s
                                        className="text-neutral-300"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>

                            {/* "Compete." */}
                            <span className="flex">
                                {"Compete.".split("").map((char, i) => (
                                    <motion.span
                                        key={`compete-${i}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0, delay: i * 0.1 + 1.2 }} // Start after Code. finishes
                                        className="text-blue-400 font-bold drop-shadow-md"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>

                            {/* "Conquer." */}
                            <span className="flex">
                                {"Conquer.".split("").map((char, i) => (
                                    <motion.span
                                        key={`conquer-${i}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0, delay: i * 0.1 + 2.2 }} // Start after Compete. finishes
                                        className="text-neutral-300"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>
                        </motion.span>

                        {/* Blinking Cursor */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            className="w-[2px] h-6 md:h-7 bg-blue-500 ml-1"
                        />
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-8"
                    >
                        The coding platform for RGIPT students. Daily problems, instant execution, real competition.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap items-center justify-center gap-4"
                    >
                        <Link href="/dpp">
                            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                                Try Today&apos;s DPP <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link href="/compiler">
                            <Button size="lg" variant="outline" className="gap-2 border-neutral-700 hover:bg-neutral-800">
                                <Terminal className="w-4 h-4" />
                                Open Compiler
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>


                {/* Live Code Block */}
                <LiveCodeBlock />
            </div>
        </section>
    );
}
