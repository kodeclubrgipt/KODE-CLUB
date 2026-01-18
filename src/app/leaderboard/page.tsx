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
import { Trophy } from "lucide-react";

const leaderboardData = [
    { rank: 1, name: "Alex Chen", score: 1250, solved: 45, streak: 12 },
    { rank: 2, name: "Sarah Jones", score: 1120, solved: 40, streak: 8 },
    { rank: 3, name: "Mike Ross", score: 980, solved: 35, streak: 5 },
    { rank: 4, name: "Rachel Green", score: 950, solved: 34, streak: 3 },
    { rank: 5, name: "Harvey Specter", score: 800, solved: 28, streak: 1 },
];

export default function LeaderboardPage() {
    return (
        <div className="container py-10">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
                <p className="text-muted-foreground">
                    Top performers of the week. Keep solving to reach the top!
                </p>
            </div>

            <div className="mx-auto max-w-3xl rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Rank</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead className="text-right">Solved</TableHead>
                            <TableHead className="text-right">Streak</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboardData.map((user) => (
                            <TableRow key={user.rank}>
                                <TableCell className="font-medium">
                                    {user.rank === 1 ? (
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                    ) : user.rank === 2 ? (
                                        <Trophy className="h-5 w-5 text-gray-400" />
                                    ) : user.rank === 3 ? (
                                        <Trophy className="h-5 w-5 text-amber-700" />
                                    ) : (
                                        <span className="ml-1">{user.rank}</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">{user.solved}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="outline">{user.streak} days</Badge>
                                </TableCell>
                                <TableCell className="text-right font-bold">{user.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
