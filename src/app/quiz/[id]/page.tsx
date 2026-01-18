'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { apiClient, Quiz, QuizResult } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Trophy } from 'lucide-react';

export default function QuizAttemptPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
      setLoading(true);
      const res = await apiClient.getQuiz(quizId);
      if (res.success && res.quiz) {
        setQuiz(res.quiz);
        setAnswers(new Array(res.quiz.questions.length).fill(-1));
      } else {
        console.error('Failed to load quiz:', res.message);
        alert('Quiz not found or is inactive');
        router.push('/quiz');
      }
    } catch (error: any) {
      console.error('Failed to load quiz:', error);
      alert('Failed to load quiz: ' + (error.message || 'Unknown error'));
      router.push('/quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!confirm('Are you sure you want to submit? You cannot change answers after submission.')) {
      return;
    }

    // Check if all questions are answered
    const unanswered = answers.filter(a => a === -1).length;
    if (unanswered > 0) {
      if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) {
        return;
      }
    }

    try {
      setSubmitting(true);
      const res = await apiClient.submitQuiz(quizId, answers);
      if (res.success && res.results) {
        setResult(res.results);
      }
    } catch (error: any) {
      alert('Failed to submit quiz: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!user || !quiz) {
    return null;
  }

  // Show results if quiz is submitted
  if (result) {
    return (
      <div className="container py-10">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <CardTitle className="text-3xl">Quiz Results</CardTitle>
            <CardDescription>{quiz.heading}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{result.score.toFixed(1)}%</div>
              <p className="text-muted-foreground">
                {result.correctAnswers} out of {result.totalQuestions} correct
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{result.correctAnswers}</div>
                    <p className="text-sm text-muted-foreground">Correct</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <XCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                    <div className="text-2xl font-bold">{result.wrongAnswers}</div>
                    <p className="text-sm text-muted-foreground">Wrong</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Question Review</h3>
              {result.details.map((detail, idx) => (
                <Card key={idx} className={detail.isCorrect ? 'border-green-500' : 'border-red-500'}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium">Question {idx + 1}</p>
                      {detail.isCorrect ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Correct
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Wrong
                        </Badge>
                      )}
                    </div>
                    <p className="mb-3">{detail.question}</p>
                    <div className="space-y-1">
                      {detail.options.map((option, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2 rounded ${
                            optIdx === detail.correctAnswer
                              ? 'bg-green-100 dark:bg-green-900'
                              : optIdx === detail.userAnswer && !detail.isCorrect
                              ? 'bg-red-100 dark:bg-red-900'
                              : 'bg-muted'
                          }`}
                        >
                          {option}
                          {optIdx === detail.correctAnswer && ' ✓'}
                          {optIdx === detail.userAnswer && optIdx !== detail.correctAnswer && ' ✗'}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-4">
              <Button onClick={() => router.push('/quiz')} className="flex-1">
                Back to Quizzes
              </Button>
              <Button onClick={() => router.push('/dashboard')} variant="outline" className="flex-1">
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = answers.filter(a => a !== -1).length;

  return (
    <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>{quiz.heading}</CardTitle>
              {quiz.description && (
                <CardDescription>{quiz.description}</CardDescription>
              )}
            </div>
            <Badge>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {answeredCount} of {quiz.questions.length} answered
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[currentQuestion] === index
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              Previous
            </Button>
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
