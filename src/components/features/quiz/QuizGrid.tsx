"use client";

import { motion } from "framer-motion";
import { IconBrain, IconCode, IconDatabase, IconWorld, IconChartBar, IconLock } from "@tabler/icons-react";
import Link from "next/link";

const quizCategories = [
    {
        title: "Algorithms",
        description: "Master sorting, searching, and algorithmic thinking",
        icon: IconBrain,
        quizCount: 12,
        difficulty: "Medium",
        color: "from-blue-500 to-cyan-500",
        available: true,
    },
    {
        title: "Data Structures",
        description: "Arrays, linked lists, trees, graphs, and more",
        icon: IconDatabase,
        quizCount: 15,
        difficulty: "Hard",
        color: "from-purple-500 to-pink-500",
        available: true,
    },
    {
        title: "Web Development",
        description: "HTML, CSS, JavaScript, and modern frameworks",
        icon: IconWorld,
        quizCount: 20,
        difficulty: "Easy",
        color: "from-green-500 to-emerald-500",
        available: true,
    },
    {
        title: "Programming Basics",
        description: "Syntax, loops, conditions, and fundamentals",
        icon: IconCode,
        quizCount: 18,
        difficulty: "Easy",
        color: "from-orange-500 to-red-500",
        available: true,
    },
    {
        title: "System Design",
        description: "Architecture patterns and scalability",
        icon: IconChartBar,
        quizCount: 8,
        difficulty: "Hard",
        color: "from-indigo-500 to-purple-500",
        available: false,
    },
];

export function QuizGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizCategories.map((category, index) => (
                <QuizCard key={category.title} category={category} index={index} />
            ))}
        </div>
    );
}

function QuizCard({ category, index }: { category: typeof quizCategories[0]; index: number }) {
    const Icon = category.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
        >
            <Link href={category.available ? `/quiz/${category.title.toLowerCase().replace(" ", "-")}` : "#"}>
                <div
                    className={`
                        relative overflow-hidden rounded-2xl p-6 h-full min-h-[240px]
                        bg-black/40 backdrop-blur-xl border border-neutral-800
                        transition-all duration-300
                        ${category.available
                            ? "hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] cursor-pointer"
                            : "opacity-60 cursor-not-allowed"
                        }
                    `}
                >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity`} />

                    {/* Lock Icon for unavailable quizzes */}
                    {!category.available && (
                        <div className="absolute top-4 right-4">
                            <IconLock className="w-5 h-5 text-neutral-600" />
                        </div>
                    )}

                    <div className="relative z-10 flex flex-col h-full">
                        {/* Icon */}
                        <div className={`
                            mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl
                            bg-gradient-to-br ${category.color} bg-opacity-20
                            group-hover:scale-110 transition-transform
                        `}>
                            <Icon className="w-7 h-7 text-white" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {category.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-neutral-400 mb-4 leading-relaxed flex-grow">
                            {category.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs">
                            <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {category.quizCount} Quizzes
                            </span>
                            <span className={`
                                px-2 py-1 rounded-md
                                ${category.difficulty === "Easy" && "bg-green-500/10 text-green-400 border border-green-500/20"}
                                ${category.difficulty === "Medium" && "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"}
                                ${category.difficulty === "Hard" && "bg-red-500/10 text-red-400 border border-red-500/20"}
                            `}>
                                {category.difficulty}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
