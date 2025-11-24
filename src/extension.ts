// src/extension.ts
// ---------------------------------------------------------------
// VS Code Extension: React Component Generator
// Main extension entry point — handles command registration,
// user input, validation, folder logic, template processing,
// file creation, and error logging.
// ---------------------------------------------------------------

import * as vscode from 'vscode';
import * as path from 'path';

import { loadTemplate, processTemplate } from './templateManager';
import { logError, logInfo } from './logger';

import {
    EnvironmentError,
    InvalidNameError,
    ComponentExistsError
} from './errors';

// ---------------------------------------------------------------
// Utility: Read configuration values from `rcs.*`
// ---------------------------------------------------------------
function getConfiguration<T = any>(key: string): T {
    return vscode.workspace.getConfiguration('rcs').get(key) as T;
}

// ---------------------------------------------------------------
// Utility: Convert a string to PascalCase
// ---------------------------------------------------------------
function toPascalCase(name: string): string {
    return name
        .replace(/\.[^/.]+$/, '')
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('');
}

// ---------------------------------------------------------------
// Utility: Validate filename according to VS Code restrictions
// ---------------------------------------------------------------
function validateFilename(filename: string): string | undefined {
    if (/[\/\?%*:|"<>]/.test(filename)) {
        return 'Filename contains invalid characters (/ , \\ , ?, %, *, :, |, ", <, >).';
    }
    return undefined;
}

// ---------------------------------------------------------------
// Extension Activation
// ---------------------------------------------------------------
export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'rcs.generateComponent',
        async (uri?: vscode.Uri) => {
            logInfo('Command "rcs.generateComponent" initiated.');

            try {
                // ---------------------------------------------------
                // Step 1: Resolve base folder
                // ---------------------------------------------------
                const baseUri = uri ?? vscode.workspace.workspaceFolders?.[0]?.uri;

                if (!baseUri) {
                    throw new EnvironmentError(
                        'No workspace folder found. Exiting.',
                        'Please open a folder or workspace first.'
                    );
                }

                // ---------------------------------------------------
                // Step 2: Filename input
                // ---------------------------------------------------
                let filename = await vscode.window.showInputBox({
                    prompt: 'Enter component filename (e.g., Navbar or UserProfile.tsx)',
                    placeHolder: 'Navbar',
                    validateInput: validateFilename
                });

                if (!filename) {
                    logInfo('Component creation cancelled (filename input).');
                    return;
                }

                // ---------------------------------------------------
                // Step 3: Extract name + extension
                // ---------------------------------------------------
                let ext = path.extname(filename);
                const fileBase = path.basename(filename, ext);

                if (!ext) {
                    ext = '.jsx';
                    filename = fileBase + ext;
                }

                const pascalName = toPascalCase(fileBase);
                const lowerName = fileBase.toLowerCase();

                if (!/^[A-Za-z]/.test(pascalName)) {
                    throw new InvalidNameError(
                        'React component name failed validation.',
                        'Component name must start with a letter (A-Z).'
                    );
                }

                // ---------------------------------------------------
                // Step 4: Folder creation choice
                // ---------------------------------------------------
                const useFolderSetting = getConfiguration<string>('useFolder');
                let shouldCreateFolder = false;

                if (useFolderSetting === 'always') {
                    shouldCreateFolder = true;
                } else if (useFolderSetting === 'ask') {
                    const pick = await vscode.window.showQuickPick(
                        ['Yes (Create a new folder)', 'No (Create files directly)'],
                        { placeHolder: 'Create a dedicated component folder?' }
                    );

                    if (pick === undefined) {
                        logInfo('Component creation cancelled (folder choice).');
                        return;
                    }

                    shouldCreateFolder = pick.startsWith('Yes');
                }

                // ---------------------------------------------------
                // Step 5: Check folder/file existence
                // ---------------------------------------------------
                let finalTargetUri = baseUri;

                if (shouldCreateFolder) {
                    const folderUri = vscode.Uri.joinPath(baseUri, pascalName);

                    try {
                        await vscode.workspace.fs.stat(folderUri);
                        throw new ComponentExistsError(
                            'Cannot create component/folder because target already exists.',
                            'The component folder already exists. Operation cancelled.'
                        );
                    } catch (err: any) {
                        if (err?.code !== 'FileNotFound' && err?.name !== 'FileNotFoundError') {
                            throw err;
                        }

                        finalTargetUri = folderUri;
                        await vscode.workspace.fs.createDirectory(finalTargetUri);
                    }

                } else {
                    const componentUri = vscode.Uri.joinPath(finalTargetUri, filename);

                    try {
                        await vscode.workspace.fs.stat(componentUri);
                        throw new ComponentExistsError(
                            'Cannot create file because it already exists.',
                            'The component file already exists. Operation cancelled.'
                        );
                    } catch (err: any) {
                        if (err?.code !== 'FileNotFound' && err?.name !== 'FileNotFoundError') {
                            throw err;
                        }
                    }
                }

                // ---------------------------------------------------
                // Step 6: Style selection
                // ---------------------------------------------------
                const defaultStyleSetting = getConfiguration<string>('defaultStyle');
                let styleType: string | undefined;

                if (defaultStyleSetting === 'ask') {
                    styleType = await vscode.window.showQuickPick(
                        ['CSS', 'SCSS', 'Tailwind', 'None'],
                        { placeHolder: 'Choose style type' }
                    );
                } else {
                    styleType = defaultStyleSetting;
                }

                if (styleType === undefined) {
                    logInfo('Component creation cancelled (style choice).');
                    return;
                }

                // ---------------------------------------------------
                // Step 7: Prepare style files
                // ---------------------------------------------------
                let styleFileName: string | null = null;
                let styleContent = '';
                let styleImport = '';
                let className = lowerName;

                if (styleType === 'Tailwind') {
                    const defaultTW = getConfiguration<string>('defaultTailwindClass');

                    if (styleType === 'Tailwind' && defaultTW === 'ask') {
                        className =
                            (await vscode.window.showInputBox({
                                prompt: 'Enter Tailwind class'
                            })) || 'container';
                    } else {
                        className = defaultTW;
                    }
                } else if (styleType !== 'None') {
                    const styleExt = styleType === 'SCSS' ? '.scss' : '.css';
                    styleFileName = `${lowerName}${styleExt}`;
                    styleImport = `import './${styleFileName}';\n`;

                    const styleTemplate = await loadTemplate(
                        context,
                        `styles/${styleType.toLowerCase()}.txt`
                    );
                    styleContent = processTemplate(styleTemplate, { lowerName });
                }

                // ---------------------------------------------------
                // Step 8: Component creation
                // ---------------------------------------------------
                const componentTemplate = await loadTemplate(context, 'component.txt');
                const componentContent = processTemplate(componentTemplate, {
                    pascalName,
                    lowerName,
                    styleImport,
                    className,
                    props: 'props'
                });

                const componentUri = vscode.Uri.joinPath(finalTargetUri, filename);
                const styleUri = styleFileName
                    ? vscode.Uri.joinPath(finalTargetUri, styleFileName)
                    : null;

                await vscode.workspace.fs.writeFile(
                    componentUri,
                    new TextEncoder().encode(componentContent)
                );

                if (styleUri) {
                    await vscode.workspace.fs.writeFile(
                        styleUri,
                        new TextEncoder().encode(styleContent)
                    );
                }

                const doc = await vscode.workspace.openTextDocument(componentUri);
                await vscode.window.showTextDocument(doc, {
                    preserveFocus: false,
                    preview: false
                });
                await vscode.commands.executeCommand('editor.action.formatDocument');

                vscode.window.showInformationMessage(
                    `Component ${pascalName} created successfully.`
                );
                logInfo(`Successfully created component: ${pascalName}.`);
            } catch (err: any) {
                if (err instanceof EnvironmentError ||
                    err instanceof InvalidNameError ||
                    err instanceof ComponentExistsError) {

                    vscode.window.showErrorMessage(err.userMessage);
                    logError(err.message, err);
                    return;
                }

                vscode.window.showErrorMessage('An unexpected error occurred.');
                logError('Unexpected fatal error.', err);
            }
        }
    );

    context.subscriptions.push(disposable);
}

// ---------------------------------------------------------------
// Extension Deactivation
// ---------------------------------------------------------------
export function deactivate() {}
