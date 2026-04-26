import { describe, it, expect } from 'vitest'
import { validateBuild } from '../server/utils/compatibility'
import type { BikeComponent } from '../types/bike'

describe('CompatibilityEngine', () => {
  const createComponent = (category: string, data: Partial<BikeComponent>): BikeComponent => ({
    id: Math.random(),
    category,
    model: 'Test Model',
    price: 0,
    ...data
  })

  it('should detect mismatched drivetrain speeds', () => {
    const build = [
      createComponent('Cassete', { speeds: '12v' }),
      createComponent('Câmbio Traseiro', { speeds: '11v' })
    ]
    const issues = validateBuild(build)
    expect(issues).toHaveLength(1)
    expect(issues[0].severity).toBe('error')
    expect(issues[0].message).toContain('12v, 11v')
  })

  it('should detect non-boost hub on boost frame', () => {
    const build = [
      createComponent('Quadro', { axleType: 'Boost 148mm' }),
      createComponent('Cubo', { axleType: 'QR 135mm' })
    ]
    const issues = validateBuild(build)
    expect(issues).toHaveLength(1)
    expect(issues[0].severity).toBe('error')
    expect(issues[0].message).toContain('Quadro Boost exige cubo Boost 148mm')
  })

  it('should warn about Over fork in Tapered frame', () => {
    const build = [
      createComponent('Quadro', { steeringType: 'Tapered' }),
      createComponent('Suspensão', { steeringType: 'Over' })
    ]
    const issues = validateBuild(build)
    expect(issues).toHaveLength(1)
    expect(issues[0].severity).toBe('warning')
    expect(issues[0].message).toContain('exige caixa de direção com redutor')
  })

  it('should detect Tapered fork in Over frame as error', () => {
    const build = [
      createComponent('Quadro', { steeringType: 'Over' }),
      createComponent('Suspensão', { steeringType: 'Tapered' })
    ]
    const issues = validateBuild(build)
    expect(issues).toHaveLength(1)
    expect(issues[0].severity).toBe('error')
    expect(issues[0].message).toContain('não suporta suspensão')
  })

  it('should be valid for a consistent build', () => {
    const build = [
      createComponent('Quadro', { axleType: 'Boost 148mm', steeringType: 'Tapered' }),
      createComponent('Cubo', { axleType: 'Boost 148mm' }),
      createComponent('Suspensão', { steeringType: 'Tapered' }),
      createComponent('Cassete', { speeds: '12v' }),
      createComponent('Câmbio Traseiro', { speeds: '12v' })
    ]
    const issues = validateBuild(build)
    expect(issues).toHaveLength(0)
  })
})
