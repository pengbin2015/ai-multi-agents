# Test Suite Quick Reference

## Test Files Overview

### Unit Tests

#### 1. `src/models/__tests__/ListItem.test.ts`
**Purpose**: Tests the ListItem data model class  
**Tests**: 14  
**Coverage**: 100%  
**Tests**:
- Constructor with default and custom values
- ID getter and setter
- Item text getter and setter  
- Checked state getter and setter
- Interface implementation

#### 2. `src/models/__tests__/FullList.test.ts`
**Purpose**: Tests the FullList singleton manager  
**Tests**: 28  
**Coverage**: 100%  
**Tests**:
- Singleton pattern implementation
- Adding items to list
- Removing items from list
- Clearing all items
- Saving to localStorage
- Loading from localStorage
- Integration with ListItem

#### 3. `src/templates/__tests__/ListTemplate.test.ts`
**Purpose**: Tests the DOM rendering template  
**Tests**: 20  
**Coverage**: 100%  
**Tests**:
- Singleton pattern implementation
- Clearing list UI
- Rendering items to DOM
- Creating proper HTML structure
- Checkbox change events
- Delete button events
- Integration with FullList

### Integration Tests

#### 4. `src/__tests__/main.integration.test.ts`
**Purpose**: Tests the complete application flow  
**Tests**: 9  
**Coverage**: N/A (main.ts excluded from coverage)  
**Tests**:
- Application initialization
- Form submission workflow
- Input validation and trimming
- Sequential ID generation
- Clear button functionality
- localStorage persistence
- Complete user flows (add → check → delete)

## Total Test Statistics

- **Total Test Files**: 4
- **Total Tests**: 71
- **All Tests**: ✅ PASSING
- **Code Coverage**: 100% (statements, branches, functions, lines)

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Infrastructure

- **Framework**: Jest 30.x
- **TypeScript Support**: ts-jest 29.x
- **DOM Simulation**: jsdom
- **Testing Utilities**: @testing-library/dom, @testing-library/jest-dom

## Coverage Report Location

After running `npm run test:coverage`, the full HTML coverage report is available at:
- `coverage/lcov-report/index.html`

## Key Testing Patterns

### 1. localStorage Mocking
```typescript
const localStorageMock: { [key: string]: string } = {};
global.Storage.prototype.getItem = jest.fn(/* ... */);
global.Storage.prototype.setItem = jest.fn(/* ... */);
```

### 2. DOM Setup
```typescript
document.body.innerHTML = `<ul id="listItems"></ul>`;
ListTemplate.instance.ul = document.getElementById('listItems') as HTMLUListElement;
```

### 3. Singleton Reset
```typescript
FullList.instance['_list'] = [];
ListTemplate.instance.ul = mockUl;
```

### 4. Event Simulation
```typescript
const event = new Event('submit', { bubbles: true, cancelable: true });
form.dispatchEvent(event);
checkbox.click();
```

## Documentation

Full testing documentation is available in `TESTING.md`.
