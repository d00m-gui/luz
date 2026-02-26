# AGENTS.md

## Project Overview
This document guides agents on working with the `luz` repository. Based on analysis of codebase structure, config files, and dependencies:

### Technology Stack
- **Runtime**: Bun (runtime environment)
- **Language**: TypeScript
- **Build Tool**: `bunup` (custom build command)
- **Testing**: `bun test`
- **Key Dependencies**:
  - `@happy-dom/global-registrator`: DOM manipulation and global element registration
  - `chroma-js`: Vector database/similarity search capability
  - `typescript`: ^5 (peer dependency)
- **Frontend Technologies**:
  - CSS/Theming system with CSS variables (`--background`, `--foreground`, etc.)
  - Global DOM registration for animations and theming

### Essential Commands
```bash
# Build production output
bunup

# Development with live reload
bunup --watch

# Run test suite
bun test

# Install dependencies (standard practice, not in explicit scripts but implied)
bun install
```

### Project Structure
```
.gitignore
LICENSE
README.md
bun.lock
bunfig.toml
bunup.config.ts

src/
├── index.ts          # Main entry point (module export)
├── reset.css          # CSS reset styles
├── setup.ts           # Configuration/initialization and theming
└── utils.ts           # Utility functions

happydom.ts           # Global DOM setup and registration
beta/
└── luz/              # Agent-specific logic subproject (contents require deeper exploration)
package.json
tsconfig.json
```

### Code Organization & Conventions
- **Module System**: ES modules (`import`/`export`)
- **File Naming**:
  - TypeScript: `*.ts`
  - Styles: `*.css`
  - Utilities: `utils.ts` for shared helpers
- **Type Safety**: Full TypeScript enforcement via `tsconfig.json`
- **CSS/Theming Conventions**:
  - CSS reset and base styles in `src/reset.css`
  - Theming variables and global styles in `src/setup.ts`
  - Global element registration and animations in `happydom.ts`
- **Build Output**: Compiled artifacts placed in `dist/` (inferred from `package.json` structure)

### Testing Approach
- **Command**: `bun test` triggers full test suite
- **Framework**: Likely Jest/Pendulum/Mocha (common with Bun/TypeScript); specific patterns not observable without test files
- **Best Practice**: Run tests before/after changes to catch failures early

### Important Gotchas & Observations
1. **`bunup` is the primary build command** — behavior not fully documented; consult `bunup.config.ts` if available
2. **Global DOM registration**: `happydom.ts` suggests global DOM element registration — caution when modifying DOM logic; may affect global state
3. **Vector search context**: `chroma-js` dependency implies vector database/similarity search functionality; likely used for AI/semantic features
4. **CSS/Theming depth**: `setup.ts` contains comprehensive CSS variables and theming system — critical for agent styling consistency
5. **Peer dependencies**: `typescript` must be installed separately (common pattern; not in `package.json` dependencies but required runtime)
6. **Directory visibility limit**: `beta/luz/` contents partially visible — explore as needed for agent-specific tasks
7. **Animation system**: `happydom.ts` includes suspense animations (`@keyframes suspense`) — agents should respect animation states
8. **Type safety**: Strict TypeScript types expected; agents should respect type definitions

### Agent Guidance Checklist
✅ **Before coding**:
```bash
bunup          # Ensure clean build
bun test       # Verify no existing failures
```

✅ **Debugging workflow**:
- Check `dist/` for build errors
- Use `bun up --watch` for runtime debugging
- Inspect console errors and browser dev tools
- Respect CSS variable overrides and theming system
- Verify DOM registration state in `happydom.ts`

✅ **Dependencies management**:
- Install: `bun install`
- Update: `bun install --upgrade`
- Pin versions via `bun.lock` file

✅ **Best practices**:
- Use `src/` directory for new source files
- Follow TypeScript conventions (strict mode likely)
- Prefer utility functions in `utils.ts` for reusability
- Leverage CSS variables for theming consistency
- Document changes in tests or comments where appropriate

### Existing Documentation Gap
- No prior `agents.md`, `.cursor/rules/*.md`, `claude.md`, or `.github/copilot-instructions.md` found in repository
- This document created proactively to fill agent tooling documentation gap
- Content based solely on observed codebase artifacts — supplement with direct exploration as project evolves

---

> **Note**: This guide reflects analysis of current repository state. As project evolves, agents should validate assumptions with direct code review and updated documentation.