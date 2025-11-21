# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Planned support for workspace-level template overrides.
- Planned improvements for error handling and output logging.
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
