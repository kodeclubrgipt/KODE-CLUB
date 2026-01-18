"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, Cpu, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        icon: <Code2 className="h-8 w-8" />,
        title: "Daily Practice",
        description: "Consistency is key. New challenges every single day.",
    },
    {
        icon: <Cpu className="h-8 w-8" />,
        title: "Instant Execution",
        description: "Run code in 4+ languages with our sandboxed compiler.",
    },
    {
        icon: <Users className="h-8 w-8" />,
        title: "Live Leaderboards",
        description: "Compete with peers and climb the global rankings.",
    },
];

export function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const headerY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

    return (
        <section ref={containerRef} className="py-32 relative">
            <div className="container">
                <motion.div
                    style={{ y: headerY, opacity: headerOpacity }}
                    className="mx-auto max-w-2xl text-center mb-20"
                >
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                        Everything you need <br /> to <span className="text-primary">excel</span>.
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        A platform designed for growth, performance, and competition.
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature, i) => (
                        <FeatureCard key={i} feature={feature} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ feature, index }: { feature: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.2, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={cn(
                "group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 cursor-pointer",
                // Dark glassmorphism
                "bg-black/40 backdrop-blur-xl",
                "border border-neutral-800",
                // Hover - subtle blue/purple glow
                "hover:border-blue-500/30",
                "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
            )}
        >
            {/* Inner glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 rounded-2xl" />

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon container */}
                <div className={cn(
                    "mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl transition-all duration-300",
                    "bg-blue-500/20 text-blue-400",
                    "group-hover:bg-blue-500/30 group-hover:scale-110"
                )}>
                    <motion.div
                        whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                    >
                        {feature.icon}
                    </motion.div>
                </div>

                <h3 className="mb-3 text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {feature.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed group-hover:text-neutral-300 transition-colors">
                    {feature.description}
                </p>
            </div>
        </motion.div>
    );
}
