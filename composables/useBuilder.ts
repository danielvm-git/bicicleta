import { ref, computed } from 'vue'

export interface BikeComponent {
  id: number;
  category: string;
  model: string;
  brand?: string | null;
  line?: string | null;
  link?: string | null;
  price: string | number;
  weight?: string | null;
  speeds?: string | null;
  steeringType?: string | null;
  axleType?: string | null;
  suspensionTravel?: string | null;
}

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

  const compatibilityErrors = computed(() => {
    const errors: string[] = []
    const comps = Object.values(selectedComponents.value)
    
    // 1. Drivetrain speeds check
    const drivetrainCategories = ['Cassete', 'Câmbio Traseiro', 'Câmbio Dianteiro', 'Alavanca de Câmbio', 'Transmissão']
    const selectedSpeeds = comps
      .filter(c => drivetrainCategories.includes(c.category) && c.speeds)
      .map(c => c.speeds)
    
    const uniqueSpeeds = new Set(selectedSpeeds)
    if (uniqueSpeeds.size > 1) {
      errors.push(`Incompatibilidade de velocidades: misturando ${Array.from(uniqueSpeeds).join(', ')}`)
    }

    // 2. Rear Axle check (Quadro vs Cubo)
    const frame = comps.find(c => c.category === 'Quadro')
    const hubs = comps.filter(c => c.category === 'Cubo')
    
    if (frame?.axleType?.includes('Boost 148mm')) {
      const nonBoostHub = hubs.find(h => h.axleType && !h.axleType.includes('148'))
      if (nonBoostHub) {
        errors.push(`Cubo traseiro incompatível: Quadro Boost exige cubo Boost 148mm.`)
      }
    }

    // 3. Steering check (Quadro vs Suspensão)
    const suspension = comps.find(c => c.category === 'Suspensão')
    const headset = comps.find(c => c.category === 'Caixa de Direção')

    if (frame?.steeringType && suspension?.steeringType) {
      if (frame.steeringType === 'Over' && suspension.steeringType === 'Tapered') {
        errors.push(`Direção incompatível: Quadro 'Over' não suporta suspensão 'Tapered'.`)
      }
      if (frame.steeringType === 'Tapered' && suspension.steeringType === 'Over') {
        errors.push(`Aviso: Suspensão 'Over' em quadro 'Tapered' exige caixa de direção com redutor.`)
      }
    }

    if (headset?.model && frame?.steeringType) {
      const headsetModel = headset.model.toLowerCase()
      const isHeadsetTapered = headsetModel.includes('52') || headsetModel.includes('56') || headsetModel.includes('tapered')
      if (frame.steeringType === 'Over' && isHeadsetTapered) {
        errors.push(`Caixa de Direção incompatível: Quadro 'Over' (44mm) não suporta caixa 'Tapered'.`)
      }
    }
    
    return errors
  })

  const clearBuild = () => {
    selectedComponents.value = {}
  }

  const checkCompatibility = (component: BikeComponent): { compatible: boolean; reason?: string } => {
    const comps = Object.values(selectedComponents.value)
    const frame = comps.find(c => c.category === 'Quadro')
    
    // 1. Drivetrain speeds
    const drivetrainCategories = ['Cassete', 'Câmbio Traseiro', 'Câmbio Dianteiro', 'Alavanca de Câmbio', 'Transmissão']
    if (drivetrainCategories.includes(component.category) && component.speeds) {
      const existing = comps.find(c => drivetrainCategories.includes(c.category) && c.speeds)
      if (existing && existing.speeds !== component.speeds) {
        return { compatible: false, reason: `Exige ${existing.speeds}` }
      }
    }

    // 2. Rear Axle (Hub vs Frame)
    if (component.category === 'Cubo' && frame?.axleType?.includes('Boost 148mm')) {
      if (component.axleType && !component.axleType.includes('148')) {
        return { compatible: false, reason: 'Exige Boost 148mm' }
      }
    }
    if (component.category === 'Quadro' && component.axleType?.includes('Boost 148mm')) {
      const hub = comps.find(c => c.category === 'Cubo')
      if (hub?.axleType && !hub.axleType.includes('148')) {
        return { compatible: false, reason: 'Incompatível com Cubo QR' }
      }
    }

    // 3. Steering
    if (component.category === 'Suspensão' && frame?.steeringType === 'Over' && component.steeringType === 'Tapered') {
      return { compatible: false, reason: 'Tapered em Quadro Over' }
    }

    return { compatible: true }
  }

  return {
    selectedComponents,
    selectComponent,
    removeComponent,
    totalPrice,
    totalWeight,
    compatibilityErrors,
    checkCompatibility,
    clearBuild
  }
}
