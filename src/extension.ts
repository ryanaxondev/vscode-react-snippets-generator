import * as vscode from 'vscode';
import * as path from 'path';
import { loadTemplate, processTemplate } from './templateManager';
import { logError, logInfo } from './logger';

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
// Extension Activation: Registers the main command
// ---------------------------------------------------------------
export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'rcs.generateComponent',
        async (uri?: vscode.Uri) => {
            logInfo('Command "rcs.generateComponent" initiated.');

            try {
                // ---------------------------------------------------
                // Resolve base folder
                // ---------------------------------------------------
                const baseUri = uri ?? vscode.workspace.workspaceFolders?.[0]?.uri;
                if (!baseUri) {
                    vscode.window.showErrorMessage(
                        'Please open a workspace or right-click a folder in the Explorer.'
                    );
                    return;
                }

                // ---------------------------------------------------
                // Determine folder creation behavior
                // ---------------------------------------------------
                const useFolderSetting = getConfiguration<string>('useFolder');
                let shouldCreateFolder = false;

                if (useFolderSetting === 'always') {
                    shouldCreateFolder = true;
                } else if (useFolderSetting === 'ask') {
                    const pick = await vscode.window.showQuickPick(
                        ['Yes (Create folder)', 'No (Just files)'],
                        { placeHolder: 'Create a dedicated folder?' }
                    );
                    if (!pick) return;
                    shouldCreateFolder = pick.startsWith('Yes');
                }
                // If "never", it remains false

                // ---------------------------------------------------
                // Ask user for component filename
                // ---------------------------------------------------
                let filename = await vscode.window.showInputBox({
                    prompt: 'Enter component filename (e.g. Navbar or UserCard.tsx)',
                    placeHolder: 'Navbar'
                });
                if (!filename) return;

                // Validate filename characters
                if (/[/\\?%*:|"<>]/.test(filename)) {
                    vscode.window.showErrorMessage('Filename contains invalid characters.');
                    return;
                }

                // Normalize filename & extension
                let ext = path.extname(filename);
                const baseName = path.basename(filename, ext);

                if (!ext) {
                    ext = '.jsx';
                    filename = baseName + ext;
                }

                const pascalName = toPascalCase(baseName);
                const lowerName = baseName.toLowerCase();

                if (!/^[A-Za-z]/.test(pascalName)) {
                    vscode.window.showErrorMessage('Component name must start with a letter.');
                    return;
                }

                // ---------------------------------------------------
                // Determine the output directory
                // ---------------------------------------------------
                let finalTargetUri = baseUri;
                if (shouldCreateFolder) {
                    finalTargetUri = vscode.Uri.joinPath(baseUri, pascalName);
                    await vscode.workspace.fs.createDirectory(finalTargetUri);
                }

                // ---------------------------------------------------
                // Determine style type from configuration
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

                if (!styleType) return;

                // ---------------------------------------------------
                // Prepare style output (if needed)
                // ---------------------------------------------------
                let styleFileName: string | null = null;
                let styleContent = '';
                let styleImport = '';
                let className = lowerName;

                // Tailwind class configuration
                if (styleType === 'Tailwind') {
                    const defaultTW = getConfiguration<string>('defaultTailwindClass');
                    const userInput = await vscode.window.showInputBox({
                        prompt: 'Enter Tailwind class',
                        value: defaultTW
                    });
                    className = userInput || defaultTW;
                }

                // CSS / SCSS handling
                else if (styleType !== 'None') {
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
                // Generate component file from template
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

                // Write component
                await vscode.workspace.fs.writeFile(
                    componentUri,
                    new TextEncoder().encode(componentContent)
                );

                // Write style file
                if (styleUri) {
                    await vscode.workspace.fs.writeFile(
                        styleUri,
                        new TextEncoder().encode(styleContent)
                    );
                }

                // Open file and auto-format
                const doc = await vscode.workspace.openTextDocument(componentUri);
                await vscode.window.showTextDocument(doc, {
                    preserveFocus: false,
                    preview: false
                });

                await vscode.commands.executeCommand('editor.action.formatDocument');

                // Success notification
                vscode.window.showInformationMessage(`Component ${pascalName} created successfully.`);
                logInfo(`Successfully created component: ${pascalName}.`);

            } catch (err: any) {
                logError('Component generation failed.', err);
                if (err?.name === 'AbortError') return;
            }
        }
    );

    context.subscriptions.push(disposable);
}

// ---------------------------------------------------------------
// Extension Deactivation
// ---------------------------------------------------------------
export function deactivate() {}