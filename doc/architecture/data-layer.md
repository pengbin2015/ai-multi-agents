# Data Layer Architecture

## Overview

The data layer is responsible for all business logic, state management, and data persistence in the Todo List application. It consists of two main classes that work together to manage todo items: `ListItem` for individual items and `FullList` for the collection.

## Design Principles

### 1. Singleton Pattern
Both model classes use the singleton pattern to ensure a single source of truth:
- Prevents multiple instances of the list
- Simplifies state access throughout the application
- Eliminates need for dependency injection or prop drilling

### 2. Interface-First Design
Each class is defined by an interface before implementation:
- Provides clear type contracts
- Enables future alternative implementations
- Improves IDE autocomplete and type checking

### 3. Private Fields with Accessors
All data is stored in private fields with getter/setter access:
- Encapsulation of internal state
- Underscore prefix convention (`_id`, `_item`, `_checked`)
- Public getters/setters for controlled access
- Future extensibility for validation or computed properties

### 4. Auto-Save on Mutation
Every method that changes state automatically saves to localStorage:
- Ensures data persistence without manual save calls
- Prevents data loss from forgotten saves
- Simplifies calling code

## ListItem Class

### Purpose
Represents a single todo item with its properties and state.

### Location
`src/models/ListItem.ts`

### Interface Definition

```typescript
export interface Item {
  id: string;
  item: string;
  checked: boolean;
}
```

### Class Structure

```typescript
export default class LitsItem implements Item {
  constructor(
    private _id: string = "",
    private _item: string = "",
    private _checked: boolean = false
  ) {}
  
  get id(): string { return this._id; }
  set id(id: string) { this._id = id; }
  
  get item(): string { return this._item; }
  set item(item: string) { this._item = item; }
  
  get checked(): boolean { return this._checked; }
  set checked(checked: boolean) { this._checked = checked; }
}
```

### Properties

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `id` | `string` | Unique identifier for the item | `""` |
| `item` | `string` | Text description of the todo | `""` |
| `checked` | `boolean` | Completion status | `false` |

### Usage Examples

#### Creating a New Item

```typescript
import LitsItem from "./models/ListItem";

// Create with all properties
const item = new LitsItem("1", "Buy groceries", false);

// Create with defaults
const item2 = new LitsItem();
item2.id = "2";
item2.item = "Write documentation";
item2.checked = false;
```

#### Accessing Properties

```typescript
const item = new LitsItem("1", "Complete task", false);

// Reading
console.log(item.id);      // "1"
console.log(item.item);    // "Complete task"
console.log(item.checked); // false

// Updating
item.checked = true;
item.item = "Complete task - DONE";
```

### Design Decisions

**Why strings for IDs?**
- Flexibility for future UUID or hash-based IDs
- Easier JSON serialization
- Avoids number type coercion issues

**Why no validation in setters?**
- Keeps setters pure and simple
- Validation happens at application boundaries (user input)
- Reduces coupling between model and validation logic

**Why default parameters in constructor?**
- Allows partial initialization
- Simplifies testing and mock data
- Consistent with TypeScript best practices

## FullList Class

### Purpose
Manages the collection of todo items with persistence and CRUD operations.

### Location
`src/models/FullList.ts`

### Interface Definition

```typescript
interface List {
  list: LitsItem[];
  load(): void;
  save(): void;
  clearList(): void;
  addItem(itemObj: LitsItem): void;
  removeItem(id: string): void;
}
```

### Class Structure

```typescript
export default class FullList implements List {
  static instance: FullList = new FullList();
  
  private constructor(private _list: LitsItem[] = []) {}
  
  get list(): LitsItem[] {
    return this._list;
  }
  
  load(): void { /* ... */ }
  save(): void { /* ... */ }
  clearList(): void { /* ... */ }
  addItem(itemObj: LitsItem): void { /* ... */ }
  removeItem(id: string): void { /* ... */ }
}
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `instance` | `FullList` (static) | Singleton instance |
| `list` | `LitsItem[]` | Array of all todo items |

### Methods

#### load(): void

Loads saved items from localStorage and populates the list.

**Behavior:**
1. Retrieves data from localStorage key `"myList"`
2. Returns early if no data exists
3. Parses JSON string to array of objects
4. Creates new `LitsItem` instances from parsed data
5. Adds each item to the list via `addItem()`

**Code:**
```typescript
load(): void {
  const storedList: string | null = localStorage.getItem("myList");
  if (typeof storedList !== "string") return;

  const parsedList: { _id: string; _item: string; _checked: boolean }[] =
    JSON.parse(storedList);

  parsedList.forEach((itemObj) => {
    const newListItem = new LitsItem(
      itemObj._id,
      itemObj._item,
      itemObj._checked
    );
    FullList.instance.addItem(newListItem);
  });
}
```

**Usage:**
```typescript
const fullList = FullList.instance;
fullList.load(); // Loads items from localStorage
```

#### save(): void

Persists the current list to localStorage.

**Behavior:**
1. Serializes the `_list` array to JSON
2. Stores in localStorage with key `"myList"`

**Code:**
```typescript
save(): void {
  localStorage.setItem("myList", JSON.stringify(this._list));
}
```

**Storage Format:**
```json
[
  {"_id": "1", "_item": "Buy groceries", "_checked": false},
  {"_id": "2", "_item": "Write code", "_checked": true}
]
```

**Note:** Properties are serialized with underscore prefixes as they are private fields.

#### addItem(itemObj: LitsItem): void

Adds a new item to the list and saves.

**Parameters:**
- `itemObj` - The `LitsItem` instance to add

**Behavior:**
1. Pushes item to internal `_list` array
2. Calls `save()` to persist

**Code:**
```typescript
addItem(itemObj: LitsItem): void {
  this._list.push(itemObj);
  this.save();
}
```

**Usage:**
```typescript
const newItem = new LitsItem("3", "New task", false);
FullList.instance.addItem(newItem);
// Item is added and automatically saved
```

#### removeItem(id: string): void

Removes an item by ID and saves.

**Parameters:**
- `id` - The unique identifier of the item to remove

**Behavior:**
1. Filters the list to exclude item with matching ID
2. Updates `_list` with filtered array
3. Calls `save()` to persist

**Code:**
```typescript
removeItem(id: string): void {
  this._list = this._list.filter((item) => item.id !== id);
  this.save();
}
```

**Usage:**
```typescript
FullList.instance.removeItem("3");
// Item with id "3" is removed and list is saved
```

#### clearList(): void

Removes all items from the list and saves.

**Behavior:**
1. Sets `_list` to empty array
2. Calls `save()` to persist empty state

**Code:**
```typescript
clearList(): void {
  this._list = [];
  this.save();
}
```

**Usage:**
```typescript
FullList.instance.clearList();
// All items removed and empty list saved
```

## Data Persistence

### localStorage Strategy

**Key:** `"myList"`

**Format:** JSON array of objects with private property names

**Benefits:**
- Simple, synchronous API
- Survives page refreshes
- No server required
- Works offline

**Limitations:**
- Typically 5-10MB storage limit
- Synchronous operations can block UI
- Plain text storage (not secure)
- Same-origin policy restrictions

### Serialization Details

When items are saved, the private fields are serialized:

```typescript
// In memory
const item = new LitsItem("1", "Task", false);
// Internal state: { _id: "1", _item: "Task", _checked: false }

// In localStorage
{"_id": "1", "_item": "Task", "_checked": false}
```

On load, these are reconstructed:
```typescript
const parsedObj = { _id: "1", _item: "Task", _checked: false };
const item = new LitsItem(parsedObj._id, parsedObj._item, parsedObj._checked);
```

## State Management Flow

### Complete CRUD Cycle

**Create:**
```typescript
const newItem = new LitsItem("1", "New task", false);
FullList.instance.addItem(newItem);
// → Adds to array → Saves to localStorage
```

**Read:**
```typescript
FullList.instance.load();
// → Retrieves from localStorage → Populates array
const items = FullList.instance.list;
// → Returns current array
```

**Update:**
```typescript
const item = FullList.instance.list[0];
item.checked = true;
FullList.instance.save();
// → Saves updated state to localStorage
```

**Delete:**
```typescript
FullList.instance.removeItem("1");
// → Filters array → Saves to localStorage
```

## Integration with UI Layer

The data layer is consumed by the UI layer through:

1. **Initial Load:**
   ```typescript
   FullList.instance.load();
   ListTemplate.instance.render(FullList.instance);
   ```

2. **Adding Items:**
   ```typescript
   FullList.instance.addItem(newItem);
   ListTemplate.instance.render(FullList.instance);
   ```

3. **Checking Items:**
   ```typescript
   item.checked = !item.checked;
   FullList.instance.save();
   ```

4. **Removing Items:**
   ```typescript
   FullList.instance.removeItem(id);
   ListTemplate.instance.render(FullList.instance);
   ```

## Design Trade-offs

### Strengths
✅ Simple, understandable state management
✅ Automatic persistence without extra code
✅ Type-safe with interfaces and strict TypeScript
✅ No external dependencies
✅ Clear separation of concerns

### Limitations
⚠️ Single list only (singleton constraint)
⚠️ No state history or undo capability
⚠️ No optimistic updates or async handling
⚠️ Full rerenders required for UI updates
⚠️ No validation in the data layer

### When to Refactor
Consider refactoring if you need:
- Multiple independent lists
- Complex state with history
- Server synchronization
- Advanced querying or indexing
- Optimistic updates
- Real-time collaboration

## Best Practices

### DO ✅
- Always use `FullList.instance` (never `new FullList()`)
- Let the models handle saving (don't call `save()` externally unless needed)
- Check for empty strings or invalid data before creating items
- Use the getter/setter interface for property access

### DON'T ❌
- Don't instantiate `FullList` directly (private constructor)
- Don't modify `_list` array directly (use provided methods)
- Don't assume `load()` is synchronous across sessions
- Don't store sensitive data (localStorage is not secure)

## Future Enhancements

Possible improvements while maintaining architecture:

1. **Add validation to setters:**
   ```typescript
   set item(item: string) {
     if (item.trim().length === 0) {
       throw new Error("Item text cannot be empty");
     }
     this._item = item;
   }
   ```

2. **Add item metadata:**
   ```typescript
   interface Item {
     id: string;
     item: string;
     checked: boolean;
     createdAt: Date;
     priority: "low" | "medium" | "high";
   }
   ```

3. **Add query methods:**
   ```typescript
   getCompletedItems(): LitsItem[] {
     return this._list.filter(item => item.checked);
   }
   
   getItemById(id: string): LitsItem | undefined {
     return this._list.find(item => item.id === id);
   }
   ```

## Conclusion

The data layer provides a simple, effective foundation for state management in this application. Its singleton pattern and auto-save behavior make it easy to use while maintaining data integrity. Understanding this layer is key to working with the application's business logic.

---

**Related Documentation:**
- [Architecture Overview](./overview.md)
- [UI Rendering](./ui-rendering.md)
- [Models API Reference](../api/models.md)
