# Application Initialization Domain

## Overview
Application initialization follows a structured pattern that waits for DOM readiness, sets up singleton instances, attaches event listeners, loads persisted data, and performs initial render.

## Core Pattern

### DOMContentLoaded-Based Initialization

**Complete initialization code from `main.ts`**:
```typescript
import "./css/style.css";
import FullList from "./models/FullList";
import LitsItem from "./models/ListItem";
import ListTemplate from "./templates/ListTemplate";

const initApp = (): void => {
  const fullList = FullList.instance;
  const template = ListTemplate.instance;

  // Add listener to new entry form submit
  const itemEntryForm = document.getElementById(
    "itemEntryForm"
  ) as HTMLFormElement;

  itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
    e.preventDefault();

    // get new item
    const input = document.getElementById("newItem") as HTMLInputElement;
    const myEntryText: string = input.value.trim();
    if (!myEntryText) return;

    // calculate item ID
    const itemId: number = fullList.list.length
      ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
      : 1;

    // create new item
    const newItem = new LitsItem(itemId.toString(), myEntryText);

    fullList.addItem(newItem);
    template.render(fullList);
  });

  // Add listener to "Clear" button
  const clearItems = document.getElementById(
    "clearItemsButton"
  ) as HTMLButtonElement;
  clearItems.addEventListener("click", () => {
    fullList.clearList();
    template.clear();
  });

  // load initial data
  fullList.load();

  // initial render of template
  template.render(fullList);
};

document.addEventListener("DOMContentLoaded", initApp);
```

## Initialization Phases

### Phase 1: Module Imports
```typescript
import "./css/style.css";
import FullList from "./models/FullList";
import LitsItem from "./models/ListItem";
import ListTemplate from "./templates/ListTemplate";
```

**Key characteristics**:
- CSS imported first for styling
- Model classes imported before usage
- No side effects at module level
- ES module syntax (import/export)

### Phase 2: Wait for DOM
```typescript
document.addEventListener("DOMContentLoaded", initApp);
```

**Key characteristics**:
- No code executes before DOM is ready
- initApp passed as callback reference (not invoked)
- Ensures all HTML elements exist before querying

### Phase 3: Get Singleton Instances
```typescript
const fullList = FullList.instance;
const template = ListTemplate.instance;
```

**Key characteristics**:
- First lines in initApp function
- Both instances already constructed (static initialization)
- Stored in local constants for repeated use
- Never use `new` keyword for these classes

### Phase 4: Query DOM Elements
```typescript
const itemEntryForm = document.getElementById(
  "itemEntryForm"
) as HTMLFormElement;

const clearItems = document.getElementById(
  "clearItemsButton"
) as HTMLButtonElement;
```

**Key characteristics**:
- getElementById with explicit type assertions
- Elements queried once and stored in constants
- Assumes elements exist (no null checks)
- Specific types (HTMLFormElement, not just HTMLElement)

### Phase 5: Attach Event Listeners
Event listeners attached to:
1. Form submit for adding items
2. Clear button for clearing all items

**Key characteristics**:
- All listeners attached before initial render
- Listeners defined inline with arrow functions
- No cleanup or removal logic

### Phase 6: Load Persisted Data
```typescript
fullList.load();
```

**Key characteristics**:
- Called before first render
- Restores items from localStorage
- Called only once during initialization
- No error handling (handled inside load())

### Phase 7: Initial Render
```typescript
template.render(fullList);
```

**Key characteristics**:
- Final step in initialization
- Displays loaded data (or empty list)
- Same method used for all subsequent renders

## Form Submit Handler

### Complete Form Logic
```typescript
itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();

  // get new item
  const input = document.getElementById("newItem") as HTMLInputElement;
  const myEntryText: string = input.value.trim();
  if (!myEntryText) return;

  // calculate item ID
  const itemId: number = fullList.list.length
    ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
    : 1;

  // create new item
  const newItem = new LitsItem(itemId.toString(), myEntryText);

  fullList.addItem(newItem);
  template.render(fullList);
});
```

### Key Steps:
1. **Prevent default**: Stop form submission page reload
2. **Get input**: Query input element dynamically (could be cached)
3. **Validate**: Trim and check for empty string
4. **Calculate ID**: Sequential ID based on last item
5. **Create item**: Instantiate with `new` keyword
6. **Add to model**: Call addItem (auto-saves)
7. **Re-render**: Update UI to show new item

### ID Generation Logic
```typescript
const itemId: number = fullList.list.length
  ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
  : 1;
```

**Key characteristics**:
- Ternary for first item vs. subsequent items
- Uses last item's id + 1
- Assumes sequential IDs
- Converts string ID to number, increments, converts back
- No UUID or random generation

## Clear Button Handler

```typescript
clearItems.addEventListener("click", () => {
  fullList.clearList();
  template.clear();
});
```

**Key characteristics**:
- Calls model clearList() first (saves empty array)
- Then clears template (removes DOM nodes)
- No render() call (list is empty anyway)
- No confirmation dialog

## Function Signature

### initApp Declaration
```typescript
const initApp = (): void => {
  // ...
};
```

**Key characteristics**:
- Arrow function stored in const
- No parameters
- Explicit void return type
- All logic encapsulated inside
- Not exported (private to module)

## Type Safety

### Explicit Types Throughout
```typescript
const myEntryText: string = input.value.trim();
const itemId: number = fullList.list.length ? ... : 1;
const newItem = new LitsItem(itemId.toString(), myEntryText);
```

**Key characteristics**:
- Variable type annotations where helpful
- Parameter types always specified
- Return types always specified
- Type assertions on DOM queries

### Event Types
```typescript
itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();
  // ...
});

clearItems.addEventListener("click", () => {
  // ...
});
```

**Key characteristics**:
- SubmitEvent for form submissions
- MouseEvent inferred for click (not annotated)
- Explicit void return on form handler
- Implicit void return on click handler (could be explicit)

## Architectural Constraints

### What You MUST Do
1. **Wait for DOMContentLoaded**: All initialization in initApp callback
2. **Get singleton instances first**: Before any DOM queries
3. **Type assert DOM queries**: Every getElementById needs type
4. **Validate input**: Trim and check before processing
5. **Call preventDefault on forms**: Prevent page reload
6. **Load then render**: fullList.load() before template.render()

### What You MUST NOT Do
1. **No global code execution**: Everything inside initApp or imports
2. **No new FullList()**: Always use .instance
3. **No new ListTemplate()**: Always use .instance
4. **No innerHTML for user input**: Use safe property setters
5. **No null checks**: Assumes DOM elements exist
6. **No async initialization**: All synchronous

## Event Listener Pattern

### Inline Arrow Functions
All event listeners use inline arrow functions with closure over local variables:

```typescript
itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  // Accesses fullList, template from outer scope
});

clearItems.addEventListener("click", () => {
  // Accesses fullList, template from outer scope
});
```

**Key characteristics**:
- No separate handler functions
- Direct access to instances via closure
- No need to pass context
- Listeners never removed (app lifetime)

## Extension Points

### Adding New Global Event Listeners
To add keyboard shortcuts:
```typescript
document.addEventListener("keydown", (e: KeyboardEvent): void => {
  if (e.key === "Escape") {
    fullList.clearList();
    template.clear();
  }
});
```

### Adding More Form Validation
```typescript
const myEntryText: string = input.value.trim();
if (!myEntryText) return;
if (myEntryText.length > 100) {
  alert("Task too long!");
  return;
}
```

### Adding Loading States
Would require:
- UI element for loading indicator
- Show before fullList.load()
- Hide after template.render()
```typescript
const loader = document.getElementById("loader") as HTMLElement;
loader.style.display = "block";
fullList.load();
template.render(fullList);
loader.style.display = "none";
```

### Adding Error Handling
```typescript
try {
  fullList.load();
  template.render(fullList);
} catch (error) {
  console.error("Failed to load data:", error);
  // Show error UI
}
```

## Common Pitfalls

### Don't Query Input Outside Event Handler
```typescript
// BAD: Input queried once, value stale
const input = document.getElementById("newItem") as HTMLInputElement;
itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  const text = input.value; // This is fine
});

// CURRENT: Input queried inside handler (could be moved out)
itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  const input = document.getElementById("newItem") as HTMLInputElement;
  const text = input.value; // Queried every time
});
```

Current code queries input inside handler. This works but is inefficient. Could query once outside.

### Don't Forget preventDefault
```typescript
// BAD: Page will reload
itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  // Missing e.preventDefault();
  const input = ...
});
```

### Don't Call render() Before load()
```typescript
// BAD: Will render empty list, then load will add items but not show them
template.render(fullList); // Empty
fullList.load(); // Loads but doesn't render

// GOOD: Load first, then render
fullList.load();
template.render(fullList);
```

## Initialization Summary

**Execution order**:
1. Module imports execute (CSS + classes)
2. Singletons construct (static initialization)
3. DOMContentLoaded fires
4. initApp() called
5. Get singleton instances
6. Query DOM elements
7. Attach event listeners
8. Load persisted data
9. Initial render
10. App ready for user interaction
