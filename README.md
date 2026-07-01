# luz

Luz provides a minimalist mechanism for centralizing and managing styles across modern web applications

## Installation

```bash
bun i luz
```

## Usage Example (Astro Integration)

For Astro projects, use the provided integration to configure static luz styles CSS variables.

**1. Configure:** Create the file and define your primary theme colors in `luz.config.mjs`.

```javascript
export const config = {
	primary: "#007DEA",
	font: "'Inter', sans-serif",
	"font-headings": "'Inter', sans-serif",
	"font-emphasis": "'Inter', sans-serif",
	"font-monospace": "'Cascadia Mono', monospace"
```

**2. Use:** Integrate the setup in your astro.config.mjs file:

```javascript
import { config } from "./luz.config.mjs";
import { luzAstro } from "luz/astro";
// ... other imports
export default defineConfig({
  integrations: [luzAstro(config) /* ... */],
});
```

**3. Structure:** By default this configuration will create a static `./src/styles/luz.css` file. Unless you pass the parameter `path` to the config file.

**NOTE:** if the `./src/styles` directory does not exist create it.

**4. Loading:** Create a `./src/styles/global.css` and import `./luz.css` as follow

```css
@import url("./luz.css");
```

## License

MIT
