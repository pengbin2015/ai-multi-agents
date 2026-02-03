import LitsItem from '../ListItem';

describe('LitsItem', () => {
  describe('constructor', () => {
    it('should create an item with default values', () => {
      const item = new LitsItem();
      
      expect(item.id).toBe('');
      expect(item.item).toBe('');
      expect(item.checked).toBe(false);
    });

    it('should create an item with provided values', () => {
      const item = new LitsItem('1', 'Test task', true);
      
      expect(item.id).toBe('1');
      expect(item.item).toBe('Test task');
      expect(item.checked).toBe(true);
    });

    it('should create an item with partial values', () => {
      const item = new LitsItem('2', 'Another task');
      
      expect(item.id).toBe('2');
      expect(item.item).toBe('Another task');
      expect(item.checked).toBe(false);
    });
  });

  describe('id getter and setter', () => {
    it('should get the id value', () => {
      const item = new LitsItem('123', 'Task');
      
      expect(item.id).toBe('123');
    });

    it('should set the id value', () => {
      const item = new LitsItem();
      item.id = '456';
      
      expect(item.id).toBe('456');
    });

    it('should update id to empty string', () => {
      const item = new LitsItem('123', 'Task');
      item.id = '';
      
      expect(item.id).toBe('');
    });
  });

  describe('item getter and setter', () => {
    it('should get the item value', () => {
      const item = new LitsItem('1', 'Buy groceries');
      
      expect(item.item).toBe('Buy groceries');
    });

    it('should set the item value', () => {
      const item = new LitsItem();
      item.item = 'Walk the dog';
      
      expect(item.item).toBe('Walk the dog');
    });

    it('should update item text', () => {
      const item = new LitsItem('1', 'Old task');
      item.item = 'Updated task';
      
      expect(item.item).toBe('Updated task');
    });
  });

  describe('checked getter and setter', () => {
    it('should get the checked value', () => {
      const item = new LitsItem('1', 'Task', false);
      
      expect(item.checked).toBe(false);
    });

    it('should set the checked value to true', () => {
      const item = new LitsItem('1', 'Task', false);
      item.checked = true;
      
      expect(item.checked).toBe(true);
    });

    it('should toggle checked value', () => {
      const item = new LitsItem('1', 'Task', false);
      
      item.checked = true;
      expect(item.checked).toBe(true);
      
      item.checked = false;
      expect(item.checked).toBe(false);
    });
  });

  describe('implements Item interface', () => {
    it('should have all required properties', () => {
      const item = new LitsItem('1', 'Test', true);
      
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('item');
      expect(item).toHaveProperty('checked');
    });
  });
});
