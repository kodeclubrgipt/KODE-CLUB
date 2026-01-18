"use client";
import { useEffect, useState } from "react";

const codeLines = [
    "const club = 'Kode Club RGIPT';",
    "function join() {",
    "  return 'Master your craft.';",
    "}",
    "",
    "console.log(join());",
];

export function LiveCodeHero() {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setLines((prev) => [...prev, codeLines[i]]);
            i++;
            if (i === codeLines.length) clearInterval(interval);
        }, 450);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-10 rounded-xl border border-neutral-800 bg-black/70 p-4 font-mono text-sm text-neutral-200 shadow-xl backdrop-blur">
            {lines.map((line, idx) => (
                <pre key={idx} className="whitespace-pre-wrap">
                    {line}
                </pre>
            ))}
            {lines.length === codeLines.length && (
                <pre className="text-green-400 mt-2">
                    ▶ Master your craft.
                </pre>
            )}
        </div>
    );
}
