# Templates Style Guide

## Unique Patterns in This Project

### 1. Singleton Template with Cached DOM Reference

**Pattern**: Template class caches DOM element reference in constructor, accessed via public property.

```typescript
export default class ListTemplate implements DOMList {
  ul: HTMLUListElement;

  static instance: ListTemplate = new ListTemplate();
  
  private constructor() {
    this.ul = document.getElementById("listItems") as HTMLUListElement;
  }
}
```

**What Makes This Unique**:
- `ul` property is **public** (not private)
- DOM query happens **once** in constructor (cached forever)
- Type assertion for specific element type
- Assumes element exists (no null check)
- Constructor takes **no parameters** (unlike model classes)

### 2. Clear-Then-Render Pattern

**Pattern**: Every render starts by clearing all existing content.

```typescript
clear(): void {
  this.ul.innerHTML = "";
}

render(fullList: FullList): void {
  this.clear(); // Always first
  
  fullList.list.forEach((item) => {
    // Rebuild everything
  });
}
```

**What Makes This Unique**:
- Uses `innerHTML = ""` (not removeChild loop)
- No partial updates or diffing
- Stateless rendering (no cached state)
- Performance acceptable for this use case

### 3. Imperative DOM Construction with Type Assertions

**Pattern**: Every element created with createElement + type assertion, properties set individually.

```typescript
const li = document.createElement("li") as HTMLLIElement;
li.className = "item";

const check = document.createElement("input") as HTMLInputElement;
check.type = "checkbox";
check.id = item.id;
check.tabIndex = 0;
check.checked = item.checked;
li.append(check);
```

**What Makes This Unique**:
- **Every createElement has type assertion**
- Specific types (HTMLInputElement, not HTMLElement)
- Properties set one-by-one (not via object spread)
- Uses `append()` not `appendChild()`
- `className` property, not `classList.add()`

### 4. Inline Event Listener Attachment

**Pattern**: Event listeners attached immediately after element creation, inline in render method.

```typescript
check.addEventListener("change", () => {
  item.checked = !item.checked;
  fullList.save();
});

button.addEventListener("click", () => {
  fullList.removeItem(item.id);
  this.render(fullList);
});
```

**What Makes This Unique**:
- Anonymous arrow functions (not named handlers)
- Capture loop variables through closure
- Direct model mutation from event handlers
- **Checkbox change**: Manual save(), no re-render
- **Button click**: Model method, then re-render
- `this` refers to template instance in arrow functions

### 5. Prepend for Reverse Chronological Order

**Pattern**: Items added with prepend() to show newest first.

```typescript
fullList.list.forEach((item) => {
  // ... create li ...
  this.ul.prepend(li); // Newest items at top
});
```

**What Makes This Unique**:
- Uses `prepend()` not `append()`
- Results in reverse chronological order
- No explicit sorting logic
- forEach order + prepend = newest on top

### 6. Interface with Public Element Reference

**Pattern**: Interface exposes the managed DOM element as part of contract.

```typescript
interface DOMList {
  ul: HTMLUListElement;
  clear(): void;
  render(fullList: FullList): void;
}
```

**What Makes This Unique**:
- DOM element part of public API
- Not typically seen in template/view patterns
- Allows external access if needed
- Simple, transparent approach

### 7. Element Construction Order Matches Layout

**Pattern**: Elements created and appended in visual order.

```typescript
const li = document.createElement("li") as HTMLLIElement;

const check = document.createElement("input") as HTMLInputElement;
li.append(check); // First

const label = document.createElement("label") as HTMLLabelElement;
li.append(label); // Second

const button = document.createElement("button") as HTMLButtonElement;
li.append(button); // Third
```

**What Makes This Unique**:
- Creation order mirrors DOM structure
- Sequential append calls (not all at end)
- Easy to visualize resulting HTML
- Properties set before appending

## Naming Conventions

### File Names
- `ListTemplate.ts` - PascalCase, ends with "Template"
- Describes role: template/renderer for list

### Class Names
- `ListTemplate` - Noun + "Template" suffix
- Clear indication this handles rendering

### Interface Names
- `DOMList` - Describes contract: DOM management for list
- Prefix "DOM" indicates DOM operations

### Method Names
- `clear()` - Simple imperative verb
- `render(fullList: FullList)` - Verb + parameter name describes input

### Variable Names in Render
```typescript
const li = document.createElement("li") as HTMLLIElement;
const check = document.createElement("input") as HTMLInputElement;
const label = document.createElement("label") as HTMLLabelElement;
const button = document.createElement("button") as HTMLButtonElement;
```

**What Makes This Unique**:
- Short, abbreviated names (li, check, button)
- Describe element type, not purpose
- Scoped to render method (recreated each call)

## Typing Patterns

### Explicit Type Assertions
```typescript
const li = document.createElement("li") as HTMLLIElement;
const check = document.createElement("input") as HTMLInputElement;
const label = document.createElement("label") as HTMLLabelElement;
const button = document.createElement("button") as HTMLButtonElement;
```

**What Makes This Unique**:
- Every createElement includes `as Type`
- Specific element types (not generic HTMLElement)
- Enables IntelliSense for element-specific properties

### Parameter Types
```typescript
render(fullList: FullList): void {
  // Takes full model, not array of items
}
```

**What Makes This Unique**:
- Takes entire model class instance
- Not just array of items
- Allows template to call model methods
- Void return (side effects only)

## Element Property Patterns

### Setting Checkbox Properties
```typescript
check.type = "checkbox";
check.id = item.id;
check.tabIndex = 0;
check.checked = item.checked;
```

**What Makes This Unique**:
- `tabIndex` explicitly set to 0 (keyboard accessibility)
- `checked` reflects model state
- `id` matches item id (for label association)

### Setting Label Properties
```typescript
label.htmlFor = item.id;
label.textContent = item.item;
```

**What Makes This Unique**:
- Uses `htmlFor` (camelCase), not `for`
- `textContent` (safe from XSS), not `innerHTML`
- Links to checkbox via id

### Setting Button Properties
```typescript
button.className = "button";
button.textContent = "x";
```

**What Makes This Unique**:
- `className` (not classList.add)
- Simple "x" text (no icon font or SVG)
- No aria-label (could be improved)

## Event Handler Patterns

### Checkbox Change Handler
```typescript
check.addEventListener("change", () => {
  item.checked = !item.checked;
  fullList.save();
});
```

**What Makes This Unique**:
- Direct model mutation (uses setter)
- Manual save() call
- **No re-render** (browser updates checkbox visually)

### Delete Button Handler
```typescript
button.addEventListener("click", () => {
  fullList.removeItem(item.id);
  this.render(fullList);
});
```

**What Makes This Unique**:
- Calls model method (encapsulates save)
- **Full re-render** after deletion
- Uses `this.render()` (recursive call)

## Testing Conventions

**What to follow when creating new template files**:

1. ✅ Use singleton pattern with static instance
2. ✅ Cache DOM element reference in constructor
3. ✅ Make element reference public (not private)
4. ✅ Implement clear() method that sets innerHTML = ""
5. ✅ Start render() with this.clear()
6. ✅ Type assert every createElement
7. ✅ Set properties individually (not via object)
8. ✅ Append children immediately after creation
9. ✅ Attach event listeners inline with arrow functions
10. ✅ Use prepend() for reverse chronological order
11. ✅ Re-render for structural changes, manual save for property changes
12. ✅ Take full model instance as parameter, not just data array

## Anti-Patterns to Avoid

1. ❌ Don't use innerHTML for dynamic content (XSS risk)
2. ❌ Don't use template literals for HTML (use createElement)
3. ❌ Don't cache element references outside render (recreated each time)
4. ❌ Don't attach event listeners to parent (no event delegation)
5. ❌ Don't use removeChild loop (innerHTML = "" is cleaner here)
6. ❌ Don't skip type assertions on createElement
7. ❌ Don't use append() without appending (causes reflows)
8. ❌ Don't forget to re-render after structural changes
9. ❌ Don't re-render after property-only changes (unnecessary)
10. ❌ Don't use classList when className suffices for single class
