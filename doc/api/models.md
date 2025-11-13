# Models API Reference

## Overview

This document provides detailed API documentation for the data model classes in the Todo List application. The models handle all business logic, state management, and data persistence.

## Table of Contents

- [ListItem Class](#listitem-class)
- [FullList Class](#fulllist-class)
- [Interfaces](#interfaces)

---

## ListItem Class

### Description

Represents a single todo item with an ID, text description, and completion status.

### Location
`src/models/ListItem.ts`

### Interface

```typescript
export interface Item {
  id: string;
  item: string;
  checked: boolean;
}
```

### Class Declaration

```typescript
export default class LitsItem implements Item {
  constructor(
    private _id: string = "",
    private _item: string = "",
    private _checked: boolean = false
  ) {}
}
```

### Constructor

#### Signature
```typescript
constructor(
  _id?: string,
  _item?: string,
  _checked?: boolean
)
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `_id` | `string` | `""` | Unique identifier for the item |
| `_item` | `string` | `""` | Text description of the todo |
| `_checked` | `boolean` | `false` | Completion status |

#### Examples

```typescript
// Create with all parameters
const item1 = new LitsItem("1", "Buy groceries", false);

// Create with defaults
const item2 = new LitsItem();
item2.id = "2";
item2.item = "Write documentation";

// Create partially
const item3 = new LitsItem("3", "Complete task");
// checked defaults to false
```

### Properties

#### id

**Type:** `string`

**Access:** Read/Write via getter/setter

**Description:** Unique identifier for the todo item.

**Getter:**
```typescript
get id(): string {
  return this._id;
}
```

**Setter:**
```typescript
set id(id: string) {
  this._id = id;
}
```

**Example:**
```typescript
const item = new LitsItem("1", "Task", false);
console.log(item.id); // "1"

item.id = "42";
console.log(item.id); // "42"
```

#### item

**Type:** `string`

**Access:** Read/Write via getter/setter

**Description:** Text description of the todo item.

**Getter:**
```typescript
get item(): string {
  return this._item;
}
```

**Setter:**
```typescript
set item(item: string) {
  this._item = item;
}
```

**Example:**
```typescript
const todo = new LitsItem("1", "Original text", false);
console.log(todo.item); // "Original text"

todo.item = "Updated text";
console.log(todo.item); // "Updated text"
```

#### checked

**Type:** `boolean`

**Access:** Read/Write via getter/setter

**Description:** Completion status of the todo item.

**Getter:**
```typescript
get checked(): boolean {
  return this._checked;
}
```

**Setter:**
```typescript
set checked(checked: boolean) {
  this._checked = checked;
}
```

**Example:**
```typescript
const todo = new LitsItem("1", "Task", false);
console.log(todo.checked); // false

todo.checked = true;
console.log(todo.checked); // true
```

### Usage Examples

#### Creating Items

```typescript
import LitsItem from "./models/ListItem";

// Empty item
const emptyItem = new LitsItem();

// Complete item
const completeItem = new LitsItem("1", "Buy milk", false);

// Partial item
const partialItem = new LitsItem("2");
partialItem.item = "Write code";
partialItem.checked = false;
```

#### Modifying Items

```typescript
const todo = new LitsItem("1", "Complete task", false);

// Update text
todo.item = "Complete task - URGENT";

// Toggle completion
todo.checked = !todo.checked;

// Change ID
todo.id = "100";
```

#### Serialization

ListItem instances are serialized when saved to localStorage:

```typescript
const item = new LitsItem("1", "Task", true);
const serialized = JSON.stringify(item);
console.log(serialized);
// {"_id":"1","_item":"Task","_checked":true}
```

Note: Private fields are serialized with underscore prefixes.

---

## FullList Class

### Description

Manages a collection of ListItem instances with persistence to localStorage. Implements the singleton pattern to ensure a single source of truth for the todo list.

### Location
`src/models/FullList.ts`

### Interface

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

### Class Declaration

```typescript
export default class FullList implements List {
  static instance: FullList = new FullList();
  private constructor(private _list: LitsItem[] = []) {}
}
```

### Static Properties

#### instance

**Type:** `FullList` (static)

**Access:** Read-only

**Description:** Singleton instance of the FullList class. This is the only instance that should be used throughout the application.

**Example:**
```typescript
import FullList from "./models/FullList";

// ✅ Correct usage
const fullList = FullList.instance;

// ❌ Cannot instantiate directly (private constructor)
const badList = new FullList(); // Error!
```

### Constructor

#### Signature
```typescript
private constructor(_list?: LitsItem[])
```

**Note:** The constructor is private to enforce the singleton pattern. Use `FullList.instance` instead.

### Properties

#### list

**Type:** `LitsItem[]`

**Access:** Read-only via getter

**Description:** Array of all todo items in the list.

**Getter:**
```typescript
get list(): LitsItem[] {
  return this._list;
}
```

**Example:**
```typescript
const fullList = FullList.instance;
console.log(fullList.list.length); // Number of items
console.log(fullList.list[0]);     // First item

// Can read the array
fullList.list.forEach(item => {
  console.log(item.item);
});

// ❌ Cannot directly assign (read-only)
fullList.list = []; // Error: Cannot assign to 'list' because it is a read-only property
```

### Methods

#### load()

**Description:** Loads todo items from localStorage and populates the list.

**Signature:**
```typescript
load(): void
```

**Returns:** `void`

**Side Effects:**
- Reads from localStorage key `"myList"`
- Clears current list and repopulates with stored items
- Parses JSON and creates LitsItem instances

**Implementation:**
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

**Example:**
```typescript
const fullList = FullList.instance;

// Load saved items
fullList.load();

// Check what was loaded
console.log(`Loaded ${fullList.list.length} items`);
fullList.list.forEach(item => {
  console.log(`- ${item.item} (${item.checked ? '✓' : ' '})`);
});
```

**Error Handling:**
- Returns early if localStorage is empty
- Assumes valid JSON format (no try-catch)

#### save()

**Description:** Persists the current list to localStorage.

**Signature:**
```typescript
save(): void
```

**Returns:** `void`

**Side Effects:**
- Writes to localStorage key `"myList"`
- Serializes the entire list to JSON

**Implementation:**
```typescript
save(): void {
  localStorage.setItem("myList", JSON.stringify(this._list));
}
```

**Storage Format:**
```json
[
  {"_id": "1", "_item": "First task", "_checked": false},
  {"_id": "2", "_item": "Second task", "_checked": true}
]
```

**Example:**
```typescript
const fullList = FullList.instance;

// Modify the list
fullList.addItem(new LitsItem("1", "Task", false));

// save() is called automatically by addItem
// But you can call it manually after direct modifications:
fullList.list[0].checked = true;
fullList.save(); // Persist the change
```

**Note:** Most mutation methods (`addItem`, `removeItem`, `clearList`) automatically call `save()`.

#### addItem()

**Description:** Adds a new item to the list and saves to localStorage.

**Signature:**
```typescript
addItem(itemObj: LitsItem): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `itemObj` | `LitsItem` | The item instance to add |

**Returns:** `void`

**Side Effects:**
- Adds item to internal `_list` array
- Calls `save()` to persist

**Implementation:**
```typescript
addItem(itemObj: LitsItem): void {
  this._list.push(itemObj);
  this.save();
}
```

**Example:**
```typescript
const fullList = FullList.instance;

// Create and add item
const newItem = new LitsItem("1", "New task", false);
fullList.addItem(newItem);

// Item is now in the list and saved
console.log(fullList.list.length); // 1
```

**Notes:**
- Does not check for duplicate IDs
- Does not validate the item
- Always appends to the end of the array

#### removeItem()

**Description:** Removes an item by ID and saves to localStorage.

**Signature:**
```typescript
removeItem(id: string): void
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The unique identifier of the item to remove |

**Returns:** `void`

**Side Effects:**
- Filters out item with matching ID
- Updates `_list` with filtered array
- Calls `save()` to persist

**Implementation:**
```typescript
removeItem(id: string): void {
  this._list = this._list.filter((item) => item.id !== id);
  this.save();
}
```

**Example:**
```typescript
const fullList = FullList.instance;

// Add items
fullList.addItem(new LitsItem("1", "Task 1", false));
fullList.addItem(new LitsItem("2", "Task 2", false));
fullList.addItem(new LitsItem("3", "Task 3", false));

console.log(fullList.list.length); // 3

// Remove item
fullList.removeItem("2");

console.log(fullList.list.length); // 2
// Item "2" is removed
```

**Notes:**
- Does nothing if ID is not found (silent failure)
- Updates the array reference
- Preserves other items

#### clearList()

**Description:** Removes all items from the list and saves to localStorage.

**Signature:**
```typescript
clearList(): void
```

**Returns:** `void`

**Side Effects:**
- Sets `_list` to empty array
- Calls `save()` to persist empty state

**Implementation:**
```typescript
clearList(): void {
  this._list = [];
  this.save();
}
```

**Example:**
```typescript
const fullList = FullList.instance;

// Add some items
fullList.addItem(new LitsItem("1", "Task", false));
fullList.addItem(new LitsItem("2", "Task", false));

console.log(fullList.list.length); // 2

// Clear all
fullList.clearList();

console.log(fullList.list.length); // 0
```

### Complete Usage Example

```typescript
import FullList from "./models/FullList";
import LitsItem from "./models/ListItem";

// Get singleton instance
const fullList = FullList.instance;

// Load existing items
fullList.load();
console.log(`Loaded ${fullList.list.length} items`);

// Add new items
const item1 = new LitsItem("1", "Buy groceries", false);
const item2 = new LitsItem("2", "Write code", false);
const item3 = new LitsItem("3", "Review PR", false);

fullList.addItem(item1);
fullList.addItem(item2);
fullList.addItem(item3);

// List all items
fullList.list.forEach(item => {
  console.log(`[${item.id}] ${item.item} - ${item.checked ? 'Done' : 'Pending'}`);
});

// Mark item as complete
const firstItem = fullList.list.find(item => item.id === "1");
if (firstItem) {
  firstItem.checked = true;
  fullList.save(); // Persist the change
}

// Remove completed items
fullList.list
  .filter(item => item.checked)
  .forEach(item => fullList.removeItem(item.id));

// Clear everything
fullList.clearList();
```

## Best Practices

### DO ✅

```typescript
// Use the singleton instance
const fullList = FullList.instance;

// Call save after direct modifications
fullList.list[0].checked = true;
fullList.save();

// Check if items exist before accessing
const item = fullList.list.find(i => i.id === "1");
if (item) {
  item.checked = true;
}
```

### DON'T ❌

```typescript
// Don't try to instantiate FullList
const badList = new FullList(); // Error!

// Don't modify the array directly
fullList.list = []; // Error: read-only

// Don't forget to save after manual changes
fullList.list[0].checked = true;
// Missing: fullList.save();
```

## Type Definitions

### Item Interface

```typescript
export interface Item {
  id: string;
  item: string;
  checked: boolean;
}
```

### List Interface

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

---

**Related Documentation:**
- [Architecture Overview](../architecture/overview.md)
- [Data Layer](../architecture/data-layer.md)
- [Templates API](./templates.md)
