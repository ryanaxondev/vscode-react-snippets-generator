// src/logger.ts

import * as vscode from 'vscode';
import { RCGError } from './errors';

/**
 * Name of the output channel used by this extension.
 */
const OUTPUT_CHANNEL_NAME = 'React Component Generator';

// Holds the OutputChannel instance (Singleton pattern)
let channel: vscode.OutputChannel;

/**
 * Returns the existing OutputChannel instance or creates a new one.
 */
function getChannel(): vscode.OutputChannel {
    if (!channel) {
        channel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);
    }
    return channel;
}

/**
 * Logs an informational message.
 */
export function logInfo(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    getChannel().appendLine(`[INFO ${timestamp}] ${message}`);
}

/**
 * Logs a warning message.
 */
export function logWarning(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    getChannel().appendLine(`[WARN ${timestamp}] ${message}`);
}

/**
 * Logs an error message and optionally shows an error notification.
 * Supports RCGError for displaying friendly user-facing messages.
 */
export function logError(message: string, error?: any, showNotification: boolean = true): void {
    const timestamp = new Date().toLocaleTimeString();
    const channel = getChannel();

    let userDisplayMessage = message;

    channel.appendLine('--------------------------------------------------');

    if (error instanceof RCGError) {
        userDisplayMessage = error.userMessage;
        channel.appendLine(`[ERROR ${timestamp}] Type: ${error.name} | User Message: ${userDisplayMessage}`);
    } else {
        channel.appendLine(`[ERROR ${timestamp}] Type: Standard Error | User Message: ${userDisplayMessage}`);
    }

    if (error) {
        const errorDetails = error instanceof Error ? error.stack || error.message : String(error);
        channel.appendLine(`[ERROR DETAILS]: ${errorDetails}`);
    }

    channel.appendLine('--------------------------------------------------');

    channel.show(true);

    if (showNotification) {
        vscode.window.showErrorMessage(
            `RCG Error: ${userDisplayMessage}. See 'React Component Generator' Output channel for technical details.`
        );
    }
}