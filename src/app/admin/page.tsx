'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient, User, Quiz } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Upload, Users, FileText, Copy } from 'lucide-react';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [showJsonInput, setShowJsonInput] = useState(false);
  const [jsonContent, setJsonContent] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (!user.isAdmin) {
        router.push('/dashboard');
        return;
      }
      loadData();
    }
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, quizzesRes] = await Promise.all([
        apiClient.getAllUsers(),
        apiClient.getAllQuizzes(),
      ]);
      if (usersRes.success) setUsers(usersRes.users || []);
      if (quizzesRes.success) setQuizzes(quizzesRes.quizzes || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await apiClient.deleteUser(userId);
      if (res.success) {
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    try {
      const res = await apiClient.deleteQuiz(quizId);
      if (res.success) {
        setQuizzes(quizzes.filter(q => (q.id || q._id) !== quizId));
      }
    } catch (error) {
      alert('Failed to delete quiz');
    }
  };

  const handleToggleQuiz = async (quizId: string) => {
    try {
      const res = await apiClient.toggleQuizStatus(quizId);
      if (res.success && res.quiz) {
        setQuizzes(quizzes.map(q => (q.id || q._id) === quizId ? res.quiz! : q));
      }
    } catch (error) {
      alert('Failed to toggle quiz status');
    }
  };

  const validateAndUploadQuiz = async (jsonData: any) => {
    // Support both "questions" and "quiz" field names
    const questions = jsonData.questions || jsonData.quiz;
    
    // Validate JSON structure
    if (!jsonData.heading || !questions || !Array.isArray(questions)) {
      alert('Invalid quiz format. Required: heading, and questions/quiz array');
      return false;
    }

    // Validate questions (accept both correctAnswer and correct_answer)
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || !q.options || !Array.isArray(q.options)) {
        alert(`Invalid question ${i + 1}. Required: question, options array`);
        return false;
      }
      
      // Check if correctAnswer (number) or correct_answer (string) exists
      const hasCorrectAnswer = typeof q.correctAnswer === 'number';
      const hasCorrectAnswerString = typeof q.correct_answer === 'string';
      
      if (!hasCorrectAnswer && !hasCorrectAnswerString) {
        alert(`Invalid question ${i + 1}. Must have either correctAnswer (number) or correct_answer (string)`);
        return false;
      }
      
      // If correct_answer is string, verify it exists in options
      if (hasCorrectAnswerString && !q.options.includes(q.correct_answer)) {
        alert(`Invalid question ${i + 1}. correct_answer "${q.correct_answer}" not found in options`);
        return false;
      }
    }

    try {
      const res = await apiClient.uploadQuiz(jsonData);
      if (res.success) {
        alert('Quiz uploaded successfully!');
        return true;
      }
      return false;
    } catch (error: any) {
      alert('Failed to upload quiz: ' + (error.message || 'Unknown error'));
      return false;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        const success = await validateAndUploadQuiz(jsonData);
        if (success) {
          event.target.value = ''; // Reset input
          loadData(); // Reload quizzes
        }
      } catch (error: any) {
        alert('Failed to parse JSON: ' + (error.message || 'Invalid JSON format'));
      }
    };
    reader.readAsText(file);
  };

  const handlePasteJson = async () => {
    if (!jsonContent.trim()) {
      alert('Please paste JSON content');
      return;
    }

    try {
      const jsonData = JSON.parse(jsonContent);
      const success = await validateAndUploadQuiz(jsonData);
      if (success) {
        setJsonContent(''); // Clear textarea
        setShowJsonInput(false); // Hide input
        loadData(); // Reload quizzes
      }
    } catch (error: any) {
      alert('Failed to parse JSON: ' + (error.message || 'Invalid JSON format'));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users and quizzes</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users ({users.length})
          </TabsTrigger>
          <TabsTrigger value="quizzes">
            <FileText className="mr-2 h-4 w-4" />
            Quizzes ({quizzes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Provider</th>
                      <th className="text-left p-2">Member Since</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b">
                        <td className="p-2">{u.name}</td>
                        <td className="p-2">{u.email}</td>
                        <td className="p-2 capitalize">{u.provider}</td>
                        <td className="p-2">
                          {new Date(u.memberSince).toLocaleDateString()}
                        </td>
                        <td className="p-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={u.id === user.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Quizzes</CardTitle>
                  <CardDescription>Manage quiz content</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={showJsonInput ? "default" : "outline"}
                    onClick={() => {
                      setShowJsonInput(!showJsonInput);
                      if (showJsonInput) {
                        setJsonContent('');
                      }
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {showJsonInput ? 'Cancel Paste' : 'Paste JSON'}
                  </Button>
                  <label htmlFor="quiz-upload">
                    <Button asChild variant="outline">
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload File
                      </span>
                    </Button>
                    <input
                      id="quiz-upload"
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </CardHeader>
            {showJsonInput && (
              <CardContent className="border-t pt-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Paste JSON Content
                    </label>
                    <textarea
                      value={jsonContent}
                      onChange={(e) => setJsonContent(e.target.value)}
                      placeholder='{"heading": "Quiz Title", "description": "Optional", "questions": [{"question": "Question text?", "options": ["Option 1", "Option 2"], "correctAnswer": 0}]}'
                      className="w-full h-64 p-3 rounded-md border bg-background font-mono text-sm resize-y"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Paste your quiz JSON here. Format: heading, description (optional), and questions array.
                    </p>
                  </div>
                  <Button onClick={handlePasteJson} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Quiz from JSON
                  </Button>
                </div>
              </CardContent>
            )}
            <CardContent>
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <Card key={quiz.id || quiz._id || Math.random().toString()}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{quiz.heading}</CardTitle>
                          {quiz.description && (
                            <CardDescription>{quiz.description}</CardDescription>
                          )}
                          <p className="text-sm text-muted-foreground mt-2">
                            {quiz.questions?.length || 0} questions • Created{' '}
                            {new Date(quiz.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant={quiz.isActive ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              const quizId = quiz.id || quiz._id;
                              if (quizId) handleToggleQuiz(quizId);
                            }}
                          >
                            {quiz.isActive ? 'Active' : 'Inactive'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const quizId = quiz.id || quiz._id;
                              if (quizId) handleDeleteQuiz(quizId);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
                {quizzes.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No quizzes yet. Upload a JSON file to create one.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
