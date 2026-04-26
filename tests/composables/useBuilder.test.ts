import { describe, it, expect, beforeEach } from 'vitest'
import { useBuilder } from '~/composables/useBuilder'

describe('useBuilder', () => {
  let builder: ReturnType<typeof useBuilder>

  beforeEach(() => {
    builder = useBuilder()
    builder.clearBuild()
  })

  it('should start with an empty build', () => {
    expect(builder.selectedComponents.value).toEqual({})
    expect(builder.totalPrice.value).toBe(0)
  })

  it('should persist state across different instances', () => {
    const component = {
      id: 1,
      category: 'Quadro',
      model: 'Absolute Nero',
      price: 500
    }
    
    builder.selectComponent(component)
    
    // Get a new instance
    const newBuilder = useBuilder()
    expect(newBuilder.selectedComponents.value['Quadro']).toEqual(component)
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

  it('should calculate total weight', () => {
    builder.selectComponent({
      id: 1,
      category: 'Quadro',
      model: 'Nero',
      price: 500,
      weight: '1.800'
    })
    builder.selectComponent({
      id: 2,
      category: 'Suspensão',
      model: 'Prime',
      price: 300.50,
      weight: '2.100'
    })

    expect(builder.totalWeight.value).toBe(3.900)
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

  it('should detect compatibility errors for mixed speeds', () => {
    builder.selectComponent({
      id: 1,
      category: 'Cassete',
      model: '12v Cassette',
      price: 200,
      speeds: '12v'
    })
    builder.selectComponent({
      id: 2,
      category: 'Câmbio Traseiro',
      model: '11v Derailleur',
      price: 150,
      speeds: '11v'
    })

    expect(builder.compatibilityErrors.value.length).toBeGreaterThan(0)
    expect(builder.compatibilityErrors.value[0]).toContain('Incompatibilidade de velocidades')
    expect(builder.compatibilityErrors.value[0]).toContain('12v')
    expect(builder.compatibilityErrors.value[0]).toContain('11v')
  })

  it('should not report errors for matching speeds', () => {
    builder.selectComponent({
      id: 1,
      category: 'Cassete',
      model: '12v Cassette',
      price: 200,
      speeds: '12v'
    })
    builder.selectComponent({
      id: 2,
      category: 'Câmbio Traseiro',
      model: '12v Derailleur',
      price: 150,
      speeds: '12v'
    })

    expect(builder.compatibilityErrors.value.length).toBe(0)
  })

  it('should detect axle incompatibility', () => {
    builder.selectComponent({
      id: 1,
      category: 'Quadro',
      model: 'Boost Frame',
      price: 500,
      axleType: 'Boost 148mm'
    })
    builder.selectComponent({
      id: 2,
      category: 'Cubo',
      model: 'QR Hub',
      price: 100,
      axleType: 'Quick Release'
    })

    expect(builder.compatibilityErrors.value).toContain('Cubo traseiro incompatível: Quadro Boost exige cubo Boost 148mm.')
  })

  it('should detect steering incompatibility', () => {
    builder.selectComponent({
      id: 1,
      category: 'Quadro',
      model: 'Over Frame',
      price: 500,
      steeringType: 'Over'
    })
    builder.selectComponent({
      id: 2,
      category: 'Suspensão',
      model: 'Tapered Fork',
      price: 300,
      steeringType: 'Tapered'
    })

    expect(builder.compatibilityErrors.value).toContain("Direção incompatível: Quadro 'Over' não suporta suspensão 'Tapered'.")
  })

  it('should detect headset incompatibility', () => {
    builder.selectComponent({
      id: 1,
      category: 'Quadro',
      model: 'Over Frame',
      price: 500,
      steeringType: 'Over'
    })
    builder.selectComponent({
      id: 2,
      category: 'Caixa de Direção',
      model: 'Tapered Headset ZS44/56',
      price: 50
    })

    expect(builder.compatibilityErrors.value).toContain("Caixa de Direção incompatível: Quadro 'Over' (44mm) não suporta caixa 'Tapered'.")
  })

  it('should report warning for straight fork in tapered frame', () => {
    builder.selectComponent({
      id: 1,
      category: 'Quadro',
      model: 'Tapered Frame',
      price: 500,
      steeringType: 'Tapered'
    })
    builder.selectComponent({
      id: 2,
      category: 'Suspensão',
      model: 'Straight Fork',
      price: 300,
      steeringType: 'Over'
    })

    expect(builder.compatibilityErrors.value).toContain("Aviso: Suspensão 'Over' em quadro 'Tapered' exige caixa de direção com redutor.")
  })
})
