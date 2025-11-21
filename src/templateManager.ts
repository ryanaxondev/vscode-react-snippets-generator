// src/templateManager.ts

import * as vscode from 'vscode';
import * as path from 'path';

// ---------------------------------------------------------------
// Workspace template directory
// Users can override built-in templates by placing files inside:
//   <workspace>/.react-component-generator/
// ---------------------------------------------------------------
const WORKSPACE_TEMPLATES_FOLDER = '.react-component-generator';

// ---------------------------------------------------------------
// Load template content with workspace-first priority
// ---------------------------------------------------------------
/**
 * Loads a template file, giving priority to workspace-level overrides.
 *
 * Resolution order:
 * 1. Workspace templates inside `.react-component-generator/`
 * 2. Built-in extension templates inside `/templates/`
 *
 * @param context       The extension context.
 * @param templateName  Relative template path (e.g. `component.txt`, `styles/css.txt`).
 */
export async function loadTemplate(
    context: vscode.ExtensionContext,
    templateName: string
): Promise<string> {

    // -----------------------------------------------------------
    // 1. Try loading from workspace override directory
    // -----------------------------------------------------------
    if (vscode.workspace.workspaceFolders?.length) {
        const workspaceRoot = vscode.workspace.workspaceFolders[0].uri;
        const workspaceTemplateUri = vscode.Uri.joinPath(
            workspaceRoot,
            WORKSPACE_TEMPLATES_FOLDER,
            templateName
        );

        try {
            const content = await vscode.workspace.fs.readFile(workspaceTemplateUri);
            return new TextDecoder().decode(content); // Workspace override found
        } catch {
            // Not found → fall back to built-in templates
        }
    }

    // -----------------------------------------------------------
    // 2. Fallback: Load built-in extension template
    // -----------------------------------------------------------
    const extensionTemplatePath = path.join(
        context.extensionPath,
        'templates',
        templateName
    );

    try {
        const fileUri = vscode.Uri.file(extensionTemplatePath);
        const content = await vscode.workspace.fs.readFile(fileUri);
        return new TextDecoder().decode(content);
    } catch {
        throw new Error(
            `Could not load template file: ${templateName}. ` +
            `Checked workspace '${WORKSPACE_TEMPLATES_FOLDER}/' and built-in templates.`
        );
    }
}

// ---------------------------------------------------------------
// Simple template replacement utility
// ---------------------------------------------------------------
/**
 * Replaces `{{key}}` placeholders inside template content.
 * @param template      Raw template string.
 * @param replacements  Key-value map for placeholder replacements.
 */
export function processTemplate(
    template: string,
    replacements: { [key: string]: string }
): string {
    let content = template;

    for (const key in replacements) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, replacements[key]);
    }

    return content;
}