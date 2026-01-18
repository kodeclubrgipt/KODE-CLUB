import { ProblemCard } from "@/components/features/dpp/problem-card";
import { problems } from "@/lib/mock-data";

export default function DPPPage() {
    return (
        <div className="container py-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Daily Practice Problems
                    </h1>
                    <p className="text-muted-foreground">
                        Solve a new problem every day to improve your coding skills.
                    </p>
                </div>
                {/* Filters could go here */}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {problems.map((problem) => (
                    <ProblemCard key={problem.id} problem={problem} />
                ))}
            </div>
        </div>
    );
}
