# Templates API Reference

## Overview

This document provides detailed API documentation for the template classes in the Todo List application. The template layer handles all UI rendering and DOM manipulation.

## Table of Contents

- [ListTemplate Class](#listtemplate-class)
- [Interfaces](#interfaces)
- [DOM Structure](#dom-structure)

---

## ListTemplate Class

### Description

Manages rendering of todo items to the DOM using imperative DOM manipulation. Implements the singleton pattern for consistent rendering throughout the application.

### Location
`src/templates/ListTemplate.ts`

### Interface

```typescript
interface DOMList {
  ul: HTMLUListElement;
  clear(): void;
  render(fullList: FullList): void;
}
```

### Class Declaration

```typescript
export default class ListTemplate implements DOMList {
  ul: HTMLUListElement;
  static instance: ListTemplate = new ListTemplate();
  
  private constructor() {
    this.ul = document.getElementById("listItems") as HTMLUListElement;
  }
}
```

### Static Properties

#### instance

**Type:** `ListTemplate` (static)

**Access:** Read-only

**Description:** Singleton instance of the ListTemplate class. This is the only instance that should be used throughout the application.

**Example:**
```typescript
import ListTemplate from "./templates/ListTemplate";

// ✅ Correct usage
const template = ListTemplate.instance;

// ❌ Cannot instantiate directly (private constructor)
const badTemplate = new ListTemplate(); // Error!
```

### Constructor

#### Signature
```typescript
private constructor()
```

**Description:** Private constructor that initializes the template by querying and caching the list container element.

**Side Effects:**
- Queries the DOM for element with ID `"listItems"`
- Caches reference in `ul` property
- Type asserts to `HTMLUListElement`

**Note:** The constructor is private to enforce the singleton pattern. Use `ListTemplate.instance` instead.

**Implementation:**
```typescript
private constructor() {
  this.ul = document.getElementById("listItems") as HTMLUListElement;
}
```

### Properties

#### ul

**Type:** `HTMLUListElement`

**Access:** Read/Write (public)

**Description:** Reference to the `<ul>` element that contains all todo list items.

**Example:**
```typescript
const template = ListTemplate.instance;

// Access the ul element
console.log(template.ul.tagName); // "UL"
console.log(template.ul.id);      // "listItems"

// Query children
console.log(template.ul.children.length); // Number of <li> elements

// Can modify directly if needed
template.ul.className = "custom-class";
```

**HTML Element:**
```html
<ul id="listItems">
  <!-- List items rendered here -->
</ul>
```

### Methods

#### clear()

**Description:** Removes all child elements from the list container.

**Signature:**
```typescript
clear(): void
```

**Returns:** `void`

**Side Effects:**
- Sets `innerHTML` of `ul` to empty string
- Removes all `<li>` elements and their children
- Removes all associated event listeners (garbage collected)

**Implementation:**
```typescript
clear(): void {
  this.ul.innerHTML = "";
}
```

**Example:**
```typescript
const template = ListTemplate.instance;

// Clear the list
template.clear();

// List is now empty
console.log(template.ul.children.length); // 0
```

**When Used:**
- At the start of every `render()` call
- When the "Clear" button is clicked
- Before rebuilding the list

**Performance Note:** Setting `innerHTML = ""` is efficient for clearing, but we use `createElement` for adding content to avoid XSS vulnerabilities.

#### render()

**Description:** Renders all items from a FullList instance to the DOM, creating the complete list UI with interactive elements.

**Signature:**
```typescript
render(fullList: FullList): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `fullList` | `FullList` | The data model containing items to render |

**Returns:** `void`

**Side Effects:**
- Clears existing list content
- Creates new DOM elements for each item
- Attaches event listeners to checkboxes and buttons
- Updates the visible UI

**Implementation:**
```typescript
render(fullList: FullList): void {
  this.clear();

  fullList.list.forEach((item) => {
    const li = document.createElement("li") as HTMLLIElement;
    li.className = "item";

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

    const label = document.createElement("label") as HTMLLabelElement;
    label.htmlFor = item.id;
    label.textContent = item.item;
    li.append(label);

    const button = document.createElement("button") as HTMLButtonElement;
    button.className = "button";
    button.textContent = "x";
    li.append(button);

    button.addEventListener("click", () => {
      fullList.removeItem(item.id);
      this.render(fullList);
    });
    
    this.ul.prepend(li);
  });
}
```

**Rendering Process:**

1. **Clear existing content**
   ```typescript
   this.clear();
   ```

2. **Iterate over items**
   ```typescript
   fullList.list.forEach((item) => { /* ... */ });
   ```

3. **Create list item container**
   ```typescript
   const li = document.createElement("li") as HTMLLIElement;
   li.className = "item";
   ```

4. **Create checkbox**
   ```typescript
   const check = document.createElement("input") as HTMLInputElement;
   check.type = "checkbox";
   check.id = item.id;
   check.tabIndex = 0;
   check.checked = item.checked;
   li.append(check);
   ```

5. **Attach checkbox event listener**
   ```typescript
   check.addEventListener("change", () => {
     item.checked = !item.checked;
     fullList.save();
   });
   ```

6. **Create label**
   ```typescript
   const label = document.createElement("label") as HTMLLabelElement;
   label.htmlFor = item.id;
   label.textContent = item.item;
   li.append(label);
   ```

7. **Create delete button**
   ```typescript
   const button = document.createElement("button") as HTMLButtonElement;
   button.className = "button";
   button.textContent = "x";
   li.append(button);
   ```

8. **Attach button event listener**
   ```typescript
   button.addEventListener("click", () => {
     fullList.removeItem(item.id);
     this.render(fullList);
   });
   ```

9. **Add to list (newest first)**
   ```typescript
   this.ul.prepend(li);
   ```

**Generated DOM Structure:**

For each item, the following HTML is generated:

```html
<li class="item">
  <input type="checkbox" id="1" tabindex="0" checked>
  <label for="1">Task description</label>
  <button class="button">x</button>
</li>
```

**Example:**
```typescript
import FullList from "./models/FullList";
import ListTemplate from "./templates/ListTemplate";

const fullList = FullList.instance;
const template = ListTemplate.instance;

// Load data
fullList.load();

// Render to DOM
template.render(fullList);

// After user adds item
fullList.addItem(newItem);
template.render(fullList); // Re-render with new item
```

**Event Handlers:**

The `render()` method attaches two types of event listeners:

**Checkbox Change:**
- Toggles the item's `checked` property
- Saves the updated list to localStorage
- Does not trigger a re-render (checkbox already updated)

**Button Click:**
- Removes the item from the data model
- Triggers a full re-render
- Item disappears from the UI

**Performance Considerations:**
- Full re-render on every call
- Event listeners recreated each time
- Acceptable for small to medium lists (<1000 items)
- Consider incremental updates for very large lists

### Complete Usage Example

```typescript
import FullList from "./models/FullList";
import LitsItem from "./models/ListItem";
import ListTemplate from "./templates/ListTemplate";

// Initialize
const fullList = FullList.instance;
const template = ListTemplate.instance;

// Load existing items
fullList.load();

// Initial render
template.render(fullList);
console.log("Rendered initial items");

// Add new item
const newItem = new LitsItem("1", "New task", false);
fullList.addItem(newItem);
template.render(fullList);
console.log("Added and rendered new item");

// Toggle item (no re-render needed)
fullList.list[0].checked = true;
fullList.save();
console.log("Toggled item completion");

// Remove item
fullList.removeItem("1");
template.render(fullList);
console.log("Removed and re-rendered");

// Clear all
fullList.clearList();
template.clear();
console.log("Cleared all items");
```

### Integration with Main Application

The template is typically used in `main.ts` for event-driven updates:

```typescript
// In src/main.ts
const initApp = (): void => {
  const fullList = FullList.instance;
  const template = ListTemplate.instance;

  // Form submission handler
  itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
    e.preventDefault();
    
    // ... create new item ...
    
    fullList.addItem(newItem);
    template.render(fullList); // Update UI
  });

  // Clear button handler
  clearItems.addEventListener("click", () => {
    fullList.clearList();
    template.clear(); // Clear UI
  });

  // Initial load and render
  fullList.load();
  template.render(fullList);
};

document.addEventListener("DOMContentLoaded", initApp);
```

## DOM Structure

### Container Element

**Required HTML:**
```html
<ul id="listItems">
  <!-- Items rendered here -->
</ul>
```

**Properties:**
- Must have ID `"listItems"`
- Should be a `<ul>` element
- Can be empty initially

### Generated Item Structure

**For each todo item:**
```html
<li class="item">
  <input type="checkbox" id="{item.id}" tabindex="0" [checked]>
  <label for="{item.id}">{item.item}</label>
  <button class="button">x</button>
</li>
```

**Element Details:**

**List Item (`<li>`):**
- Class: `"item"`
- Contains all child elements

**Checkbox (`<input>`):**
- Type: `"checkbox"`
- ID: Item's unique ID
- tabIndex: `0` (keyboard focusable)
- checked: Reflects item's completion status

**Label (`<label>`):**
- htmlFor: Matches checkbox ID
- textContent: Item's text description
- Clicking toggles checkbox

**Delete Button (`<button>`):**
- Class: `"button"`
- textContent: `"x"`
- Clicking removes item

### CSS Classes Used

| Class | Element | Purpose |
|-------|---------|---------|
| `item` | `<li>` | Style list items |
| `button` | `<button>` | Style delete buttons |

Additional styling is applied via element selectors and states in `src/css/style.css`.

## Type Definitions

### DOMList Interface

```typescript
interface DOMList {
  ul: HTMLUListElement;
  clear(): void;
  render(fullList: FullList): void;
}
```

**Properties:**
- `ul` - Reference to the list container element

**Methods:**
- `clear()` - Remove all items from the DOM
- `render(fullList)` - Render all items from a FullList

## Best Practices

### DO ✅

```typescript
// Use the singleton instance
const template = ListTemplate.instance;

// Always render after model changes
fullList.addItem(newItem);
template.render(fullList);

// Clear before switching contexts
template.clear();

// Use textContent for user data
label.textContent = item.item;
```

### DON'T ❌

```typescript
// Don't instantiate directly
const badTemplate = new ListTemplate(); // Error!

// Don't forget to render after changes
fullList.addItem(newItem);
// Missing: template.render(fullList);

// Don't use innerHTML for user data (XSS risk)
label.innerHTML = item.item; // ❌

// Don't manually manipulate the ul children
template.ul.innerHTML = "<li>Custom item</li>"; // ❌
```

## Security Considerations

### XSS Prevention

The template uses `textContent` instead of `innerHTML` for user-generated content:

```typescript
// ✅ Safe - text is escaped
label.textContent = item.item;

// ❌ Unsafe - could execute scripts
label.innerHTML = item.item;
```

**Example Attack Prevention:**
```typescript
const maliciousItem = new LitsItem("1", "<script>alert('XSS')</script>", false);
fullList.addItem(maliciousItem);
template.render(fullList);

// Safe: displays literal text "<script>alert('XSS')</script>"
// Does NOT execute the script
```

### Type Safety

All DOM elements are type-asserted for compile-time safety:

```typescript
// ✅ TypeScript knows the specific element type
const check = document.createElement("input") as HTMLInputElement;
check.type = "checkbox"; // ✅ Valid property

// ❌ Without assertion, TypeScript can't verify properties
const check2 = document.createElement("input");
check2.type = "checkbox"; // May cause issues
```

## Performance Optimization

### Current Approach
- Full clear and rebuild on every render
- Simple and predictable
- Acceptable for small to medium lists

### Potential Optimizations

**For large lists (>1000 items):**

1. **Incremental updates:**
   ```typescript
   addItemToDOM(item: LitsItem): void {
     // Create and append single item without clearing
   }
   
   removeItemFromDOM(id: string): void {
     // Remove single element by ID
   }
   ```

2. **Event delegation:**
   ```typescript
   this.ul.addEventListener("click", (e: MouseEvent) => {
     const target = e.target as HTMLElement;
     if (target.matches(".button")) {
       // Handle all delete buttons with one listener
     }
   });
   ```

3. **Virtual scrolling:**
   - Render only visible items
   - Update as user scrolls
   - Significantly improves performance for very large lists

---

**Related Documentation:**
- [Architecture Overview](../architecture/overview.md)
- [UI Rendering](../architecture/ui-rendering.md)
- [Models API](./models.md)
- [Event Handling](../architecture/event-handling.md)
