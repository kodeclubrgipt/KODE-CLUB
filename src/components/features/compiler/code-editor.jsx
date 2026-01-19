"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { Loader2 } from "lucide-react";

// Custom dark theme definition
const defineCustomTheme = (monaco) => {
    monaco.editor.defineTheme('kode-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'FF79C6' },
            { token: 'string', foreground: 'F1FA8C' },
            { token: 'number', foreground: 'BD93F9' },
            { token: 'type', foreground: '8BE9FD' },
            { token: 'function', foreground: '50FA7B' },
            { token: 'variable', foreground: 'F8F8F2' },
            { token: 'constant', foreground: 'BD93F9' },
            { token: 'class', foreground: '8BE9FD', fontStyle: 'bold' },
            { token: 'operator', foreground: 'FF79C6' },
        ],
        colors: {
            'editor.background': '#0a0a0a',
            'editor.foreground': '#F8F8F2',
            'editor.lineHighlightBackground': '#1a1a1a',
            'editor.selectionBackground': '#44475A',
            'editor.inactiveSelectionBackground': '#44475A80',
            'editorCursor.foreground': '#F8F8F2',
            'editorLineNumber.foreground': '#4a4a4a',
            'editorLineNumber.activeForeground': '#888888',
            'editor.selectionHighlightBackground': '#44475A50',
            'editorIndentGuide.background': '#1a1a1a',
            'editorIndentGuide.activeBackground': '#333333',
            'editorBracketMatch.background': '#44475A',
            'editorBracketMatch.border': '#F8F8F2',
            'scrollbarSlider.background': '#1a1a1a80',
            'scrollbarSlider.hoverBackground': '#2a2a2a',
            'scrollbarSlider.activeBackground': '#3a3a3a',
        }
    });
};

export function CodeEditor({ language, value, onChange }) {
    const handleEditorWillMount = (monaco) => {
        defineCustomTheme(monaco);
    };

    const handleEditorDidMount = (editor, monaco) => {
        editor.focus();

        // Add Ctrl+Enter to run code
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
            // Dispatch custom event that parent can listen to
            window.dispatchEvent(new CustomEvent('runCode'));
        });
    };

    // Map language names for Monaco
    const getMonacoLanguage = (lang) => {
        const map = {
            'python': 'python',
            'javascript': 'javascript',
            'typescript': 'typescript',
            'cpp': 'cpp',
            'c': 'c',
            'java': 'java',
            'go': 'go',
            'rust': 'rust',
            'ruby': 'ruby',
            'php': 'php',
            'swift': 'swift',
            'kotlin': 'kotlin',
            'csharp': 'csharp',
            'bash': 'shell',
            'lua': 'lua',
            'perl': 'perl',
            'r': 'r',
            'scala': 'scala',
            'haskell': 'haskell',
            'dart': 'dart',
        };
        return map[lang?.toLowerCase()] || lang?.toLowerCase() || 'plaintext';
    };

    return (
        <div className="h-full min-h-[400px] w-full overflow-hidden">
            <Editor
                height="100%"
                width="100%"
                language={getMonacoLanguage(language)}
                value={value}
                theme="kode-dark"
                onChange={onChange}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
                loading={
                    <div className="flex h-full w-full items-center justify-center bg-[#0a0a0a]">
                        <Loader2 className="h-6 w-6 animate-spin text-white/30" />
                    </div>
                }
                options={{
                    minimap: { enabled: false },
                    fontSize: 15,
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace",
                    fontLigatures: true,
                    lineNumbers: "on",
                    lineNumbersMinChars: 3,
                    lineHeight: 24,
                    letterSpacing: 0.5,
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                    renderLineHighlight: 'line',
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                    padding: { top: 16, bottom: 16 },
                    folding: true,
                    foldingHighlight: true,
                    bracketPairColorization: { enabled: true },
                    guides: {
                        indentation: true,
                        bracketPairs: true,
                    },
                    wordWrap: 'off',
                    tabSize: 4,
                    insertSpaces: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    parameterHints: { enabled: true },
                }}
            />
        </div>
    );
}
