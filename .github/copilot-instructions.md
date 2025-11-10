# Copilot Instructions for Todo List TypeScript Application

## Overview

This document enables AI coding assistants (like GitHub Copilot) to generate features and code that align with this project's architecture, conventions, and style guidelines. All patterns described here are based on **actual, observed patterns** from the existing codebase—not invented best practices.

### Purpose
When you ask an AI assistant to add features or modify code in this project, it will:
- Follow the established architectural patterns
- Match the existing code style and conventions
- Maintain consistency with the design philosophy
- Avoid introducing incompatible approaches

### Architecture Summary
This is a **minimalist, vanilla TypeScript todo list application** with:
- Zero runtime dependencies (only build tools: TypeScript + Vite)
- Singleton pattern for state management
- localStorage persistence
- Imperative DOM manipulation (no UI framework)
- Strict TypeScript with comprehensive type checking
- Dark theme with accessibility features

---

## File Category Reference

### 1. **models** - Data Models and State Management

**Purpose**: Classes that represent data and handle persistence.

**Examples**:
- `src/models/ListItem.ts` - Individual todo item
- `src/models/FullList.ts` - Collection of items with localStorage

**Key Conventions**:
- ✅ **Singleton pattern**: Static instance property, private constructor
- ✅ **Interface + Class**: Interface first, class implements it (same file)
- ✅ **Private fields**: Underscore prefix (`_id`, `_item`), exposed via getters/setters
- ✅ **Auto-save**: Every mutation method calls `this.save()`
- ✅ **localStorage**: Persistence encapsulated in model, key: `"myList"`
- ✅ **Constructor**: Private with parameters and default values
- ❌ No validation in setters (keep pure accessors)
- ❌ No multiple instances (singleton constraint)

**Example Structure**:
```typescript
export interface Item {
  id: string;
  item: string;
  checked: boolean;
}

export default class LitsItem implements Item {
  constructor(
    private _id: string = "",
    private _item: string = "",
    private _checked: boolean = false
  ) {}
  
  get id(): string { return this._id; }
  set id(id: string) { this._id = id; }
  // ... more getters/setters
}
```

---

### 2. **templates** - UI Rendering and DOM Manipulation

**Purpose**: Classes that render data models to the DOM.

**Examples**:
- `src/templates/ListTemplate.ts` - Renders todo list items

**Key Conventions**:
- ✅ **Singleton pattern**: Static instance, private constructor
- ✅ **Cache DOM reference**: Query once in constructor, store as public property
- ✅ **Clear-then-render**: Always call `this.clear()` before rebuilding
- ✅ **createElement with type assertions**: `as HTMLInputElement`, etc.
- ✅ **Imperative DOM**: Set properties individually, use `append()`
- ✅ **Inline event listeners**: Arrow functions capturing loop variables
- ✅ **prepend() for order**: Newest items at top
- ❌ No innerHTML for dynamic content (XSS risk)
- ❌ No template literals or JSX
- ❌ No partial updates (always full rerender)

**Example Structure**:
```typescript
interface DOMList {
  ul: HTMLUListElement;
  clear(): void;
  render(fullList: FullList): void;
}

export default class ListTemplate implements DOMList {
  ul: HTMLUListElement;
  static instance: ListTemplate = new ListTemplate();
  
  private constructor() {
    this.ul = document.getElementById("listItems") as HTMLUListElement;
  }
  
  clear(): void {
    this.ul.innerHTML = "";
  }
  
  render(fullList: FullList): void {
    this.clear();
    fullList.list.forEach((item) => {
      const li = document.createElement("li") as HTMLLIElement;
      // ... build elements
      this.ul.prepend(li);
    });
  }
}
```

---

### 3. **entry-point** - Application Initialization

**Purpose**: Bootstrap the application, set up event listeners, initialize state.

**Examples**:
- `src/main.ts` - Application entry point

**Key Conventions**:
- ✅ **Import CSS first**: `import "./css/style.css"`
- ✅ **DOMContentLoaded**: Wrap all logic in `initApp()` function
- ✅ **Get singletons first**: `const fullList = FullList.instance`
- ✅ **Type assert DOM queries**: Every `getElementById` with specific type
- ✅ **preventDefault on forms**: First action in form submit handler
- ✅ **Trim and validate input**: Before processing
- ✅ **Load then render**: `fullList.load()` before `template.render()`
- ❌ No code execution before DOMContentLoaded
- ❌ No instantiation with `new` for singletons

**Example Structure**:
```typescript
import "./css/style.css";
import FullList from "./models/FullList";
import ListTemplate from "./templates/ListTemplate";

const initApp = (): void => {
  const fullList = FullList.instance;
  const template = ListTemplate.instance;
  
  const itemEntryForm = document.getElementById(
    "itemEntryForm"
  ) as HTMLFormElement;
  
  itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
    e.preventDefault();
    // ... handle form submission
  });
  
  fullList.load();
  template.render(fullList);
};

document.addEventListener("DOMContentLoaded", initApp);
```

---

### 4. **styles** - CSS Styling

**Purpose**: All visual styling in a single global stylesheet.

**Examples**:
- `src/css/style.css` - All application styles

**Key Conventions**:
- ✅ **BEM-like naming**: `block__element` (camelCase blocks)
- ✅ **Semantic class names**: Describe purpose, not appearance
- ✅ **Flexbox layouts**: Use `display: flex` with `gap` property
- ✅ **Offscreen class**: `position: absolute; left: -10000px` (not display: none)
- ✅ **Hover + focus together**: Always style both states identically
- ✅ **48px minimum touch targets**: Accessibility requirement
- ✅ **Mobile-first**: Base styles for mobile, `@media (min-width: 768px)` for desktop
- ✅ **rem/em units**: Relative units for spacing and sizing
- ❌ No CSS modules or scoped styles
- ❌ No ID selectors
- ❌ No inline styles

**Example Pattern**:
```css
.newItemEntry__form {
  display: flex;
  gap: 0.25rem;
  font-size: 1.5rem;
}

.newItemEntry__button:hover,
.newItemEntry__button:focus {
  color: limegreen;
}
```

---

### 5. **html-templates** - Static HTML Structure

**Purpose**: Base HTML document with semantic structure.

**Examples**:
- `index.html` - Main HTML file

**Key Conventions**:
- ✅ **Semantic HTML**: `<main>`, `<section>`, `<form>`, `<ul>`, `<header>`
- ✅ **Offscreen headings**: `.offscreen` class for screen reader content
- ✅ **Label associations**: `<label for="id">` matching `<input id="id">`
- ✅ **aria-label on icon buttons**: Describe action clearly
- ✅ **Heading hierarchy**: h1 → h2 (no skipping)
- ❌ No div/span soup (use semantic elements)

---

### 6. **build-configuration** - TypeScript and Build Setup

**Purpose**: Configure TypeScript compiler and Vite build tool.

**Examples**:
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts

**Key Conventions**:
- ✅ **Strict mode enabled**: All type checking rules
- ✅ **ES2020 target**: Modern JavaScript features
- ✅ **Bundler mode**: Module resolution for Vite
- ✅ **No emit**: Vite handles compilation
- ✅ **Explicit types**: All functions have parameter and return types
- ❌ No implicit any types
- ❌ No unused variables or parameters

---

## Feature Scaffold Guide

### How to Plan and Implement a New Feature

#### Step 1: Determine File Categories Needed

Ask yourself:
- **Data model?** → Create a new model file in `src/models/`
- **UI component?** → Update `src/templates/ListTemplate.ts` or create new template
- **User interaction?** → Add event listener in `src/main.ts`
- **Styling?** → Add styles to `src/css/style.css`
- **HTML structure?** → Modify `index.html` if needed

#### Step 2: Follow Naming and Structure Conventions

**File naming**:
- Models: `src/models/[ModelName].ts` (PascalCase)
- Templates: `src/templates/[TemplateName].ts` (PascalCase)
- Styles: Keep in `src/css/style.css`

**Class naming**:
- Data: `[Noun]` or `Full[Noun]` (e.g., `ListItem`, `FullList`)
- Templates: `[Noun]Template` (e.g., `ListTemplate`)
- Use singleton pattern for both

**CSS naming**:
- Blocks: `.blockName` (camelCase)
- Elements: `.blockName__element` (camelCase__camelCase)
- Utilities: `.utilityName` (camelCase)

#### Step 3: Implement Following Patterns

For **models**:
1. Define interface first
2. Create class with `static instance` and private constructor
3. Add private fields with getters/setters
4. Include `save()` and `load()` for persistence
5. Call `save()` in every mutation method

For **templates**:
1. Create singleton with cached DOM reference
2. Implement `clear()` and `render(model)` methods
3. Use `createElement` with type assertions
4. Attach event listeners inline with arrow functions
5. Call `this.clear()` at start of `render()`

For **event handlers**:
1. Type event parameter explicitly
2. Call `preventDefault()` first for forms
3. Trim and validate input
4. Update model first, then call `template.render()`

For **styles**:
1. Add to single `style.css` file
2. Use BEM-like naming with camelCase
3. Use flexbox with gap property
4. Style hover and focus together
5. Use rem/em units for spacing

---

## Integration Rules (Architectural Constraints)

These are **required patterns** from the architectural analysis. Violating these will create inconsistent code:

### Data Layer
- ✅ **MUST** use singleton instances: `ClassName.instance`
- ✅ **MUST** call `save()` after every state mutation
- ✅ **MUST** use private fields with getters/setters
- ✅ **MUST** define interface before class implementation
- ❌ **MUST NOT** access localStorage directly from non-model code
- ❌ **MUST NOT** create multiple instances of model classes

### UI Rendering
- ✅ **MUST** use `ListTemplate.instance` for all rendering
- ✅ **MUST** call `clear()` before every render
- ✅ **MUST** use `createElement` with type assertions
- ✅ **MUST** use `textContent` (not `innerHTML`) for user data
- ❌ **MUST NOT** use JSX, template literals, or innerHTML for dynamic content
- ❌ **MUST NOT** do partial updates (always full rerender)

### Event Handling
- ✅ **MUST** type event parameters when using event properties
- ✅ **MUST** call `preventDefault()` on form submissions
- ✅ **MUST** trim user input before validation
- ✅ **MUST** update model before calling render
- ❌ **MUST NOT** manipulate DOM directly in event handlers
- ❌ **MUST NOT** skip validation for user input

### Styling
- ✅ **MUST** add all styles to single `style.css` file
- ✅ **MUST** use BEM-like naming: `block__element`
- ✅ **MUST** use `.offscreen` for screen-reader-only content
- ✅ **MUST** style hover and focus states together
- ✅ **MUST** maintain 48px minimum touch targets
- ❌ **MUST NOT** use CSS modules or scoped styles
- ❌ **MUST NOT** use display: none for accessible content
- ❌ **MUST NOT** use inline styles

### TypeScript
- ✅ **MUST** enable strict mode (keep `"strict": true`)
- ✅ **MUST** type all function parameters and return types
- ✅ **MUST** type assert DOM queries with specific types
- ✅ **MUST** handle nullable types (localStorage can return null)
- ❌ **MUST NOT** use implicit any types
- ❌ **MUST NOT** leave unused variables or parameters

---

## Example Prompt Usage

### Example 1: Adding a New Feature

**User Prompt**:
> "Create a searchable dropdown that lets users filter by category"

**AI Should Respond With**:

⚠️ **Architectural Constraint Violation**: This feature requires categorization of todo items, but the current `ListItem` model only supports `id`, `item`, and `checked` properties. Adding categories would require:

1. **Breaking change to data model**:
   - Add `category: string` field to `Item` interface
   - Update `LitsItem` class with getter/setter
   - Update localStorage migration (existing data won't have category)

2. **New files needed**:
   - Modify: `src/models/ListItem.ts` (add category field)
   - Modify: `src/models/FullList.ts` (add filter method)
   - Modify: `src/templates/ListTemplate.ts` (render filtered list)
   - Modify: `src/main.ts` (add dropdown event listener)
   - Modify: `index.html` (add dropdown HTML)
   - Modify: `src/css/style.css` (style dropdown)

Would you like me to proceed with this breaking change, or would you prefer a different approach?

---

### Example 2: Adding a Simple Feature

**User Prompt**:
> "Add a clear input and focus it after adding a task"

**AI Should Generate**:

**Files to modify**: `src/main.ts`

```typescript
// In the form submit handler, after template.render():
fullList.addItem(newItem);
template.render(fullList);
input.value = ""; // Clear input
input.focus();     // Focus for next entry
```

**Explanation**: This follows the existing pattern of updating model → rendering → additional UI updates. No new files needed, maintains consistency.

---

### Example 3: Adding Styling

**User Prompt**:
> "Make completed items appear with gray text"

**AI Should Generate**:

**Files to modify**: `src/css/style.css`

Add after the existing checkbox checked style:

```css
.item>input[type="checkbox"]:checked+label {
  text-decoration: line-through;
  color: #999; /* Add gray color */
}
```

**Explanation**: Uses existing adjacent sibling selector pattern, maintains BEM-like naming convention, adds alongside existing checked state styling.

---

### Example 4: Adding a New Model

**User Prompt**:
> "Add a priority field (high, medium, low) to each todo item"

**AI Should Generate**:

**1. Modify**: `src/models/ListItem.ts`

```typescript
export interface Item {
  id: string;
  item: string;
  checked: boolean;
  priority: "high" | "medium" | "low"; // Add priority
}

export default class LitsItem implements Item {
  constructor(
    private _id: string = "",
    private _item: string = "",
    private _checked: boolean = false,
    private _priority: "high" | "medium" | "low" = "medium" // Default to medium
  ) {}
  
  // ... existing getters/setters ...
  
  get priority(): "high" | "medium" | "low" {
    return this._priority;
  }
  set priority(priority: "high" | "medium" | "low") {
    this._priority = priority;
  }
}
```

**2. Modify**: `src/models/FullList.ts`

Update the `load()` method to include priority in type annotation:

```typescript
const parsedList: { 
  _id: string; 
  _item: string; 
  _checked: boolean;
  _priority: "high" | "medium" | "low"; // Add to type
}[] = JSON.parse(storedList);

parsedList.forEach((itemObj) => {
  const newListItem = new LitsItem(
    itemObj._id,
    itemObj._item,
    itemObj._checked,
    itemObj._priority || "medium" // Handle missing priority in old data
  );
  FullList.instance.addItem(newListItem);
});
```

**3. Modify**: `src/main.ts`

Update item creation to include priority (you'll need UI to select it):

```typescript
const newItem = new LitsItem(
  itemId.toString(), 
  myEntryText,
  false, // checked
  "medium" // priority - default for now
);
```

**4. Modify**: `src/templates/ListTemplate.ts`

Optionally display priority in the rendered item (example):

```typescript
const label = document.createElement("label") as HTMLLabelElement;
label.htmlFor = item.id;
label.textContent = `[${item.priority}] ${item.item}`; // Show priority
li.append(label);
```

**5. Modify**: `src/css/style.css`

Optionally style priorities:

```css
.item>label[data-priority="high"] {
  color: #ff6b6b;
}

.item>label[data-priority="medium"] {
  color: #ffd93d;
}

.item>label[data-priority="low"] {
  color: #6bcf7f;
}
```

And update template to set data attribute:

```typescript
label.dataset.priority = item.priority;
```

---

## Domain-Specific Notes

### What Features Fit Well
- ✅ Simple CRUD operations on single todo list
- ✅ Visual enhancements (animations, better styling)
- ✅ Keyboard shortcuts
- ✅ Export/import functionality (CSV, JSON)
- ✅ Simple filtering or sorting
- ✅ Edit existing items
- ✅ Drag and drop reordering
- ✅ Due dates or timestamps

### What Features Conflict with Architecture
- ❌ Multiple lists (singleton pattern assumes one list)
- ❌ User authentication (no backend or user model)
- ❌ Real-time collaboration (no WebSocket or sync)
- ❌ Complex nested hierarchies (flat list structure)
- ❌ Backend API integration (localStorage only)
- ❌ Using React, Vue, or other frameworks (vanilla TypeScript only)
- ❌ Using state management libraries (custom singleton pattern)

If a feature requires conflicting patterns, the AI should:
1. Identify the conflict
2. Explain what would need to change
3. Ask for confirmation before proceeding

---

## Summary Checklist

When generating code for this project, AI assistants should:

✅ Use singleton pattern for models and templates  
✅ Type assert all DOM queries  
✅ Call `save()` after state mutations  
✅ Clear and rebuild DOM on render  
✅ Trim and validate user input  
✅ Use BEM-like naming for CSS  
✅ Style hover and focus together  
✅ Import CSS before JavaScript modules  
✅ Wait for DOMContentLoaded  
✅ Use strict TypeScript with explicit types  
✅ Maintain accessibility features  
✅ Follow mobile-first responsive design  

❌ Don't use external UI frameworks  
❌ Don't skip type annotations  
❌ Don't manipulate DOM outside templates  
❌ Don't use multiple instances of singletons  
❌ Don't use innerHTML for user content  
❌ Don't ignore accessibility requirements  
❌ Don't create multiple CSS files  
❌ Don't use CSS-in-JS or styled components  

---

## Conclusion

This document provides comprehensive guidance for AI assistants to generate code that aligns with this project's unique patterns and constraints. The patterns are intentionally simple and educational, prioritizing clarity and understandability over scalability or feature richness.

When in doubt, favor:
- **Simplicity** over complexity
- **Explicit** over implicit
- **Consistency** with existing patterns
- **Type safety** over convenience
- **Accessibility** over aesthetics

Happy coding! 🚀
