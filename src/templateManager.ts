// src/templateManager.ts

import * as vscode from 'vscode';
import * as path from 'path';
import { TemplateError } from './errors';

const WORKSPACE_TEMPLATES_FOLDER = '.react-component-generator';

export async function loadTemplate(
    context: vscode.ExtensionContext,
    templateName: string
): Promise<string> {

    // ---------------------------------------------------------
    // 1. Try workspace override first
    // ---------------------------------------------------------
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        const workspaceRoot = vscode.workspace.workspaceFolders[0].uri;
        const workspaceTemplateUri = vscode.Uri.joinPath(
            workspaceRoot,
            WORKSPACE_TEMPLATES_FOLDER,
            templateName
        );

        try {
            const bytes = await vscode.workspace.fs.readFile(workspaceTemplateUri);
            return new TextDecoder().decode(bytes);
        } catch (error: any) {
            // Only ignore "file not found" — rethrow all real issues
            if (
                error instanceof vscode.FileSystemError &&
                error.code === 'FileNotFound'
            ) {
                // expected → fallback to built-in
            } else {
                throw error; // do not hide unexpected filesystem problems
            }
        }
    }

    // ---------------------------------------------------------
    // 2. Fallback to extension built-in templates (safe & cross-platform)
    // ---------------------------------------------------------
    const fileUri = vscode.Uri.joinPath(
        context.extensionUri,
        'templates',
        templateName
    );

    try {
        const bytes = await vscode.workspace.fs.readFile(fileUri);
        return new TextDecoder().decode(bytes);
    } catch (e) {
        throw new TemplateError(
            `Could not load template: ${templateName}`,
            `Template '${templateName}' is missing. Please reinstall the extension or check your workspace templates.`
        );
    }
}

// ---------------------------------------------------------
// 3. Template processor
// ---------------------------------------------------------
export function processTemplate(
    template: string,
    replacements: { [key: string]: string }
): string {
    let content = template;

    for (const key in replacements) {
        if (Object.prototype.hasOwnProperty.call(replacements, key)) {
            const rx = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(rx, replacements[key]);
        }
    }

    return content;
}
