// src/core/fileService.ts

import * as vscode from 'vscode';
import { Config } from './configService';
import { logInfo, logWarning } from '../logger';

/**
 * Ensure the parent directory exists before writing a file.
 */
async function ensureParentDirectory(uri: vscode.Uri): Promise<void> {
    const parent = vscode.Uri.joinPath(uri, '..');
    try {
        await vscode.workspace.fs.stat(parent);
    } catch {
        await vscode.workspace.fs.createDirectory(parent);
    }
}

export async function writeComponentFiles(
    componentUri: vscode.Uri,
    componentContent: string,
    styleUri: vscode.Uri | null,
    styleContent: string
): Promise<void> {
    const enc = new TextEncoder();

    // Ensure component folder exists
    await ensureParentDirectory(componentUri);

    // Write Component
    await vscode.workspace.fs.writeFile(componentUri, enc.encode(componentContent));
    logInfo(`Wrote component: ${componentUri.fsPath}`);

    // Write Style (if applicable)
    if (styleUri && styleContent) {
        await ensureParentDirectory(styleUri);
        await vscode.workspace.fs.writeFile(styleUri, enc.encode(styleContent));
        logInfo(`Wrote style: ${styleUri.fsPath}`);
    }
}

export async function openAndFormatDocument(uri: vscode.Uri): Promise<void> {
    const doc = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc, { preserveFocus: false, preview: false });

    if (!Config.autoFormat) {
        logInfo('AutoFormat disabled by config (rcs.autoFormat=false).');
        return;
    }

    try {
        logInfo('Formatting document...');

        // Preferred low-level formatter API (optional)
        const edits = await vscode.commands.executeCommand(
            'vscode.executeFormatDocumentProvider',
            uri,
            { tabSize: 2, insertSpaces: true }
        );

        if (Array.isArray(edits) && edits.length > 0) {
            const wsEdit = new vscode.WorkspaceEdit();
            wsEdit.set(uri, edits);
            await vscode.workspace.applyEdit(wsEdit);
            logInfo('Applied formatter edits.');
        } else {
            // Fallback to standard format if provider returned nothing
            await vscode.commands.executeCommand('editor.action.formatDocument');
            logInfo('Fallback format command executed.');
        }
    } catch (e) {
        logWarning('Auto-format failed (formatter error). The file was created but may need manual formatting.');
    }
}
