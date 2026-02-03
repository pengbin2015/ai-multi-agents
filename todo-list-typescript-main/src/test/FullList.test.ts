import { describe, it, expect, beforeEach } from 'vitest'
import FullList from '../models/FullList'
import LitsItem from '../models/ListItem'

describe('FullList', () => {
  // Reset the singleton instance before each test
  beforeEach(() => {
    // Clear the list and localStorage
    FullList.instance.clearList()
  })

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = FullList.instance
      const instance2 = FullList.instance
      
      expect(instance1).toBe(instance2)
    })

    it('should maintain state across instance accesses', () => {
      const instance1 = FullList.instance
      instance1.addItem(new LitsItem('1', 'Test item'))
      
      const instance2 = FullList.instance
      expect(instance2.list.length).toBe(1)
      expect(instance2.list[0].item).toBe('Test item')
    })
  })

  describe('addItem', () => {
    it('should add an item to the list', () => {
      const item = new LitsItem('1', 'First task', false)
      FullList.instance.addItem(item)
      
      expect(FullList.instance.list.length).toBe(1)
      expect(FullList.instance.list[0]).toBe(item)
    })

    it('should add multiple items to the list', () => {
      const item1 = new LitsItem('1', 'First task', false)
      const item2 = new LitsItem('2', 'Second task', false)
      const item3 = new LitsItem('3', 'Third task', true)
      
      FullList.instance.addItem(item1)
      FullList.instance.addItem(item2)
      FullList.instance.addItem(item3)
      
      expect(FullList.instance.list.length).toBe(3)
      expect(FullList.instance.list[0].item).toBe('First task')
      expect(FullList.instance.list[1].item).toBe('Second task')
      expect(FullList.instance.list[2].item).toBe('Third task')
      expect(FullList.instance.list[2].checked).toBe(true)
    })

    it('should persist item to localStorage when added', () => {
      const item = new LitsItem('1', 'Persistent task', false)
      FullList.instance.addItem(item)
      
      const stored = localStorage.getItem('myList')
      expect(stored).not.toBeNull()
      
      const parsed = JSON.parse(stored!)
      expect(parsed.length).toBe(1)
      expect(parsed[0]._item).toBe('Persistent task')
    })
  })

  describe('removeItem', () => {
    it('should remove an item by id', () => {
      const item1 = new LitsItem('1', 'Keep this', false)
      const item2 = new LitsItem('2', 'Remove this', false)
      
      FullList.instance.addItem(item1)
      FullList.instance.addItem(item2)
      
      expect(FullList.instance.list.length).toBe(2)
      
      FullList.instance.removeItem('2')
      
      expect(FullList.instance.list.length).toBe(1)
      expect(FullList.instance.list[0].id).toBe('1')
      expect(FullList.instance.list[0].item).toBe('Keep this')
    })

    it('should do nothing if item id does not exist', () => {
      const item = new LitsItem('1', 'Only item', false)
      FullList.instance.addItem(item)
      
      FullList.instance.removeItem('999')
      
      expect(FullList.instance.list.length).toBe(1)
    })

    it('should persist removal to localStorage', () => {
      const item1 = new LitsItem('1', 'Item 1', false)
      const item2 = new LitsItem('2', 'Item 2', false)
      
      FullList.instance.addItem(item1)
      FullList.instance.addItem(item2)
      
      FullList.instance.removeItem('1')
      
      const stored = localStorage.getItem('myList')
      const parsed = JSON.parse(stored!)
      
      expect(parsed.length).toBe(1)
      expect(parsed[0]._id).toBe('2')
    })
  })

  describe('clearList', () => {
    it('should remove all items from the list', () => {
      FullList.instance.addItem(new LitsItem('1', 'Item 1'))
      FullList.instance.addItem(new LitsItem('2', 'Item 2'))
      FullList.instance.addItem(new LitsItem('3', 'Item 3'))
      
      expect(FullList.instance.list.length).toBe(3)
      
      FullList.instance.clearList()
      
      expect(FullList.instance.list.length).toBe(0)
    })

    it('should persist empty list to localStorage', () => {
      FullList.instance.addItem(new LitsItem('1', 'Item'))
      FullList.instance.clearList()
      
      const stored = localStorage.getItem('myList')
      const parsed = JSON.parse(stored!)
      
      expect(parsed).toEqual([])
    })
  })

  describe('save and load', () => {
    it('should save list to localStorage', () => {
      const item = new LitsItem('1', 'Save test', false)
      FullList.instance.addItem(item)
      
      const stored = localStorage.getItem('myList')
      expect(stored).not.toBeNull()
      
      const parsed = JSON.parse(stored!)
      expect(parsed[0]._id).toBe('1')
      expect(parsed[0]._item).toBe('Save test')
      expect(parsed[0]._checked).toBe(false)
    })

    it('should load list from localStorage', () => {
      // Manually set localStorage
      const testData = [
        { _id: '1', _item: 'Loaded task 1', _checked: false },
        { _id: '2', _item: 'Loaded task 2', _checked: true },
      ]
      localStorage.setItem('myList', JSON.stringify(testData))
      
      // Manually clear the in-memory list without saving
      // @ts-ignore - accessing private property for testing
      FullList.instance._list = []
      
      FullList.instance.load()
      
      expect(FullList.instance.list.length).toBe(2)
      expect(FullList.instance.list[0].item).toBe('Loaded task 1')
      expect(FullList.instance.list[0].checked).toBe(false)
      expect(FullList.instance.list[1].item).toBe('Loaded task 2')
      expect(FullList.instance.list[1].checked).toBe(true)
    })

    it('should handle loading when localStorage is empty', () => {
      localStorage.removeItem('myList')
      
      // Manually clear the in-memory list
      // @ts-ignore - accessing private property for testing
      FullList.instance._list = []
      
      FullList.instance.load()
      
      expect(FullList.instance.list.length).toBe(0)
    })

    it('should preserve checked state when saving and loading', () => {
      const checkedItem = new LitsItem('1', 'Completed', true)
      const uncheckedItem = new LitsItem('2', 'Pending', false)
      
      FullList.instance.addItem(checkedItem)
      FullList.instance.addItem(uncheckedItem)
      
      // Manually clear in-memory list and reload from storage
      // @ts-ignore - accessing private property for testing
      FullList.instance._list = []
      
      FullList.instance.load()
      
      expect(FullList.instance.list.length).toBe(2)
      expect(FullList.instance.list[0].checked).toBe(true)
      expect(FullList.instance.list[1].checked).toBe(false)
    })
  })

  describe('list getter', () => {
    it('should return the current list', () => {
      const item1 = new LitsItem('1', 'Item 1')
      const item2 = new LitsItem('2', 'Item 2')
      
      FullList.instance.addItem(item1)
      FullList.instance.addItem(item2)
      
      const list = FullList.instance.list
      
      expect(list).toBeInstanceOf(Array)
      expect(list.length).toBe(2)
      expect(list[0]).toBe(item1)
      expect(list[1]).toBe(item2)
    })
  })
})
