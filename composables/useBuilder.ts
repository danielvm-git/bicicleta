import { ref, computed } from 'vue'

export interface BikeComponent {
  id: number;
  category: string;
  model: string;
  brand?: string | null;
  line?: string | null;
  link?: string | null;
  price: string | number;
}

export const useBuilder = () => {
  const selectedComponents = ref<Record<string, BikeComponent>>({})

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

  const clearBuild = () => {
    selectedComponents.value = {}
  }

  return {
    selectedComponents,
    selectComponent,
    removeComponent,
    totalPrice,
    clearBuild
  }
}
