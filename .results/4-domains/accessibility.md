# Accessibility Domain

## Overview
This application implements semantic HTML, ARIA labels, keyboard navigation, and screen reader support following WCAG guidelines. Accessibility is built into the core architecture, not added as an afterthought.

## Core Patterns

### 1. Semantic HTML Structure

**Complete HTML structure from `index.html`**:
```html
<body>
  <main>
    <h1 class="offscreen">My List</h1>

    <section class="newItemEntry">
      <h2 class="offscreen">New Item Entry</h2>
      <form class="newItemEntry__form" id="itemEntryForm">
        <label for="newItem" class="offscreen">Enter a new to do item</label>
        <input class="newItemEntry__input" id="newItem" type="text" />
        <button id="addItem" class="button newItemEntry__button" 
                title="Add new item" aria-label="Add new item to list">
          +
        </button>
      </form>
    </section>

    <section class="listContainer">
      <header class="listTitle">
        <h2 id="listName">List</h2>
        <button id="clearItemsButton" class="button listTitle__button" 
                title="Clear the list" aria-label="Remove all items from the list">
          Clear
        </button>
      </header>
      <hr />
      <ul id="listItems">
        <!-- Generated items -->
      </ul>
    </section>
  </main>
</body>
```

**Key characteristics**:
- **main** landmark for main content
- **section** for logical groupings
- **header** for section headers
- **form** for input collection
- **ul** for list of items
- Heading hierarchy: h1 → h2 (no skipping levels)

### 2. Screen Reader Support

**Offscreen headings and labels**:
```html
<h1 class="offscreen">My List</h1>
<h2 class="offscreen">New Item Entry</h2>
<label for="newItem" class="offscreen">Enter a new to do item</label>
```

**CSS for offscreen class**:
```css
.offscreen {
  position: absolute;
  left: -10000px;
}
```

**Key characteristics**:
- Content visible to screen readers
- Content hidden from visual display
- **Not** using `display: none` (hides from screen readers)
- **Not** using `visibility: hidden` (hides from screen readers)
- Provides context for non-sighted users

### 3. ARIA Labels for Interactive Elements

**Button with aria-label**:
```html
<button id="addItem" class="button newItemEntry__button" 
        title="Add new item" aria-label="Add new item to list">
  +
</button>

<button id="clearItemsButton" class="button listTitle__button" 
        title="Clear the list" aria-label="Remove all items from the list">
  Clear
</button>
```

**Key characteristics**:
- `aria-label` provides accessible name
- `title` provides tooltip on hover
- Both present for redundancy
- Descriptive action verbs ("Add", "Remove")
- Context included ("to list", "from the list")

### 4. Form Accessibility

**Label-Input Association**:
```html
<label for="newItem" class="offscreen">Enter a new to do item</label>
<input class="newItemEntry__input" id="newItem" type="text" 
       maxlength="40" autocomplete="off" placeholder="Add item" />
```

**Key characteristics**:
- `for` attribute matches input `id`
- Screen readers announce label when input focused
- Clicking label focuses input
- Label hidden but accessible
- Placeholder provides visual hint

### 5. Keyboard Navigation

**Static checkbox tabIndex in HTML**:
```html
<!-- Not present in static HTML, added dynamically -->
```

**Dynamic checkbox from `ListTemplate.ts`**:
```typescript
const check = document.createElement("input") as HTMLInputElement;
check.type = "checkbox";
check.id = item.id;
check.tabIndex = 0;
check.checked = item.checked;
```

**Key characteristics**:
- `tabIndex = 0` adds to natural tab order
- Checkboxes keyboard accessible
- Space bar toggles checkbox
- Enter key on focused checkbox triggers change event

**Form submission**:
```html
<form class="newItemEntry__form" id="itemEntryForm">
  <input id="newItem" type="text" />
  <button id="addItem" type="submit">+</button>
</form>
```

**Key characteristics**:
- Enter key in input submits form
- Button default type is submit
- Keyboard-only users can add items

### 6. Focus Management

**Buttons naturally focusable**:
```html
<button id="addItem">+</button>
<button id="clearItemsButton">Clear</button>
```

**Focus styles from CSS**:
```css
.newItemEntry__button:hover,
.newItemEntry__button:focus {
  color: limegreen;
}

.item>button:hover,
.item>button:focus {
  color: red;
}
```

**Key characteristics**:
- Hover and focus styled together
- Visual feedback for keyboard navigation
- No outline removal (default focus ring preserved)
- Color changes indicate focused element

### 7. Checkbox-Label Association in Generated Items

**From `ListTemplate.ts`**:
```typescript
const check = document.createElement("input") as HTMLInputElement;
check.type = "checkbox";
check.id = item.id;
check.checked = item.checked;

const label = document.createElement("label") as HTMLLabelElement;
label.htmlFor = item.id;
label.textContent = item.item;
```

**Key characteristics**:
- `htmlFor` links label to checkbox
- Screen readers announce label text
- Clicking label toggles checkbox
- Larger hit target for interaction

## Generated Item Accessibility

### Complete Generated Item Structure
```typescript
const li = document.createElement("li") as HTMLLIElement;
li.className = "item";

const check = document.createElement("input") as HTMLInputElement;
check.type = "checkbox";
check.id = item.id;
check.tabIndex = 0;
check.checked = item.checked;
li.append(check);

const label = document.createElement("label") as HTMLLabelElement;
label.htmlFor = item.id;
label.textContent = item.item;
li.append(label);

const button = document.createElement("button") as HTMLButtonElement;
button.className = "button";
button.textContent = "x";
li.append(button);

this.ul.prepend(li);
```

**Accessibility features**:
1. **Semantic list**: `<ul>` and `<li>` elements
2. **Associated label**: `htmlFor` matches checkbox `id`
3. **Keyboard accessible**: `tabIndex = 0` on checkbox
4. **Text content**: Safe from XSS, readable by screen readers
5. **Button**: Keyboard accessible by default

**Potential improvements**:
- Delete button lacks `aria-label` (could be "Delete [item text]")
- No skip links for long lists
- No live region announcements for additions/deletions

## Touch Target Sizes

**From `style.css`**:
```css
.button {
  min-width: 48px;
  min-height: 48px;
}

.item>input[type="checkbox"] {
  min-width: 2.5rem;  /* 40px */
  min-height: 2.5rem; /* 40px */
  cursor: pointer;
}
```

**Key characteristics**:
- Buttons: 48px × 48px (WCAG AAA: 44px minimum)
- Checkboxes: 40px × 40px (WCAG AA: 24px minimum)
- Exceeds minimum requirements
- Easy to tap on mobile devices
- Reduces error rate for motor impairments

## Color Contrast

**Background and text**:
```css
body {
  background-color: #333; /* Dark gray */
  color: #fff;            /* White */
}
```

**Contrast ratio**: ~12.6:1 (WCAG AAA requires 7:1 for normal text)

**Interactive elements**:
```css
.newItemEntry__input {
  border: 2px solid whitesmoke;
}

.newItemEntry__button {
  color: whitesmoke;
  border: 3px dashed whitesmoke;
}
```

**Key characteristics**:
- High contrast throughout
- Exceeds WCAG AAA requirements
- Clear visual boundaries
- Readable for low vision users

## Visual Feedback

### Completed Items
```css
.item>input[type="checkbox"]:checked+label {
  text-decoration: line-through;
}
```

**Key characteristics**:
- Visual indication of completion
- Preserves text (not grayed out)
- Still readable when checked
- Clear distinction between states

### Interactive State Changes
```css
.newItemEntry__button:hover,
.newItemEntry__button:focus {
  color: limegreen;
}

.item>button:hover,
.item>button:focus {
  color: red;
}

.button:hover {
  cursor: pointer;
}
```

**Key characteristics**:
- Hover and focus states identical
- Color indicates action type (green = add, red = delete)
- Cursor changes show interactivity
- Works for keyboard and mouse users

## Input Attributes

**Autocomplete and maxlength**:
```html
<input class="newItemEntry__input" id="newItem" type="text" 
       maxlength="40" autocomplete="off" placeholder="Add item" />
```

**Key characteristics**:
- `maxlength="40"`: Prevents excessively long input
- `autocomplete="off"`: Prevents browser suggestions (task-specific)
- `placeholder="Add item"`: Visual hint (not a label replacement)
- `type="text"`: Appropriate input type

## Heading Structure

**Hierarchical headings**:
```html
<h1 class="offscreen">My List</h1>

<section class="newItemEntry">
  <h2 class="offscreen">New Item Entry</h2>
</section>

<section class="listContainer">
  <header class="listTitle">
    <h2 id="listName">List</h2>
  </header>
</section>
```

**Key characteristics**:
- Single h1 per page
- h2 for major sections
- No skipped heading levels
- Screen reader users can navigate by headings
- Logical document outline

## Architectural Constraints

### What You MUST Do
1. **Use semantic HTML**: main, section, form, ul, li, header
2. **Associate labels with inputs**: Use `for` and `id` attributes
3. **Include aria-label on icon buttons**: Describe action clearly
4. **Set tabIndex on dynamic elements**: Make keyboard accessible
5. **Use .offscreen for hidden labels**: Not display: none
6. **Maintain heading hierarchy**: h1 → h2 (no skipping)
7. **Meet minimum touch targets**: 48px for buttons, 40px for checkboxes
8. **Provide focus states**: Visual feedback for keyboard users

### What You MUST NOT Do
1. **No generic div/span soup**: Use semantic elements
2. **No outline: none**: Keep focus indicators
3. **No display: none for accessible content**: Use .offscreen
4. **No title attribute only**: Provide aria-label too
5. **No placeholder as label**: Use real label elements
6. **No poor contrast**: Maintain WCAG AA minimum (4.5:1)
7. **No keyboard traps**: All interactive elements escapable

## Extension Points

### Adding Live Regions
Announce changes to screen readers:
```html
<div aria-live="polite" aria-atomic="true" class="offscreen" id="announcements"></div>
```

```typescript
// After adding item
const announcer = document.getElementById("announcements");
announcer.textContent = "Item added to list";
```

### Adding Skip Links
Help keyboard users skip to content:
```html
<a href="#listItems" class="skip-link">Skip to list items</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Adding Better Delete Button Labels
```typescript
const button = document.createElement("button") as HTMLButtonElement;
button.className = "button";
button.textContent = "x";
button.setAttribute("aria-label", `Delete ${item.item}`);
```

### Adding Focus Management
Focus input after adding item:
```typescript
fullList.addItem(newItem);
template.render(fullList);
input.focus(); // Return focus to input
input.value = ""; // Clear for next entry
```

## Testing Considerations

### Manual Testing
- Tab through all interactive elements
- Use only keyboard (no mouse)
- Test with screen reader (NVDA, JAWS, VoiceOver)
- Zoom to 200% (check text doesn't overflow)
- Test with high contrast mode

### Automated Testing
- axe DevTools for automated checks
- Lighthouse accessibility audit
- WAVE browser extension
- Check HTML validation

## Current Limitations

### What Could Be Improved
1. **Delete buttons**: Missing descriptive aria-labels
2. **Live regions**: No announcements for dynamic changes
3. **Error messages**: No accessible error handling
4. **Loading states**: No indication when loading from storage
5. **Empty state**: No message when list is empty
6. **Focus management**: Focus not moved after deletion

### What Works Well
1. ✅ Semantic HTML throughout
2. ✅ Keyboard navigation fully functional
3. ✅ Screen reader accessible headings and labels
4. ✅ High contrast and readable text
5. ✅ Large touch targets
6. ✅ Form accessibility with label associations
7. ✅ Focus indicators preserved
