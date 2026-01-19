'use client';

import { useAuth } from "@/contexts/AuthContext.jsx";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Activity,
    Calendar,
    Code2,
    Trophy,
    FileText,
    Settings,
    ArrowUpRight,
    CheckCircle2,
    XCircle,
    Zap,
    Target,
    TrendingUp,
    Clock,
    Star
} from "lucide-react";

// Modern Stat Card Component
const StatCard = ({ icon: Icon, label, value, subtext, gradient, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${gradient} border border-white/10 backdrop-blur-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group`}
    >
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity bg-white/20" />

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                    <Icon className="h-5 w-5 text-white" />
                </div>
            </div>
            <p className="text-sm font-medium text-white/60 mb-1">{label}</p>
            <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
            {subtext && <p className="text-xs text-white/50 mt-1">{subtext}</p>}
        </div>
    </motion.div>
);

// Quick Action Card
const ActionCard = ({ icon: Icon, title, description, href, gradient, buttonText }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${gradient} border border-white/10 backdrop-blur-xl group`}
    >
        {/* Background icon */}
        <div className="absolute -bottom-8 -right-8 opacity-10">
            <Icon className="w-32 h-32" />
        </div>

        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                    <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            <p className="text-sm text-white/60 mb-6">{description}</p>
            <Link href={href}>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 hover:scale-105 transition-all group/btn">
                    {buttonText}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </button>
            </Link>
        </div>
    </motion.div>
);

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto mb-4" />
                    <p className="text-white/50 animate-pulse">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const initials = user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const recentSubmissions = [
        { problem: "Two Sum", status: "Accepted", time: "2 hours ago", diff: "Easy" },
        { problem: "Median of Arrays", status: "Wrong Answer", time: "5 hours ago", diff: "Hard" },
        { problem: "LRU Cache", status: "Accepted", time: "1 day ago", diff: "Medium" },
    ];

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 border border-white/10 p-8"
                >
                    {/* Background effects */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500 rounded-full blur-3xl opacity-20" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                                    <span className="text-2xl font-bold text-white">{initials}</span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-4 border-black/50 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                            </div>

                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                    Welcome back, {user.name}!
                                </h1>
                                <p className="text-white/50">{user.email}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium">
                                        {user.isAdmin ? '🔐 Admin' : '👤 Member'}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-medium">
                                        🔥 {user.currentStreak || 0} Day Streak
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick stats mini */}
                        <div className="flex items-center gap-4">
                            <div className="text-center px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-2xl font-bold text-white">{user.totalSolved || 0}</p>
                                <p className="text-xs text-white/50">Solved</p>
                            </div>
                            <div className="text-center px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-2xl font-bold text-white">#{user.globalRank || '—'}</p>
                                <p className="text-xs text-white/50">Rank</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={Code2}
                        label="Problems Solved"
                        value={user.totalSolved || 0}
                        subtext="Keep coding!"
                        gradient="from-blue-500/20 to-blue-900/20"
                        delay={0.1}
                    />
                    <StatCard
                        icon={Zap}
                        label="Current Streak"
                        value={`${user.currentStreak || 0} Days`}
                        subtext="Consistency is key"
                        gradient="from-orange-500/20 to-red-900/20"
                        delay={0.2}
                    />
                    <StatCard
                        icon={Trophy}
                        label="Global Rank"
                        value={`#${user.globalRank || '—'}`}
                        subtext="Top 10% of users"
                        gradient="from-amber-500/20 to-yellow-900/20"
                        delay={0.3}
                    />
                    <StatCard
                        icon={Calendar}
                        label="Member Since"
                        value={new Date(user.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        subtext="Active contributor"
                        gradient="from-emerald-500/20 to-green-900/20"
                        delay={0.4}
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2">
                    <ActionCard
                        icon={FileText}
                        title="Knowledge Check"
                        description="Test your skills and improve your ranking with our curated quizzes."
                        href="/quiz"
                        gradient="from-purple-500/10 to-purple-900/10"
                        buttonText="View Quizzes"
                    />
                    {user.isAdmin && (
                        <ActionCard
                            icon={Settings}
                            title="Admin Controls"
                            description="Manage user accounts, content, and system configurations."
                            href="/admin"
                            gradient="from-slate-500/10 to-slate-900/10"
                            buttonText="Go to Admin"
                        />
                    )}
                    {!user.isAdmin && (
                        <ActionCard
                            icon={Target}
                            title="Practice Problems"
                            description="Solve daily practice problems to improve your coding skills."
                            href="/dpp"
                            gradient="from-cyan-500/10 to-cyan-900/10"
                            buttonText="Start Practicing"
                        />
                    )}
                </div>

                {/* Activity & Submissions */}
                <div className="grid gap-6 lg:grid-cols-7">
                    {/* Activity Overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Activity Overview</h3>
                                <p className="text-sm text-white/50">Your problem solving frequency</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                <TrendingUp className="h-4 w-4 text-green-400" />
                                <span className="text-xs text-green-400">+12%</span>
                            </div>
                        </div>

                        {/* Activity placeholder */}
                        <div className="h-48 flex items-center justify-center rounded-xl bg-white/5 border border-dashed border-white/10">
                            <div className="text-center">
                                <Activity className="h-8 w-8 text-white/30 mx-auto mb-2" />
                                <p className="text-sm text-white/40">Activity chart coming soon</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Submissions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Recent Submissions</h3>
                                <p className="text-sm text-white/50">Your latest attempts</p>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">
                                History
                            </span>
                        </div>

                        <div className="space-y-4">
                            {recentSubmissions.map((sub, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                                >
                                    <div className={`p-2 rounded-lg ${sub.status === "Accepted" ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                        {sub.status === "Accepted" ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                                            {sub.problem}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${sub.diff === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                    sub.diff === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {sub.diff}
                                            </span>
                                            <span className="text-xs text-white/40 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {sub.time}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-medium ${sub.status === "Accepted" ? 'text-green-400' : 'text-red-400'}`}>
                                        {sub.status === "Accepted" ? '✓' : '✗'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}