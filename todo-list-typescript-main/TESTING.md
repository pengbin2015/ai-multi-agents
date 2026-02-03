# Unit Tests Documentation

This document describes the comprehensive unit test suite for the Todo List TypeScript application.

## Test Framework

- **Framework**: Jest 30.x
- **Test Environment**: jsdom (simulates browser DOM)
- **TypeScript Support**: ts-jest
- **Testing Library**: @testing-library/dom and @testing-library/jest-dom

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The test suite achieves **100% code coverage** across all source files:

- **ListItem.ts**: 100% coverage (statements, branches, functions, lines)
- **FullList.ts**: 100% coverage (statements, branches, functions, lines)
- **ListTemplate.ts**: 100% coverage (statements, branches, functions, lines)

## Test Organization

### Unit Tests

#### 1. ListItem Tests (`src/models/__tests__/ListItem.test.ts`)

Tests the basic data model for a single todo item.

**Test Categories**:
- Constructor behavior (default values, provided values, partial values)
- ID getter and setter
- Item text getter and setter
- Checked state getter and setter
- Interface implementation

**Total Tests**: 14

#### 2. FullList Tests (`src/models/__tests__/FullList.test.ts`)

Tests the singleton list manager with localStorage persistence.

**Test Categories**:
- Singleton pattern verification
- List getter
- Adding items
- Removing items
- Clearing the list
- Saving to localStorage
- Loading from localStorage
- Integration with ListItem

**Total Tests**: 28

**Key Features Tested**:
- Singleton instance is maintained across calls
- All mutations trigger automatic save to localStorage
- Loading from localStorage creates proper ListItem instances
- Handles null/empty localStorage gracefully
- Filter operations work correctly

#### 3. ListTemplate Tests (`src/templates/__tests__/ListTemplate.test.ts`)

Tests the DOM rendering singleton.

**Test Categories**:
- Singleton pattern verification
- DOM element reference
- Clearing the list UI
- Rendering items
- Checkbox change events
- Delete button events
- Integration with FullList

**Total Tests**: 20

**Key Features Tested**:
- Singleton maintains DOM reference
- Clearing removes all list items from DOM
- Rendering creates proper HTML structure (li, checkbox, label, button)
- Items are prepended (newest first)
- Checkbox changes toggle item state and trigger save
- Delete button removes item and re-renders
- Full integration with FullList model

### Integration Tests

#### 4. Main Application Integration Tests (`src/__tests__/main.integration.test.ts`)

Tests the complete application flow simulating user interactions.

**Test Categories**:
- Application initialization
- Form submission
- Clear button functionality
- localStorage integration
- Complete user flows

**Total Tests**: 9

**Key Features Tested**:
- Required DOM elements exist
- Singletons are properly initialized
- Form submission adds items
- Empty/whitespace inputs are rejected
- Input is trimmed
- Sequential IDs are generated
- Items render after form submission
- Clear button clears both model and view
- localStorage persists items
- Complete flow: add → check → delete

## Test Patterns and Best Practices

### Mocking localStorage

All tests mock localStorage to avoid side effects:

```typescript
const localStorageMock: { [key: string]: string } = {};

global.Storage.prototype.getItem = jest.fn((key: string) => {
  return localStorageMock[key] || null;
});

global.Storage.prototype.setItem = jest.fn((key: string, value: string) => {
  localStorageMock[key] = value;
});
```

### DOM Setup

Tests that need DOM elements set them up in `beforeEach`:

```typescript
beforeEach(() => {
  document.body.innerHTML = `
    <ul id="listItems"></ul>
  `;
  
  mockUl = document.getElementById('listItems') as HTMLUListElement;
  
  // Reset singleton DOM reference
  ListTemplate.instance.ul = mockUl;
});
```

### Singleton Handling

Since the application uses singletons, tests reset their state:

```typescript
beforeEach(() => {
  // Reset FullList
  FullList.instance['_list'] = [];
  
  // Reset ListTemplate DOM reference
  ListTemplate.instance.ul = mockUl;
});
```

### Event Testing

Integration tests simulate user interactions:

```typescript
// Simulate form submission
const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
itemEntryForm.dispatchEvent(submitEvent);

// Simulate checkbox click
checkbox.click();

// Simulate button click
button.click();
```

## Test Failures and Debugging

If tests fail:

1. **Check singleton state**: Singletons maintain state across tests. Ensure proper cleanup in `beforeEach`.

2. **Check DOM elements**: Ensure DOM is set up correctly and element IDs match.

3. **Check event listeners**: In integration tests, avoid adding duplicate event listeners.

4. **Check localStorage mocks**: Ensure localStorage is properly mocked in each test.

## Adding New Tests

When adding new features:

1. **Add unit tests** for the new class/function in the appropriate `__tests__` directory
2. **Add integration tests** if the feature involves user interaction
3. **Maintain 100% coverage** - run `npm run test:coverage` to verify
4. **Follow existing patterns** for consistency

## Test Configuration

### jest.config.js

```javascript
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
```

### Coverage Thresholds

The project enforces minimum 80% coverage thresholds:
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

Current coverage: **100% across all metrics** ✅

## Continuous Integration

These tests should be run:
- Before every commit
- In CI/CD pipeline
- Before merging pull requests

## Dependencies

Testing dependencies (installed as devDependencies):

```json
{
  "@testing-library/dom": "^10.4.1",
  "@testing-library/jest-dom": "^6.9.1",
  "@types/jest": "^30.0.0",
  "jest": "^30.2.0",
  "jest-environment-jsdom": "^30.2.0",
  "ts-jest": "^29.4.5"
}
```

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**: Ensure all dependencies are installed with `npm install`

2. **TypeScript errors**: Check `tsconfig.json` settings match Jest configuration

3. **DOM not found errors**: Ensure `testEnvironment: 'jsdom'` is set in jest.config.js

4. **Singleton state persists**: Add proper cleanup in `beforeEach` hooks

## Contributing

When contributing tests:

1. Follow the existing test structure and naming conventions
2. Write descriptive test names using "should" statements
3. Group related tests using `describe` blocks
4. Keep tests focused and atomic (test one thing per test)
5. Mock external dependencies (localStorage, DOM, etc.)
6. Maintain 100% code coverage
