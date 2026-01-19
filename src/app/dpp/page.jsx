'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api.js';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Code2,
    Clock,
    TrendingUp,
    ChevronRight,
    Zap,
    Target,
    BookOpen,
    Loader2
} from 'lucide-react';

export default function DPPPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            loadProblems();
        }
    }, [user, authLoading, router]);

    const loadProblems = async () => {
        try {
            setLoading(true);
            // Try to fetch from API, fallback to empty
            const res = await apiClient.request('/problems');
            if (res.success && res.problems) {
                setProblems(res.problems);
            }
        } catch (error) {
            console.log('No problems available yet');
            setProblems([]);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white/30 mx-auto mb-4" />
                    <p className="text-white/50">Loading problems...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'hard': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-white/40 bg-white/5 border-white/10';
        }
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <Code2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Daily Practice Problems</h1>
                            <p className="text-white/50 text-sm">Sharpen your coding skills with daily challenges</p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                            <Target className="h-5 w-5 text-white/40 mb-2" />
                            <p className="text-2xl font-bold text-white">{user.totalSolved || 0}</p>
                            <p className="text-xs text-white/40">Solved</p>
                        </div>
                        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                            <Zap className="h-5 w-5 text-white/40 mb-2" />
                            <p className="text-2xl font-bold text-white">{user.currentStreak || 0}</p>
                            <p className="text-xs text-white/40">Day Streak</p>
                        </div>
                        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                            <TrendingUp className="h-5 w-5 text-white/40 mb-2" />
                            <p className="text-2xl font-bold text-white">#{user.globalRank || '—'}</p>
                            <p className="text-xs text-white/40">Global Rank</p>
                        </div>
                        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                            <BookOpen className="h-5 w-5 text-white/40 mb-2" />
                            <p className="text-2xl font-bold text-white">{problems.length}</p>
                            <p className="text-xs text-white/40">Total Problems</p>
                        </div>
                    </div>
                </motion.div>

                {/* Problems List */}
                {problems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-2xl bg-white/5 border border-white/10 p-12 text-center"
                    >
                        <Code2 className="h-12 w-12 text-white/20 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No Problems Available</h3>
                        <p className="text-white/40 text-sm mb-6">
                            Daily practice problems will appear here once they're created by the admins.
                        </p>
                        <Link href="/compiler">
                            <button className="px-6 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-all">
                                Practice in Compiler
                            </button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        {problems.map((problem, index) => (
                            <motion.div
                                key={problem._id || problem.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link href={`/dpp/${problem.slug || problem._id || problem.id}`}>
                                    <div className="group rounded-xl bg-white/5 border border-white/10 p-4 sm:p-5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            {/* Problem Number */}
                                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-mono text-white/40">#{index + 1}</span>
                                            </div>

                                            {/* Problem Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white group-hover:text-white/90 transition-colors truncate">
                                                    {problem.title}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    {problem.tags?.slice(0, 3).map((tag, i) => (
                                                        <span key={i} className="text-xs text-white/30">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Difficulty Badge */}
                                            <span className={`hidden sm:block px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                                                {problem.difficulty || 'Unknown'}
                                            </span>

                                            {/* Solve Rate */}
                                            {problem.solveRate !== undefined && (
                                                <div className="hidden md:flex items-center gap-2 text-sm text-white/40">
                                                    <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                        <div
                                                            className="h-full bg-green-500/50 rounded-full"
                                                            style={{ width: `${problem.solveRate}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs w-8">{problem.solveRate}%</span>
                                                </div>
                                            )}

                                            {/* Arrow */}
                                            <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
