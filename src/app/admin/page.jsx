'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Trash2, Plus, Upload, Users, FileText, Copy,
  Activity, Calendar, Mail, Bell, Database,
  Download, Search, CheckCircle, XCircle, Clock, Trophy
} from 'lucide-react';

// --- Modern UI Helper Components ---

const StatCard = ({ icon: Icon, label, value, trend, colorClass, gradientFrom, gradientTo }) => (
  <div className={`
    relative overflow-hidden rounded-2xl p-6
    bg-gradient-to-br ${gradientFrom} ${gradientTo}
    border border-white/10 backdrop-blur-xl
    hover:scale-[1.02] hover:shadow-2xl hover:shadow-${colorClass}/20
    transition-all duration-300 group
  `}>
    {/* Glow Effect */}
    <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${colorClass} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10`}>
          <Icon className={`h-5 w-5 text-${colorClass}`} style={{ color: colorClass }} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-white/60 mb-1">{label}</p>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    </div>
  </div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-sm text-white/50">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // --- State Management ---
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Existing KodeClub Data
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // New IEEE Data (Mocked/Placeholder for structure)
  const [registrations, setRegistrations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeQuizzes: 0,
    totalAttempts: 0,
    newUsersLast7Days: 0,
    attemptsLast7Days: 0,
    recentActivity: [],
    topPerformers: []
  });
  const [graphData, setGraphData] = useState([]);

  // UI States
  const [showJsonInput, setShowJsonInput] = useState(false); // For Quiz
  const [jsonContent, setJsonContent] = useState(''); // For Quiz
  const [showUserBulkInput, setShowUserBulkInput] = useState(false); // For Users
  const [userBulkJson, setUserBulkJson] = useState(''); // For Users
  const [searchTerm, setSearchTerm] = useState('');
  const [announcementForm, setAnnouncementForm] = useState({ heading: '', body: '', image: null });

  // Report Dialog State
  const [selectedQuizReport, setSelectedQuizReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  // --- Auth & Data Loading ---
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
      // Fetch data
      const [usersRes, quizzesRes, statsRes] = await Promise.all([
        apiClient.getAllUsers(),
        apiClient.getAllQuizzes(),
        apiClient.request('/stats/dashboard').catch(() => ({ success: false }))
      ]);

      if (usersRes.success) setUsers(usersRes.users || []);
      if (quizzesRes.success) setQuizzes(quizzesRes.quizzes || []);

      if (statsRes.success) {
        setStats({
          totalUsers: statsRes.stats.totalUsers || 0,
          activeQuizzes: statsRes.stats.totalQuizzes || 0,
          totalAttempts: statsRes.stats.totalAttempts || 0,
          newUsersLast7Days: statsRes.stats.newUsersLast7Days || 0,
          attemptsLast7Days: statsRes.stats.attemptsLast7Days || 0,
          recentActivity: statsRes.recentActivity || [],
          topPerformers: statsRes.topPerformers || []
        });
        if (statsRes.graphData) {
          setGraphData(statsRes.graphData);
        }
      } else {
        // Fallback if stats endpoint fails
        setStats({
          totalUsers: usersRes.users?.length || 0,
          activeQuizzes: quizzesRes.quizzes?.filter(q => q.isActive).length || 0,
          totalAttempts: 0,
          newUsersLast7Days: 0,
          attemptsLast7Days: 0
        });
      }

    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = async (quizId) => {
    setReportLoading(true);
    try {
      const res = await apiClient.request(`/stats/quiz/${quizId}`);
      if (res.success) {
        setSelectedQuizReport(res);
      }
    } catch (error) {
      console.error("Failed to load report", error);
      alert("Could not load quiz report");
    } finally {
      setReportLoading(false);
    }
  };

  // --- Handlers (Existing KodeClub) ---

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await apiClient.deleteUser(userId);
      if (res.success) {
        // Use _id for MongoDB compatibility
        setUsers(users.filter(u => (u._id || u.id) !== userId));
      }
    } catch (error) {
      console.error('Delete user error:', error);
      alert('Failed to delete user: ' + error.message);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
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

  const handleToggleQuiz = async (quizId) => {
    try {
      console.log('Toggling quiz:', quizId);
      const res = await apiClient.toggleQuizStatus(quizId);
      console.log('Toggle response:', res);
      if (res.success && res.quiz) {
        setQuizzes(quizzes.map(q => (q.id || q._id) === quizId ? res.quiz : q));
        alert(`Quiz ${res.quiz.isActive ? 'activated' : 'deactivated'} successfully!`);
      } else {
        alert('Failed to toggle: ' + (res.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Failed to toggle quiz status: ' + (error.message || 'Unknown error'));
    }
  };

  // --- Handlers (New IEEE Features) ---

  const handleBulkCreateUsers = async () => {
    if (!userBulkJson.trim()) return alert('Please provide JSON data');
    try {
      const parsedUsers = JSON.parse(userBulkJson);
      if (!Array.isArray(parsedUsers)) return alert('Data must be an array of user objects');

      // Integration Point: Call your bulk create API here
      // await apiClient.bulkCreateUsers(parsedUsers);

      alert(`Simulated creation of ${parsedUsers.length} users.`);
      setUsers([...users, ...parsedUsers.map((u, i) => ({ ...u, id: `new-${i}`, memberSince: new Date() }))]);
      setUserBulkJson('');
      setShowUserBulkInput(false);
    } catch (err) {
      alert('Invalid JSON format');
    }
  };

  const handleExportCSV = () => {
    alert("Triggering CSV Download... (Implement API call)");
  };

  const handleQuizFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
        const res = await apiClient.uploadQuiz(json);
        if (res.success) {
          alert('Quiz created successfully!');
          setQuizzes([...quizzes, res.quiz]);
        }
      } catch (err) {
        alert('Invalid JSON or upload failed');
      }
    };
    reader.readAsText(file);
  };

  const handleCreateQuizFromJson = async () => {
    if (!jsonContent.trim()) {
      alert('Please paste JSON content first');
      return;
    }
    try {
      const quizData = JSON.parse(jsonContent);
      const res = await apiClient.uploadQuiz(quizData);
      if (res.success) {
        alert('Quiz created successfully!');
        setQuizzes([...quizzes, res.quiz]);
        setJsonContent('');
        setShowJsonInput(false);
      } else {
        alert('Failed to create quiz: ' + (res.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Invalid JSON format: ' + err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Modern Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 border border-white/10 p-8 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500 rounded-full blur-3xl opacity-20" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
              </div>
              <p className="text-white/60">Manage KodeClub users, quizzes, events, and data.</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="py-1.5 px-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-300">
                🔐 Admin Mode
              </Badge>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-white/60">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex h-auto p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl gap-1">
              <TabsTrigger value="overview" className="py-2.5 px-5 gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                <Activity className="h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="py-2.5 px-5 gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                <Users className="h-4 w-4" /> Users
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="py-2.5 px-5 gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                <FileText className="h-4 w-4" /> Quizzes
              </TabsTrigger>
              <TabsTrigger value="registrations" className="py-2.5 px-5 gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                <Database className="h-4 w-4" /> Registrations
              </TabsTrigger>
              <TabsTrigger value="contacts" className="py-2.5 px-5 gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                <Mail className="h-4 w-4" /> Contacts
              </TabsTrigger>
              <TabsTrigger value="announcements" className="py-2.5 px-5 gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                <Bell className="h-4 w-4" /> Announcements
              </TabsTrigger>
            </TabsList>
          </div>

          {/* --- OVERVIEW TAB --- */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Users}
                label="Total Users"
                value={stats.totalUsers}
                colorClass="#a855f7"
                gradientFrom="from-purple-500/20"
                gradientTo="to-purple-900/20"
              />
              <StatCard
                icon={FileText}
                label="Active Quizzes"
                value={stats.activeQuizzes}
                colorClass="#3b82f6"
                gradientFrom="from-blue-500/20"
                gradientTo="to-blue-900/20"
              />
              <StatCard
                icon={CheckCircle}
                label="Total Attempts"
                value={stats.totalAttempts}
                colorClass="#10b981"
                gradientFrom="from-emerald-500/20"
                gradientTo="to-emerald-900/20"
              />
              <StatCard
                icon={Activity}
                label="New Users (7d)"
                value={stats.newUsersLast7Days}
                colorClass="#f59e0b"
                gradientFrom="from-amber-500/20"
                gradientTo="to-amber-900/20"
              />
            </div>

            {/* Quick Stats Panel */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {stats.recentActivity?.length > 0 ? (
                    stats.recentActivity.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className={`w-2 h-2 rounded-full ${item.type === 'user_register' ? 'bg-green-500' : 'bg-blue-500'}`} />
                        <div className="flex flex-col">
                          <span className="text-sm text-white/70">
                            {item.type === 'user_register'
                              ? `New user ${item.data.name || 'joined'}`
                              : `Quiz attempt by ${item.data.userId?.name || 'User'}`
                            }
                          </span>
                          <span className="text-xs text-white/30">
                            {new Date(item.date).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-white/30 text-center py-4">No recent activity</div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Top Performers
                </h3>
                <div className="space-y-3">
                  {stats.topPerformers?.length > 0 ? (
                    stats.topPerformers.map((u, i) => (
                      <div key={u._id || u.id || i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          i === 1 ? 'bg-gray-400/20 text-gray-300' :
                            i === 2 ? 'bg-orange-500/20 text-orange-400' :
                              'bg-white/10 text-white/50'
                          }`}>
                          {i + 1}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm text-white/70">{u.name || u.username || 'User'}</span>
                          <span className="text-xs text-white/30">@{u.username}</span>
                        </div>
                        <span className="text-xs text-white/40 ml-auto">{u.totalSolved || 0} solved</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-white/30 text-center py-4">No top performers yet</div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* --- USERS & DATABASE TAB --- */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* User List */}
              <Card className="md:col-span-2 bg-[#0a0a0a] border-white/10">
                <CardHeader className="border-b border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-white">User Management</CardTitle>
                      <CardDescription className="text-white/50">{users.length} registered users</CardDescription>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-full sm:w-[200px] bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                    {users
                      .filter(u =>
                        !searchTerm ||
                        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.username?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((u) => (
                        <div key={u._id || u.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors group">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-white/70">
                              {(u.username || u.name)?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white truncate">
                                {u.name || 'Unknown'}
                              </span>
                              {u.username && (
                                <span className="text-xs text-white/40">@{u.username}</span>
                              )}
                              {u.isAdmin && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-medium">Admin</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-white/40">
                              <span className="truncate">{u.email}</span>
                            </div>
                          </div>

                          {/* Provider Badge */}
                          <div className="hidden sm:flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${u.provider === 'google'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-white/5 text-white/40 border border-white/10'
                              }`}>
                              {u.provider === 'google' ? '🔵 Google' : '✉️ Email'}
                            </span>
                          </div>

                          {/* Stats */}
                          <div className="hidden md:flex items-center gap-4 text-xs text-white/40">
                            <div className="text-center">
                              <div className="font-medium text-white/70">{u.totalSolved || 0}</div>
                              <div>Solved</div>
                            </div>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteUser(u._id || u.id)}
                            className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    {users.length === 0 && (
                      <div className="p-8 text-center text-white/30">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No users found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Bulk Creation Tool (From IEEE) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-500" /> Bulk Create
                  </CardTitle>
                  <CardDescription>Add users via JSON array</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant={showUserBulkInput ? "secondary" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setShowUserBulkInput(!showUserBulkInput)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {showUserBulkInput ? 'Close Input' : 'Open Bulk Creator'}
                  </Button>

                  {showUserBulkInput && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                      <Textarea
                        placeholder='[{"username":"usr1", "email":"..."}]'
                        className="font-mono text-xs h-48"
                        value={userBulkJson}
                        onChange={(e) => setUserBulkJson(e.target.value)}
                      />
                      <Button className="w-full" onClick={handleBulkCreateUsers}>
                        <Upload className="mr-2 h-4 w-4" /> Process JSON
                      </Button>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                    <strong>Format:</strong> Array of objects containing username, full_name, email, etc.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* --- QUIZZES TAB (Existing KodeClub Logic) --- */}
          <TabsContent value="quizzes" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Quiz Library</CardTitle>
                    <CardDescription>Manage questions and active status.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant={showJsonInput ? "secondary" : "outline"} onClick={() => setShowJsonInput(!showJsonInput)}>
                      <Copy className="mr-2 h-4 w-4" /> {showJsonInput ? 'Hide Paste' : 'Paste JSON'}
                    </Button>
                    <div className="relative">
                      <Button variant="outline" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" /> Upload JSON
                      </Button>
                      <input type="file" accept=".json" onChange={handleQuizFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </CardHeader>

              {showJsonInput && (
                <CardContent className="border-t pt-6 bg-muted/30">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Paste Quiz JSON</h3>
                    <Textarea
                      value={jsonContent}
                      onChange={(e) => setJsonContent(e.target.value)}
                      className="font-mono h-48"
                      placeholder='{"heading": "Title", "questions": [...] }'
                    />
                    <Button className="w-full sm:w-auto" onClick={handleCreateQuizFromJson}>Create Quiz from Text</Button>
                  </div>
                </CardContent>
              )}

              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {quizzes.map((quiz) => {
                    const isActive = quiz.isActive;
                    return (
                      <Card
                        key={quiz.id || quiz._id}
                        className={`overflow-hidden transition-all duration-300 ${isActive
                          ? 'border-green-500/30 bg-gradient-to-br from-green-500/5 to-transparent'
                          : 'border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent opacity-75'
                          }`}
                      >
                        {/* Status Bar */}
                        <div className={`h-1.5 w-full ${isActive ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-orange-500'}`} />

                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start gap-2">
                            <CardTitle className="text-lg line-clamp-1">{quiz.heading || 'Untitled Quiz'}</CardTitle>
                            <Badge
                              className={`shrink-0 ${isActive
                                ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                                }`}
                            >
                              {isActive ? '● Live' : '○ Draft'}
                            </Badge>
                          </div>
                          <CardDescription className="line-clamp-2 mt-1">{quiz.description || 'No description'}</CardDescription>
                        </CardHeader>

                        <CardContent className="pb-4">
                          <div className="flex items-center text-xs text-muted-foreground mb-4 gap-3">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" />
                              {quiz.questions?.length || 0} Questions
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(quiz.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            {/* Toggle Button - Clear visual */}
                            <Button
                              size="sm"
                              className={`flex-1 transition-all ${isActive
                                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30'
                                }`}
                              variant="ghost"
                              onClick={() => handleToggleQuiz(quiz.id || quiz._id)}
                            >
                              {isActive ? 'Deactivate' : 'Activate'}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/10 hover:bg-white/10"
                              onClick={() => handleViewReport(quiz.id || quiz._id)}
                              disabled={reportLoading}
                            >
                              {reportLoading ? '...' : 'Report'}
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                              onClick={() => handleDeleteQuiz(quiz.id || quiz._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- REGISTRATIONS TAB (From IEEE) --- */}
          <TabsContent value="registrations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Event Registrations</CardTitle>
                    <CardDescription>Track teams and participants.</CardDescription>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search teams..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" onClick={handleExportCSV}>
                      <Download className="mr-2 h-4 w-4" /> CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="h-10 px-4 text-left font-medium text-muted-foreground">Event</th>
                        <th className="h-10 px-4 text-left font-medium text-muted-foreground">Team</th>
                        <th className="h-10 px-4 text-left font-medium text-muted-foreground">Leader</th>
                        <th className="h-10 px-4 text-left font-medium text-muted-foreground">Status</th>
                        <th className="h-10 px-4 text-right font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Placeholder for registrations map */}
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          No registrations found
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- CONTACTS TAB (From IEEE) --- */}
          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Inquiries</CardTitle>
                <CardDescription>Manage messages from the contact form.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="cursor-pointer">All</Badge>
                    <Badge variant="outline" className="cursor-pointer">New</Badge>
                    <Badge variant="outline" className="cursor-pointer">Replied</Badge>
                  </div>
                  <div className="rounded-md border p-8 text-center text-muted-foreground">
                    No messages yet
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- ANNOUNCEMENTS TAB (From IEEE) --- */}
          <TabsContent value="announcements" className="space-y-6">
            <div className="flex justify-end">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Announcement
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2 opacity-50" />
                  <p>No active announcements</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>

        <Dialog open={!!selectedQuizReport} onOpenChange={(open) => !open && setSelectedQuizReport(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedQuizReport?.quizName} - Performance Report</DialogTitle>
              <DialogDescription>
                Stats and student results.
              </DialogDescription>
            </DialogHeader>
            {selectedQuizReport && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-muted/50 border-0">
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold">{selectedQuizReport.totalAttempts}</div>
                      <p className="text-xs text-muted-foreground">Total Attempts</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-0">
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold text-blue-500">{selectedQuizReport.averageScore}</div>
                      <p className="text-xs text-muted-foreground">Avg. Score</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-0">
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold text-green-500">{selectedQuizReport.highestScore}</div>
                      <p className="text-xs text-muted-foreground">Highest Score</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Student Results</h4>
                  <div className="border rounded-md">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="h-10 px-4 text-left font-medium text-muted-foreground">Student</th>
                          <th className="h-10 px-4 text-left font-medium text-muted-foreground">Email</th>
                          <th className="h-10 px-4 text-right font-medium text-muted-foreground">Score</th>
                          <th className="h-10 px-4 text-right font-medium text-muted-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedQuizReport.results?.length > 0 ? (
                          selectedQuizReport.results.map((result, i) => (
                            <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                              <td className="p-3 font-medium">{result.userId?.name || 'Unknown'}</td>
                              <td className="p-3 text-muted-foreground">{result.userId?.email || '-'}</td>
                              <td className="p-3 text-right font-bold">{result.score}</td>
                              <td className="p-3 text-right text-muted-foreground">
                                {new Date(result.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-muted-foreground">
                              No attempts yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}