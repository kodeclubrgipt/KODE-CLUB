'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, Code2, Trophy, FileText, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
            <div className="container py-10 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground">Loading...</p>
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

    return (
        <div className="container py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user.name}!</p>
                </div>
                <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Solved
                        </CardTitle>
                        <Code2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{user.totalSolved || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Problems solved
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Current Streak
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{user.currentStreak || 0} Days</div>
                        <p className="text-xs text-muted-foreground">
                            Keep it up!
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">#{user.globalRank || 'N/A'}</div>
                        <p className="text-xs text-muted-foreground">
                            Your ranking
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Member Since
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Active Member
                        </p>
                    </CardContent>
                </Card>
            </div>

            {user.isAdmin && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Admin Panel
                        </CardTitle>
                        <CardDescription>
                            Manage users and quizzes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/admin">
                            <Button>
                                <Settings className="mr-2 h-4 w-4" />
                                Go to Admin Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Quizzes
                    </CardTitle>
                    <CardDescription>
                        Test your knowledge with quizzes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/quiz">
                        <Button>
                            <FileText className="mr-2 h-4 w-4" />
                            View Available Quizzes
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your problem solving activity this week.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm border-dashed border-2 rounded-md">
                            Activity Graph Placeholder
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Submissions</CardTitle>
                        <CardDescription>
                            Your latest code submissions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { problem: "Two Sum", status: "Accepted", time: "2 hours ago" },
                                { problem: "Median of Arrays", status: "Wrong Answer", time: "5 hours ago" },
                                { problem: "LRU Cache", status: "Accepted", time: "1 day ago" },
                            ].map((sub, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium text-sm">{sub.problem}</p>
                                        <p className="text-xs text-muted-foreground">{sub.time}</p>
                                    </div>
                                    <Badge variant={sub.status === "Accepted" ? "default" : "destructive"}>{sub.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
