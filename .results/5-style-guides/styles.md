# Styles Style Guide

## Unique Patterns in This Project

### 1. Single Global Stylesheet with BEM-Like Naming

**Pattern**: All styles in one file, using `block__element` naming without modifiers.

```css
.newItemEntry__form { }
.newItemEntry__input { }
.newItemEntry__button { }
```

**What Makes This Unique**:
- Block names in camelCase (not kebab-case)
- Double underscore separator (`__`)
- No modifiers (no `--` pattern)
- No hierarchy beyond block__element

### 2. Universal Reset with Border-Box

**Pattern**: Aggressive reset at file start.

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

input,
button {
  font: inherit;
}
```

**What Makes This Unique**:
- Uses `*` universal selector
- Both margin and padding reset
- border-box for all elements
- input/button inherit font explicitly

### 3. Offscreen Accessibility Class

**Pattern**: Screen-reader-only content positioned far off-screen.

```css
.offscreen {
  position: absolute;
  left: -10000px;
}
```

**What Makes This Unique**:
- **Not** using `display: none`
- **Not** using `visibility: hidden`
- Uses extreme negative positioning
- No clipping or overflow techniques

### 4. Consistent Touch Target Sizing

**Pattern**: Minimum 48px for buttons, 2.5rem (40px) for checkboxes.

```css
.button {
  min-width: 48px;
  min-height: 48px;
}

.item>input[type="checkbox"] {
  min-width: 2.5rem;
  min-height: 2.5rem;
}
```

**What Makes This Unique**:
- Uses px for buttons
- Uses rem for checkboxes
- Both exceed WCAG minimums
- min-width and min-height (not just width/height)

### 5. Flexbox-Based Layouts with Gap

**Pattern**: flex with gap property for spacing, no margins between flex children.

```css
.newItemEntry__form {
  display: flex;
  gap: 0.25rem;
}

.listContainer {
  display: flex;
  flex-flow: column;
  gap: 1rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 1em;
}
```

**What Makes This Unique**:
- `gap` for all spacing (not margins)
- Consistent gap scale: 0.25rem, 1em, 1rem
- flex-flow shorthand for direction + wrap
- align-items: center for vertical centering

### 6. Calc() for Input Width

**Pattern**: Calculate input width accounting for button and gap.

```css
.newItemEntry__input {
  width: calc(100% - (0.25rem + 48px));
  flex-grow: 1;
}
```

**What Makes This Unique**:
- calc() with mixed units (rem + px)
- Subtracts gap + button width
- Also uses flex-grow as fallback
- Parentheses for clarity

### 7. Hover and Focus Styled Together

**Pattern**: Both states get identical styling.

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

**What Makes This Unique**:
- Always paired (never separate)
- Same specificity and properties
- Ensures keyboard and mouse parity
- Color indicates action type

### 8. Transparent Button Backgrounds with Borders

**Pattern**: Buttons have transparent backgrounds with visible borders.

```css
.newItemEntry__button {
  background-color: transparent;
  color: whitesmoke;
  border: 3px dashed whitesmoke;
}

.listTitle__button {
  background-color: transparent;
  color: whitesmoke;
}
```

**What Makes This Unique**:
- Transparent, not solid backgrounds
- Dashed border for add button (unique)
- Consistent color scheme
- Minimal visual weight

### 9. Adjacent Sibling Selector for Checked State

**Pattern**: Style label based on checkbox state.

```css
.item>input[type="checkbox"]:checked+label {
  text-decoration: line-through;
}
```

**What Makes This Unique**:
- Adjacent sibling combinator (`+`)
- :checked pseudo-class
- Styles sibling element
- Pure CSS (no JavaScript needed)

### 10. Single Breakpoint Mobile-First Design

**Pattern**: Base styles for mobile, one media query for desktop.

```css
section {
  padding: 0.5rem;
}

@media (min-width: 768px) {
  section {
    padding: 1rem;
  }
}
```

**What Makes This Unique**:
- Only one breakpoint (768px)
- Only spacing adjustments (no layout changes)
- No max-width queries
- Progressive enhancement approach

### 11. Sticky Positioning for Form

**Pattern**: Form stays at top when scrolling.

```css
.newItemEntry {
  position: sticky;
  top: 0;
  margin-bottom: 1rem;
}
```

**What Makes This Unique**:
- position: sticky (not fixed)
- top: 0 for no offset
- margin-bottom for spacing
- No z-index needed

### 12. Word-Break for Long Text

**Pattern**: Labels break long text to prevent layout breakage.

```css
.item>label {
  flex-grow: 1;
  word-break: break-all;
}
```

**What Makes This Unique**:
- word-break: break-all (aggressive)
- Not word-wrap or overflow-wrap
- Combined with flex-grow
- Ensures layout never breaks

## Naming Conventions

### Block Names
- `.newItemEntry` - camelCase (not kebab-case)
- `.listContainer` - camelCase
- `.listTitle` - camelCase

### Element Names
- `.newItemEntry__form` - describes purpose
- `.newItemEntry__input` - describes element type
- `.newItemEntry__button` - describes element type
- `.listTitle__button` - describes element type

### Utility Classes
- `.button` - Reusable, semantic
- `.item` - Describes role, not appearance
- `.offscreen` - Describes behavior

### No Presentation Names
- ❌ No `.red-button` or `.large-text`
- ✅ Use `.button` with context-specific overrides

## Color Patterns

### Dark Theme
```css
body {
  background-color: #333;
  color: #fff;
}
```

**What Makes This Unique**:
- Hard-coded values (no CSS variables)
- Dark gray, not pure black
- White text (not off-white)

### Whitesmoke for Borders and Text
```css
.newItemEntry__input {
  border: 2px solid whitesmoke;
}

.newItemEntry__button {
  color: whitesmoke;
  border: 3px dashed whitesmoke;
}
```

**What Makes This Unique**:
- Named color "whitesmoke"
- Used for borders and text
- No hex equivalent

### Semantic Hover Colors
```css
.newItemEntry__button:hover,
.newItemEntry__button:focus {
  color: limegreen; /* Positive action */
}

.item>button:hover,
.item>button:focus {
  color: red; /* Destructive action */
}
```

**What Makes This Unique**:
- Green for add (positive)
- Red for delete (destructive)
- Named colors (not hex)
- Conveys meaning through color

## Spacing Patterns

### Consistent Scale
- 0.25rem - Small gaps
- 0.5rem - Medium padding (mobile)
- 1em - Item gaps
- 1rem - Large gaps and padding

**What Makes This Unique**:
- Mix of rem and em units
- No pixel values for spacing
- Powers of 2 or 0.5 increments
- em scales with font-size

### Section Padding
```css
section {
  padding: 0.5rem;
}

@media (min-width: 768px) {
  section {
    padding: 1rem;
  }
}
```

**What Makes This Unique**:
- Doubles on larger screens
- Same pattern for all sections
- Responsive but simple

## Border Patterns

### Consistent Radius
```css
.button {
  border-radius: 10px;
}

section {
  border-radius: 10px;
}

.newItemEntry__input {
  border-radius: 10px;
}
```

**What Makes This Unique**:
- Always 10px (no variation)
- Never 0 or 50% (circular)
- Consistent rounded corners

### Border Widths
- 1px - Section borders
- 2px - Input borders
- 3px - Button borders (dashed)

**What Makes This Unique**:
- Increases for importance
- Dashed only for add button
- No 4px or 5px borders

## Testing Conventions

**What to follow when creating new styles**:

1. ✅ Add all styles to single style.css file
2. ✅ Use BEM-like `block__element` naming
3. ✅ Use camelCase for block names
4. ✅ Use flexbox for layouts
5. ✅ Use gap for spacing (not margins)
6. ✅ Style hover and focus together
7. ✅ Use rem/em units (avoid px except for borders)
8. ✅ Use .offscreen for screen-reader-only content
9. ✅ Maintain 48px minimum touch targets
10. ✅ Use mobile-first approach with min-width media queries
11. ✅ Use semantic color choices (green for positive, red for destructive)
12. ✅ Use 10px border-radius consistently

## Anti-Patterns to Avoid

1. ❌ Don't create multiple CSS files
2. ❌ Don't use CSS modules or scoped styles
3. ❌ Don't use kebab-case for block names
4. ❌ Don't use ID selectors in CSS
5. ❌ Don't use !important
6. ❌ Don't use display: none for screen-reader content
7. ❌ Don't style hover without focus
8. ❌ Don't use pixel units for spacing
9. ❌ Don't use inline styles
10. ❌ Don't create presentation-focused class names
11. ❌ Don't skip border-radius (keep consistent)
12. ❌ Don't use max-width media queries (mobile-first only)
