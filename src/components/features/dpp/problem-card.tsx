import Link from "next/link";
import { ArrowRight, BarChart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { type Problem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ProblemCardProps {
    problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
    return (
        <Card className="flex flex-col justify-between transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <Badge
                        variant={
                            problem.difficulty === "Easy"
                                ? "secondary" // Greenish in custom theme later, or just different variant
                                : problem.difficulty === "Medium"
                                    ? "default"
                                    : "destructive"
                        }
                        className="mb-2"
                    >
                        {problem.difficulty}
                    </Badge>
                    <span className="flex items-center text-xs text-muted-foreground">
                        <BarChart className="mr-1 h-3 w-3" />
                        {problem.solveRate}% Solved
                    </span>
                </div>
                <CardTitle className="line-clamp-1 text-xl">{problem.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                    {problem.description.slice(0, 100)}...
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Link href={`/dpp/${problem.slug}`} className="w-full">
                    <Button className="w-full gap-2 group">
                        Solve Problem
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
