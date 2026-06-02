import type { ItemDef } from '@/models/types'

export const ITEMS: Record<string, ItemDef> = {
  water: {
    id: 'water', name: '水(1L)', emoji: '💧', weight: 1,
    durabilityType: 'consumable', description: '一升饮用水。生存的基础。',
  },
  biscuit: {
    id: 'biscuit', name: '压缩饼干', emoji: '🍪', weight: 1,
    durabilityType: 'consumable', description: '高热量压缩饼干，一份可提供一餐。',
  },
  meal: {
    id: 'meal', name: '热量餐', emoji: '🍱', weight: 1.5,
    durabilityType: 'consumable', description: '自热米饭或面条，热量更高。',
  },
  gel: {
    id: 'gel', name: '能量胶', emoji: '⚡', weight: 0.5,
    durabilityType: 'consumable', description: '快速补充能量的凝胶，关键时刻能救命。',
  },
  purifier: {
    id: 'purifier', name: '净水片', emoji: '💊', weight: 0.5,
    durabilityType: 'consumable', description: '可净化野外水源。夏季特别有用。',
  },
  firstaid: {
    id: 'firstaid', name: '急救包', emoji: '🩹', weight: 1,
    durabilityType: 'consumable', description: '绷带、消毒液、冰袋。处理扭伤和外伤。',
  },
  altitude_med: {
    id: 'altitude_med', name: '高反药', emoji: '💉', weight: 1,
    durabilityType: 'consumable', description: '乙酰唑胺，预防和缓解高原反应。',
  },
  battery: {
    id: 'battery', name: '电池', emoji: '🔋', weight: 1,
    durabilityType: 'consumable', description: 'GPS备用电池。石海迷路时的生命线。',
  },
  repair_kit: {
    id: 'repair_kit', name: '修理工具', emoji: '🔧', weight: 0.5,
    durabilityType: 'consumable', description: '胶带、金属片、螺丝刀。修复损坏装备。',
  },
  raincoat: {
    id: 'raincoat', name: '雨衣', emoji: '🧥', weight: 1,
    durabilityType: 'durable', description: '防雨防风，保护身体和背包。',
  },
  pole: {
    id: 'pole', name: '登山杖', emoji: '🥾', weight: 1,
    durabilityType: 'durable', description: '探路、支撑、减轻膝盖压力。石海和陡坡的好帮手。',
  },
  gps: {
    id: 'gps', name: 'GPS', emoji: '📡', weight: 2,
    durabilityType: 'durable', description: '离线导航设备。万仙阵石海中的唯一可靠指引。',
  },
  warm_clothes: {
    id: 'warm_clothes', name: '保暖衣物', emoji: '🧣', weight: 3,
    durabilityType: 'durable', description: '羽绒服+抓绒衣。冬季防失温的核心装备。',
  },
  stove: {
    id: 'stove', name: '炉具+燃料', emoji: '🔥', weight: 3,
    durabilityType: 'durable_fuel', maxFuelCharges: 3,
    description: '气罐炉+3次燃料。融雪取水、加热食物。冬季营地的隐藏核心。',
  },
  rope: {
    id: 'rope', name: '绳索', emoji: '🪢', weight: 3,
    durabilityType: 'durable', description: '15米登山绳。攀降、过河、防滑坠。',
  },
  drybag: {
    id: 'drybag', name: '防水袋', emoji: '🎒', weight: 0.5,
    durabilityType: 'durable', description: '保护背包内物资不被雨雪浸湿。',
  },
}

export const ITEM_LIST = Object.values(ITEMS)

export function getItemDef(id: string): ItemDef {
  return ITEMS[id]
}
