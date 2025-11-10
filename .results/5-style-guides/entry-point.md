# Entry Point Style Guide

## Unique Patterns in This Project

### 1. DOMContentLoaded-Based Initialization

**Pattern**: All application logic wrapped in initApp function, called on DOMContentLoaded.

```typescript
const initApp = (): void => {
  // All initialization logic here
};

document.addEventListener("DOMContentLoaded", initApp);
```

**What Makes This Unique**:
- initApp is const arrow function (not function declaration)
- Explicit `: void` return type
- No parameters
- Function reference passed (not invoked with `()`)
- No code executes before DOMContentLoaded

### 2. Module-Level Imports First

**Pattern**: CSS import before JavaScript imports.

```typescript
import "./css/style.css";
import FullList from "./models/FullList";
import LitsItem from "./models/ListItem";
import ListTemplate from "./templates/ListTemplate";
```

**What Makes This Unique**:
- CSS imported first (ensures styles load)
- Relative imports with explicit paths
- No file extensions (TypeScript/bundler convention)
- Default imports (not named imports)
- Import name `LitsItem` (likely typo for ListItem)

### 3. Singleton Instance References at Function Start

**Pattern**: Get singleton instances before any DOM operations.

```typescript
const initApp = (): void => {
  const fullList = FullList.instance;
  const template = ListTemplate.instance;
  
  // Now use fullList and template throughout
};
```

**What Makes This Unique**:
- First lines of initApp
- Stored in local constants
- Never uses `new` keyword for these classes
- Short, convenient names for repeated use

### 4. Type-Asserted DOM Queries

**Pattern**: Every getElementById includes explicit type assertion.

```typescript
const itemEntryForm = document.getElementById(
  "itemEntryForm"
) as HTMLFormElement;

const input = document.getElementById("newItem") as HTMLInputElement;

const clearItems = document.getElementById(
  "clearItemsButton"
) as HTMLButtonElement;
```

**What Makes This Unique**:
- Multi-line formatting for long type names
- Specific element types (HTMLFormElement, not HTMLElement)
- No null checks (assumes elements exist)
- IDs match HTML exactly

### 5. Inline Event Listener Definitions

**Pattern**: Event listeners defined inline with arrow functions accessing closure variables.

```typescript
itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();
  // Access fullList and template from outer scope
  fullList.addItem(newItem);
  template.render(fullList);
});
```

**What Makes This Unique**:
- Typed event parameter: `(e: SubmitEvent): void`
- Explicit void return type
- **First action**: `e.preventDefault()`
- Captures fullList and template via closure
- No separate handler functions

### 6. Dynamic Input Querying in Event Handler

**Pattern**: Input element queried inside submit handler (not cached).

```typescript
itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();
  
  const input = document.getElementById("newItem") as HTMLInputElement;
  const myEntryText: string = input.value.trim();
  // ...
});
```

**What Makes This Unique**:
- Query happens every submit (not cached)
- Could be optimized by querying once outside handler
- Ensures fresh reference (though unnecessary here)

### 7. Input Validation with Early Return

**Pattern**: Trim input, check if empty, early return if invalid.

```typescript
const myEntryText: string = input.value.trim();
if (!myEntryText) return;
```

**What Makes This Unique**:
- Explicit type annotation: `: string`
- `.trim()` always called
- Falsy check (not explicit `=== ""`)
- Early return (no else block)
- No error message shown

### 8. Sequential ID Generation Logic

**Pattern**: Calculate next ID based on last item's ID.

```typescript
const itemId: number = fullList.list.length
  ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
  : 1;
```

**What Makes This Unique**:
- Ternary for first item vs subsequent
- Accesses last item via array index
- parseInt to convert string ID to number
- Increments, then converts back to string
- No UUID or timestamp-based IDs

### 9. Model Update Then UI Render Pattern

**Pattern**: Always update model first, then trigger UI update.

```typescript
fullList.addItem(newItem);
template.render(fullList);
```

**What Makes This Unique**:
- Two separate method calls
- Model encapsulates save
- Render rebuilds entire UI
- Never render before model update

### 10. Clear Model + Clear Template Pattern

**Pattern**: Clearing list updates model then template separately.

```typescript
clearItems.addEventListener("click", () => {
  fullList.clearList();
  template.clear();
});
```

**What Makes This Unique**:
- Two method calls (not one)
- clearList() handles model and persistence
- template.clear() handles DOM only
- No render() call (list is empty)

### 11. Load Then Render Initialization

**Pattern**: Load persisted data before initial render.

```typescript
// load initial data
fullList.load();

// initial render of template
template.render(fullList);
```

**What Makes This Unique**:
- Comments explain each step
- load() called only once
- load() is separate from render()
- Order matters (load first, then render)

## Naming Conventions

### File Names
- `main.ts` - Lowercase, conventional entry point name

### Function Names
- `initApp` - camelCase, describes purpose
- Prefix "init" conventional for initialization

### Variable Names
```typescript
const fullList = FullList.instance;
const template = ListTemplate.instance;
const itemEntryForm = ...;
const input = ...;
const myEntryText = ...;
const itemId = ...;
const newItem = ...;
```

**What Makes This Unique**:
- camelCase for all variables
- Descriptive names (not abbreviated)
- `my` prefix for user-entered text
- `new` prefix for newly created objects

## Event Handler Patterns

### Form Submit Handler Structure
```typescript
itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();
  
  // Get input
  const input = ...;
  const myEntryText: string = input.value.trim();
  
  // Validate
  if (!myEntryText) return;
  
  // Calculate ID
  const itemId: number = ...;
  
  // Create item
  const newItem = new LitsItem(itemId.toString(), myEntryText);
  
  // Update model
  fullList.addItem(newItem);
  
  // Update view
  template.render(fullList);
});
```

**What Makes This Unique**:
- Comments section the logic
- Linear flow (no nested blocks)
- Explicit types for intermediate values
- Clear separation of concerns

### Button Click Handler Structure
```typescript
clearItems.addEventListener("click", () => {
  fullList.clearList();
  template.clear();
});
```

**What Makes This Unique**:
- No event parameter (not needed)
- No explicit types (inferred)
- Simpler than form handler
- Direct action without validation

## Initialization Order

```typescript
// 1. Module imports
import "./css/style.css";
import FullList from "./models/FullList";
// ... more imports

// 2. Function definition
const initApp = (): void => {
  // 3. Get singletons
  const fullList = FullList.instance;
  const template = ListTemplate.instance;

  // 4. Query DOM elements
  const itemEntryForm = ...;
  const clearItems = ...;
  
  // 5. Attach event listeners
  itemEntryForm.addEventListener(...);
  clearItems.addEventListener(...);
  
  // 6. Load data
  fullList.load();
  
  // 7. Initial render
  template.render(fullList);
};

// 8. Wait for DOM
document.addEventListener("DOMContentLoaded", initApp);
```

**What Makes This Unique**:
- Strict ordering convention
- Comments guide the sequence
- All setup before render
- No code after addEventListener

## Typing Patterns

### Event Parameter Types
```typescript
(e: SubmitEvent): void => { }  // Form submit
() => { }                       // Button click (no param needed)
```

**What Makes This Unique**:
- Explicit SubmitEvent (not just Event)
- Void return always specified or inferred
- Omit parameter if not used

### Variable Type Annotations
```typescript
const myEntryText: string = input.value.trim();
const itemId: number = fullList.list.length ? ... : 1;
const newItem = new LitsItem(...); // Type inferred
```

**What Makes This Unique**:
- Annotate when helpful for clarity
- Omit when obvious from right side
- Strings and numbers explicitly typed
- Class instances rely on inference

## Testing Conventions

**What to follow when creating new entry point files**:

1. ✅ Import CSS first, then modules
2. ✅ Define initApp as const arrow function with void return
3. ✅ Get singleton instances at start of initApp
4. ✅ Query DOM elements before attaching listeners
5. ✅ Type assert all getElementById calls
6. ✅ Type event parameters when using event properties
7. ✅ Call preventDefault first in form handlers
8. ✅ Trim and validate user input
9. ✅ Update model before rendering
10. ✅ Load data before initial render
11. ✅ Attach initApp to DOMContentLoaded event
12. ✅ Don't execute code before DOMContentLoaded

## Anti-Patterns to Avoid

1. ❌ Don't execute code before DOMContentLoaded
2. ❌ Don't instantiate singletons with `new`
3. ❌ Don't query DOM before DOMContentLoaded
4. ❌ Don't skip preventDefault on form submit
5. ❌ Don't forget to trim user input
6. ❌ Don't render before updating model
7. ❌ Don't forget initial load() call
8. ❌ Don't use global variables (use closure)
9. ❌ Don't skip type assertions on DOM queries
10. ❌ Don't validate in model (validate in handler)

## Extension Points

### Adding New Event Listeners
Add after existing listeners, before load/render:
```typescript
// After clearItems listener
document.addEventListener("keydown", (e: KeyboardEvent): void => {
  if (e.key === "Escape") {
    fullList.clearList();
    template.clear();
  }
});

// load initial data
fullList.load();
```

### Adding More Validation
Extend validation logic after trim:
```typescript
const myEntryText: string = input.value.trim();
if (!myEntryText) return;
if (myEntryText.length > 100) {
  alert("Task too long!");
  return;
}
```

### Clearing Input After Submit
Add after render:
```typescript
fullList.addItem(newItem);
template.render(fullList);
input.value = "";
input.focus();
```
