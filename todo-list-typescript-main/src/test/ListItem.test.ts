import { describe, it, expect } from 'vitest'
import LitsItem from '../models/ListItem'

describe('ListItem', () => {
  describe('constructor', () => {
    it('should create an item with default values', () => {
      const item = new LitsItem()
      
      expect(item.id).toBe('')
      expect(item.item).toBe('')
      expect(item.checked).toBe(false)
    })

    it('should create an item with provided values', () => {
      const item = new LitsItem('1', 'Test todo', true)
      
      expect(item.id).toBe('1')
      expect(item.item).toBe('Test todo')
      expect(item.checked).toBe(true)
    })

    it('should create an unchecked item by default when only id and text provided', () => {
      const item = new LitsItem('2', 'Another todo')
      
      expect(item.id).toBe('2')
      expect(item.item).toBe('Another todo')
      expect(item.checked).toBe(false)
    })
  })

  describe('getters and setters', () => {
    it('should get and set id', () => {
      const item = new LitsItem()
      
      item.id = '42'
      expect(item.id).toBe('42')
    })

    it('should get and set item text', () => {
      const item = new LitsItem()
      
      item.item = 'Buy groceries'
      expect(item.item).toBe('Buy groceries')
    })

    it('should get and set checked status', () => {
      const item = new LitsItem('1', 'Test')
      
      expect(item.checked).toBe(false)
      
      item.checked = true
      expect(item.checked).toBe(true)
      
      item.checked = false
      expect(item.checked).toBe(false)
    })
  })

  describe('checked state transitions', () => {
    it('should support transitioning from unchecked to checked', () => {
      const item = new LitsItem('1', 'Task to complete', false)
      
      expect(item.checked).toBe(false)
      item.checked = true
      expect(item.checked).toBe(true)
    })

    it('should support transitioning from checked to unchecked', () => {
      const item = new LitsItem('1', 'Completed task', true)
      
      expect(item.checked).toBe(true)
      item.checked = false
      expect(item.checked).toBe(false)
    })

    it('should handle multiple state transitions', () => {
      const item = new LitsItem('1', 'Toggle task')
      
      expect(item.checked).toBe(false)
      
      item.checked = true
      expect(item.checked).toBe(true)
      
      item.checked = false
      expect(item.checked).toBe(false)
      
      item.checked = true
      expect(item.checked).toBe(true)
    })
  })

  describe('Item interface compliance', () => {
    it('should implement the Item interface', () => {
      const item = new LitsItem('1', 'Interface test', false)
      
      // Verify all Item interface properties are accessible
      expect(typeof item.id).toBe('string')
      expect(typeof item.item).toBe('string')
      expect(typeof item.checked).toBe('boolean')
    })
  })
})
