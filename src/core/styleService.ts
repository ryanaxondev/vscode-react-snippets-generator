// src/core/styleService.ts

import * as vscode from 'vscode';
import { Config } from './configService';
import { loadTemplate, processTemplate } from '../templateManager';
import { UserCanceledError } from '../errors';

interface StyleData {
    styleFileName: string | null;
    styleContent: string;
    styleImport: string;
    className: string;
}

export async function prepareStyleFiles(
    context: vscode.ExtensionContext, 
    lowerName: string
): Promise<StyleData> {

    let styleType = Config.defaultStyle;

    if (styleType === 'ask') {
        const pick = await vscode.window.showQuickPick(
            ['CSS', 'SCSS', 'Tailwind', 'None'],
            { placeHolder: 'Choose style type' }
        );
        if (!pick) throw new UserCanceledError();
        styleType = pick;
    }

    let styleFileName: string | null = null;
    let styleContent = '';
    let styleImport = '';
    let className = lowerName;

    // --- Tailwind Mode ---
    if (styleType === 'Tailwind') {
        let twClass = Config.defaultTailwindClass;

        if (twClass === 'ask') {
            const input = await vscode.window.showInputBox({
                prompt: 'Enter Tailwind class',
                value: 'container'
            });
            twClass = input || 'container';
        }

        className = twClass;

        return {
            styleFileName: null,
            styleContent: '',
            styleImport: '',
            className
        };
    }

    // --- No Styles ---
    if (styleType === 'None') {
        return {
            styleFileName: null,
            styleContent: '',
            styleImport: '',
            className
        };
    }

    // --- CSS / SCSS ---
    const ext = styleType === 'SCSS' ? '.scss' : '.css';
    styleFileName = `${lowerName}${ext}`;
    styleImport = `import './${styleFileName}';\n`;

    const rawTemplate = await loadTemplate(context, `styles/${styleType.toLowerCase()}.txt`);
    styleContent = processTemplate(rawTemplate, { lowerName });

    return { styleFileName, styleContent, styleImport, className };
}
