# ⚛️ React Component Snippets + Generator

[![Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/RyanCarter.react-component-snippets?style=for-the-badge\&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=RyanCarter.react-component-snippets)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/RyanCarter.react-component-snippets?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=RyanCarter.react-component-snippets)

A modern productivity extension for React developers.
Create components instantly with:

* 🚀 A powerful Component Generator that scaffolds components, styles, and folders in seconds.
* ⌨️ Production-ready snippets for rapid in-file component creation.

Perfect for teams and individuals building scalable, high-quality React applications.

---

## 🎥 Quick Demo

```
![Demo](./demo.gif)
```

---

## ✨ Features — Component Generator

The `Generate React Component` command provides a smooth, guided workflow for creating production-ready component structures.

| Feature                           | Description                                                                                     |
| :-------------------------------- | :---------------------------------------------------------------------------------------------- |
| **Dedicated Folder Creation**     | Generate `Component/Component.jsx` + `Component.css` inside a folder named after the component. |
| **Smart Naming**                  | Input like `user-card` automatically becomes **UserCard**.                                      |
| **CSS / SCSS / Tailwind Support** | Choose your preferred styling method.                                                           |
| **Tailwind Class Prompt**         | When Tailwind is selected, enter a base class like `container` or `flex-col`.                   |
| **Auto-Formatting**               | Automatically formats generated files using your VS Code formatter.                             |

### 🔧 What the Generator Creates

* Component file (`.jsx` or `.tsx`)
* Optional style file (CSS / SCSS / Tailwind)
* Optional dedicated folder
* Clean, formatted boilerplate

### 💡 How to Use

1. Right-click a folder in the VS Code **Explorer**.
2. Click **`Generate React Component`**.
3. Enter a component name (e.g., `user-profile.jsx`).
4. Choose whether to create a dedicated folder.
5. Select your styling preference.

---

## ⌨️ Snippets — Fast Component Building

These snippets work in `.jsx`, `.tsx`, `.js`, and `.ts` with React enabled.

| Prefix    | Description                | Output                              |
| :-------- | :------------------------- | :---------------------------------- |
| **`rcc`** | React Component + CSS      | Component + CSS import              |
| **`rcs`** | React Component + SCSS     | Component + SCSS import             |
| **`rct`** | React Component + Tailwind | Component + editable Tailwind class |
| **`rc`**  | Simple Component           | Minimal functional component        |

### Quick List

```
rcc → CSS Component
rcs → SCSS Component
rct → Tailwind Component
rc  → Simple Component
```

### Example (`rcc`)

```jsx
import './mycomponent.css';

const MyComponent = () => {
  return (
    <div className="mycomponent">
      {/* cursor moves here */}
    </div>
  );
};

export default MyComponent;
```

---

## 🏗️ Project Structure

```
react-component-snippets/
 ├── src/
 │   ├── extension.ts        // Extension entrypoint and UX logic
 │   └── templateManager.ts  // Template loading + processing
 │
 ├── snippets/
 │   └── react-snippets.json // Registered VS Code snippet definitions
 │
 ├── templates/
 │   ├── component.txt       // Base component template
 │   └── styles/
 │       ├── css.txt
 │       ├── scss.txt
 │       └── tailwind.txt
 │
 ├── icon.png                // Extension icon (128x128)
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
Input:

```
Navbar > NavItem > Avatar
```

Output: Generates a full nested structure.

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
