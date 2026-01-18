"use client";

import React, { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

interface CodeEditorProps {
    language: string;
    value: string;
    onChange: (value: string | undefined) => void;
}

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
    const { theme } = useTheme();
    // Map next-themes to monaco themes
    const editorTheme = theme === "dark" ? "vs-dark" : "light";

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        // You can configure the editor here
        editor.focus();
    };

    return (
        <div className="h-full min-h-[400px] w-full overflow-hidden rounded-md border border-input shadow-sm">
            <Editor
                height="100%"
                width="100%"
                language={language.toLowerCase()}
                value={value}
                theme={editorTheme}
                onChange={onChange}
                onMount={handleEditorDidMount}
                loading={
                    <div className="flex h-full w-full items-center justify-center bg-background text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                }
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                    fontFamily: "var(--font-mono)",
                }}
            />
        </div>
    );
}
