# UI Rendering Domain

## Overview
The UI rendering layer uses imperative DOM manipulation through a singleton template class. All rendering follows a "clear and rebuild" pattern with no virtual DOM or partial updates.

## Core Patterns

### 1. Singleton Template Pattern

**Pattern**: Single ListTemplate instance manages all DOM operations for the todo list.

**Example from `ListTemplate.ts`**:
```typescript
export default class ListTemplate implements DOMList {
  ul: HTMLUListElement;

  static instance: ListTemplate = new ListTemplate();
  
  private constructor() {
    this.ul = document.getElementById("listItems") as HTMLUListElement;
  }
```

**Usage in `main.ts`**:
```typescript
const template = ListTemplate.instance;
template.render(fullList);
```

**Key characteristics**:
- Private constructor caches DOM element reference
- Single ul element managed throughout app lifecycle
- No need to query DOM repeatedly
- Element reference stored as public property

### 2. Full Rerender on Every Change

**Pattern**: Clear entire list, then rebuild from data model on every update.

**Example from `ListTemplate.ts`**:
```typescript
clear(): void {
  this.ul.innerHTML = "";
}

render(fullList: FullList): void {
  this.clear();
  
  fullList.list.forEach((item) => {
    // ... rebuild entire list
  });
}
```

**Usage in event handlers**:
```typescript
// From main.ts
fullList.addItem(newItem);
template.render(fullList);

// From ListTemplate.ts
button.addEventListener("click", () => {
  fullList.removeItem(item.id);
  this.render(fullList);
});
```

**Key characteristics**:
- No diffing or selective updates
- Simple, predictable rendering
- Performance acceptable for small lists
- Stateless rendering (no cached state)

### 3. Imperative DOM Construction

**Pattern**: All elements created using typed DOM APIs with explicit element creation and property assignment.

**Complete render logic from `ListTemplate.ts`**:
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

**Key characteristics**:
- createElement with type assertions (as HTMLLIElement, etc.)
- Properties set individually (type, id, className, etc.)
- append() to add children to parents
- prepend() to add items to top of list (newest first)
- No innerHTML or template literals
- Event listeners attached inline during creation

### 4. Inline Event Binding

**Pattern**: Event listeners created and attached during element construction, with direct access to loop variables.

**Checkbox example**:
```typescript
const check = document.createElement("input") as HTMLInputElement;
check.type = "checkbox";
check.id = item.id;
check.checked = item.checked;
li.append(check);

check.addEventListener("change", () => {
  item.checked = !item.checked;
  fullList.save();
});
```

**Delete button example**:
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
- Anonymous arrow functions capture loop variables
- Direct model mutation from event handlers
- Manual save() call for checkbox changes
- Re-render triggered for structural changes (delete)
- No event delegation or centralized handlers

### 5. Type-Safe DOM Element Creation

**Pattern**: Every createElement call includes a type assertion to ensure TypeScript type safety.

**Examples**:
```typescript
const li = document.createElement("li") as HTMLLIElement;
const check = document.createElement("input") as HTMLInputElement;
const label = document.createElement("label") as HTMLLabelElement;
const button = document.createElement("button") as HTMLButtonElement;
```

**Key characteristics**:
- Explicit type assertions on every creation
- Enables IntelliSense for element-specific properties
- Prevents type errors at compile time
- No use of generic HTMLElement type

## DOM Structure

### Static HTML Template
From `index.html`:
```html
<ul id="listItems">
  <!-- Dynamically generated items go here -->
</ul>
```

### Generated Item Structure
```html
<li class="item">
  <input type="checkbox" id="1" tabindex="0" checked>
  <label for="1">Task text here</label>
  <button class="button">x</button>
</li>
```

**Characteristics**:
- Checkbox id matches item id from data model
- label htmlFor attribute links to checkbox id
- tabIndex=0 ensures keyboard accessibility
- button has no explicit aria-label (relies on context)

## Rendering Flow

### Initial Render
1. `main.ts` calls `fullList.load()` to restore data
2. `main.ts` calls `template.render(fullList)` once
3. Template clears ul (empty initially)
4. Template iterates list and creates elements
5. Event listeners attached to dynamic elements

### On Add Item
1. User submits form in `main.ts`
2. `fullList.addItem(newItem)` updates model and saves
3. `template.render(fullList)` rebuilds entire list
4. New item appears at top (prepend)

### On Toggle Checkbox
1. User clicks checkbox
2. Change event listener fires
3. `item.checked = !item.checked` mutates model directly
4. `fullList.save()` persists change
5. **No re-render** (visual state already updated by browser)

### On Delete Item
1. User clicks delete button
2. Click event listener fires
3. `fullList.removeItem(item.id)` updates model and saves
4. `this.render(fullList)` rebuilds entire list
5. Item disappears from DOM

### On Clear All
From `main.ts`:
```typescript
clearItems.addEventListener("click", () => {
  fullList.clearList();
  template.clear();
});
```

**Key characteristics**:
- Model cleared first
- Then template cleared (not re-rendered)
- No render() call needed when list is empty

## Interface Contract

**DOMList interface**:
```typescript
interface DOMList {
  ul: HTMLUListElement;
  clear(): void;
  render(fullList: FullList): void;
}
```

**Key characteristics**:
- Exposes ul element publicly
- Only two methods: clear and render
- render() takes full list (not individual items)
- No partial update methods

## Element Order

### Prepend vs Append
```typescript
this.ul.prepend(li);
```

**Key characteristics**:
- prepend() adds to beginning of list
- Newest items appear at top
- Reverse chronological order
- No explicit sorting logic

### Child Append Order
```typescript
li.append(check);
li.append(label);
li.append(button);
```

**Key characteristics**:
- Checkbox, then label, then button
- Order matters for visual layout and keyboard navigation
- CSS flexbox handles final positioning

## Accessibility in Rendering

### Checkbox and Label Association
```typescript
check.id = item.id;
label.htmlFor = item.id;
```
- Screen readers announce label when checkbox focused
- Click on label toggles checkbox

### Keyboard Navigation
```typescript
check.tabIndex = 0;
```
- Dynamically created checkboxes included in tab order
- Buttons naturally keyboard accessible

### Text Content
```typescript
label.textContent = item.item;
button.textContent = "x";
```
- textContent prevents XSS (safer than innerHTML)
- Screen readers read actual text content

## Performance Considerations

### When Full Rerenders Work
- Small lists (< 100 items)
- Simple item structure
- No animations required
- Acceptable performance for this use case

### Limitations
- Large lists would be slow
- No optimizations for unchanged items
- All event listeners recreated on every render
- No memoization or caching

## Architectural Constraints

### What You MUST Do
1. **Use ListTemplate.instance**: Never create new template instances
2. **Call clear() before render()**: Always clear before rebuilding
3. **Type assert createElement**: Every element needs explicit type
4. **Use append/prepend**: Don't manipulate innerHTML directly
5. **Attach events inline**: Bind listeners during element creation
6. **Call render() after state changes**: UI must reflect model

### What You MUST NOT Do
1. **No innerHTML or outerHTML**: Use createElement and append
2. **No template literals for HTML**: Imperative only
3. **No partial updates**: Always full rerender
4. **No event delegation**: Attach to individual elements
5. **No JSX or template strings**: Pure DOM API only
6. **No external rendering libraries**: React, Vue, etc. not compatible

## Extension Points

### Adding New Element Properties
To add data attributes or aria labels:
```typescript
const button = document.createElement("button") as HTMLButtonElement;
button.className = "button";
button.textContent = "x";
button.setAttribute("aria-label", `Delete ${item.item}`);
button.dataset.itemId = item.id;
li.append(button);
```

### Adding New UI Elements
To add edit functionality:
```typescript
const editButton = document.createElement("button") as HTMLButtonElement;
editButton.className = "button";
editButton.textContent = "Edit";
editButton.addEventListener("click", () => {
  // Edit logic here
});
li.append(editButton);
```

### Optimizing for Large Lists
Would require architectural changes:
- Virtual scrolling
- Partial updates with diffing
- Event delegation
- Memoization
- These would fundamentally change the rendering model
