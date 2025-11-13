# Contributing Guide

## Welcome!

Thank you for your interest in contributing to the Todo List TypeScript Application! This guide will help you understand how to contribute effectively to the project.

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:
- Experience level
- Background
- Identity
- Age, gender, or nationality

### Expected Behavior

- Be respectful and considerate
- Provide constructive feedback
- Accept constructive criticism gracefully
- Focus on what's best for the project
- Show empathy toward other contributors

### Unacceptable Behavior

- Harassment or discriminatory language
- Personal attacks or insults
- Trolling or inflammatory comments
- Publishing others' private information
- Any other unethical or unprofessional conduct

## Getting Started

### Prerequisites

Before contributing, ensure you have:
1. Read the [Setup Guide](./setup.md)
2. Set up your development environment
3. Familiarized yourself with the codebase
4. Reviewed the [Architecture Documentation](../architecture/overview.md)

### Finding Issues to Work On

**Good first issues:**
- Look for issues labeled `good first issue`
- Look for issues labeled `help wanted`
- Check the project roadmap for planned features

**Creating new issues:**
- Search existing issues first to avoid duplicates
- Use the issue template if provided
- Provide clear description and reproduction steps
- Include screenshots or code examples

## Contribution Workflow

### 1. Fork the Repository

**Via GitHub:**
1. Navigate to the repository on GitHub
2. Click the "Fork" button in the top right
3. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/ai-multi-agents.git
   cd ai-multi-agents/todo-list-typescript-main
   ```

### 2. Create a Branch

**Branch naming conventions:**
- `feature/description` - For new features
- `fix/description` - For bug fixes
- `docs/description` - For documentation changes
- `refactor/description` - For code refactoring

**Create and switch to branch:**
```bash
git checkout -b feature/add-due-dates
```

### 3. Make Your Changes

**Follow these guidelines:**
- Make small, focused changes
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed
- Test your changes thoroughly

**See [Development Workflow](./development.md) for detailed guidance.**

### 4. Test Your Changes

**Manual testing checklist:**
- [ ] Feature works as expected
- [ ] No console errors
- [ ] localStorage persists correctly
- [ ] Page refresh doesn't break anything
- [ ] Works in different browsers
- [ ] Keyboard navigation works
- [ ] No TypeScript errors

**Build test:**
```bash
npm run build
npm run preview
```

### 5. Commit Your Changes

**Commit message format:**
```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Example:**
```bash
git add .
git commit -m "feat: add due date field to todo items

- Add dueDate property to ListItem interface
- Update constructor and getters/setters
- Add date input to form
- Display due date in list template
- Update localStorage serialization"
```

### 6. Push to Your Fork

```bash
git push origin feature/add-due-dates
```

### 7. Create a Pull Request

**Via GitHub:**
1. Navigate to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit the pull request

**PR Title Format:**
```
[Type] Brief description
```

**Examples:**
- `[Feature] Add due date support to todo items`
- `[Fix] Resolve localStorage quota exceeded error`
- `[Docs] Update setup guide with troubleshooting section`

**PR Description Should Include:**
- Summary of changes
- Motivation and context
- Testing performed
- Screenshots (for UI changes)
- Related issues (e.g., "Fixes #123")

## Code Style Guidelines

### TypeScript Style

#### Naming Conventions

**Classes and Interfaces:**
```typescript
// ✅ PascalCase
class ListItem { }
interface Item { }

// ❌ Don't use
class listItem { }
interface item { }
```

**Variables and Functions:**
```typescript
// ✅ camelCase
const fullList = FullList.instance;
function addItem(item: LitsItem): void { }

// ❌ Don't use
const FullList = FullList.instance;
function AddItem(item: LitsItem): void { }
```

**Private Fields:**
```typescript
// ✅ Underscore prefix
private _id: string;
private _checked: boolean;

// ❌ Don't use
private id: string;
private checked: boolean;
```

**Constants:**
```typescript
// ✅ UPPER_CASE for true constants
const MAX_ITEM_LENGTH = 100;

// ✅ camelCase for configuration
const defaultPriority = "medium";
```

#### Type Annotations

**Always specify types:**
```typescript
// ✅ Explicit types
function render(fullList: FullList): void {
  const items: LitsItem[] = fullList.list;
}

// ❌ Relying on inference
function render(fullList) {
  const items = fullList.list;
}
```

**Type assertions:**
```typescript
// ✅ Use type assertions for DOM elements
const input = document.getElementById("newItem") as HTMLInputElement;

// ❌ Don't use generic type
const input = document.getElementById("newItem");
```

#### Code Organization

**Imports:**
```typescript
// ✅ CSS first, then modules
import "./css/style.css";
import FullList from "./models/FullList";
import LitsItem from "./models/ListItem";

// ❌ Don't mix order
import FullList from "./models/FullList";
import "./css/style.css";
```

**Interface before class:**
```typescript
// ✅ Interface first
export interface Item {
  id: string;
  item: string;
  checked: boolean;
}

export default class LitsItem implements Item {
  // ...
}
```

### CSS Style

#### Naming

**BEM-like structure:**
```css
/* ✅ Block__Element pattern */
.newItemEntry { }
.newItemEntry__form { }
.newItemEntry__input { }

/* ❌ Don't use arbitrary names */
.input-box { }
.my-form { }
```

#### Formatting

**Group related selectors:**
```css
/* ✅ Group hover and focus */
.button:hover,
.button:focus {
  color: limegreen;
}

/* ❌ Don't repeat */
.button:hover { color: limegreen; }
.button:focus { color: limegreen; }
```

**Use relative units:**
```css
/* ✅ Use rem/em */
font-size: 1.5rem;
padding: 0.5em;

/* ❌ Avoid px for fonts */
font-size: 24px;
```

### HTML Style

**Semantic elements:**
```html
<!-- ✅ Use semantic HTML -->
<main>
  <section class="newItemEntry">
    <form class="newItemEntry__form">
      <!-- ... -->
    </form>
  </section>
</main>

<!-- ❌ Don't use divs for everything -->
<div class="main">
  <div class="new-item">
    <div class="form">
      <!-- ... -->
    </div>
  </div>
</div>
```

**Accessibility:**
```html
<!-- ✅ Include labels and ARIA -->
<label for="newItem" class="offscreen">Enter a new to do item</label>
<input id="newItem" type="text" />
<button aria-label="Add new item to list">+</button>

<!-- ❌ Don't skip accessibility -->
<input type="text" />
<button>+</button>
```

## Architectural Constraints

### What Fits the Architecture

✅ **Encouraged contributions:**
- UI enhancements and styling improvements
- Accessibility improvements
- Performance optimizations
- Bug fixes
- Documentation improvements
- Code refactoring for clarity
- Adding metadata fields (priority, due date, tags)
- Export/import functionality
- Keyboard shortcuts

### What Requires Discussion

⚠️ **Needs architectural review:**
- Multiple list support (breaks singleton pattern)
- Backend integration (localStorage only currently)
- External dependencies (zero dependency philosophy)
- Framework migration (vanilla TypeScript design)
- State management libraries (custom singleton used)
- Complex validation or business logic

**Please open an issue first for these types of changes.**

## Documentation Guidelines

### When to Update Documentation

Update documentation when you:
- Add new features
- Change existing behavior
- Fix bugs that affect documented behavior
- Add configuration options
- Change APIs or interfaces

### Documentation Structure

**Architecture docs:** Explain design patterns and decisions
**API docs:** Document classes, methods, and properties
**Guides:** Provide step-by-step instructions
**Examples:** Show how to use features

### Writing Style

**Be clear and concise:**
```markdown
✅ "Add items by typing text and pressing Enter"
❌ "The user has the capability to insert new todo items into the list by utilizing the text input field and subsequently submitting the form"
```

**Use code examples:**
```markdown
✅ Example:
    ```typescript
    const item = new LitsItem("1", "Task", false);
    ```

❌ "Create a new list item with parameters id, text, and checked status"
```

**Use active voice:**
```markdown
✅ "The method returns a string"
❌ "A string is returned by the method"
```

## Review Process

### What Reviewers Look For

**Code quality:**
- Follows existing patterns
- Properly typed
- Clear and readable
- Well-commented (when needed)

**Testing:**
- Manually tested
- No console errors
- Works in multiple browsers
- Doesn't break existing features

**Documentation:**
- Updated if needed
- Clear and accurate
- Includes examples

### Addressing Feedback

**Responding to review comments:**
1. Read all comments thoroughly
2. Ask questions if unclear
3. Make requested changes
4. Push updates to the same branch
5. Reply to comments when resolved

**Example responses:**
```markdown
✅ "Good catch! I've updated the type annotation."
✅ "I wasn't sure about this approach. I've changed it to use X instead."
✅ "Could you clarify what you mean by 'more defensive'? Should I add null checks?"

❌ "No, this is fine."
❌ "You're wrong about this."
```

## Licensing

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

## Recognition

Contributors will be:
- Listed in the project's contributors
- Mentioned in release notes (for significant contributions)
- Thanked in the community

## Getting Help

### Resources

**Documentation:**
- [Setup Guide](./setup.md)
- [Development Workflow](./development.md)
- [Architecture Overview](../architecture/overview.md)
- [API Reference](../api/models.md)

**External Resources:**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Asking Questions

**Before asking:**
1. Search existing issues
2. Check documentation
3. Review related code

**When asking:**
- Be specific about the problem
- Include error messages
- Show what you've tried
- Provide code examples

**Where to ask:**
- GitHub Issues (for bugs or feature requests)
- GitHub Discussions (for general questions)
- Pull Request comments (for code review questions)

## Example Contributions

### Small Contribution Example

**Adding an "Edit" feature:**

1. Fork and clone
2. Create branch: `feature/edit-item`
3. Add edit functionality:
   - Add edit button to template
   - Add event handler
   - Update item text
   - Save changes
4. Test thoroughly
5. Commit: `feat: add ability to edit todo items`
6. Push and create PR

### Documentation Contribution Example

**Improving setup guide:**

1. Fork and clone
2. Create branch: `docs/improve-setup-guide`
3. Update `doc/guides/setup.md`:
   - Add troubleshooting section
   - Include more examples
   - Clarify confusing parts
4. Review for accuracy
5. Commit: `docs: improve setup guide with troubleshooting`
6. Push and create PR

### Bug Fix Example

**Fixing localStorage quota issue:**

1. Fork and clone
2. Create branch: `fix/localstorage-quota`
3. Add try-catch in save method:
   ```typescript
   save(): void {
     try {
       localStorage.setItem("myList", JSON.stringify(this._list));
     } catch (error) {
       console.error("Failed to save:", error);
       // Show user notification
     }
   }
   ```
4. Test quota exceeded scenario
5. Commit: `fix: handle localStorage quota exceeded error`
6. Push and create PR

## Checklist Before Submitting

- [ ] Code follows the project style guide
- [ ] Changes are focused and minimal
- [ ] TypeScript compiles without errors
- [ ] Manual testing completed
- [ ] Documentation updated if needed
- [ ] Commit messages are clear
- [ ] PR description is complete
- [ ] No unrelated changes included

## Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

---

**Related Documentation:**
- [Setup Guide](./setup.md)
- [Development Workflow](./development.md)
- [Style Guide](../style-guide.md)
- [Architecture Overview](../architecture/overview.md)
