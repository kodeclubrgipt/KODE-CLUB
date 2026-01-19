"use client";

import { useState, useEffect } from "react";
import { CodeEditor } from "@/components/features/compiler/code-editor";
import { motion } from "framer-motion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Play,
    RotateCcw,
    AlertCircle,
    Terminal,
    Code2,
    Clock,
    Loader2,
    Copy,
    Check,
    Keyboard
} from "lucide-react";
import { executeCode } from "@/lib/piston.js";

const LANGUAGES = [
    { id: "python", name: "Python", icon: "🐍", ext: "py", category: "Popular" },
    { id: "javascript", name: "JavaScript", icon: "JS", ext: "js", category: "Popular" },
    { id: "typescript", name: "TypeScript", icon: "TS", ext: "ts", category: "Popular" },
    { id: "java", name: "Java", icon: "☕", ext: "java", category: "Popular" },
    { id: "cpp", name: "C++", icon: "⚡", ext: "cpp", category: "Popular" },
    { id: "c", name: "C", icon: "C", ext: "c", category: "Popular" },
    { id: "go", name: "Go", icon: "Go", ext: "go", category: "Systems" },
    { id: "rust", name: "Rust", icon: "🦀", ext: "rs", category: "Systems" },
    { id: "ruby", name: "Ruby", icon: "💎", ext: "rb", category: "Scripting" },
    { id: "php", name: "PHP", icon: "🐘", ext: "php", category: "Scripting" },
    { id: "bash", name: "Bash", icon: "$", ext: "sh", category: "Scripting" },
    { id: "perl", name: "Perl", icon: "🐪", ext: "pl", category: "Scripting" },
    { id: "lua", name: "Lua", icon: "🌙", ext: "lua", category: "Scripting" },
    { id: "swift", name: "Swift", icon: "🍎", ext: "swift", category: "Mobile" },
    { id: "kotlin", name: "Kotlin", icon: "K", ext: "kt", category: "Mobile" },
    { id: "dart", name: "Dart", icon: "🎯", ext: "dart", category: "Mobile" },
    { id: "csharp", name: "C#", icon: "C#", ext: "cs", category: "Other" },
    { id: "scala", name: "Scala", icon: "S", ext: "scala", category: "Other" },
    { id: "haskell", name: "Haskell", icon: "λ", ext: "hs", category: "Other" },
    { id: "r", name: "R", icon: "📊", ext: "r", category: "Other" },
];

const DEFAULT_CODE = {
    python: `# Python Example
def main():
    print("Hello, World!")
    name = "KODE Club"
    print(f"Welcome to {name}!")

if __name__ == "__main__":
    main()`,
    javascript: `// JavaScript Example
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));
console.log("Welcome to KODE Club!");`,
    typescript: `// TypeScript Example
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
    cpp: `// C++ Example
#include <iostream>
#include <string>

int main() {
    std::string name = "World";
    std::cout << "Hello, " << name << "!" << std::endl;
    return 0;
}`,
    c: `// C Example
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
    java: `// Java Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    go: `// Go Example
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
    rust: `// Rust Example
fn main() {
    println!("Hello, World!");
}`,
    ruby: `# Ruby Example
puts "Hello, World!"`,
    php: `<?php
echo "Hello, World!\\n";
?>`,
    swift: `// Swift Example
print("Hello, World!")`,
    kotlin: `// Kotlin Example
fun main() {
    println("Hello, World!")
}`,
    csharp: `// C# Example
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
    bash: `#!/bin/bash
echo "Hello, World!"`,
    lua: `-- Lua Example
print("Hello, World!")`,
    perl: `# Perl Example
print "Hello, World!\\n";`,
    r: `# R Example
print("Hello, World!")`,
    scala: `// Scala Example
object Main extends App {
    println("Hello, World!")
}`,
    haskell: `-- Haskell Example
main = putStrLn "Hello, World!"`,
    dart: `// Dart Example
void main() {
    print('Hello, World!');
}`,
};

export default function CompilerPage() {
    const [language, setLanguage] = useState("python");
    const [code, setCode] = useState(DEFAULT_CODE[language] || "");
    const [input, setInput] = useState(""); // stdin input
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState("");
    const [executionTime, setExecutionTime] = useState(null);
    const [copied, setCopied] = useState(false);
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        const handleRunCode = () => {
            if (!isRunning) handleRun();
        };
        window.addEventListener('runCode', handleRunCode);
        return () => window.removeEventListener('runCode', handleRunCode);
    }, [code, language, isRunning]);

    const handleRun = async () => {
        if (!code.trim()) {
            setError("Please write some code before running.");
            return;
        }

        setIsRunning(true);
        setError("");
        setOutput("");
        setExecutionTime(null);

        try {
            // Pass stdin input to executeCode
            const result = await executeCode(language, code, input);

            if (result.success) {
                let outputText = result.output || "";
                if (result.error) {
                    outputText += `\n\n⚠️ Warning:\n${result.error}`;
                }
                if (result.time !== undefined) {
                    setExecutionTime((result.time * 1000).toFixed(2));
                }
                setOutput(outputText || "✓ Code executed successfully (no output)");
            } else {
                setError(result.error || "Execution failed");
                setOutput(result.output || "");
            }
        } catch (err) {
            setError(err.message || "Failed to execute code");
        } finally {
            setIsRunning(false);
        }
    };

    const handleReset = () => {
        setCode(DEFAULT_CODE[language] || "");
        setOutput("");
        setError("");
        setInput("");
        setExecutionTime(null);
    };

    const handleLanguageChange = (v) => {
        setLanguage(v);
        setCode(DEFAULT_CODE[v] || `// ${LANGUAGES.find(l => l.id === v)?.name || v} code`);
        setOutput("");
        setError("");
        setExecutionTime(null);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const currentLang = LANGUAGES.find(l => l.id === language);

    const groupedLanguages = LANGUAGES.reduce((acc, lang) => {
        if (!acc[lang.category]) acc[lang.category] = [];
        acc[lang.category].push(lang);
        return acc;
    }, {});

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                <Code2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Code Compiler</h1>
                                <p className="text-white/40 text-sm">20+ languages • Real-time execution</p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <Select value={language} onValueChange={handleLanguageChange}>
                                <SelectTrigger className="w-[160px] h-10 bg-white/5 border-white/10">
                                    <span className="flex items-center gap-2">
                                        <span className="text-xs">{currentLang?.icon}</span>
                                        <SelectValue placeholder="Language" />
                                    </span>
                                </SelectTrigger>
                                <SelectContent className="max-h-[400px]">
                                    {Object.entries(groupedLanguages).map(([category, langs]) => (
                                        <div key={category}>
                                            <div className="px-2 py-1.5 text-xs text-white/40 font-medium">{category}</div>
                                            {langs.map((lang) => (
                                                <SelectItem key={lang.id} value={lang.id}>
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-xs opacity-60 w-5">{lang.icon}</span>
                                                        {lang.name}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </div>
                                    ))}
                                </SelectContent>
                            </Select>

                            <button
                                onClick={handleReset}
                                className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                title="Reset code"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </button>

                            <button
                                onClick={handleCopy}
                                className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                title="Copy code"
                            >
                                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            </button>

                            {/* Clean Run Button */}
                            <button
                                onClick={handleRun}
                                disabled={isRunning}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isRunning ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Running...
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4" />
                                        Run Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[calc(100vh-220px)]">
                    {/* Code Editor */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-3 rounded-xl bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <span className="text-white/40 text-xs font-mono">main.{currentLang?.ext}</span>
                            </div>
                            <span className="text-white/30 text-xs">{currentLang?.name}</span>
                        </div>

                        <div className="flex-1 min-h-[450px]">
                            <CodeEditor language={language} value={code} onChange={(val) => setCode(val || "")} />
                        </div>
                    </motion.div>

                    {/* Input & Output Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 flex flex-col gap-4"
                    >
                        {/* Input Section */}
                        <div className="rounded-xl bg-[#0a0a0a] border border-white/10 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <Keyboard className="h-4 w-4 text-white/40" />
                                    <span className="text-white/60 text-sm font-medium">Input</span>
                                </div>
                                {input && (
                                    <span className="text-xs text-green-400">Has input</span>
                                )}
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter stdin input here (optional)..."
                                className="w-full h-[180px] bg-transparent p-3 text-white font-mono text-sm resize-none focus:outline-none placeholder:text-white/20"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            />
                        </div>

                        {/* Output Section */}
                        <div className="flex-1 rounded-xl bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col min-h-[300px]">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <Terminal className="h-4 w-4 text-white/40" />
                                    <span className="text-white/60 text-sm font-medium">Output</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {executionTime && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                                            <Clock className="h-3 w-3 text-white/40" />
                                            <span className="text-xs text-white/40">{executionTime}ms</span>
                                        </div>
                                    )}
                                    {error && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                                            <AlertCircle className="h-3 w-3 text-red-400" />
                                            <span className="text-xs text-red-400">Error</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 p-4 overflow-auto font-mono text-sm">
                                {isRunning ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <Loader2 className="h-6 w-6 text-white/30 animate-spin mx-auto mb-2" />
                                            <p className="text-white/30 text-xs">Executing...</p>
                                        </div>
                                    </div>
                                ) : output || error ? (
                                    <pre className="whitespace-pre-wrap leading-relaxed">
                                        {output && <span className="text-white/80">{output}</span>}
                                        {error && <span className="text-red-400 block mt-2">{error}</span>}
                                    </pre>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center text-white/20">
                                            <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-xs">Run code to see output</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-white/20 text-xs">
                        <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-white/30 font-mono">Ctrl</kbd>
                        {" + "}
                        <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-white/30 font-mono">Enter</kbd>
                        {" to run • Powered by Piston API"}
                    </p>
                </div>
            </div>
        </div>
    );
}
