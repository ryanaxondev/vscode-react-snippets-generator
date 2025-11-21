// src/logger.ts

import * as vscode from 'vscode';

/**
 * Name of the custom output channel for this extension.
 */
const OUTPUT_CHANNEL_NAME = 'React Component Generator';

// Private variable holding the OutputChannel instance (Singleton)
let channel: vscode.OutputChannel;

/**
 * Returns the existing OutputChannel instance or creates it if missing.
 * Implements a simple Singleton pattern.
 */
function getChannel(): vscode.OutputChannel {
    if (!channel) {
        channel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);
    }
    return channel;
}

/**
 * Logs an informational message to the Output Channel.
 * @param message The message to log.
 */
export function logInfo(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    getChannel().appendLine(`[INFO ${timestamp}] ${message}`);
}

/**
 * Logs an error message to the Output Channel and optionally shows an error notification.
 * @param message A short user-facing error message.
 * @param error The technical error object or message for detailed logging.
 * @param showNotification If true, displays a VS Code error notification.
 */
export function logError(message: string, error?: any, showNotification: boolean = true): void {
    const timestamp = new Date().toLocaleTimeString();
    const channel = getChannel();

    channel.appendLine('--------------------------------------------------');
    channel.appendLine(`[ERROR ${timestamp}] User Message: ${message}`);

    if (error) {
        const errorDetails = error instanceof Error ? error.stack || error.message : String(error);
        channel.appendLine(`[ERROR DETAILS]: ${errorDetails}`);
    }

    channel.appendLine('--------------------------------------------------');

    // Automatically show the output channel so debugging becomes easier
    channel.show(true);

    // Optionally show a user-friendly error notification
    if (showNotification) {
        vscode.window.showErrorMessage(
            `RCG Error: ${message}. See 'React Component Generator' output channel for details.`
        );
    }
}

/**
 * Logs a warning message to the Output Channel.
 * @param message The warning message to log.
 */
export function logWarning(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    getChannel().appendLine(`[WARN ${timestamp}] ${message}`);
}