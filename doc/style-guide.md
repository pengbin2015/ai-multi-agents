# Code Style Guide

## Overview

This style guide documents the coding conventions, patterns, and best practices used in the Todo List TypeScript application. Following these guidelines ensures consistency and maintainability across the codebase.

## Table of Contents

- [TypeScript Style](#typescript-style)
- [CSS Style](#css-style)
- [HTML Style](#html-style)
- [File Organization](#file-organization)
- [Documentation Style](#documentation-style)
- [Git Commit Style](#git-commit-style)

---

## TypeScript Style

### Naming Conventions

#### Classes and Interfaces

**Use PascalCase:**

```typescript
// ✅ Correct
class ListItem { }
class FullList { }
interface Item { }
interface DOMList { }

// ❌ Incorrect
class listItem { }
class fullList { }
interface item { }
```

#### Variables and Functions

**Use camelCase:**

```typescript
// ✅ Correct
const fullList = FullList.instance;
const itemEntryForm = document.getElementById("form");
function addItem(item: LitsItem): void { }

// ❌ Incorrect
const FullList = FullList.instance;
const ItemEntryForm = document.getElementById("form");
function AddItem(item: LitsItem): void { }
```

#### Private Fields

**Use underscore prefix:**

```typescript
// ✅ Correct
class ListItem {
  private _id: string;
  private _item: string;
  private _checked: boolean;
}

// ❌ Incorrect
class ListItem {
  private id: string;
  private item: string;
  private checked: boolean;
}
```

**Rationale:** Makes it clear which properties are internal state vs. public interface.

#### Constants

**Use UPPER_CASE for true constants:**

```typescript
// ✅ Correct
const MAX_ITEM_LENGTH = 100;
const STORAGE_KEY = "myList";

// ❌ Incorrect
const maxItemLength = 100;
const storageKey = "myList";
```

**Use camelCase for configuration:**

```typescript
// ✅ Correct
const defaultPriority = "medium";
const enableDebug = false;
```

### Type Annotations

#### Always Specify Types

**Function parameters and return types:**

```typescript
// ✅ Correct - Explicit types
function addItem(item: LitsItem): void {
  // ...
}

function getItemById(id: string): LitsItem | undefined {
  return this._list.find(item => item.id === id);
}

// ❌ Incorrect - No types
function addItem(item) {
  // ...
}
```

**Variable declarations:**

```typescript
// ✅ Correct when type isn't obvious
const items: LitsItem[] = [];
const isValid: boolean = checkValidity();

// ✅ OK when type is obvious from assignment
const fullList = FullList.instance; // Type inferred as FullList
const text = "Hello"; // Type inferred as string
```

#### Type Assertions

**Use for DOM elements:**

```typescript
// ✅ Correct
const input = document.getElementById("newItem") as HTMLInputElement;
const form = document.getElementById("form") as HTMLFormElement;

// ❌ Incorrect - No assertion
const input = document.getElementById("newItem");
```

**Use `as` syntax, not angle brackets:**

```typescript
// ✅ Correct
const input = document.getElementById("newItem") as HTMLInputElement;

// ❌ Incorrect (conflicts with JSX)
const input = <HTMLInputElement>document.getElementById("newItem");
```

### Interface and Class Patterns

#### Interface Before Implementation

**Define interface first:**

```typescript
// ✅ Correct - Interface first
export interface Item {
  id: string;
  item: string;
  checked: boolean;
}

export default class LitsItem implements Item {
  // ...
}

// ❌ Incorrect - Implementation only
export default class LitsItem {
  // ...
}
```

#### Singleton Pattern

**Use static instance with private constructor:**

```typescript
// ✅ Correct
export default class FullList {
  static instance: FullList = new FullList();
  
  private constructor(private _list: LitsItem[] = []) {}
}

// ❌ Incorrect - Public constructor
export default class FullList {
  constructor(private _list: LitsItem[] = []) {}
}
```

#### Getters and Setters

**Use for private fields:**

```typescript
// ✅ Correct
class ListItem {
  private _id: string;
  
  get id(): string {
    return this._id;
  }
  
  set id(id: string) {
    this._id = id;
  }
}

// ❌ Incorrect - Expose private field
class ListItem {
  id: string;
}
```

**Keep setters simple:**

```typescript
// ✅ Correct - Simple setter
set id(id: string) {
  this._id = id;
}

// ❌ Incorrect - Validation in setter (do at boundaries)
set id(id: string) {
  if (id.length === 0) throw new Error("ID cannot be empty");
  this._id = id;
}
```

### Code Organization

#### Import Order

**CSS first, then modules:**

```typescript
// ✅ Correct
import "./css/style.css";
import FullList from "./models/FullList";
import LitsItem from "./models/ListItem";
import ListTemplate from "./templates/ListTemplate";

// ❌ Incorrect
import FullList from "./models/FullList";
import "./css/style.css";
```

#### File Structure

**One class per file:**

```typescript
// ✅ Correct - ListItem.ts
export interface Item { }
export default class LitsItem implements Item { }

// ❌ Incorrect - Multiple unrelated classes
export class ListItem { }
export class FullList { }
```

### Event Handling

#### Type Event Parameters

**Always specify event type:**

```typescript
// ✅ Correct
form.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();
  // ...
});

// ❌ Incorrect - No type
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // ...
});
```

#### Prevent Default First

**Call preventDefault() at the top:**

```typescript
// ✅ Correct
form.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();
  
  // rest of handler
});

// ❌ Incorrect - Could forget
form.addEventListener("submit", (e: SubmitEvent): void => {
  // do stuff
  e.preventDefault(); // Too late if error occurs
});
```

### Error Handling

#### Type-Safe Null Checks

**Check before accessing:**

```typescript
// ✅ Correct
const item = fullList.list.find(i => i.id === "1");
if (item) {
  item.checked = true;
}

// ❌ Incorrect - Could be undefined
const item = fullList.list.find(i => i.id === "1");
item.checked = true; // Error if not found
```

---

## CSS Style

### Naming Conventions

#### BEM-like Structure

**Use Block__Element pattern:**

```css
/* ✅ Correct */
.newItemEntry { }
.newItemEntry__form { }
.newItemEntry__input { }
.newItemEntry__button { }

.listContainer { }
.listTitle { }
.listTitle__button { }

/* ❌ Incorrect */
.new-item-entry { }
.form { }
.input { }
```

**Use camelCase, not kebab-case:**

```css
/* ✅ Correct */
.newItemEntry { }

/* ❌ Incorrect */
.new-item-entry { }
```

#### Utility Classes

**Use camelCase:**

```css
/* ✅ Correct */
.offscreen {
  position: absolute;
  left: -10000px;
}

/* ❌ Incorrect */
.off-screen { }
```

### Selector Patterns

#### Group Related States

**Combine hover and focus:**

```css
/* ✅ Correct */
.button:hover,
.button:focus {
  color: limegreen;
}

/* ❌ Incorrect - Repetition */
.button:hover {
  color: limegreen;
}
.button:focus {
  color: limegreen;
}
```

#### Avoid Deep Nesting

**Keep selectors shallow:**

```css
/* ✅ Correct */
.item > input[type="checkbox"] { }
.item > label { }

/* ❌ Incorrect */
.listContainer .item input[type="checkbox"] { }
```

### Units and Values

#### Use Relative Units

**Prefer rem and em:**

```css
/* ✅ Correct */
font-size: 1.5rem;
padding: 0.5em;
gap: 0.25rem;

/* ❌ Incorrect - Hardcoded px */
font-size: 24px;
padding: 8px;
```

#### Use Flexbox with Gap

**Modern layout approach:**

```css
/* ✅ Correct */
.newItemEntry__form {
  display: flex;
  gap: 0.25rem;
}

/* ❌ Incorrect - Manual margins */
.newItemEntry__form {
  display: flex;
}
.newItemEntry__input {
  margin-right: 0.25rem;
}
```

### Accessibility

#### Minimum Touch Targets

**48px minimum size:**

```css
/* ✅ Correct */
.button {
  min-height: 48px;
  min-width: 48px;
}

/* ❌ Incorrect */
.button {
  width: 20px;
  height: 20px;
}
```

#### Offscreen Content

**For screen readers:**

```css
/* ✅ Correct */
.offscreen {
  position: absolute;
  left: -10000px;
}

/* ❌ Incorrect - Hidden from screen readers */
.offscreen {
  display: none;
}
```

### Mobile-First Approach

**Base styles for mobile:**

```css
/* ✅ Correct */
.container {
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* ❌ Incorrect - Desktop first */
.container {
  padding: 2rem;
}

@media (max-width: 767px) {
  .container {
    padding: 1rem;
  }
}
```

---

## HTML Style

### Semantic Structure

#### Use Semantic Elements

**Prefer semantic over div:**

```html
<!-- ✅ Correct -->
<main>
  <section class="newItemEntry">
    <form class="newItemEntry__form">
      <!-- ... -->
    </form>
  </section>
</main>

<!-- ❌ Incorrect -->
<div class="main">
  <div class="new-item-entry">
    <div class="form">
      <!-- ... -->
    </div>
  </div>
</div>
```

#### Heading Hierarchy

**Don't skip levels:**

```html
<!-- ✅ Correct -->
<h1>My List</h1>
<h2>New Item Entry</h2>
<h2>List</h2>

<!-- ❌ Incorrect -->
<h1>My List</h1>
<h3>New Item Entry</h3>
```

### Accessibility

#### Label Associations

**Always associate labels:**

```html
<!-- ✅ Correct -->
<label for="newItem">Enter a new to do item</label>
<input id="newItem" type="text" />

<!-- ❌ Incorrect -->
<label>Enter a new to do item</label>
<input type="text" />
```

#### ARIA Labels

**For icon buttons:**

```html
<!-- ✅ Correct -->
<button aria-label="Add new item to list">+</button>

<!-- ❌ Incorrect -->
<button>+</button>
```

#### Offscreen Headings

**For structure without visual:**

```html
<!-- ✅ Correct -->
<h2 class="offscreen">New Item Entry</h2>

<!-- ❌ Incorrect -->
<!-- Missing heading -->
```

---

## File Organization

### Directory Structure

```
src/
├── css/
│   └── style.css          # All styles in one file
├── models/
│   ├── ListItem.ts        # One model per file
│   └── FullList.ts
├── templates/
│   └── ListTemplate.ts    # One template per file
└── main.ts                # Application entry point
```

### File Naming

**Use PascalCase for classes:**

```
✅ Correct:
- ListItem.ts
- FullList.ts
- ListTemplate.ts

❌ Incorrect:
- listItem.ts
- full-list.ts
```

**Use camelCase for other files:**

```
✅ Correct:
- main.ts
- style.css

❌ Incorrect:
- Main.ts
- Style.css
```

---

## Documentation Style

### Code Comments

#### When to Comment

**Do comment:**
- Complex algorithms
- Non-obvious design decisions
- Workarounds or hacks
- TODOs

**Don't comment:**
- Obvious code
- What code does (code should be self-documenting)

```typescript
// ✅ Good comment - Explains why
// Use singleton pattern to ensure single source of truth
static instance: FullList = new FullList();

// ❌ Bad comment - States the obvious
// This is a getter for id
get id(): string {
  return this._id;
}
```

#### Comment Style

**Use single-line comments:**

```typescript
// ✅ Correct
// This is a comment

// ❌ Incorrect
/* This is a comment */
```

**Use JSDoc for public APIs:**

```typescript
/**
 * Adds an item to the list and saves to localStorage.
 * @param itemObj - The item to add
 */
addItem(itemObj: LitsItem): void {
  // ...
}
```

---

## Git Commit Style

### Commit Message Format

```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

### Examples

**Simple commit:**
```
feat: add priority field to todo items
```

**Detailed commit:**
```
feat: add priority field to todo items

- Update ListItem interface and class
- Add priority selection in form
- Display priority in list template
- Update localStorage serialization

Closes #42
```

### Guidelines

**Subject line:**
- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Max 50 characters

**Body:**
- Wrap at 72 characters
- Explain what and why, not how
- Separate from subject with blank line

---

## Best Practices Summary

### DO ✅

**TypeScript:**
- Use explicit type annotations
- Use const for variables that don't change
- Use arrow functions for event handlers
- Use template literals for string concatenation

**CSS:**
- Use BEM-like naming
- Group related states
- Use relative units (rem, em)
- Mobile-first approach

**HTML:**
- Use semantic elements
- Include accessibility attributes
- Associate labels with inputs

**General:**
- Keep functions small and focused
- Follow the single responsibility principle
- Write self-documenting code
- Test your changes

### DON'T ❌

**TypeScript:**
- Don't use `any` type
- Don't ignore TypeScript errors
- Don't use `var` (use `const` or `let`)
- Don't mutate parameters

**CSS:**
- Don't use `!important` (except for utilities)
- Don't use IDs for styling
- Don't use inline styles
- Don't use `display: none` for screen reader content

**HTML:**
- Don't skip heading levels
- Don't use divs for everything
- Don't forget accessibility
- Don't use tables for layout

**General:**
- Don't commit commented-out code
- Don't commit console.log statements
- Don't commit merge conflicts
- Don't commit without testing

---

## Tools and Automation

### TypeScript Configuration

Use strict mode in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Recommended VS Code Extensions

- TypeScript and JavaScript Language Features (built-in)
- ESLint (if using)
- Prettier (if using)

### Linting

While the project doesn't currently use ESLint, you can add it:

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

## Exceptions

Every rule has exceptions. When breaking a convention:

1. **Document why** with a comment
2. **Ensure it's necessary**
3. **Be consistent** within the exception

Example:
```typescript
// Using var for hoisting behavior required by legacy code
var globalConfig = {};
```

---

**Related Documentation:**
- [Contributing Guide](./guides/contributing.md)
- [Development Workflow](./guides/development.md)
- [Architecture Overview](./architecture/overview.md)
