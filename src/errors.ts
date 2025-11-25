// src/errors.ts
export class RCGError extends Error {
    public readonly userMessage: string;
    
    constructor(message: string, userMessage: string, name: string = 'RCGError') {
        super(message);
        this.name = name;
        this.userMessage = userMessage;
        
        // Restore prototype chain for instance of checks
        Object.setPrototypeOf(this, new.target.prototype);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class UserCanceledError extends RCGError {
    constructor() {
        super('Operation cancelled by user.', 'Operation cancelled.', 'UserCanceledError');
    }
}

export class EnvironmentError extends RCGError {
    constructor(message: string, userMessage: string) {
        super(message, userMessage, 'EnvironmentError');
    }
}

export class TemplateError extends RCGError {
    constructor(message: string, userMessage: string) {
        super(message, userMessage, 'TemplateError');
    }
}

export class InvalidNameError extends RCGError {
    constructor(message: string, userMessage: string) {
        super(message, userMessage, 'InvalidNameError');
    }
}

export class ComponentExistsError extends RCGError {
    constructor(message: string, userMessage: string) {
        super(message, userMessage, 'ComponentExistsError');
    }
}
