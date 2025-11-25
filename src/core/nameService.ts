// src/core/nameService.ts

import * as vscode from 'vscode';
import * as path from 'path';
import { logInfo } from '../logger';
import { InvalidNameError, UserCanceledError } from '../errors';
import { Config } from './configService';

// ---------------------------------------------------------
// Convert various input formats to PascalCase
// ---------------------------------------------------------
function toPascalCase(name: string): string {
    return name
        .replace(/\.[^/.]+$/, '')
        .split(/[^a-zA-Z0-9]|(?=[A-Z])/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('');
}

// ---------------------------------------------------------
// Check if workspace has tsconfig.json
// ---------------------------------------------------------
async function workspaceHasTSConfig(): Promise<boolean> {
    if (!vscode.workspace.workspaceFolders?.length) return false;

    try {
        const folder = vscode.workspace.workspaceFolders[0].uri;
        const tsconfigUri = vscode.Uri.joinPath(folder, 'tsconfig.json');
        await vscode.workspace.fs.stat(tsconfigUri);
        return true;
    } catch {
        return false;
    }
}

// ---------------------------------------------------------
// Validate filename input
// ---------------------------------------------------------
function validateFilenameInput(filename: string): string | undefined {
    if (/[\/\?%*:|"<>]/.test(filename)) {
        return 'Filename contains invalid characters (/ \\ ? % * : | " < >).';
    }
    return undefined;
}

export async function askFilename(): Promise<string> {
    const filename = await vscode.window.showInputBox({
        prompt: 'Enter component filename (e.g., Navbar or UserProfile.tsx)',
        placeHolder: 'Navbar',
        validateInput: validateFilenameInput
    });

    if (!filename) {
        logInfo('User cancelled filename input.');
        throw new UserCanceledError();
    }
    return filename;
}

interface ParsedName {
    filename: string;
    fileBase: string;
    pascalName: string;
    lowerName: string;
    ext: string;
}

// ---------------------------------------------------------
// Ultra-Pro Smart Parser
// ---------------------------------------------------------
export async function parseName(filename: string): Promise<ParsedName> {
    let ext = path.extname(filename);
    const fileBase = path.basename(filename, ext);

    // -----------------------------------------------------
    // 1) If user provided an extension → respect it fully
    // -----------------------------------------------------
    if (!ext) {
        // 2) If workspace is TypeScript → use TSX
        if (await workspaceHasTSConfig()) {
            ext = '.tsx';
        }

        // 3) Otherwise → use extension from Config
        else if (Config.defaultStyle) {
            const style = Config.defaultStyle.toLowerCase();
            switch (style) {
                case 'tsx':
                    ext = '.tsx';
                    break;
                case 'jsx':
                    ext = '.jsx';
                    break;
                case 'ts':
                    ext = '.ts';
                    break;
                case 'js':
                    ext = '.js';
                    break;
                default:
                    ext = '.tsx';
            }
        } 
        
        // 4) Fallback (modern default)
        else {
            ext = '.tsx';
        }
    }

    const finalFilename = fileBase + ext;

    const pascalName = toPascalCase(fileBase);
    const lowerName = fileBase.toLowerCase();

    // -----------------------------------------------------
    // Component name must not start with a number
    // -----------------------------------------------------
    if (!/^[A-Za-z]/.test(pascalName)) {
        throw new InvalidNameError(
            'Invalid component name.',
            'Component name must start with a letter (A-Z).'
        );
    }

    return { filename: finalFilename, fileBase, pascalName, lowerName, ext };
}
