# Models Style Guide

## Unique Patterns in This Project

### 1. Singleton Pattern with Static Instance Initialization

**Pattern**: Classes immediately initialize a static instance at class definition time.

```typescript
export default class FullList implements List {
  static instance: FullList = new FullList();
  
  private constructor(private _list: LitsItem[] = []) {}
}
```

**What Makes This Unique**:
- Instance created **immediately** (not lazy-loaded)
- Private constructor **accepts parameters** with defaults
- Comment explains rationale: `// ? we use this cuz only we have one list in out app`
- No getInstance() method pattern

### 2. Interface + Class in Same File with Matching Names

**Pattern**: Interface defined first, then class with similar name (minus "I" prefix or similar).

```typescript
export interface Item {
  id: string;
  item: string;
  checked: boolean;
}

export default class LitsItem implements Item {
  // Implementation
}
```

**What Makes This Unique**:
- Interface name: `Item` (simple, no "I" prefix)
- Class name: `LitsItem` (adds "Lits" prefix for uniqueness)
- Interface **exported** alongside class
- Both in same `.ts` file

### 3. Private Fields with Underscore + Comprehensive Getter/Setters

**Pattern**: Every property is private with underscore prefix, exposed through identical getter/setter pairs.

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
  // ... repeat for all fields
}
```

**What Makes This Unique**:
- Constructor uses `private` keyword for automatic field declaration
- **All fields** have both getter and setter (not just getters)
- Default values in constructor signature
- No validation in setters (pure accessor pattern)
- Setter parameter name matches property name (not prefixed)

### 4. Persistence Methods Encapsulated in Model

**Pattern**: localStorage operations are methods within the data model class.

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
```

**What Makes This Unique**:
- Hard-coded storage key: `"myList"`
- save() called **automatically** in mutation methods
- load() **reconstructs class instances** (not plain objects)
- Type annotation for parsed JSON includes private field names (`_id`, `_item`, `_checked`)
- null check using `typeof storedList !== "string"` (not `!storedList`)

### 5. Mutation Methods Follow Save Pattern

**Pattern**: Every method that modifies state ends with a call to this.save()

```typescript
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

**What Makes This Unique**:
- **Every mutation auto-saves** (no separate save step needed)
- removeItem uses filter (creates new array) not splice
- No validation logic in these methods
- All return void (no return values)

### 6. Array-Based State with Immutable-Style Operations

**Pattern**: removeItem creates new array rather than mutating in place.

```typescript
removeItem(id: string): void {
  this._list = this._list.filter((item) => item.id !== id);
  this.save();
}
```

**What Makes This Unique**:
- Uses `filter()` not `splice()` or `delete`
- Reassigns entire array
- Still mutates object (this._list =) despite functional style
- Hybrid approach between mutation and immutability

## Naming Conventions

### File Names
- `ListItem.ts` - PascalCase, matches class name
- `FullList.ts` - PascalCase, matches class name

### Class Names
- `LitsItem` - Typo or intentional? (likely meant "ListItem")
- `FullList` - Descriptive of containing full list
- Prefix/suffix pattern: Data concept + "List" or "Item"

### Interface Names
- `Item` - Simple noun, no "I" prefix
- `List` - Simple noun, describes contract
- Match class purpose without implementation details

### Method Names
- `load()`, `save()` - Lowercase, describe action
- `clearList()`, `addItem()`, `removeItem()` - camelCase verbs
- Prefixes: `clear`, `add`, `remove` for CRUD operations

### Property Names
- Private: `_list`, `_id`, `_item`, `_checked` (underscore prefix)
- Public (via getter): `list`, `id`, `item`, `checked` (no underscore)

## Typing Patterns

### Explicit Types in Load Method
```typescript
const storedList: string | null = localStorage.getItem("myList");

const parsedList: { _id: string; _item: string; _checked: boolean }[] =
  JSON.parse(storedList);
```

**What Makes This Unique**:
- Explicit union type for nullable localStorage return
- Inline object type definition for parsed JSON
- Matches private field structure in type annotation

### Constructor Parameter Types
```typescript
private constructor(private _list: LitsItem[] = []) {}

constructor(
  private _id: string = "",
  private _item: string = "",
  private _checked: boolean = false
) {}
```

**What Makes This Unique**:
- All parameters have default values
- Uses `private` modifier for automatic field creation
- Array initialized to empty, strings to empty string, boolean to false

## Testing Conventions

**What to follow when creating new model files**:

1. ✅ Define interface first, class second in same file
2. ✅ Use static instance pattern with immediate initialization
3. ✅ Make constructor private, accept parameters with defaults
4. ✅ Prefix all fields with underscore, make private
5. ✅ Create getter and setter for every field
6. ✅ Put save() and load() methods in model if persistence needed
7. ✅ Call save() at end of every mutation method
8. ✅ Use filter() for removals, not splice()
9. ✅ Return void from mutation methods
10. ✅ Type annotate localStorage/JSON operations explicitly

## Anti-Patterns to Avoid

1. ❌ Don't create multiple instances (defeats singleton pattern)
2. ❌ Don't add validation logic to setters (keep pure)
3. ❌ Don't forget save() calls in mutation methods
4. ❌ Don't use splice() or direct array index manipulation
5. ❌ Don't make constructor public
6. ❌ Don't skip getter/setter pairs (always include both)
7. ❌ Don't use different storage keys per model (keep consistent)
