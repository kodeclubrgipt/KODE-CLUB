"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Search, Filter } from "lucide-react";
import { apiClient } from "@/lib/api";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState("global");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchLeaderboard(selectedQuiz);
    }, [selectedQuiz]);

    const fetchInitialData = async () => {
        try {
            const quizzesRes = await apiClient.getQuizzes();
            if (quizzesRes && quizzesRes.quizzes) {
                setQuizzes(quizzesRes.quizzes);
            }
        } catch (error) {
            console.error("Failed to fetch quizzes:", error);
        }
    };

    const fetchLeaderboard = async (quizId) => {
        setIsLoading(true);
        try {
            let res;
            if (quizId === "global") {
                res = await apiClient.request('/leaderboard');
            } else {
                res = await apiClient.request(`/leaderboard/${quizId}`);
            }

            if (res && res.leaderboard) {
                setLeaderboard(res.leaderboard);
            } else {
                setLeaderboard([]);
            }
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
            setLeaderboard([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-10 min-h-screen max-w-7xl mx-auto">
            <div className="mb-8 text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    Champions Leaderboard
                </h1>
                <p className="text-white/50 max-w-2xl mx-auto text-sm sm:text-base">
                    Top performers of the community. Compete in quizzes to climb the ranks.
                </p>
            </div>

            <div className="mx-auto max-w-4xl space-y-6">
                <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle>Rankings</CardTitle>
                            <CardDescription>
                                {selectedQuiz === "global" ? "Global Rankings" : "Quiz Specific Rankings"}
                            </CardDescription>
                        </div>
                        <div className="w-[200px]">
                            <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
                                <SelectTrigger>
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Filter by Quiz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="global">Global Ranking</SelectItem>
                                    {quizzes.map((quiz) => (
                                        <SelectItem key={quiz._id || quiz.id} value={quiz._id || quiz.id}>
                                            {quiz.heading}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="py-20 text-center">
                                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-muted-foreground">Loading rankings...</p>
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div className="py-20 text-center text-muted-foreground">
                                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>No records found yet. Be the first to compete!</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[100px]">Rank</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead className="text-right">
                                            {selectedQuiz === "global" ? "Solved" : "Score"}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            {selectedQuiz === "global" ? "Detail" : "Date"}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leaderboard.map((user) => (
                                        <TableRow key={user.rank} className="border-b transition-colors hover:bg-white/5">
                                            <TableCell className="font-medium">
                                                {user.rank === 1 ? (
                                                    <Trophy className="h-6 w-6 text-yellow-500" />
                                                ) : user.rank === 2 ? (
                                                    <Trophy className="h-6 w-6 text-gray-400" />
                                                ) : user.rank === 3 ? (
                                                    <Trophy className="h-6 w-6 text-amber-700" />
                                                ) : (
                                                    <span className="ml-2 font-bold text-muted-foreground">#{user.rank}</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border-2 border-white/10">
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback className="bg-primary/20 text-primary font-bold">
                                                            {(user.displayName || user.name)?.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">
                                                            {user.username ? `@${user.username}` : user.name}
                                                        </span>
                                                        {selectedQuiz === "global" && user.currentStreak > 0 && (
                                                            <span className="text-xs text-green-500 font-medium">🔥 {user.currentStreak} day streak</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-lg">
                                                {selectedQuiz === "global" ? user.totalSolved : user.score}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {selectedQuiz === "global" ? (
                                                    <Badge variant="outline" className="bg-transparent">Global</Badge>
                                                ) : (
                                                    new Date(user.date).toLocaleDateString()
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
