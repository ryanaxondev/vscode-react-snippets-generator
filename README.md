# ⚛️ React Component Snippets + Generator

[![Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/RyanCarter.react-component-snippets?style=for-the-badge\&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=RyanCarter.react-component-snippets)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/RyanCarter.react-component-snippets?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=RyanCarter.react-component-snippets)

A modern, fully modular productivity extension for React developers.

**Version 1.0.0** introduces a clean service-based architecture, a step-by-step generation pipeline, and full error handling.

---

## 🎥 Quick Demo

```
![Demo](./demo.gif)
```

---

## ✨ Features — Component Generator

The `Generate React Component` command now leverages a **modular pipeline** with dedicated services for configuration, naming, folder handling, styling, file writing, and template processing.

| Feature                                  | Description                                                                                             |
| :--------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| **Dedicated Folder Creation**            | Generate `Component/Component.jsx` + optional style file inside a folder named after the component.     |
| **Smart Naming**                         | Input like `user-card` automatically becomes **UserCard** (PascalCase validation included).             |
| **CSS / SCSS / Tailwind Support**        | Select your preferred styling method.                                                                   |
| **Tailwind Class Prompt**                | Enter a base Tailwind class when using Tailwind (default: `container`).                                 |
| **Auto-Formatting**                      | Automatically formats generated files using your VS Code formatter (configurable via `rcs.autoFormat`). |
| **Graceful Cancel Handling**             | User canceling any prompt halts generation cleanly without errors.                                      |
| **Workspace Template Overrides**         | Override built-in templates by placing files in `.react-component-generator/` inside your workspace.    |
| **Centralized Logging & Error Handling** | All logs and errors go through a unified system (`logger.ts`) for better UX and debugging.              |

---

### 🔧 What the Generator Creates

* Component file (`.jsx` or `.tsx`)
* Optional style file (`.css`, `.scss`, or Tailwind)
* Optional dedicated folder
* Clean, formatted boilerplate

---

### 💡 How to Use

1. Right-click a folder in the VS Code **Explorer**.
2. Click **`Generate React Component`**.
3. Enter a component name (e.g., `user-profile.jsx`).
4. Choose whether to create a dedicated folder.
5. Select your styling preference.
6. The component and optional style file are automatically generated and opened.

---

## ⌨️ Snippets — Fast Component Building

These snippets work in `.jsx`, `.tsx`, `.js`, and `.ts` with React enabled.

| Prefix    | Description                | Output                              |
| :-------- | :------------------------- | :---------------------------------- |
| **`rcc`** | React Component + CSS      | Component + CSS import              |
| **`rcs`** | React Component + SCSS     | Component + SCSS import             |
| **`rct`** | React Component + Tailwind | Component + editable Tailwind class |
| **`rc`**  | Simple Component           | Minimal functional component        |

---

## 🏗️ Project Structure (v1.0.0)

```
react-component-snippets/
 ├── src/
 │   ├── core/
 │   │   ├── configService.ts
 │   │   ├── folderService.ts
 │   │   ├── fileService.ts
 │   │   ├── generationPipeline.ts
 │   │   ├── nameService.ts
 │   │   └── styleService.ts
 │   ├── errors.ts
 │   ├── extension.ts
 │   ├── logger.ts
 │   └── templateManager.ts
 │
 ├── snippets/
 │   └── react-snippets.json
 │
 ├── templates/
 │   ├── component.txt
 │   └── styles/
 │       ├── css.txt
 │       ├── scss.txt
 │       └── tailwind.txt
 │
 ├── icon.png
 ├── .gitignore
 └── package.json
```

---

## 🛣️ Future Roadmap

### 🖥️ Dedicated Webview UI

A modern GUI inside VS Code for managing templates.

* Visual template browser
* Live editing and preview
* Create your own templates
* Extra toggles (Props, Context, etc.)

### 🌐 Next.js Scaffolding

Full support for the Next.js ecosystem.

* Server / Client components
* `page.jsx`, `layout.jsx`, `loading.jsx`
* Route handlers & server actions

### 🌳 Component Tree Generator

Generate an entire component hierarchy from a single line.

```
Navbar > NavItem > Avatar
```

Output: full nested structure with folders, components, and optional styles.

---

## ⚙️ Installation

1. Open the **Extensions** panel in VS Code.
2. Search: **`React Component Snippets + Generator`**.
3. Click **Install**.

**Requirements:**

* Visual Studio Code
* React project (JSX/TSX)

---

## 🤝 Contributing

Issues:
[https://github.com/ryanaxondev/vscode-react-snippets-generator/issues](https://github.com/ryanaxondev/vscode-react-snippets-generator/issues)

Pull Requests:
[https://github.com/ryanaxondev/vscode-react-snippets-generator/pulls](https://github.com/ryanaxondev/vscode-react-snippets-generator/pulls)

---

## 💼 License

MIT License

---

## 💎 Part of the AXON Open Source Ecosystem

This extension is part of **AXON**, a collection of modern tools designed to streamline React and full‑stack development.

© 2025 Ryan Carter
