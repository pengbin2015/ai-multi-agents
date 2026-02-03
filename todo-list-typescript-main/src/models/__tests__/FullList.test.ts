import FullList from '../FullList';
import LitsItem from '../ListItem';

describe('FullList', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Reset singleton instance before each test
    // Since it's a singleton, we need to clear the list
    FullList.instance['_list'] = [];

    // Mock localStorage
    localStorageMock = {};
    
    global.Storage.prototype.getItem = jest.fn((key: string) => {
      return localStorageMock[key] || null;
    });
    
    global.Storage.prototype.setItem = jest.fn((key: string, value: string) => {
      localStorageMock[key] = value;
    });
    
    global.Storage.prototype.clear = jest.fn(() => {
      localStorageMock = {};
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('singleton pattern', () => {
    it('should have a static instance property', () => {
      expect(FullList.instance).toBeDefined();
      expect(FullList.instance).toBeInstanceOf(FullList);
    });

    it('should return the same instance', () => {
      const instance1 = FullList.instance;
      const instance2 = FullList.instance;
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('list getter', () => {
    it('should return an empty array initially', () => {
      const fullList = FullList.instance;
      
      expect(fullList.list).toEqual([]);
      expect(fullList.list).toHaveLength(0);
    });

    it('should return the list of items', () => {
      const fullList = FullList.instance;
      const item1 = new LitsItem('1', 'Task 1');
      const item2 = new LitsItem('2', 'Task 2');
      
      fullList['_list'] = [item1, item2];
      
      expect(fullList.list).toHaveLength(2);
      expect(fullList.list[0]).toBe(item1);
      expect(fullList.list[1]).toBe(item2);
    });
  });

  describe('addItem', () => {
    it('should add an item to the list', () => {
      const fullList = FullList.instance;
      const item = new LitsItem('1', 'New task');
      
      fullList.addItem(item);
      
      expect(fullList.list).toHaveLength(1);
      expect(fullList.list[0]).toBe(item);
    });

    it('should add multiple items to the list', () => {
      const fullList = FullList.instance;
      const item1 = new LitsItem('1', 'Task 1');
      const item2 = new LitsItem('2', 'Task 2');
      const item3 = new LitsItem('3', 'Task 3');
      
      fullList.addItem(item1);
      fullList.addItem(item2);
      fullList.addItem(item3);
      
      expect(fullList.list).toHaveLength(3);
      expect(fullList.list).toEqual([item1, item2, item3]);
    });

    it('should call save after adding an item', () => {
      const fullList = FullList.instance;
      const saveSpy = jest.spyOn(fullList, 'save');
      const item = new LitsItem('1', 'Task');
      
      fullList.addItem(item);
      
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it('should persist to localStorage when adding an item', () => {
      const fullList = FullList.instance;
      const item = new LitsItem('1', 'Task');
      
      fullList.addItem(item);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'myList',
        expect.any(String)
      );
    });
  });

  describe('removeItem', () => {
    it('should remove an item by id', () => {
      const fullList = FullList.instance;
      const item1 = new LitsItem('1', 'Task 1');
      const item2 = new LitsItem('2', 'Task 2');
      const item3 = new LitsItem('3', 'Task 3');
      
      fullList['_list'] = [item1, item2, item3];
      
      fullList.removeItem('2');
      
      expect(fullList.list).toHaveLength(2);
      expect(fullList.list).toEqual([item1, item3]);
    });

    it('should not affect the list if id does not exist', () => {
      const fullList = FullList.instance;
      const item1 = new LitsItem('1', 'Task 1');
      const item2 = new LitsItem('2', 'Task 2');
      
      fullList['_list'] = [item1, item2];
      
      fullList.removeItem('999');
      
      expect(fullList.list).toHaveLength(2);
      expect(fullList.list).toEqual([item1, item2]);
    });

    it('should handle removing from an empty list', () => {
      const fullList = FullList.instance;
      
      fullList.removeItem('1');
      
      expect(fullList.list).toHaveLength(0);
    });

    it('should call save after removing an item', () => {
      const fullList = FullList.instance;
      const item = new LitsItem('1', 'Task');
      fullList['_list'] = [item];
      
      const saveSpy = jest.spyOn(fullList, 'save');
      
      fullList.removeItem('1');
      
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it('should persist to localStorage when removing an item', () => {
      const fullList = FullList.instance;
      const item = new LitsItem('1', 'Task');
      fullList['_list'] = [item];
      
      fullList.removeItem('1');
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'myList',
        expect.any(String)
      );
    });
  });

  describe('clearList', () => {
    it('should clear all items from the list', () => {
      const fullList = FullList.instance;
      const item1 = new LitsItem('1', 'Task 1');
      const item2 = new LitsItem('2', 'Task 2');
      
      fullList['_list'] = [item1, item2];
      
      fullList.clearList();
      
      expect(fullList.list).toHaveLength(0);
      expect(fullList.list).toEqual([]);
    });

    it('should handle clearing an empty list', () => {
      const fullList = FullList.instance;
      
      fullList.clearList();
      
      expect(fullList.list).toHaveLength(0);
    });

    it('should call save after clearing the list', () => {
      const fullList = FullList.instance;
      const saveSpy = jest.spyOn(fullList, 'save');
      
      fullList.clearList();
      
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it('should persist to localStorage when clearing the list', () => {
      const fullList = FullList.instance;
      
      fullList.clearList();
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'myList',
        '[]'
      );
    });
  });

  describe('save', () => {
    it('should save the list to localStorage', () => {
      const fullList = FullList.instance;
      const item1 = new LitsItem('1', 'Task 1', false);
      const item2 = new LitsItem('2', 'Task 2', true);
      
      fullList['_list'] = [item1, item2];
      
      fullList.save();
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'myList',
        expect.any(String)
      );
      
      const savedData = JSON.parse(localStorageMock['myList']);
      expect(savedData).toHaveLength(2);
      expect(savedData[0]).toHaveProperty('_id', '1');
      expect(savedData[0]).toHaveProperty('_item', 'Task 1');
      expect(savedData[0]).toHaveProperty('_checked', false);
    });

    it('should save an empty list to localStorage', () => {
      const fullList = FullList.instance;
      
      fullList.save();
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'myList',
        '[]'
      );
    });
  });

  describe('load', () => {
    it('should load items from localStorage', () => {
      const fullList = FullList.instance;
      const storedData = JSON.stringify([
        { _id: '1', _item: 'Task 1', _checked: false },
        { _id: '2', _item: 'Task 2', _checked: true },
      ]);
      
      localStorageMock['myList'] = storedData;
      
      fullList.load();
      
      expect(fullList.list).toHaveLength(2);
      expect(fullList.list[0].id).toBe('1');
      expect(fullList.list[0].item).toBe('Task 1');
      expect(fullList.list[0].checked).toBe(false);
      expect(fullList.list[1].id).toBe('2');
      expect(fullList.list[1].item).toBe('Task 2');
      expect(fullList.list[1].checked).toBe(true);
    });

    it('should handle null localStorage value', () => {
      const fullList = FullList.instance;
      
      fullList.load();
      
      expect(fullList.list).toHaveLength(0);
      expect(localStorage.getItem).toHaveBeenCalledWith('myList');
    });

    it('should handle empty localStorage', () => {
      const fullList = FullList.instance;
      localStorageMock['myList'] = '[]';
      
      fullList.load();
      
      expect(fullList.list).toHaveLength(0);
    });

    it('should call addItem which saves when loading items', () => {
      const fullList = FullList.instance;
      const storedData = JSON.stringify([
        { _id: '1', _item: 'Task 1', _checked: false },
      ]);
      
      localStorageMock['myList'] = storedData;
      
      // Clear the setItem calls from previous operations
      jest.clearAllMocks();
      
      fullList.load();
      
      // load() calls addItem() which calls save()
      expect(localStorage.getItem).toHaveBeenCalledWith('myList');
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should create LitsItem instances when loading', () => {
      const fullList = FullList.instance;
      const storedData = JSON.stringify([
        { _id: '1', _item: 'Task 1', _checked: false },
      ]);
      
      localStorageMock['myList'] = storedData;
      
      fullList.load();
      
      expect(fullList.list[0]).toBeInstanceOf(LitsItem);
    });
  });

  describe('integration with LitsItem', () => {
    it('should maintain item properties through save and load cycle', () => {
      const fullList = FullList.instance;
      const item1 = new LitsItem('1', 'Buy milk', false);
      const item2 = new LitsItem('2', 'Walk dog', true);
      
      fullList.addItem(item1);
      fullList.addItem(item2);
      
      // Clear the list and reload
      fullList['_list'] = [];
      fullList.load();
      
      expect(fullList.list).toHaveLength(2);
      expect(fullList.list[0].id).toBe('1');
      expect(fullList.list[0].item).toBe('Buy milk');
      expect(fullList.list[0].checked).toBe(false);
      expect(fullList.list[1].id).toBe('2');
      expect(fullList.list[1].item).toBe('Walk dog');
      expect(fullList.list[1].checked).toBe(true);
    });
  });
});
