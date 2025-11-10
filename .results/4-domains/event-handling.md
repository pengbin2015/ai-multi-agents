# Event Handling Domain

## Overview
Event handling in this application follows a pattern of inline event listener attachment with direct DOM element queries, type-safe event parameters, and a state-then-render update cycle.

## Core Patterns

### 1. Form Event Handling

**Complete form submit handler from `main.ts`**:
```typescript
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
```

**Key characteristics**:
- Explicitly typed event parameter: `e: SubmitEvent`
- **First action**: `e.preventDefault()` to prevent form submission
- Input queried inside handler (dynamic query)
- Value trimmed before validation
- Early return for empty input
- State update (addItem) before UI update (render)

### 2. Button Click Handling

**Clear button from `main.ts`**:
```typescript
const clearItems = document.getElementById(
  "clearItemsButton"
) as HTMLButtonElement;

clearItems.addEventListener("click", () => {
  fullList.clearList();
  template.clear();
});
```

**Key characteristics**:
- No explicit event parameter (not needed)
- No preventDefault (not a form)
- Direct action: clear model then clear view
- No confirmation dialog

### 3. Checkbox Change Events

**From `ListTemplate.ts` render method**:
```typescript
const check = document.createElement("input") as HTMLInputElement;
check.type = "checkbox";
check.id = item.id;
check.tabIndex = 0;
check.checked = item.checked;
li.append(check);

check.addEventListener("change", () => {
  item.checked = !item.checked;
  fullList.save();
});
```

**Key characteristics**:
- Inline event listener attached during element creation
- Captures loop variable `item` through closure
- Directly mutates model property
- **Manual save()** call (not automatic)
- **No re-render** (browser updates checkbox visually)

### 4. Dynamic Delete Button Events

**From `ListTemplate.ts` render method**:
```typescript
const button = document.createElement("button") as HTMLButtonElement;
button.className = "button";
button.textContent = "x";
li.append(button);

button.addEventListener("click", () => {
  fullList.removeItem(item.id);
  this.render(fullList);
});
```

**Key characteristics**:
- Closure captures `item.id` from loop
- Calls model method (removeItem auto-saves)
- Triggers full re-render with `this.render(fullList)`
- `this` refers to ListTemplate instance

## Event Flow Patterns

### Pattern A: Form Submit → Validate → Update → Render
```
User submits form
  ↓
preventDefault() called
  ↓
Get input value and trim
  ↓
Validate (if empty, early return)
  ↓
Calculate new ID
  ↓
Create new model object
  ↓
Call model.addItem() (auto-saves)
  ↓
Call template.render() (full rerender)
  ↓
New item appears in UI
```

### Pattern B: Checkbox Change → Toggle → Save
```
User clicks checkbox
  ↓
Browser toggles checkbox visually
  ↓
change event fires
  ↓
Toggle item.checked property
  ↓
Call fullList.save()
  ↓
No re-render needed
```

### Pattern C: Delete Click → Remove → Render
```
User clicks delete button
  ↓
click event fires
  ↓
Call fullList.removeItem(id) (auto-saves)
  ↓
Call template.render() (full rerender)
  ↓
Item disappears from UI
```

### Pattern D: Clear Click → Clear Model → Clear View
```
User clicks clear button
  ↓
Call fullList.clearList() (saves empty array)
  ↓
Call template.clear() (removes DOM nodes)
  ↓
No render() call
```

## Type Safety in Events

### Explicit Event Types
```typescript
// SubmitEvent for form submissions
itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();
});

// MouseEvent implicit for clicks (could be explicit)
clearItems.addEventListener("click", () => {
  // Event parameter not needed
});

// Event implicit for change events (could be explicit)
check.addEventListener("change", () => {
  // Event parameter not needed
});
```

**Key characteristics**:
- Type event parameter when using it (preventDefault, etc.)
- Omit event parameter when not needed
- TypeScript infers event type from string literal ("submit", "click")

### Type-Safe Element Queries
```typescript
const itemEntryForm = document.getElementById(
  "itemEntryForm"
) as HTMLFormElement;

const input = document.getElementById("newItem") as HTMLInputElement;

const clearItems = document.getElementById(
  "clearItemsButton"
) as HTMLButtonElement;
```

**Key characteristics**:
- Every query has explicit type assertion
- Specific types (HTMLFormElement, not HTMLElement)
- Enables access to element-specific properties
- No null checks (assumes elements exist)

## Input Validation Pattern

### Trim and Check
```typescript
const myEntryText: string = input.value.trim();
if (!myEntryText) return;
```

**Key characteristics**:
- **Always trim** user input
- Empty string check with falsy evaluation
- **Early return** prevents further processing
- No error message shown (silent validation)
- No visual feedback for invalid input

### What's NOT Validated
- Maximum length (HTML has maxlength="40")
- Special characters (all allowed)
- Duplicate items (allowed)
- No async validation

## Event Listener Lifecycle

### When Attached
- Static elements (form, clear button): During initApp
- Dynamic elements (checkboxes, delete buttons): During each render

### When Removed
- Static elements: Never (exist for app lifetime)
- Dynamic elements: Implicitly when element removed from DOM

### Memory Considerations
```typescript
// Event listeners recreated on every render
fullList.list.forEach((item) => {
  const button = document.createElement("button") as HTMLButtonElement;
  button.addEventListener("click", () => {
    fullList.removeItem(item.id);
    this.render(fullList);
  });
  this.ul.prepend(li);
});
```

**Key characteristics**:
- Old listeners garbage collected when elements removed
- New listeners created for all items on each render
- Acceptable for small lists
- Could be optimized with event delegation

## Closure Patterns

### Capturing Loop Variables
```typescript
fullList.list.forEach((item) => {
  check.addEventListener("change", () => {
    item.checked = !item.checked; // 'item' captured from forEach
    fullList.save();
  });
  
  button.addEventListener("click", () => {
    fullList.removeItem(item.id); // 'item.id' captured
    this.render(fullList); // 'this' refers to ListTemplate
  });
});
```

**Key characteristics**:
- Arrow functions capture `item` from forEach scope
- Each iteration creates new closure
- `this` binding preserved in arrow functions
- No need for bind() or self = this patterns

### Capturing Outer Scope
```typescript
const initApp = (): void => {
  const fullList = FullList.instance;
  const template = ListTemplate.instance;

  itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
    // Accesses fullList and template from outer scope
    fullList.addItem(newItem);
    template.render(fullList);
  });
};
```

**Key characteristics**:
- Listeners access instances via closure
- No need to pass as parameters
- Instances stay in memory (intended)

## State Mutation Patterns

### Direct Property Mutation
```typescript
check.addEventListener("change", () => {
  item.checked = !item.checked; // Direct mutation
  fullList.save(); // Manual save
});
```

**Key characteristics**:
- Uses setter method under the hood
- No validation in setter
- Manual save() call required
- Mutates object in place

### Method-Based Mutations
```typescript
button.addEventListener("click", () => {
  fullList.removeItem(item.id); // Method call
  this.render(fullList); // Re-render
});

itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  fullList.addItem(newItem); // Method call
  template.render(fullList); // Re-render
});
```

**Key characteristics**:
- Methods encapsulate mutation + save
- Followed by re-render
- More structured than direct mutation

## Architectural Constraints

### What You MUST Do
1. **Type event parameters**: When using event properties (e.preventDefault)
2. **Call preventDefault on forms**: Always first action
3. **Trim user input**: Use .trim() before validation
4. **Validate before processing**: Early return for invalid input
5. **Update model before view**: State change then render
6. **Type assert DOM queries**: Every getElementById with explicit type

### What You MUST NOT Do
1. **No event delegation**: Attach directly to elements
2. **No removeEventListener**: Let garbage collection handle it
3. **No async event handlers**: All handlers synchronous
4. **No event.stopPropagation()**: Not needed in this architecture
5. **No synthetic events**: Direct DOM events only

## Extension Points

### Adding Keyboard Shortcuts
```typescript
document.addEventListener("keydown", (e: KeyboardEvent): void => {
  if (e.key === "Enter" && e.ctrlKey) {
    // Ctrl+Enter to add item
    itemEntryForm.requestSubmit();
  }
  if (e.key === "Escape") {
    // Escape to clear
    fullList.clearList();
    template.clear();
  }
});
```

### Adding Confirmation Dialogs
```typescript
clearItems.addEventListener("click", () => {
  if (fullList.list.length > 0) {
    const confirmed = window.confirm("Clear all items?");
    if (!confirmed) return;
  }
  fullList.clearList();
  template.clear();
});
```

### Adding Input Validation Feedback
```typescript
const myEntryText: string = input.value.trim();
if (!myEntryText) {
  input.classList.add("error");
  return;
}
input.classList.remove("error");
```

### Adding Double-Click to Edit
```typescript
label.addEventListener("dblclick", () => {
  const newText = window.prompt("Edit item:", item.item);
  if (newText && newText.trim()) {
    item.item = newText.trim();
    fullList.save();
    template.render(fullList);
  }
});
```

## Event Handler Testing Considerations

### What Makes Testing Hard
- Direct DOM queries in event handlers
- Tightly coupled to DOM structure
- No dependency injection
- Singleton pattern prevents mocking

### How Tests Would Look
```typescript
// Would need real DOM or JSDOM
const form = document.createElement("form");
form.id = "itemEntryForm";
document.body.appendChild(form);

// Would need to call initApp
initApp();

// Simulate form submission
const event = new SubmitEvent("submit", { cancelable: true });
form.dispatchEvent(event);

// Assert on model state
expect(fullList.list.length).toBe(1);
```

## Common Pitfalls

### Forgetting preventDefault
```typescript
// BAD: Page will reload on form submit
itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  // Missing e.preventDefault();
  const input = document.getElementById("newItem") as HTMLInputElement;
  // ...
});
```

### Not Trimming Input
```typescript
// BAD: Spaces-only input will create empty-looking items
const myEntryText: string = input.value; // No trim()
if (!myEntryText) return;
```

### Rendering Before State Update
```typescript
// BAD: UI shows old state
template.render(fullList); // Render first
fullList.addItem(newItem); // Update after

// GOOD: State update first, then UI
fullList.addItem(newItem);
template.render(fullList);
```

### Forgetting to Re-render
```typescript
// BAD: Model updated but UI not refreshed
button.addEventListener("click", () => {
  fullList.removeItem(item.id);
  // Missing: this.render(fullList);
});
```

### Querying Element Before DOM Ready
```typescript
// BAD: Will be null
const form = document.getElementById("itemEntryForm");

document.addEventListener("DOMContentLoaded", initApp); // Too late

// GOOD: Query after DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("itemEntryForm"); // Now exists
});
```
