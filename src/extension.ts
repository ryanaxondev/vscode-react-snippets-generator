// src/extension.ts
import * as vscode from 'vscode';
import { runGeneratorPipeline } from './core/generationPipeline';
import { logError, logInfo } from './logger';
import { UserCanceledError } from './errors';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'rcs.generateComponent',
        async (uri?: vscode.Uri) => {
            logInfo('Command "rcs.generateComponent" initiated.');
            
            try {
                await runGeneratorPipeline(context, uri);

            } catch (err: unknown) {

                // 1. User pressed ESC or canceled an input
                if (err instanceof UserCanceledError) {
                    logInfo('Operation cancelled by user.');
                    return;
                }

                // 2. Unexpected errors — log with stack trace & notify user
                logError('Generator pipeline failed', err, true);

                vscode.window.showErrorMessage(
                    'Component generation failed. Check logs for details.'
                );
            }
        }
    );

    context.subscriptions.push(disposable);
    logInfo('React Component Generator Extension Activated.');
}

export function deactivate() {}
