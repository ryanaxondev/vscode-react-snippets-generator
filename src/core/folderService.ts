// src/core/folderService.ts

import * as vscode from 'vscode';
import { Config } from './configService';
import { EnvironmentError, ComponentExistsError, UserCanceledError } from '../errors';
import { logInfo } from '../logger';

/**
 * Resolve the base folder for component generation.
 * - If invoked from context menu on a file → use parent folder
 * - If directory → use the directory itself
 * - Else fallback to workspace root
 */
export async function resolveBaseFolder(uri?: vscode.Uri): Promise<vscode.Uri> {
    if (uri) {
        try {
            const st = await vscode.workspace.fs.stat(uri);

            if (st.type === vscode.FileType.File) {
                // Official VSCode approach for parent directory resolution
                return uri.with({ path: vscode.Uri.joinPath(uri, '..').path });
            }

            return uri;
        } catch {
            // Continue to fallback
        }
    }

    const base = vscode.workspace.workspaceFolders?.[0]?.uri;
    if (!base) {
        throw new EnvironmentError(
            'No workspace found',
            'Please open a folder or workspace first.'
        );
    }
    return base;
}

interface FolderStrategyResult {
    targetUri: vscode.Uri;
    shouldCreateFolder: boolean;
}

export async function askFolderStrategy(
    baseUri: vscode.Uri,
    pascalName: string
): Promise<FolderStrategyResult> {
    const useFolder = Config.useFolder;
    let shouldCreateFolder = false;

    if (useFolder === 'always') {
        shouldCreateFolder = true;
    } else if (useFolder === 'ask') {
        const pick = await vscode.window.showQuickPick(
            ['Yes (Create a new folder)', 'No (Create files directly)'],
            { placeHolder: 'Create a dedicated component folder?' }
        );

        if (!pick) {
            throw new UserCanceledError();
        }
        shouldCreateFolder = pick.startsWith('Yes');
    }

    const targetUri = shouldCreateFolder
        ? vscode.Uri.joinPath(baseUri, pascalName)
        : baseUri;

    return { targetUri, shouldCreateFolder };
}

interface TargetAvailability {
    folderUri: vscode.Uri;
    componentUri: vscode.Uri;
}

export async function ensureTargetAvailable(
    targetUri: vscode.Uri,
    filename: string,
    shouldCreateFolder: boolean
): Promise<TargetAvailability> {

    // --- 1. Folder existence check ----
    if (shouldCreateFolder) {
        try {
            await vscode.workspace.fs.stat(targetUri);

            // Folder exists → better UX
            throw new ComponentExistsError(
                `Folder already exists: ${targetUri.fsPath}`,
                `A folder named '${targetUri.path.split('/').pop()}' already exists.`
            );
        } catch (err: unknown) {
            if (err instanceof ComponentExistsError) throw err;
            // FileNotFound → OK
        }
    }

    // --- 2. Component file existence check ---
    const fileUri = vscode.Uri.joinPath(targetUri, filename);

    try {
        await vscode.workspace.fs.stat(fileUri);
        throw new ComponentExistsError(
            `File already exists: ${fileUri.fsPath}`,
            `A component file named '${filename}' already exists in this location.`
        );
    } catch (err: unknown) {
        if (err instanceof ComponentExistsError) throw err;
        // FileNotFound → OK
    }

    return { folderUri: targetUri, componentUri: fileUri };
}

export async function createFolderIfNecessary(
    folderUri: vscode.Uri,
    shouldCreateFolder: boolean
): Promise<void> {
    if (shouldCreateFolder) {
        await vscode.workspace.fs.createDirectory(folderUri);
        logInfo(`Created folder: ${folderUri.fsPath}`);
    }
}
