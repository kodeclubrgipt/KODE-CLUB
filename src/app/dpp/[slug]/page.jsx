'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { apiClient } from '@/lib/api.js';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    Code2,
    ChevronRight,
    Loader2,
    Tag as TagIcon
} from 'lucide-react';

export default function ProblemPage({ params }) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            loadProblem();
        }
    }, [user, authLoading, params.slug]);

    const loadProblem = async () => {
        try {
            setLoading(true);
            const res = await apiClient.request(`/problems/${params.slug}`);
            if (res.success && res.problem) {
                setProblem(res.problem);
            } else {
                setError('Problem not found');
            }
        } catch (err) {
            console.error('Failed to load problem:', err);
            setError('Problem not found');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white/30 mx-auto mb-4" />
                    <p className="text-white/50">Loading problem...</p>
                </div>
            </div>
        );
    }

    if (error || !problem) {
        return (
            <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/dpp"
                        className="inline-flex items-center text-sm text-white/50 hover:text-white mb-8"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Problems
                    </Link>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-12 text-center">
                        <Code2 className="h-12 w-12 text-white/20 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">Problem Not Found</h3>
                        <p className="text-white/40 text-sm">This problem doesn't exist or has been removed.</p>
                    </div>
                </div>
            </div>
        );
    }

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
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Link
                        href="/dpp"
                        className="inline-flex items-center text-sm text-white/50 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Problems
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                {problem.title}
                            </h1>
                            <div className="flex items-center gap-3 flex-wrap">
                                {problem.publishDate && (
                                    <span className="flex items-center gap-1.5 text-sm text-white/40">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(problem.publishDate).toLocaleDateString()}
                                    </span>
                                )}
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                                    {problem.difficulty || 'Unknown'}
                                </span>
                            </div>
                        </div>
                        <Link href="/compiler">
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-all">
                                <Code2 className="h-4 w-4" />
                                Open Compiler
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* Content Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid gap-6 lg:grid-cols-[1fr_280px]"
                >
                    {/* Problem Description */}
                    <div className="rounded-xl bg-white/5 border border-white/10 p-6 overflow-hidden">
                        <div className="prose prose-invert max-w-none prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/10 prose-code:text-green-400">
                            <ReactMarkdown>{problem.description || 'No description available.'}</ReactMarkdown>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Tags */}
                        {problem.tags && problem.tags.length > 0 && (
                            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                                <h3 className="text-sm font-medium text-white mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {problem.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60"
                                        >
                                            <TagIcon className="h-3 w-3" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                            <h3 className="text-sm font-medium text-white mb-3">Stats</h3>
                            <div className="space-y-3">
                                {problem.solveRate !== undefined && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-white/40">Solve Rate</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500/50 rounded-full"
                                                    style={{ width: `${problem.solveRate}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-white">{problem.solveRate}%</span>
                                        </div>
                                    </div>
                                )}
                                {problem.submissions !== undefined && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-white/40">Submissions</span>
                                        <span className="text-sm font-medium text-white">{problem.submissions}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
