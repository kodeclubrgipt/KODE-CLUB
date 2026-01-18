"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/features/compiler/code-editor";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Play, RotateCcw } from "lucide-react";

export default function CompilerPage() {
    const [language, setLanguage] = useState("python");
    const [code, setCode] = useState(DEFAULT_CODE[language] || "");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = async () => {
        setIsRunning(true);
        setOutput("Running code...\n");

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock execution result
        setOutput(`[Output]\nHello, World! (simulated output for ${language})\n\n[Execution Info]\nTime: 0.02s\nMemory: 4MB`);
        setIsRunning(false);
    };

    return (
        <div className="container flex h-[calc(100vh-3.5rem)] flex-col gap-4 py-6 md:flex-row">
            <div className="flex flex-1 flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Select value={language} onValueChange={(v) => {
                            setLanguage(v);
                            setCode(DEFAULT_CODE[v] || "");
                        }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="javascript">JavaScript</SelectItem>
                                <SelectItem value="cpp">C++</SelectItem>
                                <SelectItem value="java">Java</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setCode(DEFAULT_CODE[language] || "")}>
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button onClick={handleRun} disabled={isRunning} className="w-24">
                            {isRunning ? "Running..." : <><Play className="mr-2 h-4 w-4" /> Run</>}
                        </Button>
                    </div>
                </div>

                <CodeEditor language={language} value={code} onChange={(val) => setCode(val || "")} />
            </div>

            <div className="flex h-[300px] flex-col rounded-md border md:h-full md:w-[400px]">
                <div className="border-b bg-muted/50 px-4 py-2 font-medium text-sm">Output</div>
                <div className="flex-1 overflow-auto bg-black p-4 font-mono text-sm text-white">
                    <pre className="whitespace-pre-wrap">{output || "Run code to see output..."}</pre>
                </div>
            </div>
        </div>
    );
}

const DEFAULT_CODE: Record<string, string> = {
    python: `def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
    javascript: `console.log("Hello, World!");`,
    cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
};
