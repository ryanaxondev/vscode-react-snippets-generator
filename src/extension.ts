import * as vscode from 'vscode';
import * as path from 'path';
import { loadTemplate, processTemplate } from './templateManager';

// ----------------------------------------------------------------
// Shared Utilities
// ----------------------------------------------------------------

/**
 * Converts a raw string (e.g., 'user.profile-card', 'user profile card')
 * into PascalCase (e.g., 'UserProfileCard').
 * Extensions are removed automatically.
 */
function toPascalCase(name: string): string {
    return name
        .replace(/\.[^/.]+$/, '') 
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('');
}

// ----------------------------------------------------------------
// Main Extension Logic
// ----------------------------------------------------------------

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('rcs.generateComponent', async (uri?: vscode.Uri) => {
        try {
            // Resolve base folder
            const baseUri = uri ?? (vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri : undefined);
            if (!baseUri) {
                vscode.window.showErrorMessage('Please open a folder or right-click on a folder in the explorer.');
                return;
            }

            // Ask whether to generate a dedicated folder for the component
            const createFolder = await vscode.window.showQuickPick(
                ['Yes (Create a new folder)', 'No (Create files directly)'],
                { placeHolder: 'Do you want to create a dedicated folder for the component?' }
            );
            if (createFolder === undefined) return;

            // Get component filename and validate input
            let filename = await vscode.window.showInputBox({
                prompt: 'Enter component filename (e.g., Navbar or UserProfile.tsx)',
                placeHolder: 'Navbar'
            });
            if (!filename) return;

            if (/[/\\?%*:|"<>]/.test(filename)) {
                vscode.window.showErrorMessage("Filename contains invalid characters (/, \\, ?, %, *, :, |, \", <, >).");
                return;
            }

            // Normalize filename
            let ext = path.extname(filename);
            let fileBase = path.basename(filename, ext);

            if (!ext) {
                ext = '.jsx';
                filename = fileBase + ext;
            }

            const pascalName = toPascalCase(fileBase);
            const lowerName = fileBase.toLowerCase();

            // Basic React component name validation
            if (!/^[A-Za-z]/.test(pascalName)) {
                vscode.window.showErrorMessage("Component name must start with a letter.");
                return;
            }

            // Determine output folder
            let finalTargetUri = baseUri;
            if (createFolder.startsWith('Yes')) {
                finalTargetUri = vscode.Uri.joinPath(baseUri, pascalName);
                await vscode.workspace.fs.createDirectory(finalTargetUri);
            }

            // Select style type
            const styleType = await vscode.window.showQuickPick(
                ["CSS", "SCSS", "Tailwind", "None"],
                { placeHolder: "Choose style type for the component" }
            );
            if (styleType === undefined) return;

            // Prepare styling options
            let styleFileName: string | null = null;
            let styleContent = '';
            let styleImport = '';
            let className = lowerName;
            let tailwindClass = '';

            if (styleType === "Tailwind") {
                tailwindClass = await vscode.window.showInputBox({
                    prompt: "Enter Tailwind class (default: container)",
                    value: "container"
                }) || "container";
                className = tailwindClass;
            } else if (styleType !== "None") {
                let styleExt = styleType === "SCSS" ? '.scss' : '.css';
                styleFileName = `${lowerName}${styleExt}`;
                styleImport = `import './${styleFileName}';\n`;

                const styleTemplateContent = await loadTemplate(context, `styles/${styleType.toLowerCase()}.txt`);
                styleContent = processTemplate(styleTemplateContent, { lowerName });
            }

            // Generate component from template
            const componentTemplate = await loadTemplate(context, 'component.txt');
            const componentContent = processTemplate(componentTemplate, {
                pascalName,
                lowerName,
                styleImport,
                className,
                props: 'props'
            });

            // Produce URIs
            const componentUri = vscode.Uri.joinPath(finalTargetUri, filename);
            const styleUri = styleFileName ? vscode.Uri.joinPath(finalTargetUri, styleFileName) : null;

            // Write component file
            const componentContentBytes = new TextEncoder().encode(componentContent);
            await vscode.workspace.fs.writeFile(componentUri, componentContentBytes);

            // Write style file if needed
            if (styleUri) {
                const styleContentBytes = new TextEncoder().encode(styleContent);
                await vscode.workspace.fs.writeFile(styleUri, styleContentBytes);
            }

            // Open and format the generated component
            const doc = await vscode.workspace.openTextDocument(componentUri);
            await vscode.window.showTextDocument(doc, { preserveFocus: false, preview: false });

            await vscode.commands.executeCommand("editor.action.formatDocument");

            vscode.window.showInformationMessage(`Component ${pascalName} created successfully.`);

        } catch (err: any) {
            vscode.window.showErrorMessage(`Error creating component: ${err.message || String(err)}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
