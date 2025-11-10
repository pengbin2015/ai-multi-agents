# Data Layer Domain

## Overview
The data layer in this application uses a class-based, singleton pattern architecture with localStorage for persistence. All state management is centralized through singleton instances that encapsulate both data and persistence logic.

## Core Patterns

### 1. Singleton Pattern with Static Instance

**Pattern**: Classes expose a single static instance property that is initialized immediately.

**Example from `FullList.ts`**:
```typescript
export default class FullList implements List {
  // ? we use this cuz only we have one list in out app
  static instance: FullList = new FullList();

  private constructor(private _list: LitsItem[] = []) {}
```

**Usage in `main.ts`**:
```typescript
const fullList = FullList.instance;
```

**Key characteristics**:
- Private constructor prevents external instantiation
- Static instance is created at class definition time
- Comments explain the singleton rationale
- No lazy initialization - instance exists immediately

### 2. Interface-First Design

**Pattern**: Every class has a corresponding interface defining its public contract.

**Example from `ListItem.ts`**:
```typescript
export interface Item {
  id: string;
  item: string;
  checked: boolean;
}
export default class LitsItem implements Item {
  // implementation
}
```

**Example from `FullList.ts`**:
```typescript
interface List {
  list: LitsItem[];
  load(): void;
  save(): void;
  clearList(): void;
  addItem(itemObj: LitsItem): void;
  removeItem(id: string): void;
}
export default class FullList implements List {
  // implementation
}
```

**Key characteristics**:
- Interface defined in same file as implementation
- Interface exported for potential external use
- Method signatures clearly documented
- Return types explicitly specified (void for side effects)

### 3. Private Fields with Getter/Setter Access

**Pattern**: All class properties are private with underscore prefix, exposed through public getter/setter methods.

**Example from `ListItem.ts`**:
```typescript
export default class LitsItem implements Item {
  constructor(
    private _id: string = "",
    private _item: string = "",
    private _checked: boolean = false
  ) {}
  
  get id(): string {
    return this._id;
  }
  set id(id: string) {
    this._id = id;
  }
  get item(): string {
    return this._item;
  }
  set item(item: string) {
    this._item = item;
  }
  get checked(): boolean {
    return this._checked;
  }
  set checked(checked: boolean) {
    this._checked = checked;
  }
}
```

**Key characteristics**:
- Constructor parameters use `private` keyword for automatic field creation
- Default values provided in constructor signature
- Getters and setters provide controlled access
- Full encapsulation of internal state

### 4. localStorage Persistence

**Pattern**: Persistence logic is fully encapsulated within the model class. Every mutation automatically saves to localStorage.

**Example from `FullList.ts`**:
```typescript
save(): void {
  localStorage.setItem("myList", JSON.stringify(this._list));
}

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

clearList(): void {
  this._list = [];
  this.save();
}

addItem(itemObj: LitsItem): void {
  this._list.push(itemObj);
  this.save();
}

removeItem(id: string): void {
  this._list = this._list.filter((item) => item.id !== id);
  this.save();
}
```

**Key characteristics**:
- Hard-coded storage key: `"myList"`
- save() called automatically after every mutation
- load() handles null/undefined gracefully
- JSON structure preserves private field names (_id, _item, _checked)
- load() reconstructs ListItem objects (not plain objects)
- Type annotations for parsed JSON structure

### 5. Array-Based State Management

**Pattern**: State is managed as a private array with immutable-style operations.

**Example from `FullList.ts`**:
```typescript
private constructor(private _list: LitsItem[] = []) {}

get list(): LitsItem[] {
  return this._list;
}

removeItem(id: string): void {
  this._list = this._list.filter((item) => item.id !== id);
  this.save();
}
```

**Key characteristics**:
- Array stored as private field
- Getter exposes read-only access
- Mutations use array methods (push, filter)
- No direct array index manipulation
- filter() creates new array for removals

## Data Flow

### Creating New Items
1. User input captured in `main.ts`
2. ID calculated from existing list length
3. New LitsItem instantiated with new keyword
4. addItem() called on FullList.instance
5. Item pushed to array
6. Automatic save() to localStorage

**Code from `main.ts`**:
```typescript
const itemId: number = fullList.list.length
  ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
  : 1;

const newItem = new LitsItem(itemId.toString(), myEntryText);
fullList.addItem(newItem);
```

### Loading Persisted Data
1. load() called once during app initialization
2. localStorage.getItem("myList") retrieves JSON string
3. JSON.parse() converts to object array
4. forEach loop reconstructs LitsItem instances
5. addItem() called for each (which saves, but redundant on load)

### Updating Items
**Example from `ListTemplate.ts`**:
```typescript
check.addEventListener("change", () => {
  item.checked = !item.checked;
  fullList.save();
});
```

**Key characteristics**:
- Direct property mutation via setter
- Manual save() call required (not automatic)
- No validation or business logic in setter

## Type Safety

### Explicit Return Types
All methods have explicit return type annotations:
- `load(): void` - No return value
- `save(): void` - No return value
- `get list(): LitsItem[]` - Returns typed array
- `removeItem(id: string): void` - Takes string param, no return

### Type Assertions in Persistence
```typescript
const parsedList: { _id: string; _item: string; _checked: boolean }[] =
  JSON.parse(storedList);
```
- Explicit type for parsed JSON data
- Matches private field names from serialization
- Ensures type safety during deserialization

## Architectural Constraints

### What You MUST Do
1. **Use singleton instances**: Always access via `ClassName.instance`
2. **Never instantiate with new**: Except for data objects like LitsItem
3. **Call save() after mutations**: Every state change must persist
4. **Use private fields**: Prefix with underscore, expose via getters/setters
5. **Define interfaces**: Every class needs a matching interface
6. **Type everything**: No implicit any types allowed

### What You MUST NOT Do
1. **No direct localStorage access**: Must go through model methods
2. **No public fields**: All properties must be private
3. **No multiple instances**: Singleton pattern is architectural requirement
4. **No validation in models**: Keep models simple, validate in event handlers
5. **No async operations**: All persistence is synchronous

## Extension Points

### Adding New Fields to ListItem
1. Add property to Item interface
2. Add private field with getter/setter to LitsItem class
3. Update constructor parameters and defaults
4. Update JSON type in load() method
5. Existing code will break if localStorage data doesn't match - requires migration

### Adding New Lists
Current architecture assumes single list. To add multiple lists:
- Would require refactoring singleton pattern
- Need dynamic localStorage keys
- Need list selection UI
- Significant architectural change required

### Adding Validation
Best practice: Add validation in event handlers or in a validation layer, not in setters:
```typescript
// Good: Validate before setting
const trimmedText = input.value.trim();
if (!trimmedText) return;
newItem.item = trimmedText;

// Bad: Don't add validation to setters
set item(item: string) {
  if (!item.trim()) throw new Error("Invalid");
  this._item = item;
}
```
