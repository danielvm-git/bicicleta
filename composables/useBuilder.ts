import { ref, computed } from 'vue'
import type { BikeComponent } from '../types/bike'

export const useBuilder = () => {
  const selectedComponents = useState<Record<string, BikeComponent>>('builder-selected-components', () => ({}))

  const selectComponent = (component: BikeComponent) => {
    selectedComponents.value[component.category] = component
  }

  const removeComponent = (category: string) => {
    delete selectedComponents.value[category]
  }

  const totalPrice = computed(() => {
    return Object.values(selectedComponents.value).reduce((total, component) => {
      const price = typeof component.price === 'string' ? parseFloat(component.price) : component.price
      return total + (isNaN(price) ? 0 : price)
    }, 0)
  })

  const totalWeight = computed(() => {
    const total = Object.values(selectedComponents.value).reduce((total, component) => {
      const weight = typeof component.weight === 'string' ? parseFloat(component.weight) : component.weight
      return total + (isNaN(weight || 0) ? 0 : (weight || 0))
    }, 0)
    return Math.round(total * 1000) / 1000
  })

  const compatibilityIssues = computed(() => {
    return validateBuild(Object.values(selectedComponents.value))
  })

  const clearBuild = () => {
    selectedComponents.value = {}
  }

  const checkCompatibility = (component: BikeComponent): { compatible: boolean; reason?: string } => {
    return checkComponentCompatibility(component, Object.values(selectedComponents.value))
  }

  return {
    selectedComponents,
    selectComponent,
    removeComponent,
    totalPrice,
    totalWeight,
    compatibilityIssues,
    checkCompatibility,
    clearBuild
  }
}

