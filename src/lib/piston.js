/**
 * Piston API Client for code execution
 * Uses the public Piston API: https://emkc.org/api/v2/piston
 */

// Language mapping: our language names -> Piston language names
const LANGUAGE_MAP = {
    python: 'python',
    javascript: 'javascript',
    cpp: 'cpp',
    java: 'java',
};

// Piston API endpoint
const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

/**
 * Execute code using Piston API
 * @param {string} language - Language name (python, javascript, cpp, java)
 * @param {string} code - Code to execute
 * @param {string} stdin - Standard input (optional)
 * @returns {Promise<{success: boolean, output?: string, error?: string, time?: number}>}
 */
export async function executeCode(language, code, stdin = '') {
    try {
        const pistonLanguage = LANGUAGE_MAP[language.toLowerCase()];
        
        if (!pistonLanguage) {
            return {
                success: false,
                error: `Language "${language}" is not supported. Supported languages: ${Object.keys(LANGUAGE_MAP).join(', ')}`
            };
        }

        const response = await fetch(PISTON_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: pistonLanguage,
                version: '*', // Use latest version
                files: [
                    {
                        content: code
                    }
                ],
                stdin: stdin,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();

        // Piston API response structure - EMKC format
        // Response can have both 'compile' and 'run' objects
        
        // Check for compilation errors first (for compiled languages like C++, Java)
        if (data.compile && data.compile.code !== 0) {
            return {
                success: false,
                error: data.compile.stderr || 'Compilation failed',
                output: data.compile.stdout || '',
                time: data.compile.time || 0
            };
        }
        
        // Check runtime execution
        if (data.run) {
            const run = data.run;
            
            // Check if there was a runtime error (non-zero exit code)
            if (run.code !== 0) {
                return {
                    success: false,
                    error: run.stderr || `Process exited with code ${run.code}`,
                    output: run.stdout || '',
                    time: run.time || 0
                };
            }

            // Success
            return {
                success: true,
                output: run.stdout || '',
                error: run.stderr || '',
                time: run.time || 0
            };
        }
        
        return {
            success: false,
            error: 'Unexpected response format from Piston API'
        };
    } catch (error) {
        console.error('Piston API Error:', error);
        return {
            success: false,
            error: `Failed to execute code: ${error.message || 'Unknown error'}`
        };
    }
}

/**
 * Get available languages from Piston API
 * @returns {Promise<string[]>}
 */
export async function getAvailableLanguages() {
    try {
        const response = await fetch('https://emkc.org/api/v2/piston/runtimes');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.map(lang => lang.language);
    } catch (error) {
        console.error('Failed to fetch languages:', error);
        return Object.keys(LANGUAGE_MAP);
    }
}
