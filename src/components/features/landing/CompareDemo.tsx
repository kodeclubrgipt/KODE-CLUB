import React from "react";
import { Compare } from "@/components/ui/compare";

export function CompareDemo() {
    return (
        <div className="p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 px-4">

            {/* Context heading */}
            <div className="mb-3 text-center">
                <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    Kode Club • RGIPT
                </h3>
                <p className="text-xs text-neutral-500">
                    Daily DPP → Optimized Solution
                </p>
            </div>

            <Compare
                firstImage="https://assets.aceternity.com/code-problem.png"
                secondImage="https://assets.aceternity.com/code-solution.png"
                firstImageClassName="object-cover object-left-top"
                secondImageClassname="object-cover object-left-top"
                className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
                slideMode="hover"
            />

            {/* Footer note */}
            <p className="mt-3 text-center text-xs text-neutral-500">
                Practice daily. Improve consistently. Compete confidently.
            </p>
        </div>
    );
}
