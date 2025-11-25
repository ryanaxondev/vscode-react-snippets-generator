// src/core/configService.ts

import * as vscode from 'vscode';

// -------------------------------------------------------------
// Optional: Strong typing for configuration structure
// -------------------------------------------------------------
export interface RCSConfig {
    useFolder: string;
    defaultStyle: string;
    defaultTailwindClass: string;
    autoFormat: boolean;
}

// -------------------------------------------------------------
// Cached VS Code configuration (avoids repeated getConfiguration calls)
// -------------------------------------------------------------
let config = vscode.workspace.getConfiguration('rcs');

// -------------------------------------------------------------
// Configuration accessor with safe fallbacks
// -------------------------------------------------------------
export const Config: RCSConfig = {
    get useFolder(): string {
        return config.get<string>('useFolder') ?? 'ask';
    },
    get defaultStyle(): string {
        return config.get<string>('defaultStyle') ?? 'ask';
    },
    get defaultTailwindClass(): string {
        return config.get<string>('defaultTailwindClass') ?? 'container';
    },
    get autoFormat(): boolean {
        return config.get<boolean>('autoFormat') ?? true;
    }
} as RCSConfig;

// -------------------------------------------------------------
// Allow runtime reloading when user changes settings
// -------------------------------------------------------------
export function reloadConfig() {
    config = vscode.workspace.getConfiguration('rcs');
}

// -------------------------------------------------------------
// Auto-refresh on settings change
// -------------------------------------------------------------
vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('rcs')) {
        reloadConfig();
    }
});
