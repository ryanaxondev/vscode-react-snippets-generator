// src/logger.ts

import * as vscode from 'vscode';
import { RCGError } from './errors';

const OUTPUT_CHANNEL_NAME = 'React Component Generator';
let channel: vscode.OutputChannel | undefined;

function getChannel(): vscode.OutputChannel {
    if (!channel) {
        channel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);
    }
    return channel;
}

export function logInfo(message: string): void {
    const ts = new Date().toLocaleTimeString();
    getChannel().appendLine(`[INFO ${ts}] ${message}`);
}

export function logWarning(message: string): void {
    const ts = new Date().toLocaleTimeString();
    getChannel().appendLine(`[WARN ${ts}] ${message}`);
}

export function logError(message: string, error?: unknown, showNotification: boolean = true): void {
    const ts = new Date().toLocaleTimeString();
    const ch = getChannel();

    let userMsg = message;
    let errorType = 'StandardError';

    if (error instanceof RCGError) {
        userMsg = error.userMessage;
        errorType = error.name;
    }

    ch.appendLine(`[ERROR ${ts}] Type: ${errorType} | User Message: ${userMsg}`);

    if (error) {
        const details = error instanceof Error ? (error.stack || error.message) : String(error);
        ch.appendLine(`[ERROR DETAILS] ${details}`);
    }
    ch.appendLine('--------------------------------------------------');

    if (showNotification) {
        vscode.window.showErrorMessage(`RCG Error: ${userMsg}. See '${OUTPUT_CHANNEL_NAME}' Output for details.`);
    }
}
