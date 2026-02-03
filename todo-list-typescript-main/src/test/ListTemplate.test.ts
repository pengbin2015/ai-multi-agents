import { describe, it, expect, beforeEach, vi } from 'vitest'
import FullList from '../models/FullList'
import LitsItem from '../models/ListItem'

// Mock the ListTemplate module to avoid singleton initialization issues
describe('ListTemplate', () => {
  let ListTemplate: any
  
  beforeEach(async () => {
    // Set up a mock DOM structure BEFORE importing ListTemplate
    document.body.innerHTML = `
      <ul id="listItems"></ul>
    `
    
    // Clear module cache and re-import to get fresh instance with new DOM
    vi.resetModules()
    ListTemplate = (await import('../templates/ListTemplate')).default
    
    // Clear the list
    FullList.instance.clearList()
  })

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ListTemplate.instance
      const instance2 = ListTemplate.instance
      
      expect(instance1).toBe(instance2)
    })
  })

  describe('ul property', () => {
    it('should reference the listItems element', () => {
      const template = ListTemplate.instance
      
      expect(template.ul).toBeDefined()
      expect(template.ul.id).toBe('listItems')
      expect(template.ul.tagName).toBe('UL')
    })
  })

  describe('clear', () => {
    it('should remove all children from the ul element', () => {
      const template = ListTemplate.instance
      
      // Add some content
      template.ul.innerHTML = '<li>Item 1</li><li>Item 2</li>'
      expect(template.ul.children.length).toBe(2)
      
      template.clear()
      
      expect(template.ul.children.length).toBe(0)
      expect(template.ul.innerHTML).toBe('')
    })

    it('should handle clearing an already empty list', () => {
      const template = ListTemplate.instance
      
      template.clear()
      
      expect(template.ul.children.length).toBe(0)
    })
  })

  describe('render', () => {
    it('should render an empty list', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      template.render(fullList)
      
      expect(template.ul.children.length).toBe(0)
    })

    it('should render a single unchecked item', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      fullList.addItem(new LitsItem('1', 'Test task', false))
      
      template.render(fullList)
      
      expect(template.ul.children.length).toBe(1)
      
      const li = template.ul.children[0] as HTMLLIElement
      expect(li.className).toBe('item')
      
      const checkbox = li.querySelector('input[type="checkbox"]') as HTMLInputElement
      expect(checkbox).toBeDefined()
      expect(checkbox.id).toBe('1')
      expect(checkbox.checked).toBe(false)
      
      const label = li.querySelector('label') as HTMLLabelElement
      expect(label).toBeDefined()
      expect(label.textContent).toBe('Test task')
      expect(label.htmlFor).toBe('1')
      
      const button = li.querySelector('button') as HTMLButtonElement
      expect(button).toBeDefined()
      expect(button.textContent).toBe('x')
    })

    it('should render a single checked item', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      fullList.addItem(new LitsItem('1', 'Completed task', true))
      
      template.render(fullList)
      
      const checkbox = template.ul.querySelector('input[type="checkbox"]') as HTMLInputElement
      expect(checkbox.checked).toBe(true)
    })

    it('should render multiple items', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      fullList.addItem(new LitsItem('1', 'Task 1', false))
      fullList.addItem(new LitsItem('2', 'Task 2', true))
      fullList.addItem(new LitsItem('3', 'Task 3', false))
      
      template.render(fullList)
      
      expect(template.ul.children.length).toBe(3)
    })

    it('should render items with newest first (prepend)', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      fullList.addItem(new LitsItem('1', 'First', false))
      fullList.addItem(new LitsItem('2', 'Second', false))
      fullList.addItem(new LitsItem('3', 'Third', false))
      
      template.render(fullList)
      
      // Items should be prepended, so order is reversed
      const firstLi = template.ul.children[0] as HTMLLIElement
      const lastLi = template.ul.children[2] as HTMLLIElement
      
      expect(firstLi.querySelector('label')?.textContent).toBe('Third')
      expect(lastLi.querySelector('label')?.textContent).toBe('First')
    })

    it('should clear previous render before rendering new items', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      fullList.addItem(new LitsItem('1', 'Item 1'))
      template.render(fullList)
      expect(template.ul.children.length).toBe(1)
      
      fullList.addItem(new LitsItem('2', 'Item 2'))
      template.render(fullList)
      
      // Should have 2 items, not 3 (no duplication)
      expect(template.ul.children.length).toBe(2)
    })

    it('should attach change event listener to checkbox', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      const item = new LitsItem('1', 'Toggle task', false)
      fullList.addItem(item)
      
      template.render(fullList)
      
      const checkbox = template.ul.querySelector('input[type="checkbox"]') as HTMLInputElement
      
      // Simulate checkbox click
      checkbox.checked = true
      checkbox.dispatchEvent(new Event('change'))
      
      // Item checked state should be toggled
      expect(item.checked).toBe(true)
    })

    it('should attach click event listener to delete button', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      fullList.addItem(new LitsItem('1', 'Delete me', false))
      
      template.render(fullList)
      
      const button = template.ul.querySelector('button') as HTMLButtonElement
      
      // Simulate button click
      button.click()
      
      // Item should be removed from list
      expect(fullList.list.length).toBe(0)
    })
  })

  describe('checked items styling (grey-text feature)', () => {
    it('should render checked items with checkbox checked', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      fullList.addItem(new LitsItem('1', 'Completed item', true))
      
      template.render(fullList)
      
      const checkbox = template.ul.querySelector('input[type="checkbox"]') as HTMLInputElement
      const label = template.ul.querySelector('label') as HTMLLabelElement
      
      // Checkbox should be checked
      expect(checkbox.checked).toBe(true)
      
      // The CSS selector .item>input[type="checkbox"]:checked+label applies grey color
      // We verify the structure is correct for CSS to apply
      expect(checkbox.nextElementSibling).toBe(label)
      expect(label.previousElementSibling).toBe(checkbox)
    })

    it('should maintain proper DOM structure for CSS styling of checked items', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      fullList.addItem(new LitsItem('1', 'Unchecked', false))
      fullList.addItem(new LitsItem('2', 'Checked', true))
      
      template.render(fullList)
      
      const items = template.ul.querySelectorAll('.item')
      
      // Check unchecked item
      const uncheckedItem = Array.from(items).find(item => {
        const label = item.querySelector('label')
        return label?.textContent === 'Unchecked'
      })!
      const uncheckedCheckbox = uncheckedItem.querySelector('input[type="checkbox"]') as HTMLInputElement
      expect(uncheckedCheckbox.checked).toBe(false)
      
      // Check checked item
      const checkedItem = Array.from(items).find(item => {
        const label = item.querySelector('label')
        return label?.textContent === 'Checked'
      })!
      const checkedCheckbox = checkedItem.querySelector('input[type="checkbox"]') as HTMLInputElement
      expect(checkedCheckbox.checked).toBe(true)
    })

    it('should toggle checkbox state when changed', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      const item = new LitsItem('1', 'Toggle test', false)
      fullList.addItem(item)
      
      template.render(fullList)
      
      const checkbox = template.ul.querySelector('input[type="checkbox"]') as HTMLInputElement
      
      // Initially unchecked
      expect(checkbox.checked).toBe(false)
      expect(item.checked).toBe(false)
      
      // Simulate checking
      checkbox.checked = true
      checkbox.dispatchEvent(new Event('change'))
      
      expect(item.checked).toBe(true)
      
      // Simulate unchecking
      checkbox.checked = false
      checkbox.dispatchEvent(new Event('change'))
      
      expect(item.checked).toBe(false)
    })

    it('should apply grey-text CSS class structure to completed items', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      // Add both checked and unchecked items
      fullList.addItem(new LitsItem('1', 'Active task', false))
      fullList.addItem(new LitsItem('2', 'Completed task', true))
      
      template.render(fullList)
      
      const allItems = template.ul.querySelectorAll('.item')
      
      // Verify each item has the correct structure for CSS selector
      allItems.forEach((item) => {
        const checkbox = item.querySelector('input[type="checkbox"]') as HTMLInputElement
        const label = item.querySelector('label') as HTMLLabelElement
        
        // The CSS selector .item>input[type="checkbox"]:checked+label
        // requires that label is the next sibling of checkbox
        expect(checkbox.nextElementSibling).toBe(label)
        
        // Parent element should have 'item' class
        expect(item.className).toBe('item')
      })
    })

    it('should preserve item structure after re-render', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      fullList.addItem(new LitsItem('1', 'Task', false))
      template.render(fullList)
      
      // Get initial structure
      const initialCheckbox = template.ul.querySelector('input[type="checkbox"]') as HTMLInputElement
      const initialLabel = template.ul.querySelector('label') as HTMLLabelElement
      
      expect(initialCheckbox.nextElementSibling).toBe(initialLabel)
      
      // Re-render
      template.render(fullList)
      
      // Structure should remain the same
      const newCheckbox = template.ul.querySelector('input[type="checkbox"]') as HTMLInputElement
      const newLabel = template.ul.querySelector('label') as HTMLLabelElement
      
      expect(newCheckbox.nextElementSibling).toBe(newLabel)
    })
  })

  describe('accessibility', () => {
    it('should set tabIndex on checkbox for keyboard navigation', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      fullList.addItem(new LitsItem('1', 'Accessible item'))
      
      template.render(fullList)
      
      const checkbox = template.ul.querySelector('input[type="checkbox"]') as HTMLInputElement
      expect(checkbox.tabIndex).toBe(0)
    })

    it('should associate label with checkbox via htmlFor', () => {
      const template = ListTemplate.instance
      const fullList = FullList.instance
      
      fullList.addItem(new LitsItem('42', 'Label test'))
      
      template.render(fullList)
      
      const checkbox = template.ul.querySelector('input[type="checkbox"]') as HTMLInputElement
      const label = template.ul.querySelector('label') as HTMLLabelElement
      
      expect(checkbox.id).toBe('42')
      expect(label.htmlFor).toBe('42')
    })
  })
})
