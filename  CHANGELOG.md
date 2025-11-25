# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Planned Component Tree Generator feature.
- Planned Props Builder and Next.js mode.

### Changed
- N/A

### Fixed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Security
- N/A

---

## [1.0.0] - 2025-11-25

### Added
- Major refactor: generator is now fully modular with dedicated core services:
  - `configService`, `nameService`, `folderService`, `styleService`, `fileService`, `generationPipeline`
- Unified, step-by-step **pipeline** for component generation.
- New `UserCanceledError` for graceful cancel handling.
- Enhanced `logger.ts` for consistent and non-intrusive logging.
- Improved `templateManager.ts` with better error handling using `TemplateError`.
- All component creation logic now fully respects configuration and workspace context.

### Changed
- Extension activation and `extension.ts` refactored to leverage pipeline and centralized error handling.
- All previous scattered logic replaced with modular service-based architecture.
- Input validation, folder/file creation, style handling, and component writing flows improved for clarity and maintainability.

### Fixed
- Prevented multiple edge-case crashes during workspace resolution, filename validation, or user cancel.
- Ensured proper error reporting for missing templates or invalid names.

### Notes
- This release marks **1.0.0**: the extension now has a stable, maintainable architecture and is ready for future Phase-B and Phase-C features like Props Builder and Component Tree Generator.

## [0.7.0] - 2025-11-24

### Added
- Added complete AutoFormat (A5) implementation with Prettier-respecting workflow.
- Introduced new user setting: `rcs.autoFormat` for enabling/disabling automatic formatting.
- Added `logWarning` for safer and clearer reporting of formatter failures.

### Improved
- Wrapped formatter invocation in a dedicated try/catch to prevent flow interruption.
- Improved stability of document-opening and formatter command execution.
- Component creation pipeline now fully respects workspace formatter settings.

### Notes
This release completes all Phase-A core capabilities. The extension is now ready to begin Phase-B feature development.

## [0.6.0] - 2025-11-21

### Added
- Introduced a complete enterprise-level error architecture.
- Added new custom error classes:
  - `RCGError` (base error with dual messaging)
  - `EnvironmentError`
  - `TemplateError`
  - `InvalidNameError`
  - `ComponentExistsError`
- Implemented `userMessage` system to cleanly separate UX-facing text from technical logs.
- Extended logger to detect and treat `RCGError` instances with enhanced logging output.

### Changed
- Major refactor of `extension.ts` to use `throw`-first error control flow.
- All error paths now use standardized custom error classes for consistency.
- Replaced scattered `logError()` calls with predictable exception-based flow.

### Fixed
- Prevented several edge-case failures caused by undefined input or missing workspace.
- Ensured template and naming validation produce readable UX messages instead of raw errors.

### Commit Reference
- Covers architectural foundations for error handling.

## [0.5.0] - 2025-11-21

### Added
- Advanced filename validation with detection of disallowed characters.
- Component name validation to ensure PascalCase names start with a letter.
- Graceful cancel-handling for all user input prompts (InputBox/QuickPick).
- Folder and file existence pre-checks to prevent accidental overwrites.
- Integration of `logWarning` for non-fatal, UX-friendly alerts.

### Changed
- Improved user flow for folder creation decisions (Yes/No/Settings-driven).
- Optimized error and notification behavior for more predictable UX.
- Centralized validation path to reduce edge-case crashes.

### Fixed
- Prevented extension crashes during workspace/URI resolution.
- Fixed handling of QuickPick undefined result that previously caused errors.

### Commit Reference
- Related to UX & Validation improvements.


## [0.4.0] - 2025-11-21

### Added
- **Centralized Logging System**  
  - Implemented `logger.ts` with a dedicated Output Channel named **"React Component Generator"**.
  - Added logging helpers: `logInfo`, `logWarning`, `logError`.
  - Automatic timestamps added to all log entries.
  - Errors now include stack traces inside the Output Channel for easier debugging.

### Changed
- Updated `extension.ts` to use new centralized logging system instead of scattered `showErrorMessage`.
- Replaced direct error messages with `logError` for unified error handling.

### Improved
- Enhanced developer experience during debugging.
- Output Channel automatically reveals detailed failure context.
- Prepared the groundwork for structured error classes (TemplateNotFoundError, InvalidNameError, etc.).

### Fixed
- Prevented silent failures when file writing or template resolution fails.

### Removed
- Removed redundant inline error notifications.

### Security
- N/A

## [0.3.0] - 2025-11-21

### Added
- **Workspace-level Template Overrides**
  - Extension now loads templates from the workspace folder `.react-component-generator/` when available.
  - Fallback mechanism added: if a workspace template does not exist, the built-in template will be used.
  - Introduced new `templateManager.ts` responsible for template resolution logic.

### Changed
- Updated component generation flow to use workspace-first template loading.
- Improved architecture to support future template customization features (Phase C Webview Template Manager).

### Fixed
- N/A

### Removed
- N/A

### Security
- N/A

## [0.2.0] - 2025-11-21

### Added
- **VS Code Configuration Settings** for component generator:
  - `rcs.useFolder` (ask / always / never)
  - `rcs.defaultStyle` (ask / CSS / SCSS / Tailwind / None)
  - `rcs.defaultTailwindClass`
- **Explorer Context Menu** entry:
  - Right-click on folders → *Generate React Component*
- Integrated configuration settings into `src/extension.ts` logic.
- Prepared internal architecture for future DX improvements and template overrides.

### Changed
- Updated activation flow to respect user settings before showing QuickPick dialogs.
- Improved internal naming and structure for better maintainability.

### Fixed
- Ensured the extension activates cleanly in Extension Host without missing menu entries.

### Added files
- None (only modifications in existing files).

### Commit Reference
- Related to configuration & UX enhancements under Phase A (DX + Stability).

### Deprecated
- N/A

### Removed
- N/A

### Security
- N/A
