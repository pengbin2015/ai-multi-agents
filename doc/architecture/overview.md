# Architecture Overview

## Introduction

The Todo List TypeScript application follows a **minimalist, vanilla TypeScript architecture** that emphasizes clarity, type safety, and simplicity over framework complexity. This document provides a high-level overview of the architectural decisions and patterns used throughout the codebase.

## Design Philosophy

### Core Principles

1. **Zero Runtime Dependencies**
   - Only build tools (TypeScript + Vite) are used
   - No UI frameworks, state management libraries, or utilities
   - Leverages browser-native APIs exclusively

2. **Type Safety First**
   - Strict TypeScript configuration enabled
   - All functions have explicit parameter and return types
   - No implicit `any` types allowed

3. **Singleton Pattern for State**
   - Single source of truth for application state
   - Prevents multiple instances of critical classes
   - Simplified state management without external libraries

4. **Imperative DOM Manipulation**
   - Direct createElement and property setting
   - No JSX, template literals, or virtual DOM
   - Clear, explicit rendering logic

5. **Accessibility and Standards**
   - Semantic HTML structure
   - ARIA labels and keyboard navigation
   - Screen reader support with offscreen headings

## Architecture Layers

### 1. Data Layer (Models)

**Location:** `src/models/`

The data layer handles all business logic and state management:

- **ListItem** - Individual todo item representation
- **FullList** - Collection of items with persistence logic

**Key Characteristics:**
- Singleton instances prevent multiple data stores
- Private fields with getters/setters for encapsulation
- Auto-save to localStorage on every mutation
- Interface-first design for type contracts

**Read More:** [Data Layer Documentation](./data-layer.md)

### 2. Presentation Layer (Templates)

**Location:** `src/templates/`

The presentation layer handles all UI rendering and DOM manipulation:

- **ListTemplate** - Renders the todo list to the DOM

**Key Characteristics:**
- Singleton instance for consistent rendering
- Cached DOM references for performance
- Clear-then-rebuild rendering strategy
- Inline event listeners for interactivity

**Read More:** [UI Rendering Documentation](./ui-rendering.md)

### 3. Application Layer (Entry Point)

**Location:** `src/main.ts`

The application layer initializes the app and coordinates between layers:

- Event listener setup
- Form submission handling
- Initial data loading and rendering

**Key Characteristics:**
- DOMContentLoaded initialization
- Type-safe DOM element queries
- Input validation and sanitization
- Clear separation of concerns

**Read More:** [Event Handling Documentation](./event-handling.md)

## Data Flow

```
User Interaction
      ↓
Event Listener (main.ts)
      ↓
Model Update (FullList/ListItem)
      ↓
Auto-save (localStorage)
      ↓
Template Render (ListTemplate)
      ↓
DOM Update
      ↓
User Sees Change
```

### Example Flow: Adding a New Item

1. User submits form in the UI
2. `main.ts` event listener captures submit event
3. Input value is trimmed and validated
4. New `ListItem` instance created with unique ID
5. Item added to `FullList` via `addItem()`
6. `FullList.save()` persists to localStorage
7. `ListTemplate.render()` rebuilds the DOM
8. User sees new item in the list

## File Organization

```
todo-list-typescript-main/
├── index.html              # HTML structure
├── src/
│   ├── main.ts            # Application entry point
│   ├── models/
│   │   ├── ListItem.ts    # Individual item model
│   │   └── FullList.ts    # List collection model
│   ├── templates/
│   │   └── ListTemplate.ts # UI rendering
│   └── css/
│       └── style.css      # All styles
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript configuration
```

## Design Patterns

### Singleton Pattern

Both main classes use the singleton pattern to ensure single instances:

```typescript
export default class FullList implements List {
  static instance: FullList = new FullList();
  private constructor(private _list: ListItem[] = []) {}
}
```

**Benefits:**
- Single source of truth for state
- No need for dependency injection
- Simplified access via `ClassName.instance`

**Trade-offs:**
- Limited to single-list functionality
- Would require refactoring for multi-list support

### Observer Pattern (Implicit)

While not explicitly implemented, the architecture follows an observer-like pattern:
- Models notify the UI by triggering renders
- Templates observe model state through render method
- Event handlers bridge user actions to model updates

### MVC-like Separation

Though not strict MVC, the architecture separates concerns:
- **Model**: `ListItem`, `FullList` (data and business logic)
- **View**: `ListTemplate`, `index.html`, `style.css` (presentation)
- **Controller**: `main.ts` (event handling and coordination)

## Technology Stack

### Build Tools
- **Vite** - Modern, fast build tool with dev server
- **TypeScript** - Type-safe JavaScript with ES2020 target

### Browser APIs
- **DOM API** - Element creation and manipulation
- **localStorage API** - Client-side data persistence
- **Event API** - User interaction handling

### Language Features
- **ES Modules** - Import/export for code organization
- **Classes** - OOP with private fields and methods
- **Interfaces** - Type contracts and abstractions
- **Getters/Setters** - Controlled property access

## Architectural Constraints

### What Fits Well
✅ Simple CRUD operations on a single list
✅ Visual enhancements and styling improvements
✅ Keyboard shortcuts and accessibility features
✅ Export/import functionality
✅ Simple filtering or sorting
✅ Edit existing items in place
✅ Drag and drop reordering

### What Conflicts with Architecture
❌ Multiple lists (singleton pattern assumes one)
❌ User authentication (no backend or user model)
❌ Real-time collaboration (no WebSocket or sync)
❌ Complex nested hierarchies (flat list structure)
❌ Backend API integration (localStorage only)
❌ Using React/Vue/Angular (vanilla TypeScript only)
❌ External state management (custom singleton pattern)

## Performance Considerations

### Strengths
- **Fast initial load** - No framework overhead
- **Small bundle size** - Only application code
- **Instant persistence** - localStorage is synchronous
- **Efficient builds** - Vite's optimized bundling

### Trade-offs
- **Full rerenders** - Entire list rebuilt on changes
- **No virtual DOM** - Direct DOM manipulation
- **Synchronous localStorage** - Can block on large data
- **No code splitting** - Single bundle (acceptable for small app)

## Security Considerations

### Built-in Protections
✅ **No innerHTML for user data** - Prevents XSS attacks
✅ **Type assertions** - Ensures correct element types
✅ **Input validation** - Trim and check before processing

### Limitations
⚠️ **localStorage** - Data stored as plain text in browser
⚠️ **No authentication** - Anyone with access can modify
⚠️ **Client-side only** - No server-side validation

## Extensibility

The architecture is designed for clarity rather than extensibility, but common extensions are possible:

### Easy to Add
- Additional item properties (priority, due date, etc.)
- New UI interactions (edit in place, drag and drop)
- Visual themes and customizations
- Keyboard shortcuts
- Export/import features

### Moderate Effort
- Multiple lists (requires refactoring singletons)
- Filtering and sorting
- Undo/redo functionality
- More complex item types

### Significant Refactoring Required
- Backend integration
- User authentication
- Real-time sync
- Framework migration
- Complex state management

## Testing Strategy

Currently, the application has no automated tests. Recommended testing approach:

1. **Unit Tests** - Test models and business logic
2. **Integration Tests** - Test template rendering
3. **E2E Tests** - Test user workflows
4. **Manual Testing** - Accessibility and browser compatibility

## Conclusion

This architecture prioritizes:
- **Simplicity** over complexity
- **Clarity** over cleverness
- **Type safety** over flexibility
- **Standards** over frameworks
- **Accessibility** over aesthetics

It's an excellent example of what can be built with vanilla TypeScript and modern browser APIs, demonstrating that not every application needs a heavy framework.

## Next Steps

- Read [Data Layer](./data-layer.md) for model details
- Read [UI Rendering](./ui-rendering.md) for template patterns
- Read [Event Handling](./event-handling.md) for interaction patterns
- Review [API Documentation](../api/models.md) for class references

---

**Related Documentation:**
- [Data Layer](./data-layer.md)
- [UI Rendering](./ui-rendering.md)
- [Event Handling](./event-handling.md)
- [Models API](../api/models.md)
