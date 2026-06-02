import type { ItemInstance } from '@/models/types'

export interface Preset {
  id: string
  name: string
  emoji: string
  description: string
  weightCap: number
  lockedWater: number       // minimum water in liters
  lockedBiscuit: number     // minimum biscuit count
  defaultItems: ItemInstance[]
  initialSpeed: number
}

function item(defId: string, count: number = 1): ItemInstance[] {
  return Array.from({ length: count }, () => ({
    defId,
    damaged: false,
    ...(defId === 'stove' ? { fuelCharges: 3 } : {}),
  }))
}

export const PRESETS: Preset[] = [
  {
    id: 'light', name: '轻装速通', emoji: '🏃',
    description: '押注速度，赌运气好。没有保暖、没有绳索——冬季几乎必死。',
    weightCap: 10, lockedWater: 2, lockedBiscuit: 1, initialSpeed: 4,
    defaultItems: [
      ...item('water', 2),        // 2
      ...item('biscuit', 1),      // 1
      ...item('gel', 2),          // 1
      ...item('firstaid', 1),     // 1
      ...item('pole', 1),         // 1
      ...item('gps', 1),          // 2
      ...item('raincoat', 1),     // 1
      ...item('drybag', 1),       // 0.5  = 9.5
    ],
  },
  {
    id: 'balanced', name: '均衡穿越', emoji: '⚖️',
    description: '覆盖大多数风险，但保暖/绳索/炉具三选二。核心取舍在这里。',
    weightCap: 18, lockedWater: 3, lockedBiscuit: 2, initialSpeed: 3,
    defaultItems: [
      ...item('water', 3),        // 3
      ...item('biscuit', 2),      // 2
      ...item('meal', 1),         // 1.5
      ...item('gel', 1),          // 0.5
      ...item('purifier', 1),     // 0.5
      ...item('firstaid', 1),     // 1
      ...item('altitude_med', 1), // 1
      ...item('pole', 1),         // 1
      ...item('gps', 1),          // 2
      ...item('raincoat', 1),     // 1
      ...item('drybag', 1),       // 0.5
      ...item('warm_clothes', 1), // 3  = 18.0
    ],
  },
  {
    id: 'heavy', name: '重装多日', emoji: '🏋️',
    description: '覆盖全部核心风险，代价是速度=2。遇到的事件最多、天气变化最多。',
    weightCap: 26, lockedWater: 4, lockedBiscuit: 3, initialSpeed: 2,
    defaultItems: [
      ...item('water', 4),        // 4
      ...item('biscuit', 3),      // 3
      ...item('meal', 2),         // 3
      ...item('gel', 1),          // 0.5
      ...item('purifier', 1),     // 0.5
      ...item('firstaid', 1),     // 1
      ...item('altitude_med', 1), // 1
      ...item('battery', 1),      // 1
      ...item('pole', 1),         // 1
      ...item('gps', 1),          // 2
      ...item('raincoat', 1),     // 1
      ...item('drybag', 1),       // 0.5
      ...item('warm_clothes', 1), // 3
      ...item('rope', 1),         // 3   = 25.5
    ],
  },
]

export function getPreset(id: string): Preset | undefined {
  return PRESETS.find(p => p.id === id)
}
