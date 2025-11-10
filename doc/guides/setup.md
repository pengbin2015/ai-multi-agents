# Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v16.0.0 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (usually comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (for version control)
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

### Recommended Software

1. **Visual Studio Code** or your preferred code editor
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)
   - Recommended extensions:
     - TypeScript and JavaScript Language Features (built-in)
     - ESLint
     - Prettier

2. **Modern Web Browser** with DevTools
   - Chrome, Firefox, Safari, or Edge
   - Required for testing and debugging

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/pengbin2015/ai-multi-agents.git
cd ai-multi-agents/todo-list-typescript-main
```

**Alternative (if forking):**
```bash
git clone https://github.com/YOUR-USERNAME/ai-multi-agents.git
cd ai-multi-agents/todo-list-typescript-main
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- **TypeScript** (v5.0.2 or higher) - TypeScript compiler
- **Vite** (v4.4.5 or higher) - Build tool and dev server

**Expected Output:**
```
added 2 packages, and audited 3 packages in 2s

found 0 vulnerabilities
```

### 3. Verify Installation

Check that everything is installed correctly:

```bash
npm list
```

**Expected Output:**
```
vite-ts-virgin@0.0.0 /path/to/todo-list-typescript-main
├── typescript@5.0.2
└── vite@4.4.5
```

## Project Structure

After installation, your directory structure should look like this:

```
todo-list-typescript-main/
├── node_modules/          # Dependencies (created by npm install)
├── public/                # Static assets
│   └── vite.svg          # Vite logo
├── src/                   # Source code
│   ├── css/
│   │   └── style.css     # All application styles
│   ├── models/
│   │   ├── ListItem.ts   # Individual item model
│   │   └── FullList.ts   # List collection model
│   ├── templates/
│   │   └── ListTemplate.ts # UI rendering
│   ├── main.ts           # Application entry point
│   ├── typescript.svg    # TypeScript logo
│   └── vite-env.d.ts     # Vite type definitions
├── .gitignore            # Git ignore rules
├── index.html            # HTML entry point
├── list.svg              # App icon
├── package.json          # Project metadata and scripts
├── package-lock.json     # Dependency lock file
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project readme
```

## Running the Application

### Development Server

Start the development server with hot module reloading:

```bash
npm run dev
```

**Expected Output:**
```
  VITE v4.4.5  ready in 543 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Access the application:**
- Open your browser to `http://localhost:5173/`
- The app should load and be ready to use

**Features:**
- **Hot Module Replacement (HMR)** - Changes appear instantly
- **Fast refresh** - No full page reload needed
- **Error overlay** - TypeScript and runtime errors shown in browser

### Stopping the Server

Press `Ctrl+C` in the terminal to stop the dev server.

## Building for Production

### Build the Application

```bash
npm run build
```

**What Happens:**
1. TypeScript compiles to JavaScript
2. Vite bundles and optimizes the code
3. Output is written to `dist/` directory

**Expected Output:**
```
vite v4.4.5 building for production...
✓ 34 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-a1b2c3d4.css    1.23 kB │ gzip: 0.67 kB
dist/assets/index-e5f6g7h8.js    12.34 kB │ gzip: 5.67 kB
✓ built in 1.23s
```

### Preview Production Build

```bash
npm run preview
```

**Expected Output:**
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

This serves the production build for testing.

## Configuration

### TypeScript Configuration

The `tsconfig.json` file contains TypeScript compiler options:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

**Key Settings:**
- `strict: true` - Enables all strict type checking
- `noEmit: true` - Vite handles compilation
- `target: ES2020` - Modern JavaScript features
- `moduleResolution: bundler` - Optimized for Vite

**Do NOT modify unless you understand the implications.**

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

**Available Commands:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Setup

### VS Code Configuration

Create `.vscode/settings.json` (optional):

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Git Configuration

The `.gitignore` file includes:

```
# Logs
logs
*.log
npm-debug.log*

# Dependencies
node_modules/

# Build output
dist
dist-ssr
*.local

# Editor directories
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
```

## Browser Storage

The application uses **localStorage** for data persistence:

**Storage Key:** `myList`

**Data Format:** JSON array of todo items

**Clearing Data:**
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Select Local Storage
4. Find `myList` key and delete

**Inspecting Data:**
```javascript
// In browser console
console.log(localStorage.getItem('myList'));
```

## Common Issues

### Port Already in Use

**Error:**
```
Port 5173 is already in use
```

**Solution 1:** Stop other Vite instances
```bash
# Kill process using the port
lsof -ti:5173 | xargs kill -9
```

**Solution 2:** Use different port
```bash
npm run dev -- --port 3000
```

### Module Not Found

**Error:**
```
Cannot find module 'vite'
```

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

**Error:**
```
Property 'value' does not exist on type 'HTMLElement'
```

**Solution:** Check type assertions in code:
```typescript
const input = document.getElementById("newItem") as HTMLInputElement;
```

### localStorage Not Working

**Possible Causes:**
- Private/Incognito browsing mode
- Browser security settings
- Storage quota exceeded

**Solution:** Use regular browsing mode and clear storage.

## Next Steps

After successful setup:

1. **Explore the Code**
   - Read [Architecture Overview](../architecture/overview.md)
   - Review [Data Layer](../architecture/data-layer.md)
   - Study [UI Rendering](../architecture/ui-rendering.md)

2. **Try Making Changes**
   - Modify styles in `src/css/style.css`
   - Add console logs to understand flow
   - Experiment with new features

3. **Read Development Workflow**
   - See [Development Workflow](./development.md)
   - Learn about debugging and testing
   - Understand the build process

4. **Contribute**
   - Read [Contributing Guide](./contributing.md)
   - Follow the style guide
   - Submit improvements

## Getting Help

If you encounter issues:

1. **Check the documentation**
   - Review this setup guide
   - Read relevant architecture docs
   - Check the FAQ (if available)

2. **Search for similar issues**
   - Check GitHub issues
   - Search Stack Overflow
   - Look at Vite/TypeScript docs

3. **Ask for help**
   - Open a GitHub issue
   - Provide error messages
   - Include steps to reproduce

## Additional Resources

### Official Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Learning Resources
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Modern JavaScript](https://javascript.info/)
- [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

### Tools
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [npm docs](https://docs.npmjs.com/)

---

**Related Documentation:**
- [Development Workflow](./development.md)
- [Contributing Guide](./contributing.md)
- [Architecture Overview](../architecture/overview.md)
