# Styling Domain

## Overview
This application uses a single global CSS file with BEM-like naming conventions, semantic class names, and mobile-first responsive design. All styling is centralized with no CSS modules, preprocessors, or CSS-in-JS.

## Core Patterns

### 1. Single Global Stylesheet

**Import in `main.ts`**:
```typescript
import "./css/style.css";
```

**Key characteristics**:
- One CSS file for entire application
- Imported at application entry point
- No scoped styles or CSS modules
- All classes globally available

### 2. BEM-Like Naming Convention

**Pattern**: `block__element` structure without modifiers.

**Examples from `style.css`**:
```css
.newItemEntry__form { }
.newItemEntry__input { }
.newItemEntry__button { }

.listTitle__button { }
```

**Key characteristics**:
- Block name: camelCase (e.g., `newItemEntry`)
- Element separator: double underscore (`__`)
- No modifiers used (no `--` patterns)
- Descriptive element names

### 3. Semantic Class Names

**Function-based naming**:
```css
.button { }
.item { }
.listContainer { }
.offscreen { }
```

**Key characteristics**:
- Names describe purpose, not appearance
- Reusable classes (e.g., `.button` used multiple times)
- No presentation-focused names like `.red-button`
- Easy to understand role from name

### 4. CSS Reset and Base Styles

**Universal selector reset**:
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

**Input and button normalization**:
```css
input,
button {
  font: inherit;
}
```

**Key characteristics**:
- Removes default browser margins/padding
- Border-box sizing for all elements
- Buttons and inputs inherit font from parent
- Consistent baseline across browsers

## Layout Patterns

### Flexbox-Based Layout

**Main container**:
```css
body {
  min-height: 100vh;
  background-color: #333;
  color: #fff;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

main {
  flex-grow: 1;
  margin: auto;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-flow: column nowrap;
}
```

**Key characteristics**:
- Body: Full viewport height with flex column
- Main: Centered with max-width constraint
- Flex-grow for vertical expansion
- Column layout for stacked sections

### Section Layout

**Form layout**:
```css
.newItemEntry__form {
  display: flex;
  gap: 0.25rem;
  font-size: 1.5rem;
}

.newItemEntry__input {
  width: calc(100% - (0.25rem + 48px));
  flex-grow: 1;
  border: 2px solid whitesmoke;
  border-radius: 10px;
  padding: 0.5em;
}
```

**Key characteristics**:
- Flex row for input + button
- Gap for spacing (not margins)
- Calc() for precise input width
- flex-grow for responsive input

**List container**:
```css
.listContainer {
  font-size: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  gap: 1rem;
}
```

**Item layout**:
```css
.item {
  display: flex;
  align-items: center;
  padding-top: 1em;
  gap: 1em;
}

.item>label {
  flex-grow: 1;
  word-break: break-all;
}
```

**Key characteristics**:
- Flex row for checkbox + label + button
- align-items: center for vertical centering
- Label grows to fill space
- word-break for long text handling

## Color Scheme

### Dark Theme
```css
body {
  background-color: #333;
  color: #fff;
}

.newItemEntry__input {
  border: 2px solid whitesmoke;
}

.newItemEntry__button {
  background-color: transparent;
  color: whitesmoke;
  border: 3px dashed whitesmoke;
}
```

**Key characteristics**:
- Dark background (#333)
- Light text (whitesmoke, #fff)
- Transparent buttons with borders
- Consistent dark theme throughout

### Hover States
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
- Both hover and focus states styled together
- Color changes indicate interactivity
- Green for add (positive action)
- Red for delete (destructive action)
- Pointer cursor on all buttons

## Accessibility Patterns

### Screen Reader Only Content

**Offscreen utility class**:
```css
.offscreen {
  position: absolute;
  left: -10000px;
}
```

**Usage in `index.html`**:
```html
<h1 class="offscreen">My List</h1>
<label for="newItem" class="offscreen">Enter a new to do item</label>
```

**Key characteristics**:
- Visible to screen readers
- Hidden from visual display
- Not using display: none (would hide from screen readers)
- Not using visibility: hidden (would hide from screen readers)

### Focus States
```css
.newItemEntry__button:hover,
.newItemEntry__button:focus {
  color: limegreen;
}
```

**Key characteristics**:
- Focus states styled same as hover
- Keyboard navigation visual feedback
- No outline removal (default focus ring preserved)

### Interactive Element Sizing
```css
.button {
  border-radius: 10px;
  min-width: 48px;
  min-height: 48px;
}

.item>input[type="checkbox"] {
  text-align: center;
  min-width: 2.5rem;
  min-height: 2.5rem;
  cursor: pointer;
}
```

**Key characteristics**:
- Minimum 48px touch targets for buttons
- Large checkbox (2.5rem = 40px)
- Meets WCAG accessibility guidelines
- Easy to tap on mobile devices

## Typography

### Font Family
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

html {
  font-family: 'Poppins', sans-serif;
}
```

**Key characteristics**:
- Google Fonts import
- Single font family for entire app
- Sans-serif fallback
- Applied at html level (inherited everywhere)

### Font Sizes
```css
.newItemEntry__form {
  font-size: 1.5rem;
}

.listContainer {
  font-size: 1.5rem;
}
```

**Key characteristics**:
- Relative units (rem)
- Consistent 1.5rem for main content
- Inherited by children unless overridden

## Visual Styling

### Borders and Rounded Corners
```css
section {
  border: 1px solid whitesmoke;
  border-radius: 10px;
  padding: 0.5rem;
}

.button {
  border-radius: 10px;
}

.newItemEntry__input {
  border: 2px solid whitesmoke;
  border-radius: 10px;
}

.newItemEntry__button {
  border: 3px dashed whitesmoke;
}
```

**Key characteristics**:
- Consistent 10px border radius
- Dashed border for add button (unique)
- Solid borders for sections and inputs
- Various border widths for hierarchy

### Spacing System
```css
section {
  padding: 0.5rem;
}

.newItemEntry {
  margin-bottom: 1rem;
}

.newItemEntry__form {
  gap: 0.25rem;
}

.listContainer {
  gap: 1rem;
}

.item {
  padding-top: 1em;
  gap: 1em;
}
```

**Key characteristics**:
- Relative units (rem, em)
- Consistent spacing scale (0.25, 0.5, 1)
- Gap property for flex spacing
- Responsive (em scales with font-size)

## Responsive Design

### Mobile-First Approach
Base styles assume mobile, media query enhances for desktop:

```css
section {
  padding: 0.5rem; /* Mobile default */
}

.newItemEntry__form {
  gap: 0.25rem; /* Mobile default */
}

@media (min-width: 768px) {
  section {
    padding: 1rem; /* Desktop: more padding */
  }

  .newItemEntry__form {
    gap: 0.5rem; /* Desktop: more gap */
  }
}
```

**Key characteristics**:
- Single breakpoint at 768px
- Only spacing adjustments (no layout changes)
- Enhances desktop experience
- Mobile styles work for all sizes

### Flexible Widths
```css
main {
  width: 100%;
  max-width: 800px;
}

.newItemEntry__input {
  width: calc(100% - (0.25rem + 48px));
  flex-grow: 1;
}
```

**Key characteristics**:
- Percentage widths for responsiveness
- max-width prevents excessive line length
- Calc() for precise calculations
- flex-grow for remaining space

## Interaction States

### Checkbox Checked State
```css
.item>input[type="checkbox"]:checked+label {
  text-decoration: line-through;
}
```

**Key characteristics**:
- Adjacent sibling selector (`+`)
- Targets label after checked checkbox
- Line-through for completed items
- Pure CSS (no JavaScript required for style)

### Button States
```css
.button:hover {
  cursor: pointer;
}

.newItemEntry__button:hover,
.newItemEntry__button:focus {
  color: limegreen;
}

.listTitle__button {
  background-color: transparent;
  color: whitesmoke;
  padding: 0.25em;
}
```

**Key characteristics**:
- Transparent backgrounds
- Color changes on interaction
- Cursor feedback
- Minimal visual weight

## Positioning

### Sticky Form
```css
.newItemEntry {
  position: sticky;
  top: 0;
  margin-bottom: 1rem;
}
```

**Key characteristics**:
- Sticks to top on scroll
- Always visible for quick entry
- Margin below for spacing
- No z-index needed (natural stacking)

### Flex Alignment
```css
.listTitle {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
```

**Key characteristics**:
- Title and button at opposite ends
- Vertically aligned to baseline
- No absolute positioning needed

## Architectural Constraints

### What You MUST Do
1. **Use BEM-like naming**: `block__element` structure
2. **Use semantic class names**: Describe purpose, not appearance
3. **Use .offscreen for hidden labels**: Not display: none
4. **Use rem/em units**: Relative units for scalability
5. **Use flexbox for layout**: No floats or tables
6. **Include hover and focus states**: Accessibility requirement
7. **Maintain 48px minimum touch targets**: Buttons and interactive elements

### What You MUST NOT Do
1. **No CSS modules or scoped styles**: Single global stylesheet only
2. **No preprocessors**: No SASS, LESS, etc.
3. **No CSS-in-JS**: No styled-components or emotion
4. **No inline styles**: All styles in style.css
5. **No ID selectors**: Use classes only
6. **No !important**: Avoid specificity hacks
7. **No presentation class names**: No .red-button or .big-text

## Extension Points

### Adding New Sections
Follow section pattern:
```css
.newSection {
  border: 1px solid whitesmoke;
  border-radius: 10px;
  padding: 0.5rem;
}

.newSection__element {
  /* Specific styles */
}

@media (min-width: 768px) {
  .newSection {
    padding: 1rem;
  }
}
```

### Adding New Color Scheme
Create theme classes:
```css
body.light-theme {
  background-color: #fff;
  color: #333;
}

body.light-theme .newItemEntry__button {
  color: #333;
  border-color: #333;
}
```

### Adding Animations
Keep subtle and purposeful:
```css
.item {
  transition: opacity 0.3s ease;
}

.item.removing {
  opacity: 0;
}
```

### Adding Print Styles
Hide UI elements, show content:
```css
@media print {
  .newItemEntry,
  .listTitle__button,
  .item>button {
    display: none;
  }
  
  .item>input[type="checkbox"] {
    -webkit-appearance: none;
    appearance: none;
  }
}
```

## Common Patterns

### Reusable Button Class
```css
.button {
  border-radius: 10px;
  min-width: 48px;
  min-height: 48px;
}

.button:hover {
  cursor: pointer;
}
```
Used by multiple buttons with specific overrides.

### Consistent Spacing
Uses 0.25rem, 0.5rem, 1rem scale consistently throughout.

### Text Overflow Handling
```css
.item>label {
  word-break: break-all;
}
```
Prevents long text from breaking layout.
