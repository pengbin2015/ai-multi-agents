# TypeScript Configuration Domain

## Overview
This project uses strict TypeScript with modern ES2020 features, bundler mode module resolution, and comprehensive linting rules. The configuration prioritizes type safety and code quality.

## Complete Configuration

**From `tsconfig.json`**:
```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

## Compiler Options Breakdown

### Target and Output

**ES2020 target**:
```json
"target": "ES2020"
```

**Key characteristics**:
- Modern JavaScript output
- Supports optional chaining, nullish coalescing
- Async/await natively supported
- Class fields and private fields

**useDefineForClassFields**:
```json
"useDefineForClassFields": true
```

**Key characteristics**:
- Modern class field semantics
- Aligns with TC39 standard
- Affects field initialization order

### Module System

**ESNext modules**:
```json
"module": "ESNext"
```

**Key characteristics**:
- Latest module features
- Top-level await supported
- Dynamic import() supported
- Tree-shaking friendly

**Bundler mode resolution**:
```json
"moduleResolution": "bundler"
```

**Key characteristics**:
- Optimized for bundlers (Vite)
- Allows importing .ts extensions
- More flexible than Node resolution

**TypeScript extension imports**:
```json
"allowImportingTsExtensions": true
```

**Example**:
```typescript
import FullList from "./models/FullList"; // No .ts needed
// Could also write: import FullList from "./models/FullList.ts";
```

### Library Definitions

**Available APIs**:
```json
"lib": ["ES2020", "DOM", "DOM.Iterable"]
```

**Provides**:
- **ES2020**: Promise.allSettled, BigInt, globalThis, etc.
- **DOM**: document, window, HTMLElement, etc.
- **DOM.Iterable**: for-of on NodeList, HTMLCollection

**Usage in code**:
```typescript
// ES2020 features
const myEntryText: string = input.value.trim();

// DOM types
const itemEntryForm = document.getElementById(
  "itemEntryForm"
) as HTMLFormElement;

// DOM.Iterable (implicit)
fullList.list.forEach((item) => { }); // Array iteration
```

### Bundler-Specific Options

**Isolated modules**:
```json
"isolatedModules": true
```

**Key characteristics**:
- Each file must be independently compilable
- Prevents const enum, namespace exports
- Required for bundlers like Vite

**No emit**:
```json
"noEmit": true
```

**Key characteristics**:
- TypeScript only for type checking
- Vite handles transpilation and bundling
- No .js output from tsc

**Skip lib check**:
```json
"skipLibCheck": true
```

**Key characteristics**:
- Faster compilation
- Skips type checking in .d.ts files
- Only checks code you write

### Strict Mode

**Complete strict mode**:
```json
"strict": true
```

**Enables**:
- `strictNullChecks`: null and undefined must be explicitly handled
- `strictFunctionTypes`: Stricter function type checking
- `strictBindCallApply`: Type-check bind, call, apply
- `strictPropertyInitialization`: Class properties must be initialized
- `noImplicitAny`: No implicit any types
- `noImplicitThis`: this must have explicit type
- `alwaysStrict`: Emit "use strict"

**Impact on codebase**:
```typescript
// Must type assert (no implicit any)
const input = document.getElementById("newItem") as HTMLInputElement;

// Must handle null (strictNullChecks)
const storedList: string | null = localStorage.getItem("myList");
if (typeof storedList !== "string") return;

// Explicit return types (noImplicitAny)
const initApp = (): void => { };
```

### Additional Linting

**No unused code**:
```json
"noUnusedLocals": true,
"noUnusedParameters": true
```

**Examples**:
```typescript
// ❌ Error: Unused variable
const unused = "test";

// ❌ Error: Unused parameter
function example(unusedParam: string): void { }

// ✅ OK: Prefix with underscore if intentionally unused
function example(_unusedParam: string): void { }
```

**No fallthrough**:
```json
"noFallthroughCasesInSwitch": true
```

**Example**:
```typescript
switch (value) {
  case "a":
    console.log("a");
    // ❌ Error: Missing break or return
  case "b":
    console.log("b");
    break; // ✅ OK
}
```

## Include Pattern

**Source directory**:
```json
"include": ["src"]
```

**Key characteristics**:
- Only compile files in src/
- Excludes node_modules automatically
- Excludes build output
- Recursive (includes subdirectories)

## Type Declarations

**Vite client types**:
```typescript
/// <reference types="vite/client" />
```

**From `vite-env.d.ts`**:
- Provides types for Vite-specific features
- import.meta.env types
- HMR API types
- Asset imports

## Patterns in Code

### Explicit Type Annotations

**Variable declarations**:
```typescript
const myEntryText: string = input.value.trim();
const itemId: number = fullList.list.length ? ... : 1;
```

**Function signatures**:
```typescript
const initApp = (): void => {
  // ...
};

itemEntryForm.addEventListener("submit", (e: SubmitEvent): void => {
  // ...
});
```

**Key characteristics**:
- Return types always specified
- Parameter types always specified
- Inferred types acceptable for simple cases
- Explicit better for public APIs

### Type Assertions

**DOM queries**:
```typescript
const itemEntryForm = document.getElementById(
  "itemEntryForm"
) as HTMLFormElement;

const input = document.getElementById("newItem") as HTMLInputElement;

const clearItems = document.getElementById(
  "clearItemsButton"
) as HTMLButtonElement;
```

**createElement**:
```typescript
const li = document.createElement("li") as HTMLLIElement;
const check = document.createElement("input") as HTMLInputElement;
const label = document.createElement("label") as HTMLLabelElement;
const button = document.createElement("button") as HTMLButtonElement;
```

**Key characteristics**:
- Specific types (HTMLInputElement, not HTMLElement)
- Enables IntelliSense for element properties
- Assumes element exists (no null handling)

### Interface Definitions

**Item interface**:
```typescript
export interface Item {
  id: string;
  item: string;
  checked: boolean;
}
```

**List interface**:
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

**DOMList interface**:
```typescript
interface DOMList {
  ul: HTMLUListElement;
  clear(): void;
  render(fullList: FullList): void;
}
```

**Key characteristics**:
- Define contract before implementation
- Exported when needed externally
- Private (not exported) when internal only
- Method signatures with explicit types

### Class Implementations

**Implementing interfaces**:
```typescript
export default class LitsItem implements Item {
  constructor(
    private _id: string = "",
    private _item: string = "",
    private _checked: boolean = false
  ) {}
  // ...
}
```

**Key characteristics**:
- `implements` keyword
- Private fields with getters/setters
- Default values in constructor
- Type-safe property access

## Build Process

**From `package.json`**:
```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

**Build steps**:
1. `tsc`: Type check (no output due to noEmit)
2. `vite build`: Transpile and bundle

**Key characteristics**:
- TypeScript validates types first
- Build fails if type errors exist
- Vite handles actual compilation

## Architectural Constraints

### What You MUST Do
1. **Enable strict mode**: Keep `"strict": true`
2. **Type all function signatures**: Parameters and return types
3. **Type assert DOM queries**: Specific types, not generic
4. **Export interfaces**: When used across files
5. **Handle null**: Check before using nullable values
6. **Use explicit types**: When type not obvious from context
7. **No any types**: Avoid implicit or explicit any

### What You MUST NOT Do
1. **No implicit any**: All types must be defined
2. **No unused code**: Remove or prefix with underscore
3. **No type: any**: Use specific types or unknown
4. **No @ts-ignore**: Fix type errors properly
5. **No fallthrough in switch**: Always break or return
6. **No disabling strict**: Keep all strict checks enabled

## Extension Points

### Adding New Strict Checks
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,  // Array access returns T | undefined
    "noImplicitOverride": true,         // Require override keyword
    "exactOptionalPropertyTypes": true  // Stricter optional properties
  }
}
```

### Adding Path Aliases
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@models/*": ["src/models/*"],
      "@templates/*": ["src/templates/*"]
    }
  }
}
```

**Usage**:
```typescript
import FullList from "@models/FullList";
import ListTemplate from "@templates/ListTemplate";
```

### Adding External Type Definitions
```json
{
  "compilerOptions": {
    "types": ["vite/client", "node"]
  }
}
```

## Common Type Patterns

### Union Types for Nullability
```typescript
const storedList: string | null = localStorage.getItem("myList");
```

### Conditional Types for ID Generation
```typescript
const itemId: number = fullList.list.length
  ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
  : 1;
```

### Generic Array Types
```typescript
private _list: LitsItem[] = []

get list(): LitsItem[] {
  return this._list;
}
```

### Typed Object Literals
```typescript
const parsedList: { _id: string; _item: string; _checked: boolean }[] =
  JSON.parse(storedList);
```

## Type Safety Benefits

### Compile-Time Errors
```typescript
// ❌ Compile error: Property 'value' does not exist on type 'HTMLElement'
const input = document.getElementById("newItem");
const value = input.value; // Error

// ✅ OK: Type assertion provides correct type
const input = document.getElementById("newItem") as HTMLInputElement;
const value = input.value; // OK
```

### IntelliSense Support
```typescript
const check = document.createElement("input") as HTMLInputElement;
check. // IntelliSense shows: value, checked, type, placeholder, etc.
```

### Refactoring Safety
```typescript
// Changing interface breaks all implementations
interface Item {
  id: string;
  item: string;
  checked: boolean;
  priority: number; // New field: compile errors where missing
}
```

## Testing Considerations

TypeScript configuration affects testing:
- Test files need `.test.ts` or `.spec.ts` extension
- Test utilities need type definitions
- Mocking requires proper type handling
- May need separate tsconfig for tests
