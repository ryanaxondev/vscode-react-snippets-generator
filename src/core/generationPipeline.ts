// src/core/generationPipeline.ts

import * as vscode from 'vscode';
import { resolveBaseFolder, askFolderStrategy, ensureTargetAvailable, createFolderIfNecessary } from './folderService';
import { askFilename, parseName } from './nameService';
import { prepareStyleFiles } from './styleService';
import { writeComponentFiles, openAndFormatDocument } from './fileService';
import { loadTemplate, processTemplate } from '../templateManager';
import { logInfo } from '../logger';
import { UserCanceledError } from '../errors';

export async function runGeneratorPipeline(context: vscode.ExtensionContext, uri?: vscode.Uri): Promise<void> {
    try {
        // 1. Resolve Base Folder
        const baseUri = await resolveBaseFolder(uri);

        // 2. Filename Input & Parsing
        const rawFilename = await askFilename();
        const { filename, pascalName, lowerName } = await parseName(rawFilename);

        // 3. Folder Strategy Decision
        const { targetUri, shouldCreateFolder } = await askFolderStrategy(baseUri, pascalName);

        // 4. Check for Conflicts (Pre-flight check)
        const { componentUri } = await ensureTargetAvailable(targetUri, filename, shouldCreateFolder);

        // 5. Style Configuration
        const styleData = await prepareStyleFiles(context, lowerName);

        // 6. Load & Process Component Template
        const compTemplate = await loadTemplate(context, 'component.txt');
        const compContent = processTemplate(compTemplate, {
            pascalName,
            lowerName,
            styleImport: styleData.styleImport,
            className: styleData.className,
            props: 'props' // Future placeholder for PropBuilder
        });

        // 7. Execution: Create Folders & Write Files
        await createFolderIfNecessary(targetUri, shouldCreateFolder);
        
        const styleUri = styleData.styleFileName 
            ? vscode.Uri.joinPath(targetUri, styleData.styleFileName) 
            : null;

        await writeComponentFiles(componentUri, compContent, styleUri, styleData.styleContent);

        // 8. Finalize: Open & Format
        await openAndFormatDocument(componentUri);

        // 9. Success Notification
        vscode.window.showInformationMessage(`Component ${pascalName} created successfully.`);
        logInfo(`Pipeline completed successfully for: ${pascalName}`);

    } catch (err: unknown) {
        // We re-throw UserCanceledError or specific logic errors to be handled by extension.ts central logger
        if (err instanceof UserCanceledError) {
            logInfo('User cancelled the operation.');
            return; // Stop execution silently on cancel
        }
        throw err;
    }
}