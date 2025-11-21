// src/errors.ts

/**
 * Base class for all custom errors thrown by the extension.
 * Provides a user‑friendly message alongside the technical one.
 */
export class RCGError extends Error {
    /**
     * A short, non‑technical message intended to be shown directly to the user.
     */
    userMessage: string;

    constructor(message: string, userMessage: string, name: string = 'RCGError') {
        super(message);
        this.name = name;
        this.userMessage = userMessage;

        // Preserve a clean stack trace when running in Node/TypeScript environments.
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RCGError);
        }
    }
}

/**
 * Error type used when required workspace conditions or essential templates
 * are missing or not accessible.
 */
export class EnvironmentError extends RCGError {
    constructor(message: string, userMessage: string) {
        super(message, userMessage, 'EnvironmentError');
    }
}

/**
 * Error type representing issues related to template loading, parsing,
 * or rendering.
 */
export class TemplateError extends RCGError {
    constructor(message: string, userMessage: string) {
        super(message, userMessage, 'TemplateError');
    }
}

/**
 * Error thrown when invalid component names, disallowed characters,
 * or non‑standard React naming conventions are detected.
 */
export class InvalidNameError extends RCGError {
    constructor(message: string, userMessage: string) {
        super(message, userMessage, 'InvalidNameError');
    }
}

/**
 * Error used when a target file or directory already exists and the extension
 * must avoid overwriting user content.
 */
export class ComponentExistsError extends RCGError {
    constructor(message: string, userMessage: string) {
        super(message, userMessage, 'ComponentExistsError');
    }
}
