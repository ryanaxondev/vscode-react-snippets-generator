import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Loads a template file content from the 'templates' directory.
 * @param context The extension context to get the template path.
 * @param templateName The name of the template file (e.g., 'component.txt' or 'styles/css.txt').
 * @returns The content of the template as a string.
 */
export async function loadTemplate(context: vscode.ExtensionContext, templateName: string): Promise<string> {
    const templatePath = path.join(context.extensionPath, 'templates', templateName);
    try {
        const fileUri = vscode.Uri.file(templatePath);
        const content = await vscode.workspace.fs.readFile(fileUri);
        return new TextDecoder().decode(content);
    } catch (e) {
        throw new Error(`Could not load template file: ${templateName}. Please check the 'templates' folder.`);
    }
}

/**
 * Replaces placeholders in the template content with actual values.
 * @param template The template string with placeholders (e.g., {{pascalName}}).
 * @param replacements An object containing key-value pairs for replacement.
 * @returns The final string with placeholders filled.
 */
export function processTemplate(template: string, replacements: { [key: string]: string }): string {
    let content = template;
    for (const key in replacements) {
        if (replacements.hasOwnProperty(key)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, replacements[key]);
        }
    }
    return content;
}