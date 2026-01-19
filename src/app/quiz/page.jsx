'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api.js';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  Trophy,
  Target,
  Loader2,
  Users,
  Zap
} from 'lucide-react';

export default function QuizPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      loadQuizzes();
    }
  }, [user, authLoading, router]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getQuizzes();
      if (res.success && res.quizzes) {
        setQuizzes(res.quizzes);
      }
    } catch (error) {
      console.error('Failed to load quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white/30 mx-auto mb-4" />
          <p className="text-white/50">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const activeQuizzes = quizzes.filter(q => q.isActive);
  const completedQuizzes = quizzes.filter(q => !q.isActive);

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
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Quizzes</h1>
              <p className="text-white/50 text-sm">Test your knowledge and compete with others</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <Zap className="h-5 w-5 text-green-400/70 mb-2" />
              <p className="text-2xl font-bold text-white">{activeQuizzes.length}</p>
              <p className="text-xs text-white/40">Active Quizzes</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <CheckCircle2 className="h-5 w-5 text-white/40 mb-2" />
              <p className="text-2xl font-bold text-white">{user.quizzesCompleted || 0}</p>
              <p className="text-xs text-white/40">Completed</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <Target className="h-5 w-5 text-white/40 mb-2" />
              <p className="text-2xl font-bold text-white">{user.quizScore || 0}</p>
              <p className="text-xs text-white/40">Total Score</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <Trophy className="h-5 w-5 text-white/40 mb-2" />
              <p className="text-2xl font-bold text-white">#{user.globalRank || '—'}</p>
              <p className="text-xs text-white/40">Rank</p>
            </div>
          </div>
        </motion.div>

        {/* No Quizzes State */}
        {quizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-12 text-center"
          >
            <FileText className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Quizzes Available</h3>
            <p className="text-white/40 text-sm mb-6">
              Quizzes will appear here once they're created by the admins.
            </p>
            {user.isAdmin && (
              <Link href="/admin">
                <button className="px-6 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-all">
                  Create Quiz in Admin Panel
                </button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Active Quizzes */}
            {activeQuizzes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Active Quizzes
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeQuizzes.map((quiz, index) => (
                    <QuizCard key={quiz._id || quiz.id} quiz={quiz} index={index} isActive={true} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Quizzes */}
            {completedQuizzes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white/60 mb-4">Past Quizzes</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {completedQuizzes.map((quiz, index) => (
                    <QuizCard key={quiz._id || quiz.id} quiz={quiz} index={index} isActive={false} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuizCard({ quiz, index, isActive }) {
  const quizId = quiz._id || quiz.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={isActive ? `/quiz/${quizId}` : '#'} className={!isActive ? 'cursor-not-allowed' : ''}>
        <div className={`group rounded-xl border p-5 transition-all ${isActive
            ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            : 'bg-white/[0.02] border-white/5 opacity-60'
          }`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold truncate ${isActive ? 'text-white' : 'text-white/50'}`}>
                {quiz.heading}
              </h3>
              {quiz.description && (
                <p className="text-sm text-white/40 mt-1 line-clamp-2">{quiz.description}</p>
              )}
            </div>
            {isActive && (
              <span className="flex-shrink-0 ml-3 px-2 py-1 rounded-full text-[10px] font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                Live
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-white/40 mb-4">
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>{quiz.questions?.length || 0} questions</span>
            </div>
            {quiz.participantCount !== undefined && (
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{quiz.participantCount} taken</span>
              </div>
            )}
          </div>

          {/* Action */}
          <button
            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${isActive
                ? 'bg-white text-black hover:bg-white/90'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            disabled={!isActive}
          >
            {isActive ? (
              <>
                Start Quiz
                <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              'Quiz Ended'
            )}
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
