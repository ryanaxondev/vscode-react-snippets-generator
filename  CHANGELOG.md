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
