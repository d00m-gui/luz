# 🌟 Luz: A Modern CSS-in-JS Theming Library for Web Applications

---

## **🚀 Overview**
Luz is a lightweight yet powerful CSS-in-JS library designed to simplify theming and styling in modern web applications. Whether you're building a **SPA**, **React app**, or **Vanilla JS** project, Luz provides a seamless way to manage colors, contrasts, typography, and responsive design tokens dynamically.

With **zero dependencies** (except for Chroma.js for color manipulation), Luz integrates seamlessly with **Vanilla JavaScript**, **React (v19+)** and other frameworks. It leverages the modern [CSS StyleSheet API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Style_Sheet_API) for performant theming.

---

## **✨ Key Features**

- **🎨 Dynamic Theming**: Instantly apply **light/dark modes** and custom color schemes.
- **⚡ Performance Optimized**: Uses **`CSSStyleSheet`** for fast, non-blocking CSS injection.
- **📱 Responsive Ready**: Built-in **design tokens** and **CSS variables** for consistency.
- **🛠️ Framework Agnostic**: Works with **React (v19+)**, **Vanilla JS**, and other modern stacks.
- **🎭 Customizable**: Override **fonts, spacing, shadows, transitions**, and more.
- **📚 Clean CSS Reset**: Comes with a **minimal reset** to standardize your stylesheet.
- **📦 Zero External Dependencies** (except Chroma.js for color operations).

---

## **📦 Installation**

Luz can be installed via **Bun**, **npm**, or **Yarn**:

### **Using Bun**
```bash
bun add luz
```

### **Using npm**
```bash
pnpm install luz
```

---

## **📜 Usage**

### **1. Basic Setup (Vanilla JS)**
Include Luz in your project and apply a theme:

```javascript
import { luz } from "luz";

// Define your theme (optional)
const myTheme = {
  primary: "#6366F1",   // Indigo (your brand color)
  mode: "dark",         // or "light"
  font: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
};

// Apply the theme globally
luz(myTheme);
```

### **2. Custom Styling**
Extend the reset or modify the theme with custom CSS:

```css
/* Custom CSS can be injected alongside Luz */
body {
  --secondary-600: #FF5733;
  --transition: all ease 0.3s;
  --red: #FF0000;
}
```

---

## **🎨 Theming & Design Tokens**

Luz automatically generates **smooth color transitions** and **optimal contrast**. Example output:

```css
:root {
  --primary-50: oklch(88.28% 0.07 330.96deg);    /* Lightest shade */
  --primary-500: oklch(64.66% 0.25 332.71deg);  /* Primary */
  --on-primary: oklch(93.6% 0.06 326.07deg);    /* Auto-calculated contrast */
  --secondary-500: oklch(79.2% 0.23 144.27deg);
  --secondary-950: oklch(28.15% 0.07 145.23deg); /* Dark shade for backgrounds */

  /* Element styles */
  --element-color: var(--primary-100); /* Dark text for contrast */
  --element-active-color: var(--primary-500);
}
```

### **Light vs Dark Mode**
Switch between **light** and **dark** themes effortlessly:

```javascript
luz({ mode: "dark" });  // Dark theme
luz({ mode: "light" }); // Light theme
```

---

## **📝 API Reference**

### **`luz(customTheme?: DefaultTheme)`**
Applies the Luz theme globally. Returns a `CSSStyleSheet` for frameworks like React.

#### **`DefaultTheme` Interface**
```ts
interface DefaultTheme {
  font?: string;
  "line-height"?: string;
  "font-bold-weight"?: number;
  "font-weight"?: number;
  base?: number;               // Base font size (rem/px scaling)
  power?: number;               // Font scale exponent for sizing
  primary: string;             // Your primary color (HEX, RGB, or name)
  mode: "light" | "dark";      // Theme mode
  neutrals?: "grey" | "gray";  // Neutral background color
  prefix?: string;             // Namespace for CSS variables (e.g., "app-")
  transition?: string;         // Transition effect (e.g., "all 0.2s ease")
}
```

---

## **📋 Why Luz?**
- **Framework-Friendly**: No React hooks or complex setup.
- **Performance**: Uses **CSSStyleSheet API** for instant updates.
- **Accessible**: Automatic contrast ensures WCAG compliance.
- **Lightweight**: Just **~5KB** (gzip).

---

## **📚 License**
MIT © Luz. Free for personal and commercial use.

---
