import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, Tag as TagIcon } from "lucide-react";
import Link from "next/link";

import { problems } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProblemPageProps {
    params: {
        slug: string;
    };
}

export default function ProblemPage({ params }: ProblemPageProps) {
    const problem = problems.find((p) => p.slug === params.slug);

    if (!problem) {
        notFound();
    }

    return (
        <div className="container max-w-4xl py-10">
            <div className="mb-8">
                <Link
                    href="/dpp"
                    className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Problems
                </Link>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {problem.title}
                        </h1>
                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {problem.publishDate}
                            </span>
                            <Badge
                                variant={
                                    problem.difficulty === "Easy"
                                        ? "secondary"
                                        : problem.difficulty === "Medium"
                                            ? "default"
                                            : "destructive"
                                }
                            >
                                {problem.difficulty}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/compiler">
                            <Button>Open Compiler</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                <div className="prose prose-zinc dark:prose-invert max-w-none rounded-lg border p-6 shadow-sm">
                    <ReactMarkdown>{problem.description}</ReactMarkdown>
                </div>

                <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                        <h3 className="font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {problem.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs flex gap-1">
                                    <TagIcon className="h-3 w-3" />
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg border p-4">
                        <h3 className="font-semibold mb-2">Stats</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Solve Rate</span>
                                <span className="font-medium">{problem.solveRate}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
