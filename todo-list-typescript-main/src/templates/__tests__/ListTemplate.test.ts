import ListTemplate from '../ListTemplate';
import FullList from '../../models/FullList';
import LitsItem from '../../models/ListItem';

describe('ListTemplate', () => {
  let mockUl: HTMLUListElement;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <ul id="listItems"></ul>
    `;
    
    mockUl = document.getElementById('listItems') as HTMLUListElement;

    // Reset the singleton's ul reference to the new DOM element
    ListTemplate.instance.ul = mockUl;

    // Reset FullList
    FullList.instance['_list'] = [];

    // Mock localStorage
    const localStorageMock: { [key: string]: string } = {};
    
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

  describe('singleton pattern', () => {
    it('should have a static instance property', () => {
      expect(ListTemplate.instance).toBeDefined();
      expect(ListTemplate.instance).toBeInstanceOf(ListTemplate);
    });

    it('should return the same instance', () => {
      const instance1 = ListTemplate.instance;
      const instance2 = ListTemplate.instance;
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('ul property', () => {
    it('should reference the listItems element', () => {
      const template = ListTemplate.instance;
      
      expect(template.ul).toBe(mockUl);
      expect(template.ul.id).toBe('listItems');
    });
  });

  describe('clear', () => {
    it('should clear the ul innerHTML', () => {
      const template = ListTemplate.instance;
      mockUl.innerHTML = '<li>Test Item</li>';
      
      template.clear();
      
      expect(mockUl.innerHTML).toBe('');
    });

    it('should clear multiple items', () => {
      const template = ListTemplate.instance;
      mockUl.innerHTML = '<li>Item 1</li><li>Item 2</li><li>Item 3</li>';
      
      template.clear();
      
      expect(mockUl.innerHTML).toBe('');
      expect(mockUl.children.length).toBe(0);
    });

    it('should do nothing if ul is already empty', () => {
      const template = ListTemplate.instance;
      
      template.clear();
      
      expect(mockUl.innerHTML).toBe('');
    });
  });

  describe('render', () => {
    it('should render an empty list', () => {
      const template = ListTemplate.instance;
      const fullList = FullList.instance;
      
      template.render(fullList);
      
      expect(mockUl.children.length).toBe(0);
    });

    it('should render a single item', () => {
      const template = ListTemplate.instance;
      const fullList = FullList.instance;
      const item = new LitsItem('1', 'Test task', false);
      
      fullList['_list'] = [item];
      
      template.render(fullList);
      
      expect(mockUl.children.length).toBe(1);
      
      const li = mockUl.children[0] as HTMLLIElement;
      expect(li.className).toBe('item');
      
      const checkbox = li.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(checkbox).toBeTruthy();
      expect(checkbox.id).toBe('1');
      expect(checkbox.checked).toBe(false);
      
      const label = li.querySelector('label') as HTMLLabelElement;
      expect(label).toBeTruthy();
      expect(label.textContent).toBe('Test task');
      expect(label.htmlFor).toBe('1');
      
      const button = li.querySelector('button') as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.className).toBe('button');
      expect(button.textContent).toBe('x');
    });

    it('should render multiple items', () => {
      const template = ListTemplate.instance;
      const fullList = FullList.instance;
      const item1 = new LitsItem('1', 'Task 1', false);
      const item2 = new LitsItem('2', 'Task 2', true);
      const item3 = new LitsItem('3', 'Task 3', false);
      
      fullList['_list'] = [item1, item2, item3];
      
      template.render(fullList);
      
      expect(mockUl.children.length).toBe(3);
    });

    it('should render items with prepend (newest first)', () => {
      const template = ListTemplate.instance;
      const fullList = FullList.instance;
      const item1 = new LitsItem('1', 'First task');
      const item2 = new LitsItem('2', 'Second task');
      
      fullList['_list'] = [item1, item2];
      
      template.render(fullList);
      
      // Items should be prepended, so the order is reversed
      const firstLi = mockUl.children[0] as HTMLLIElement;
      const firstLabel = firstLi.querySelector('label') as HTMLLabelElement;
      expect(firstLabel.textContent).toBe('Second task');
      
      const secondLi = mockUl.children[1] as HTMLLIElement;
      const secondLabel = secondLi.querySelector('label') as HTMLLabelElement;
      expect(secondLabel.textContent).toBe('First task');
    });

    it('should render checked items correctly', () => {
      const template = ListTemplate.instance;
      const fullList = FullList.instance;
      const item = new LitsItem('1', 'Completed task', true);
      
      fullList['_list'] = [item];
      
      template.render(fullList);
      
      const checkbox = mockUl.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('should clear before rendering', () => {
      const template = ListTemplate.instance;
      const fullList = FullList.instance;
      const item1 = new LitsItem('1', 'Task 1');
      
      fullList['_list'] = [item1];
      
      // First render
      template.render(fullList);
      expect(mockUl.children.length).toBe(1);
      
      // Update list
      const item2 = new LitsItem('2', 'Task 2');
      fullList['_list'] = [item2];
      
      // Second render should clear first
      template.render(fullList);
      expect(mockUl.children.length).toBe(1);
      
      const label = mockUl.querySelector('label') as HTMLLabelElement;
      expect(label.textContent).toBe('Task 2');
    });

    it('should set tabIndex on checkbox', () => {
      const template = ListTemplate.instance;
      const fullList = FullList.instance;
      const item = new LitsItem('1', 'Task');
      
      fullList['_list'] = [item];
      
      template.render(fullList);
      
      const checkbox = mockUl.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(checkbox.tabIndex).toBe(0);
    });
  });

  describe('checkbox change event', () => {
    it('should toggle item checked state on checkbox change', () => {
      const template = ListTemplate.instance;
      const fullList = FullList.instance;
      const item = new LitsItem('1', 'Task', false);
      
      fullList['_list'] = [item];
      
      template.render(fullList);
      
      const checkbox = mockUl.querySelector('input[type="checkbox"]') as HTMLInputElement;
      
      // Simulate change event
      checkbox.click();
      
      expect(item.checked).toBe(true);
    });

    it('should call fullList.save on checkbox change', () => {
      const template = ListTemplate.instance;
      const fullList = FullList.instance;
      const item = new LitsItem('1', 'Task', false);
      
      fullList['_list'] = [item];
      
      const saveSpy = jest.spyOn(fullList, 'save');
      
      template.render(fullList);
      
      const checkbox = mockUl.querySelector('input[type="checkbox"]') as HTMLInputElement;
      
      // Simulate change event
      checkbox.click();
      
      expect(saveSpy).toHaveBeenCalled();
    });

    it('should toggle from checked to unchecked', () => {
      const template = ListTemplate.instance;
      const fullList = FullList.instance;
      const item = new LitsItem('1', 'Task', true);
      
      fullList['_list'] = [item];
      
      template.render(fullList);
      
      const checkbox = mockUl.querySelector('input[type="checkbox"]') as HTMLInputElement;
      
      // Simulate change event
      checkbox.click();
      
      expect(item.checked).toBe(false);
    });
  });

  describe('delete button event', () => {
    it('should remove item on button click', () => {
      const template = ListTemplate.instance;
      const fullList = FullList.instance;
      const item1 = new LitsItem('1', 'Task 1');
      const item2 = new LitsItem('2', 'Task 2');
      
      fullList['_list'] = [item1, item2];
      
      template.render(fullList);
      
      expect(mockUl.children.length).toBe(2);
      
      // Get the delete button for the first item (which is item2 due to prepend)
      const firstLi = mockUl.children[0] as HTMLLIElement;
      const deleteButton = firstLi.querySelector('button') as HTMLButtonElement;
      
      // Simulate click event
      deleteButton.click();
      
      expect(fullList.list.length).toBe(1);
      expect(fullList.list[0].id).toBe('1');
    });

    it('should re-render after deleting an item', () => {
      const template = ListTemplate.instance;
      const fullList = FullList.instance;
      const item = new LitsItem('1', 'Task');
      
      fullList['_list'] = [item];
      
      const renderSpy = jest.spyOn(template, 'render');
      
      template.render(fullList);
      
      // Clear the spy to only track the second render
      renderSpy.mockClear();
      
      const deleteButton = mockUl.querySelector('button') as HTMLButtonElement;
      deleteButton.click();
      
      expect(renderSpy).toHaveBeenCalledWith(fullList);
    });

    it('should handle deleting all items', () => {
      const template = ListTemplate.instance;
      const fullList = FullList.instance;
      const item = new LitsItem('1', 'Task');
      
      fullList['_list'] = [item];
      
      template.render(fullList);
      
      const deleteButton = mockUl.querySelector('button') as HTMLButtonElement;
      deleteButton.click();
      
      expect(fullList.list.length).toBe(0);
      expect(mockUl.children.length).toBe(0);
    });
  });

  describe('integration with FullList', () => {
    it('should work with FullList methods', () => {
      const template = ListTemplate.instance;
      const fullList = FullList.instance;
      
      const item1 = new LitsItem('1', 'Task 1');
      const item2 = new LitsItem('2', 'Task 2');
      
      fullList.addItem(item1);
      fullList.addItem(item2);
      
      template.render(fullList);
      
      expect(mockUl.children.length).toBe(2);
      
      fullList.removeItem('1');
      template.render(fullList);
      
      expect(mockUl.children.length).toBe(1);
      
      fullList.clearList();
      template.render(fullList);
      
      expect(mockUl.children.length).toBe(0);
    });
  });
});
