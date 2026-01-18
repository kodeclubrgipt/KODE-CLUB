'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient, Quiz, QuizResult } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function QuizPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
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
      } else {
        console.error('Failed to load quizzes:', res.message);
      }
    } catch (error: any) {
      console.error('Failed to load quizzes:', error);
      alert('Failed to load quizzes: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container py-4 sm:py-6 md:py-10 px-4 sm:px-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container py-4 sm:py-6 md:py-10 px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Available Quizzes</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Test your knowledge</p>
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No quizzes available yet.</p>
            {user.isAdmin && (
              <Link href="/admin">
                <Button className="mt-4">
                  Go to Admin Panel to Upload Quizzes
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => {
            const quizId = quiz.id || quiz._id;
            if (!quizId) {
              console.error('Quiz missing ID:', quiz);
              return null;
            }
            return (
              <Card key={quizId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{quiz.heading}</CardTitle>
                  {quiz.description && (
                    <CardDescription>{quiz.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {quiz.questions?.length || 0} questions
                      </span>
                      <Badge variant="secondary">
                        {quiz.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <Link href={`/quiz/${quizId}`}>
                      <Button className="w-full" disabled={!quiz.isActive}>
                        {quiz.isActive ? 'Start Quiz' : 'Quiz Inactive'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
