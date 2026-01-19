'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api.js';
import Link from 'next/link';
import {
    Loader2,
    AlertCircle,
    User,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Trophy,
    Timer,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';

export default function QuizAttemptPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const quizId = params.id;

    // Game States: loading -> intro -> playing -> submitting -> results
    const [gameState, setGameState] = useState("loading");

    // Data States
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    // Timer State
    const [startTime, setStartTime] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);

    // 1. Initial Load
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            loadQuiz();
        }
    }, [user, authLoading, router, quizId]);

    const loadQuiz = async () => {
        try {
            const res = await apiClient.getQuiz(quizId);
            if (res.success && res.quiz) {
                setQuiz(res.quiz);
                // Initialize answers array with -1 (unanswered)
                setAnswers(new Array(res.quiz.questions.length).fill(-1));
                setGameState("intro");
            } else {
                throw new Error(res.message || 'Quiz not found');
            }
        } catch (err) {
            console.error('Failed to load quiz:', err);
            setError(err.message || 'Failed to load quiz');
            setGameState("error");
        }
    };

    // 2. Actions
    const handleStartQuiz = () => {
        setStartTime(Date.now());
        setGameState("playing");
    };

    const handleAnswerSelect = (optionIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        // Calculate Time
        const endTime = Date.now();
        const duration = Math.floor((endTime - startTime) / 1000);
        setTimeTaken(duration);

        // Validation
        const unanswered = answers.filter(a => a === -1).length;
        if (unanswered > 0) {
            if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
        } else {
            if (!confirm('Are you sure you want to submit?')) return;
        }

        setGameState("submitting");

        try {
            console.log('Submitting quiz:', quizId);
            console.log('Answers:', answers);
            const res = await apiClient.submitQuiz(quizId, answers);
            console.log('Submit response:', res);
            if (res.success && res.results) {
                setResult(res.results);
                setGameState("results");
            } else {
                console.error('Submit failed:', res);
                throw new Error(res.message || 'No results returned');
            }
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.message || 'Failed to submit quiz');
            setGameState("error");
        }
    };

    // --- RENDER STATES ---

    // 1. Loading
    if (gameState === "loading" || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black/90 text-white">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-neutral-400">Loading quiz environment...</p>
                </div>
            </div>
        );
    }

    // 2. Error
    if (gameState === "error") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black/90 p-4">
                <div className="text-center p-8 rounded-2xl bg-neutral-900 border border-red-500/30 max-w-md w-full">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Error</h2>
                    <p className="text-neutral-400 mb-6">{error}</p>
                    <Link href="/quiz">
                        <button className="px-6 py-3 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all w-full">
                            Back to Quizzes
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    // 3. Intro / Registration (Replaced with Start Screen since we have Auth)
    if (gameState === "intro" && quiz) {
        return (
            <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-neutral-950 to-black text-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-lg mx-auto"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-white mb-4">{quiz.heading}</h1>
                            {quiz.description && (
                                <p className="text-neutral-400 mb-2">{quiz.description}</p>
                            )}
                            <div className="flex items-center justify-center gap-4 text-sm text-neutral-500 mt-4">
                                <span className="flex items-center gap-1"><Trophy className="w-4 h-4" /> {quiz.questions.length * 10 || 100} Points</span>
                                <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {quiz.questions.length} Questions</span>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-neutral-900/50 backdrop-blur-xl border border-neutral-800">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-500" />
                                Candidate Details
                            </h2>

                            <div className="space-y-4 mb-8">
                                <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
                                    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Name</p>
                                    <p className="text-lg font-medium text-white">{user.name}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
                                    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-lg font-medium text-white">{user.email}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleStartQuiz}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-lg bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-[0.98]"
                            >
                                Start Quiz
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // 4. Playing State
    if (gameState === "playing" && quiz) {
        const question = quiz.questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
        const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

        return (
            <div className="min-h-screen pt-20 pb-16 bg-neutral-950 text-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    {/* Header: Progress & Timer */}
                    <div className="mb-8 space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className="text-neutral-400 text-sm font-medium mb-1">
                                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                                </h2>
                                <h1 className="text-xl font-bold text-white truncate max-w-md">{quiz.heading}</h1>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
                                <Timer className="w-3.5 h-3.5" />
                                <span>In Progress</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>

                    {/* Question Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm"
                        >
                            <h3 className="text-xl md:text-2xl font-semibold text-white mb-8 leading-relaxed">
                                {question.question}
                            </h3>

                            <div className="space-y-3">
                                {question.options.map((option, idx) => {
                                    const isSelected = answers[currentQuestionIndex] === idx;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswerSelect(idx)}
                                            className={`
                                                w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden
                                                ${isSelected
                                                    ? 'border-blue-500 bg-blue-500/10 text-white'
                                                    : 'border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className={`
                                                    w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border transition-colors
                                                    ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 group-hover:border-neutral-500'}
                                                `}>
                                                    {String.fromCharCode(65 + idx)}
                                                </div>
                                                <span className="text-lg">{option}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer Controls */}
                    <div className="mt-8 flex justify-between items-center">
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${currentQuestionIndex === 0
                                    ? 'text-neutral-600 cursor-not-allowed'
                                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5" /> Previous
                        </button>

                        {isLastQuestion ? (
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-neutral-100 text-black hover:bg-white active:scale-95 transition-all"
                            >
                                Next <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // 5. Submitting State
    if (gameState === "submitting") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black/90 text-white">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-2">Submitting Answers</h2>
                    <p className="text-neutral-400">Calculating your score...</p>
                </div>
            </div>
        );
    }

    // 6. Results State
    if (gameState === "results" && result) {
        const percentage = Math.round(result.score);

        return (
            <div className="min-h-screen pt-24 pb-16 bg-neutral-950 text-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400/20 to-orange-500/20 mb-6 border border-orange-500/30">
                            <Trophy className="w-12 h-12 text-yellow-500 drop-shadow-lg" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Quiz Completed!</h1>
                        <p className="text-neutral-400">Here is how you performed on {quiz.heading}</p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm flex flex-col items-center">
                            <span className="text-neutral-400 text-sm uppercase tracking-wider mb-2">Score</span>
                            <span className={`text-4xl font-black ${percentage >= 70 ? 'text-green-500' : percentage >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                {percentage}%
                            </span>
                        </div>
                        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm flex flex-col items-center">
                            <span className="text-neutral-400 text-sm uppercase tracking-wider mb-2">Accuracy</span>
                            <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-2 text-green-400">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="text-xl font-bold">{result.correctAnswers}</span>
                                </div>
                                <div className="w-px h-8 bg-neutral-800" />
                                <div className="flex items-center gap-2 text-red-400">
                                    <XCircle className="w-5 h-5" />
                                    <span className="text-xl font-bold">{result.wrongAnswers}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm flex flex-col items-center">
                            <span className="text-neutral-400 text-sm uppercase tracking-wider mb-2">Time Taken</span>
                            <span className="text-2xl font-bold text-white">
                                {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
                            </span>
                        </div>
                    </div>

                    {/* Question Review */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white mb-4">Detailed Review</h3>
                        {result.details.map((detail, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`
                                    p-6 rounded-2xl border bg-neutral-900/30 backdrop-blur-sm
                                    ${detail.isCorrect ? 'border-green-500/20' : 'border-red-500/20'}
                                `}
                            >
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <h4 className="text-lg font-medium text-white">
                                        <span className="text-neutral-500 mr-2">#{idx + 1}</span>
                                        {detail.question}
                                    </h4>
                                    {detail.isCorrect ? (
                                        <span className="shrink-0 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Correct
                                        </span>
                                    ) : (
                                        <span className="shrink-0 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 flex items-center gap-1">
                                            <XCircle className="w-3 h-3" /> Incorrect
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    {detail.options.map((option, optIdx) => {
                                        let statusClass = "border-neutral-800 bg-neutral-900/50 text-neutral-400";

                                        // Highlight logic
                                        if (optIdx === detail.correctAnswer) {
                                            statusClass = "border-green-500/50 bg-green-500/10 text-green-200";
                                        } else if (optIdx === detail.userAnswer && !detail.isCorrect) {
                                            statusClass = "border-red-500/50 bg-red-500/10 text-red-200";
                                        }

                                        return (
                                            <div key={optIdx} className={`p-3 rounded-lg border text-sm flex justify-between items-center ${statusClass}`}>
                                                <span>{option}</span>
                                                {optIdx === detail.correctAnswer && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                                {optIdx === detail.userAnswer && !detail.isCorrect && <XCircle className="w-4 h-4 text-red-500" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center gap-4">
                        <Link href="/quiz">
                            <button className="px-8 py-3 rounded-xl font-medium bg-neutral-800 text-white hover:bg-neutral-700 transition-all">
                                Back to Quizzes
                            </button>
                        </Link>
                        <Link href="/dashboard">
                            <button className="px-8 py-3 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-500 transition-all">
                                Go to Dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}