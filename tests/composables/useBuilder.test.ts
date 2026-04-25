import { describe, it, expect, beforeEach } from 'vitest'
import { useBuilder } from '~/composables/useBuilder'

describe('useBuilder', () => {
  let builder: ReturnType<typeof useBuilder>

  beforeEach(() => {
    builder = useBuilder()
  })

  it('should start with an empty build', () => {
    expect(builder.selectedComponents.value).toEqual({})
    expect(builder.totalPrice.value).toBe(0)
  })

  it('should select a component', () => {
    const component = {
      id: 1,
      category: 'Quadro',
      model: 'Absolute Nero',
      price: '500.00'
    }

    builder.selectComponent(component)
    expect(builder.selectedComponents.value['Quadro']).toEqual(component)
    expect(builder.totalPrice.value).toBe(500)
  })

  it('should replace a component in the same category', () => {
    const comp1 = {
      id: 1,
      category: 'Quadro',
      model: 'Absolute Nero',
      price: '500.00'
    }
    const comp2 = {
      id: 2,
      category: 'Quadro',
      model: 'Absolute Wild',
      price: '700.00'
    }

    builder.selectComponent(comp1)
    builder.selectComponent(comp2)
    
    expect(builder.selectedComponents.value['Quadro']).toEqual(comp2)
    expect(builder.totalPrice.value).toBe(700)
  })

  it('should calculate total price for multiple categories', () => {
    builder.selectComponent({
      id: 1,
      category: 'Quadro',
      model: 'Nero',
      price: 500
    })
    builder.selectComponent({
      id: 2,
      category: 'Suspensão',
      model: 'Prime',
      price: 300.50
    })

    expect(builder.totalPrice.value).toBe(800.50)
  })

  it('should remove a component', () => {
    builder.selectComponent({
      id: 1,
      category: 'Quadro',
      model: 'Nero',
      price: 500
    })
    builder.removeComponent('Quadro')
    expect(builder.selectedComponents.value['Quadro']).toBeUndefined()
    expect(builder.totalPrice.value).toBe(0)
  })

  it('should clear the build', () => {
    builder.selectComponent({
      id: 1,
      category: 'Quadro',
      model: 'Nero',
      price: 500
    })
    builder.clearBuild()
    expect(builder.selectedComponents.value).toEqual({})
    expect(builder.totalPrice.value).toBe(0)
  })
})
