/**
 * Integration tests for the main application initialization
 * These tests verify that the application wires everything together correctly
 */

import FullList from '../models/FullList';
import LitsItem from '../models/ListItem';
import ListTemplate from '../templates/ListTemplate';

describe('Main Application Integration', () => {
  let itemEntryForm: HTMLFormElement;
  let newItemInput: HTMLInputElement;
  let clearButton: HTMLButtonElement;
  let listItems: HTMLUListElement;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Set up complete DOM structure
    document.body.innerHTML = `
      <form id="itemEntryForm">
        <input type="text" id="newItem" placeholder="Enter new item" />
        <button type="submit">Add</button>
      </form>
      <button id="clearItemsButton">Clear</button>
      <ul id="listItems"></ul>
    `;

    itemEntryForm = document.getElementById('itemEntryForm') as HTMLFormElement;
    newItemInput = document.getElementById('newItem') as HTMLInputElement;
    clearButton = document.getElementById('clearItemsButton') as HTMLButtonElement;
    listItems = document.getElementById('listItems') as HTMLUListElement;

    // Reset the singleton's ul reference to the new DOM element
    ListTemplate.instance.ul = listItems;

    // Reset FullList
    FullList.instance['_list'] = [];

    // Mock localStorage
    localStorageMock = {};
    
    global.Storage.prototype.getItem = jest.fn((key: string) => {
      return localStorageMock[key] || null;
    });
    
    global.Storage.prototype.setItem = jest.fn((key: string, value: string) => {
      localStorageMock[key] = value;
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('Application Initialization', () => {
    it('should have required DOM elements', () => {
      expect(itemEntryForm).toBeTruthy();
      expect(newItemInput).toBeTruthy();
      expect(clearButton).toBeTruthy();
      expect(listItems).toBeTruthy();
    });

    it('should get singleton instances', () => {
      const fullList = FullList.instance;
      const template = ListTemplate.instance;
      
      expect(fullList).toBeInstanceOf(FullList);
      expect(template).toBeInstanceOf(ListTemplate);
    });
  });

  describe('Form Submission', () => {
    it('should add new item on form submit', () => {
      const fullList = FullList.instance;
      const template = ListTemplate.instance;

      // Simulate form submission
      newItemInput.value = 'New task';
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      
      itemEntryForm.addEventListener('submit', (e: Event): void => {
        e.preventDefault();
        
        const input = document.getElementById('newItem') as HTMLInputElement;
        const myEntryText: string = input.value.trim();
        if (!myEntryText) return;
        
        const itemId: number = fullList.list.length
          ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
          : 1;
        
        const newItem = new LitsItem(itemId.toString(), myEntryText);
        
        fullList.addItem(newItem);
        template.render(fullList);
      });

      itemEntryForm.dispatchEvent(submitEvent);
      
      expect(fullList.list.length).toBe(1);
      expect(fullList.list[0].item).toBe('New task');
      expect(fullList.list[0].id).toBe('1');
    });

    it('should not add empty items', () => {
      const fullList = FullList.instance;
      const template = ListTemplate.instance;

      newItemInput.value = '   '; // Only whitespace
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      
      itemEntryForm.addEventListener('submit', (e: Event): void => {
        e.preventDefault();
        
        const input = document.getElementById('newItem') as HTMLInputElement;
        const myEntryText: string = input.value.trim();
        if (!myEntryText) return;
        
        const itemId: number = fullList.list.length
          ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
          : 1;
        
        const newItem = new LitsItem(itemId.toString(), myEntryText);
        
        fullList.addItem(newItem);
        template.render(fullList);
      });

      itemEntryForm.dispatchEvent(submitEvent);
      
      expect(fullList.list.length).toBe(0);
    });

    it('should trim whitespace from input', () => {
      const fullList = FullList.instance;
      const template = ListTemplate.instance;

      newItemInput.value = '  Task with spaces  ';
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      
      itemEntryForm.addEventListener('submit', (e: Event): void => {
        e.preventDefault();
        
        const input = document.getElementById('newItem') as HTMLInputElement;
        const myEntryText: string = input.value.trim();
        if (!myEntryText) return;
        
        const itemId: number = fullList.list.length
          ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
          : 1;
        
        const newItem = new LitsItem(itemId.toString(), myEntryText);
        
        fullList.addItem(newItem);
        template.render(fullList);
      });

      itemEntryForm.dispatchEvent(submitEvent);
      
      expect(fullList.list[0].item).toBe('Task with spaces');
    });

    it('should generate sequential IDs', () => {
      const fullList = FullList.instance;
      const template = ListTemplate.instance;

      // Add event listener once
      itemEntryForm.addEventListener('submit', (e: Event): void => {
        e.preventDefault();
        
        const input = document.getElementById('newItem') as HTMLInputElement;
        const myEntryText: string = input.value.trim();
        if (!myEntryText) return;
        
        const itemId: number = fullList.list.length
          ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
          : 1;
        
        const newItem = new LitsItem(itemId.toString(), myEntryText);
        
        fullList.addItem(newItem);
        template.render(fullList);
      });

      const addItem = (text: string) => {
        newItemInput.value = text;
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        itemEntryForm.dispatchEvent(submitEvent);
      };

      addItem('Task 1');
      addItem('Task 2');
      addItem('Task 3');
      
      expect(fullList.list.length).toBe(3);
      expect(fullList.list[0].id).toBe('1');
      expect(fullList.list[1].id).toBe('2');
      expect(fullList.list[2].id).toBe('3');
    });

    it('should render items after form submit', () => {
      const fullList = FullList.instance;
      const template = ListTemplate.instance;

      newItemInput.value = 'Rendered task';
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      
      itemEntryForm.addEventListener('submit', (e: Event): void => {
        e.preventDefault();
        
        const input = document.getElementById('newItem') as HTMLInputElement;
        const myEntryText: string = input.value.trim();
        if (!myEntryText) return;
        
        const itemId: number = fullList.list.length
          ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
          : 1;
        
        const newItem = new LitsItem(itemId.toString(), myEntryText);
        
        fullList.addItem(newItem);
        template.render(fullList);
      });

      itemEntryForm.dispatchEvent(submitEvent);
      
      expect(listItems.children.length).toBe(1);
      
      const label = listItems.querySelector('label') as HTMLLabelElement;
      expect(label.textContent).toBe('Rendered task');
    });
  });

  describe('Clear Button', () => {
    it('should clear all items on button click', () => {
      const fullList = FullList.instance;
      const template = ListTemplate.instance;

      // Add some items first
      fullList.addItem(new LitsItem('1', 'Task 1'));
      fullList.addItem(new LitsItem('2', 'Task 2'));
      template.render(fullList);

      expect(fullList.list.length).toBe(2);
      expect(listItems.children.length).toBe(2);

      // Set up clear button handler
      clearButton.addEventListener('click', () => {
        fullList.clearList();
        template.clear();
      });

      // Click the clear button
      clearButton.click();
      
      expect(fullList.list.length).toBe(0);
      expect(listItems.children.length).toBe(0);
    });

    it('should clear template and list independently', () => {
      const fullList = FullList.instance;
      const template = ListTemplate.instance;

      fullList.addItem(new LitsItem('1', 'Task 1'));
      template.render(fullList);

      clearButton.addEventListener('click', () => {
        fullList.clearList();
        template.clear();
      });

      clearButton.click();
      
      // Both should be cleared
      expect(fullList.list.length).toBe(0);
      expect(listItems.innerHTML).toBe('');
    });
  });

  describe('localStorage Integration', () => {
    it('should load items from localStorage on initialization', () => {
      const fullList = FullList.instance;
      const template = ListTemplate.instance;

      // Simulate existing data in localStorage
      const storedData = JSON.stringify([
        { _id: '1', _item: 'Saved task 1', _checked: false },
        { _id: '2', _item: 'Saved task 2', _checked: true },
      ]);
      
      localStorageMock['myList'] = storedData;

      // Simulate app initialization
      fullList.load();
      template.render(fullList);
      
      expect(fullList.list.length).toBe(2);
      expect(fullList.list[0].item).toBe('Saved task 1');
      expect(fullList.list[1].item).toBe('Saved task 2');
      expect(listItems.children.length).toBe(2);
    });

    it('should persist new items to localStorage', () => {
      const fullList = FullList.instance;
      const template = ListTemplate.instance;

      newItemInput.value = 'Persistent task';
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      
      itemEntryForm.addEventListener('submit', (e: Event): void => {
        e.preventDefault();
        
        const input = document.getElementById('newItem') as HTMLInputElement;
        const myEntryText: string = input.value.trim();
        if (!myEntryText) return;
        
        const itemId: number = fullList.list.length
          ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
          : 1;
        
        const newItem = new LitsItem(itemId.toString(), myEntryText);
        
        fullList.addItem(newItem);
        template.render(fullList);
      });

      itemEntryForm.dispatchEvent(submitEvent);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'myList',
        expect.any(String)
      );
      
      const savedData = JSON.parse(localStorageMock['myList']);
      expect(savedData.length).toBe(1);
      expect(savedData[0]._item).toBe('Persistent task');
    });
  });

  describe('Complete User Flow', () => {
    it('should handle add, check, and delete flow', () => {
      const fullList = FullList.instance;
      const template = ListTemplate.instance;

      // Add an item
      newItemInput.value = 'Complete flow task';
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      
      itemEntryForm.addEventListener('submit', (e: Event): void => {
        e.preventDefault();
        
        const input = document.getElementById('newItem') as HTMLInputElement;
        const myEntryText: string = input.value.trim();
        if (!myEntryText) return;
        
        const itemId: number = fullList.list.length
          ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
          : 1;
        
        const newItem = new LitsItem(itemId.toString(), myEntryText);
        
        fullList.addItem(newItem);
        template.render(fullList);
      });

      itemEntryForm.dispatchEvent(submitEvent);
      
      expect(fullList.list.length).toBe(1);
      expect(listItems.children.length).toBe(1);

      // Check the item
      const checkbox = listItems.querySelector('input[type="checkbox"]') as HTMLInputElement;
      checkbox.click();
      
      expect(fullList.list[0].checked).toBe(true);

      // Delete the item
      const deleteButton = listItems.querySelector('button') as HTMLButtonElement;
      deleteButton.click();
      
      expect(fullList.list.length).toBe(0);
    });

    it('should handle multiple items with different states', () => {
      const fullList = FullList.instance;
      const template = ListTemplate.instance;

      // Add event listener once
      itemEntryForm.addEventListener('submit', (e: Event): void => {
        e.preventDefault();
        
        const input = document.getElementById('newItem') as HTMLInputElement;
        const myEntryText: string = input.value.trim();
        if (!myEntryText) return;
        
        const itemId: number = fullList.list.length
          ? parseInt(fullList.list[fullList.list.length - 1].id) + 1
          : 1;
        
        const newItem = new LitsItem(itemId.toString(), myEntryText);
        
        fullList.addItem(newItem);
        template.render(fullList);
      });

      // Add multiple items
      const addItem = (text: string) => {
        newItemInput.value = text;
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        itemEntryForm.dispatchEvent(submitEvent);
      };

      addItem('Task 1');
      addItem('Task 2');
      addItem('Task 3');
      
      expect(fullList.list.length).toBe(3);

      // Check some items - when you click, the checkbox state toggles AND the item state toggles
      const checkboxes = listItems.querySelectorAll('input[type="checkbox"]');
      (checkboxes[0] as HTMLInputElement).click(); // Task 3 (prepended) - was false, now true
      (checkboxes[2] as HTMLInputElement).click(); // Task 1 - was false, now true
      
      expect(fullList.list[0].checked).toBe(true); // Task 1 is now checked
      expect(fullList.list[1].checked).toBe(false); // Task 2 is still unchecked  
      expect(fullList.list[2].checked).toBe(true);  // Task 3 is now checked

      // Delete one item
      const deleteButtons = listItems.querySelectorAll('button');
      (deleteButtons[1] as HTMLButtonElement).click(); // Delete Task 2
      
      expect(fullList.list.length).toBe(2);
    });
  });
});
