import type { PlayerState, ItemInstance } from '@/models/types'
import { ITEMS } from '@/data/items'
import { calculateSpeed } from '@/engine/speed'

/**
 * 重新计算玩家负重和速度
 */
export function recalcWeight(player: PlayerState): void {
  player.currentWeight = player.inventory.reduce(
    (sum, it) => sum + (ITEMS[it.defId]?.weight ?? 0), 0
  )
  player.speed = calculateSpeed(player.currentWeight, player.statusEffects)
}

/**
 * 消耗一个消耗品（从背包移除）
 */
export function consumeItem(player: PlayerState, defId: string): boolean {
  const idx = player.inventory.findIndex(i => i.defId === defId)
  if (idx === -1) return false
  const item = ITEMS[defId]
  if (!item || item.durabilityType !== 'consumable') return false
  player.inventory.splice(idx, 1)
  player.itemsConsumed++
  recalcWeight(player)
  return true
}

/**
 * 消耗水（特殊处理：减少 water 数值 + 移除一个水实例如果整数边界跨越）
 */
export function consumeWater(player: PlayerState, amount: number): void {
  player.water = Math.max(0, +(player.water - amount).toFixed(2))
  player.waterConsumed = +(player.waterConsumed + amount).toFixed(2)
  // 同步 inventory 中的水数量
  const waterCount = Math.ceil(player.water)
  const currentWaterItems = player.inventory.filter(i => i.defId === 'water').length
  while (player.inventory.filter(i => i.defId === 'water').length > waterCount) {
    const idx = player.inventory.findIndex(i => i.defId === 'water')
    if (idx === -1) break
    player.inventory.splice(idx, 1)
  }
  recalcWeight(player)
}

/**
 * 添加水
 */
export function addWater(player: PlayerState, amount: number): void {
  const oldWater = player.water
  player.water = +(player.water + amount).toFixed(2)
  // 添加水实例
  const newWaterItems = Math.ceil(player.water) - Math.ceil(oldWater)
  for (let i = 0; i < newWaterItems; i++) {
    player.inventory.push({ defId: 'water', damaged: false })
  }
  recalcWeight(player)
}

/**
 * 添加物资
 */
export function addItem(player: PlayerState, defId: string): boolean {
  const item = ITEMS[defId]
  if (!item) return false
  const instance: ItemInstance = {
    defId,
    damaged: false,
    ...(item.durabilityType === 'durable_fuel' ? { fuelCharges: item.maxFuelCharges ?? 3 } : {}),
  }
  player.inventory.push(instance)
  recalcWeight(player)
  return true
}

/**
 * 移除物资（丢弃）
 */
export function removeItem(player: PlayerState, defId: string): boolean {
  const idx = player.inventory.findIndex(i => i.defId === defId)
  if (idx === -1) return false
  player.inventory.splice(idx, 1)
  recalcWeight(player)
  return true
}

/**
 * 损坏一个持久物资
 */
export function damageItem(player: PlayerState, defId: string): boolean {
  const item = player.inventory.find(i => i.defId === defId && !i.damaged)
  if (!item) return false
  item.damaged = true
  return true
}

/**
 * 用修理工具修复一个损坏物资
 */
export function repairItem(player: PlayerState, defId: string): boolean {
  const damaged = player.inventory.find(i => i.defId === defId && i.damaged)
  if (!damaged) return false
  // 消耗修理工具
  if (!consumeItem(player, 'repair_kit')) return false
  damaged.damaged = false
  return true
}

/**
 * 使用炉具（消耗一次燃料）
 */
export function useStove(player: PlayerState): boolean {
  const stove = player.inventory.find(i => i.defId === 'stove' && !i.damaged)
  if (!stove || !stove.fuelCharges || stove.fuelCharges <= 0) return false
  stove.fuelCharges--
  return true
}

/**
 * 检查玩家是否拥有指定物资（未损坏）
 */
export function hasItem(player: PlayerState, defId: string): boolean {
  return player.inventory.some(i => i.defId === defId && !i.damaged)
}

/**
 * 检查炉具是否有燃料
 */
export function hasStoveFuel(player: PlayerState): boolean {
  const stove = player.inventory.find(i => i.defId === 'stove' && !i.damaged)
  return !!stove && (stove.fuelCharges ?? 0) > 0
}

/**
 * 获取食物数量（饼干+热量餐+能量胶）
 */
export function getFoodCount(player: PlayerState): number {
  return player.inventory.filter(i =>
    ['biscuit', 'meal', 'gel'].includes(i.defId)
  ).length
}

/**
 * 消耗一份食物（优先消耗能量胶→饼干→热量餐）
 */
export function consumeFood(player: PlayerState): string | null {
  const priority = ['gel', 'biscuit', 'meal']
  for (const defId of priority) {
    if (consumeItem(player, defId)) return defId
  }
  return null
}

/**
 * 出发物资校验
 */
export function validateLoadout(
  items: ItemInstance[],
  weightCap: number,
  lockedWater: number,
  lockedBiscuit: number,
): { valid: boolean; error?: string } {
  const totalWeight = items.reduce((sum, it) => sum + (ITEMS[it.defId]?.weight ?? 0), 0)
  if (totalWeight > weightCap) {
    return { valid: false, error: `超重！当前 ${totalWeight.toFixed(1)} / 上限 ${weightCap}` }
  }
  const waterCount = items.filter(i => i.defId === 'water').length
  if (waterCount < lockedWater) {
    return { valid: false, error: `最少需要 ${lockedWater}L 水` }
  }
  const biscuitCount = items.filter(i => i.defId === 'biscuit').length
  if (biscuitCount < lockedBiscuit) {
    return { valid: false, error: `最少需要 ${lockedBiscuit} 份压缩饼干` }
  }
  return { valid: true }
}
