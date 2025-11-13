# Development Workflow

## Overview

This guide covers the day-to-day development workflow for the Todo List TypeScript application, including building, testing, debugging, and making changes to the codebase.

## Development Environment

### Starting Development

1. **Navigate to the project directory:**
   ```bash
   cd todo-list-typescript-main
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Navigate to `http://localhost:5173/`
   - The application should load immediately

4. **Keep the terminal open:**
   - Watch for TypeScript errors
   - See build warnings
   - Monitor hot reload status

### Hot Module Replacement (HMR)

Vite provides instant updates without full page reloads:

**When you save changes to:**
- **CSS files** - Styles update instantly
- **TypeScript files** - Code recompiles and updates
- **HTML file** - Page reloads automatically

**No need to:**
- Manually refresh the browser
- Restart the development server
- Clear the cache

## Making Code Changes

### Workflow for New Features

1. **Understand the requirement**
   - Review the feature request or issue
   - Identify affected components

2. **Plan the changes**
   - Determine which files need modification
   - Consider data model changes
   - Plan UI updates

3. **Implement incrementally**
   - Start with data layer changes
   - Update UI rendering if needed
   - Add event handlers last
   - Test after each change

4. **Verify the changes**
   - Test in the browser
   - Check console for errors
   - Verify localStorage persistence
   - Test edge cases

### Example: Adding a Priority Field

**Step 1: Update the data model**

File: `src/models/ListItem.ts`
```typescript
export interface Item {
  id: string;
  item: string;
  checked: boolean;
  priority: "low" | "medium" | "high"; // Add this
}

export default class LitsItem implements Item {
  constructor(
    private _id: string = "",
    private _item: string = "",
    private _checked: boolean = false,
    private _priority: "low" | "medium" | "high" = "medium" // Add this
  ) {}
  
  // Add getter/setter
  get priority(): "low" | "medium" | "high" {
    return this._priority;
  }
  set priority(priority: "low" | "medium" | "high") {
    this._priority = priority;
  }
}
```

**Step 2: Test the change**
- Save the file
- Check the terminal for TypeScript errors
- Verify compilation succeeds

**Step 3: Update creation logic**

File: `src/main.ts`
```typescript
const newItem = new LitsItem(
  itemId.toString(),
  myEntryText,
  false,
  "medium" // Add priority
);
```

**Step 4: Update rendering (optional)**

File: `src/templates/ListTemplate.ts`
```typescript
label.textContent = `[${item.priority}] ${item.item}`;
```

**Step 5: Test in browser**
- Add a new item
- Check console for errors
- Verify localStorage contains priority
- Test page refresh

## TypeScript Compilation

### Watching for Errors

The dev server automatically compiles TypeScript:

**Success:**
```
✓ 8 modules transformed.
```

**Error:**
```
src/models/ListItem.ts:15:3 - error TS2322: Type 'string' is not assignable to type '"low" | "medium" | "high"'.

15   priority: string;
   ~~~~~~~~
```

### Common TypeScript Errors

**Missing type annotation:**
```typescript
// ❌ Error
const items = [];

// ✅ Fix
const items: LitsItem[] = [];
```

**Incorrect type assertion:**
```typescript
// ❌ Error
const input = document.getElementById("newItem");
input.value = "text"; // Property 'value' does not exist

// ✅ Fix
const input = document.getElementById("newItem") as HTMLInputElement;
input.value = "text";
```

**Null reference:**
```typescript
// ❌ Error
const item = list.find(i => i.id === "1");
item.checked = true; // Object is possibly 'undefined'

// ✅ Fix
const item = list.find(i => i.id === "1");
if (item) {
  item.checked = true;
}
```

## Debugging

### Browser DevTools

**Opening DevTools:**
- **Chrome/Edge:** F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)
- **Firefox:** F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)
- **Safari:** Cmd+Option+I (enable developer menu first)

### Console Debugging

**Add console logs:**
```typescript
// In src/main.ts
itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();
  
  const input = document.getElementById("newItem") as HTMLInputElement;
  const myEntryText: string = input.value.trim();
  
  console.log("Form submitted with text:", myEntryText);
  console.log("Current list length:", fullList.list.length);
  
  if (!myEntryText) {
    console.log("Empty text, returning early");
    return;
  }
  
  // ...
});
```

**View output:**
- Open Console tab in DevTools
- Interact with the application
- Check logged values

### Breakpoint Debugging

**Set breakpoints:**
1. Open DevTools Sources tab
2. Navigate to `src/main.ts`
3. Click line number to add breakpoint
4. Interact with the app to trigger breakpoint

**When paused:**
- Inspect variables in Scope panel
- Step through code (F10, F11)
- Evaluate expressions in Console
- Resume execution (F8)

### Inspecting localStorage

**View stored data:**
1. Open DevTools Application tab
2. Expand Local Storage in left panel
3. Click on the domain (localhost:5173)
4. Find `myList` key
5. View JSON value

**Manually edit data:**
- Double-click the value
- Edit the JSON
- Press Enter to save
- Refresh page to see changes

**Clear data:**
- Right-click `myList` key
- Select "Delete"
- Or run in console: `localStorage.clear()`

### Network Debugging

**View requests:**
1. Open DevTools Network tab
2. Reload the page
3. See all loaded resources:
   - `index.html`
   - `src/main.ts`
   - `src/css/style.css`
   - Other assets

**Check for errors:**
- Red entries indicate failed requests
- Click entry to see details
- Useful for debugging asset loading

## Code Style

### TypeScript Conventions

**Naming:**
- Classes: `PascalCase` (e.g., `ListItem`, `FullList`)
- Interfaces: `PascalCase` (e.g., `Item`, `List`)
- Variables: `camelCase` (e.g., `fullList`, `myEntryText`)
- Private fields: `_camelCase` (e.g., `_id`, `_item`)
- Constants: `UPPER_CASE` (e.g., `MAX_LENGTH`)

**Type annotations:**
```typescript
// ✅ Always specify types
function addItem(item: LitsItem): void {
  // ...
}

// ❌ Don't rely on inference for public APIs
function addItem(item) {
  // ...
}
```

**Access modifiers:**
```typescript
// ✅ Use private for internal state
class FullList {
  private _list: LitsItem[] = [];
}

// ❌ Don't expose internal fields
class FullList {
  list: LitsItem[] = []; // Should be private
}
```

### CSS Conventions

**BEM-like naming:**
```css
/* Block */
.newItemEntry { }

/* Block__Element */
.newItemEntry__form { }
.newItemEntry__input { }
.newItemEntry__button { }
```

**Grouping selectors:**
```css
/* ✅ Group related states */
.button:hover,
.button:focus {
  color: limegreen;
}

/* ❌ Don't repeat styles */
.button:hover { color: limegreen; }
.button:focus { color: limegreen; }
```

## Building for Production

### Build Process

**Run the build:**
```bash
npm run build
```

**What happens:**
1. **TypeScript compilation** - `tsc` compiles all `.ts` files
2. **Vite bundling** - Bundles and optimizes code
3. **Asset processing** - Copies and optimizes static assets
4. **Output generation** - Creates `dist/` directory

**Build output:**
```
dist/
├── assets/
│   ├── index-[hash].css  # Compiled and minified CSS
│   └── index-[hash].js   # Compiled and minified JS
├── index.html            # HTML with updated asset links
└── vite.svg             # Static assets
```

### Testing Production Build

**Preview the build:**
```bash
npm run preview
```

**Access at:** `http://localhost:4173/`

**What to test:**
- All features work correctly
- No console errors
- localStorage persists
- Performance is acceptable
- Styles are correct

### Build Optimization

**Current optimizations:**
- Code minification
- CSS minification
- Tree shaking (unused code removal)
- Hash-based cache busting

**Build size tips:**
- Remove console.log statements
- Avoid unnecessary dependencies
- Use modern browser features

## Testing Checklist

### Manual Testing

Before committing changes, test:

**Basic Functionality:**
- [ ] Add a new todo item
- [ ] Check/uncheck items
- [ ] Delete individual items
- [ ] Clear all items
- [ ] Refresh page (verify persistence)

**Edge Cases:**
- [ ] Submit empty form
- [ ] Submit whitespace-only text
- [ ] Add very long text (40 chars max)
- [ ] Rapid-fire adding multiple items
- [ ] Delete last remaining item

**Browser Compatibility:**
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari (if available)
- [ ] Test in Edge (if available)

**Accessibility:**
- [ ] Tab through all interactive elements
- [ ] Use Space to toggle checkboxes
- [ ] Use Enter to submit form
- [ ] Test with screen reader (if available)

**Persistence:**
- [ ] Add items and refresh page
- [ ] Check items and refresh page
- [ ] Clear all and refresh page
- [ ] Open in new tab (verify shared storage)

### Performance Testing

**Stress test:**
1. Add 100+ items quickly
2. Check rendering performance
3. Test localStorage limits
4. Verify no memory leaks

**Profiling:**
1. Open DevTools Performance tab
2. Start recording
3. Perform actions
4. Stop recording
5. Analyze results

## Common Development Tasks

### Adding a New Model Field

1. Update interface in model file
2. Add to constructor parameters
3. Add private field
4. Add getter/setter
5. Update load/save if needed
6. Update UI to display/edit

### Adding a New Event Handler

1. Identify the element
2. Add event listener in `main.ts` or template
3. Type the event parameter
4. Update model
5. Re-render if needed

### Changing Styles

1. Locate the CSS class in `src/css/style.css`
2. Modify the styles
3. Save and check browser (auto-updates)
4. Test in different viewport sizes

### Refactoring Code

1. Ensure current code works
2. Make small, incremental changes
3. Test after each change
4. Watch for TypeScript errors
5. Verify functionality hasn't changed

## Git Workflow

### Committing Changes

**Check status:**
```bash
git status
```

**Stage changes:**
```bash
git add src/models/ListItem.ts
git add src/main.ts
```

**Commit:**
```bash
git commit -m "Add priority field to todo items"
```

**Push:**
```bash
git push origin main
```

### Commit Message Conventions

**Format:**
```
<type>: <subject>

<body (optional)>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

**Examples:**
```
feat: add priority field to todo items

- Update ListItem interface and class
- Add priority selection in form
- Display priority in list template
```

## Troubleshooting

### Dev Server Won't Start

**Check if port is in use:**
```bash
lsof -ti:5173
```

**Kill process:**
```bash
lsof -ti:5173 | xargs kill -9
```

**Use different port:**
```bash
npm run dev -- --port 3000
```

### TypeScript Errors Not Showing

**Restart dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

**Clear cache:**
```bash
rm -rf node_modules/.vite
npm run dev
```

### Build Fails

**Clear and reinstall:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

**Check TypeScript config:**
- Verify `tsconfig.json` is valid
- Check for syntax errors in source files

### Hot Reload Not Working

**Hard refresh:**
- Chrome/Edge: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Firefox: Ctrl+F5

**Restart dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

## Best Practices

### DO ✅
- Test changes immediately in the browser
- Keep the dev server running while coding
- Use TypeScript's type checking
- Write clear commit messages
- Test before committing
- Keep changes small and focused

### DON'T ❌
- Don't ignore TypeScript errors
- Don't commit without testing
- Don't modify configuration files without understanding
- Don't skip manual testing
- Don't disable strict mode

## Next Steps

After mastering the development workflow:

1. **Contribute to the project**
   - Read [Contributing Guide](./contributing.md)
   - Find an issue to work on
   - Submit a pull request

2. **Explore advanced topics**
   - Learn about Vite plugins
   - Study TypeScript advanced types
   - Explore performance optimization

3. **Share your knowledge**
   - Help other developers
   - Improve documentation
   - Write tutorials

---

**Related Documentation:**
- [Setup Guide](./setup.md)
- [Contributing Guide](./contributing.md)
- [Architecture Overview](../architecture/overview.md)
- [Style Guide](../style-guide.md)
