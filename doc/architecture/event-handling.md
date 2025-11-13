# Event Handling Architecture

## Overview

Event handling in the Todo List application bridges user interactions with the data layer and UI rendering. The application uses native DOM event listeners with explicit type annotations to manage form submissions, button clicks, and checkbox changes.

## Design Principles

### 1. Explicit Type Annotations
All event handlers have typed parameters:
- Improves type safety
- Enables better IDE support
- Catches errors at compile time
- Documents expected event types

### 2. Event Listener Registration on DOMContentLoaded
All event setup happens after the DOM is fully loaded:
- Ensures elements exist before querying
- Prevents null reference errors
- Centralizes initialization logic

### 3. Type Assertions for DOM Queries
Every `getElementById` includes a type assertion:
- Converts generic `HTMLElement` to specific type
- Enables access to element-specific properties
- Provides compile-time type checking

### 4. Inline Event Handlers in Templates
Event listeners in the rendering layer are attached inline:
- Captures relevant data in closures
- Keeps related logic together
- Simplifies event handling

### 5. Model-First Updates
Always update the data model before re-rendering:
- Single source of truth
- Consistent state management
- Automatic persistence

## Application Entry Point

### Location
`src/main.ts`

### Initialization Pattern

```typescript
const initApp = (): void => {
  // Get singleton instances
  const fullList = FullList.instance;
  const template = ListTemplate.instance;

  // Set up event listeners
  // ...

  // Load initial data
  fullList.load();

  // Initial render
  template.render(fullList);
};

document.addEventListener("DOMContentLoaded", initApp);
```

### Why DOMContentLoaded?

**Problem:** JavaScript might execute before HTML is parsed.

**Solution:** Wait for the DOM to be ready:
```typescript
document.addEventListener("DOMContentLoaded", initApp);
```

**Benefits:**
- All elements are available
- No race conditions
- Standard web development practice

**Alternative Approaches (Not Used):**
- `defer` attribute in script tag (used but also wrapped in DOMContentLoaded)
- `window.onload` (waits for images too, slower)
- Placing scripts at end of body (less reliable)

## Event Handler Patterns

### Form Submission Handler

#### Purpose
Captures new todo item submissions and adds them to the list.

#### HTML Element
```html
<form class="newItemEntry__form" id="itemEntryForm">
  <input class="newItemEntry__input" id="newItem" type="text" />
  <button id="addItem" class="button newItemEntry__button">+</button>
</form>
```

#### Event Handler Code

```typescript
const itemEntryForm = document.getElementById(
  "itemEntryForm"
) as HTMLFormElement;

itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();

  // Get new item
  const input = document.getElementById("newItem") as HTMLInputElement;
  const myEntryText: string = input.value.trim();
  if (!myEntryText) return;

  // Calculate item ID
  const itemId: number = fullList.list.length
    ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
    : 1;

  // Create new item
  const newItem = new LitsItem(itemId.toString(), myEntryText);

  fullList.addItem(newItem);
  template.render(fullList);
});
```

#### Breakdown

**Step 1: Get Form Element**
```typescript
const itemEntryForm = document.getElementById(
  "itemEntryForm"
) as HTMLFormElement;
```
- Type assertion to `HTMLFormElement`
- Enables TypeScript to know this is a form
- Required for form-specific events

**Step 2: Prevent Default Behavior**
```typescript
e.preventDefault();
```
- Stops form from submitting to server
- Prevents page reload
- Must be first action in handler

**Step 3: Get Input Value**
```typescript
const input = document.getElementById("newItem") as HTMLInputElement;
const myEntryText: string = input.value.trim();
```
- Query the input element
- Get its value
- Trim whitespace from both ends

**Step 4: Validate Input**
```typescript
if (!myEntryText) return;
```
- Check if empty after trimming
- Early return prevents empty items
- Simple validation pattern

**Step 5: Generate Unique ID**
```typescript
const itemId: number = fullList.list.length
  ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
  : 1;
```
- If list has items: take last item's ID and add 1
- If list is empty: use ID 1
- Ternary operator for concise logic
- Ensures unique, sequential IDs

**Alternative ID Strategies:**
- UUID: `crypto.randomUUID()`
- Timestamp: `Date.now().toString()`
- Current approach is simple and sufficient

**Step 6: Create New Item**
```typescript
const newItem = new LitsItem(itemId.toString(), myEntryText);
```
- Convert number ID to string (model expects string)
- Pass validated text
- Default checked state (false)

**Step 7: Update Model and UI**
```typescript
fullList.addItem(newItem);
template.render(fullList);
```
- Add to data model (auto-saves)
- Re-render UI with new item

**Note:** Input is NOT cleared after adding. This is a design decision that could be changed:
```typescript
// Optional: Clear input after adding
input.value = "";
input.focus();
```

### Clear Button Handler

#### Purpose
Removes all items from the list.

#### HTML Element
```html
<button id="clearItemsButton" class="button listTitle__button">
  Clear
</button>
```

#### Event Handler Code

```typescript
const clearItems = document.getElementById(
  "clearItemsButton"
) as HTMLButtonElement;

clearItems.addEventListener("click", () => {
  fullList.clearList();
  template.clear();
});
```

#### Breakdown

**Step 1: Get Button Element**
```typescript
const clearItems = document.getElementById(
  "clearItemsButton"
) as HTMLButtonElement;
```
- Type assertion to `HTMLButtonElement`
- Enables button-specific properties

**Step 2: Clear Data and UI**
```typescript
clearItems.addEventListener("click", () => {
  fullList.clearList();
  template.clear();
});
```
- Clear the data model (auto-saves empty state)
- Clear the UI directly
- No re-render needed (UI already cleared)

**Why Two Calls?**
- `clearList()` updates the model and localStorage
- `clear()` updates the UI
- Keeps model and view in sync

**Alternative (using render):**
```typescript
clearItems.addEventListener("click", () => {
  fullList.clearList();
  template.render(fullList); // Would render empty list
});
```

### Checkbox Change Handler

#### Purpose
Toggles the completion state of a todo item.

#### Generated HTML
```html
<input type="checkbox" id="1" tabindex="0" />
```

#### Event Handler Code (in ListTemplate)

```typescript
check.addEventListener("change", () => {
  item.checked = !item.checked;
  fullList.save();
});
```

#### Breakdown

**Event:** `change`
- Fires when checkbox state changes
- Triggered by user interaction
- More appropriate than `click` for checkboxes

**Update Pattern:**
```typescript
item.checked = !item.checked;
```
- Toggle the boolean value
- Updates the model directly
- Setter ensures type safety

**Persistence:**
```typescript
fullList.save();
```
- Save updated state to localStorage
- No re-render needed (checkbox already updated)

**Why No Re-render?**
The browser automatically updates the checkbox visual state. We only need to sync the data model and persist the change.

### Delete Button Handler

#### Purpose
Removes a specific todo item from the list.

#### Generated HTML
```html
<button class="button">x</button>
```

#### Event Handler Code (in ListTemplate)

```typescript
button.addEventListener("click", () => {
  fullList.removeItem(item.id);
  this.render(fullList);
});
```

#### Breakdown

**Remove from Model:**
```typescript
fullList.removeItem(item.id);
```
- Filters out the item with matching ID
- Auto-saves the updated list

**Re-render UI:**
```typescript
this.render(fullList);
```
- Full rebuild of the list
- Item disappears from view
- Ensures UI matches model

**Closure Capture:**
The arrow function captures `item`, `fullList`, and `this` from the surrounding scope, allowing access to the correct item and instances.

## Event Flow Diagrams

### Adding a New Item

```
User types in input
       ↓
User submits form (Enter or Click +)
       ↓
Submit event fires
       ↓
preventDefault() stops page reload
       ↓
Get input value and trim
       ↓
Validate (not empty)
       ↓
Generate unique ID
       ↓
Create new ListItem
       ↓
Add to FullList (auto-saves)
       ↓
Re-render template
       ↓
New item appears in list
```

### Toggling Item Completion

```
User clicks checkbox
       ↓
Browser toggles checkbox visually
       ↓
Change event fires
       ↓
Toggle item.checked property
       ↓
Save to localStorage
       ↓
UI remains as-is (already updated)
```

### Deleting an Item

```
User clicks delete button (x)
       ↓
Click event fires
       ↓
Remove item from FullList (auto-saves)
       ↓
Re-render entire list
       ↓
Item disappears from UI
```

### Clearing All Items

```
User clicks Clear button
       ↓
Click event fires
       ↓
Clear FullList (auto-saves)
       ↓
Clear template UI
       ↓
Empty list displayed
```

## Type Safety in Event Handling

### Typed Event Parameters

**Why Type Events?**
```typescript
// Without type
itemEntryForm.addEventListener("submit", (e) => {
  e.preventDefault(); // TypeScript doesn't know if this method exists
});

// With type
itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault(); // ✅ TypeScript verifies this is valid
});
```

### Element Type Assertions

**Benefits:**
```typescript
const input = document.getElementById("newItem") as HTMLInputElement;
console.log(input.value); // ✅ TypeScript knows .value exists

// Without assertion
const input2 = document.getElementById("newItem");
console.log(input2.value); // ❌ Error: Property 'value' does not exist on type 'HTMLElement'
```

### Return Type Annotations

```typescript
itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  // ↑ Explicit void return type
  // Ensures handler doesn't accidentally return a value
});
```

## Closure Patterns

### Capturing Loop Variables

In the template's `render` method:

```typescript
fullList.list.forEach((item) => {
  // ...
  button.addEventListener("click", () => {
    fullList.removeItem(item.id); // Captures 'item' from loop
    this.render(fullList);        // Captures 'this' and 'fullList'
  });
});
```

**How It Works:**
- Arrow function creates a closure
- `item` reference is captured for each iteration
- Each button has its own closure with the correct item
- No need for `data-*` attributes or event delegation

**Common Mistake (if using var):**
```typescript
for (var i = 0; i < items.length; i++) {
  button.addEventListener("click", () => {
    console.log(i); // ❌ Would always log items.length
  });
}
```

**Solution (using const/let or forEach):**
```typescript
items.forEach((item, i) => {
  button.addEventListener("click", () => {
    console.log(i); // ✅ Correct index for each button
  });
});
```

## Input Validation

### Current Validation

**Trim and Check:**
```typescript
const myEntryText: string = input.value.trim();
if (!myEntryText) return;
```

**What It Validates:**
- Removes leading/trailing whitespace
- Rejects empty strings
- Rejects whitespace-only strings

**What It Doesn't Validate:**
- Maximum length (handled by HTML maxlength attribute)
- Special characters
- Profanity or inappropriate content
- Duplicates

### Enhanced Validation Examples

**Check for Duplicates:**
```typescript
const isDuplicate = fullList.list.some(
  item => item.item.toLowerCase() === myEntryText.toLowerCase()
);
if (isDuplicate) {
  alert("This item already exists!");
  return;
}
```

**Minimum Length:**
```typescript
if (myEntryText.length < 3) {
  alert("Item must be at least 3 characters");
  return;
}
```

**Pattern Matching:**
```typescript
const hasInvalidChars = /[<>]/.test(myEntryText);
if (hasInvalidChars) {
  alert("Invalid characters detected");
  return;
}
```

## Error Handling

### Current Approach
The application uses minimal error handling:
- Type assertions assume elements exist
- No try-catch blocks
- No user feedback for errors

### Potential Failures

**Missing DOM Elements:**
```typescript
const input = document.getElementById("newItem") as HTMLInputElement;
// If element doesn't exist, input is null, next line throws error
const text = input.value.trim();
```

**localStorage Failures:**
```typescript
localStorage.setItem("myList", JSON.stringify(this._list));
// Could fail if quota exceeded or in private browsing
```

### Enhanced Error Handling

**Check for Element Existence:**
```typescript
const input = document.getElementById("newItem");
if (!input) {
  console.error("Input element not found");
  return;
}
const typedInput = input as HTMLInputElement;
```

**Try-Catch for localStorage:**
```typescript
save(): void {
  try {
    localStorage.setItem("myList", JSON.stringify(this._list));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
    // Could show user notification
  }
}
```

## Performance Considerations

### Event Listener Management

**Current Approach:**
- New listeners created on each render
- Old listeners removed when elements are cleared

**Memory Impact:**
- Minimal for small lists
- Listeners are garbage collected when elements are removed

**Alternative (Event Delegation):**
```typescript
// In constructor
this.ul.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.matches("button.button")) {
    const li = target.closest("li");
    const id = li?.querySelector("input")?.id;
    if (id) {
      fullList.removeItem(id);
      this.render(fullList);
    }
  }
});
```

**Benefits of Delegation:**
- Single event listener for all buttons
- Better performance for large lists
- No need to recreate listeners

**Trade-offs:**
- More complex logic
- Harder to debug
- Less clear connection between element and behavior

## Accessibility in Event Handling

### Keyboard Navigation

**tabIndex for Checkboxes:**
```typescript
check.tabIndex = 0;
```
- Enables keyboard focus
- Users can tab to checkboxes
- Space bar toggles checkbox

### Label Associations
```typescript
label.htmlFor = item.id;
```
- Clicking label toggles checkbox
- Larger click target
- Better usability

### ARIA Labels
```html
<button id="addItem" aria-label="Add new item to list">
  +
</button>
```
- Screen readers announce purpose
- Supplements visual icon

## Best Practices

### DO ✅
- Always call `preventDefault()` on form submissions
- Trim user input before validation
- Update model before re-rendering
- Use type annotations for events
- Use type assertions for DOM elements
- Validate input before processing

### DON'T ❌
- Don't forget to wait for DOMContentLoaded
- Don't skip input validation
- Don't modify DOM directly without updating model
- Don't use `var` in event listeners (use `const`/`let`)
- Don't forget to save after model updates

## Testing Event Handlers

### Manual Testing Checklist
- [ ] Add item with valid text
- [ ] Try to add empty item
- [ ] Try to add whitespace-only item
- [ ] Toggle item completion
- [ ] Delete individual items
- [ ] Clear all items
- [ ] Refresh page (check persistence)
- [ ] Test keyboard navigation
- [ ] Test with screen reader

### Automated Testing Examples

**Test Form Submission:**
```typescript
test("should add item when form is submitted", () => {
  const input = document.getElementById("newItem") as HTMLInputElement;
  const form = document.getElementById("itemEntryForm") as HTMLFormElement;
  
  input.value = "Test item";
  form.dispatchEvent(new Event("submit"));
  
  expect(FullList.instance.list.length).toBe(1);
  expect(FullList.instance.list[0].item).toBe("Test item");
});
```

**Test Validation:**
```typescript
test("should not add empty item", () => {
  const input = document.getElementById("newItem") as HTMLInputElement;
  const form = document.getElementById("itemEntryForm") as HTMLFormElement;
  
  input.value = "   ";
  form.dispatchEvent(new Event("submit"));
  
  expect(FullList.instance.list.length).toBe(0);
});
```

## Future Enhancements

### Keyboard Shortcuts
```typescript
document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === "k") {
    e.preventDefault();
    input.focus();
  }
});
```

### Undo/Redo
```typescript
const history: FullList[] = [];
let historyIndex = -1;

function saveHistory() {
  history.push(JSON.parse(JSON.stringify(fullList)));
  historyIndex++;
}

document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === "z") {
    // Undo logic
  }
});
```

### Debounced Input
```typescript
let debounceTimer: number;
input.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    // Validate or suggest completions
  }, 300);
});
```

## Conclusion

The event handling layer provides a clear, type-safe bridge between user interactions and application state. Its straightforward approach makes it easy to understand and modify, while TypeScript's type system ensures reliability.

---

**Related Documentation:**
- [Architecture Overview](./overview.md)
- [Data Layer](./data-layer.md)
- [UI Rendering](./ui-rendering.md)
- [Development Workflow](../guides/development.md)
