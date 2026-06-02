import type { StatusEffect } from '@/models/types'

/**
 * 速度公式: speed = max(2, min(5, floor(5 - weight/8 + statusMod)))
 * - 最低 2，最高 5
 * - 负重每 8 单位降速 1
 * - 状态效果叠加
 */
export function calculateSpeed(weight: number, statusEffects: StatusEffect[]): number {
  const statusMod = statusEffects.reduce((sum, s) => sum + s.speedModifier, 0)
  const raw = 5 - weight / 8 + statusMod
  return Math.max(2, Math.min(5, Math.floor(raw)))
}

/**
 * 检查是否有"力竭"状态（速度强制为2）
 */
export function isExhausted(statusEffects: StatusEffect[]): boolean {
  return statusEffects.some(s => s.type === 'exhaustion')
}

/**
 * 获取最终速度（考虑力竭强制）
 */
export function getFinalSpeed(weight: number, statusEffects: StatusEffect[]): number {
  if (isExhausted(statusEffects)) return 2
  return calculateSpeed(weight, statusEffects)
}
