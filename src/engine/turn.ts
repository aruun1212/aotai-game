import type { PlayerState, WeatherType, GamePhase } from '@/models/types'
import { ROUTE_SEGMENTS } from '@/data/routes'
import { getCampForSegment } from '@/data/camps'
import { getWeatherDef } from '@/data/weather'
import { getFinalSpeed } from '@/engine/speed'
import type { Rng } from '@/engine/random'

export interface TurnResult {
  waterConsumed: number
  newPosition: number
  newSegmentId: number
  newGridInSegment: number
  crossedSegmentBoundary: boolean
  reachedCamp: boolean
  reachedEnd: boolean
  statusUpdates: string[]       // human-readable status change descriptions
  deathTriggered: boolean
  deathCause?: string
}

const TOTAL_MAIN_GRIDS = 108  // 段1-9 + 段11-12（不含段10支线4格），共112-4=108

/**
 * 执行一个回合的非事件逻辑：
 * 1. 消耗水
 * 2. 检查/推进状态效果
 * 3. 推进位置
 * 4. 检测段边界/营地/终点
 */
export function executeTurn(player: PlayerState, weather: WeatherType, _rng: Rng): TurnResult {
  const statusUpdates: string[] = []
  let deathTriggered = false
  let deathCause: string | undefined

  // ── 1. 水消耗 ──
  const weatherDef = getWeatherDef(weather)
    // 格子翻倍后，每格水耗从 0.2L 降到 0.08L，保持总消耗平衡
    const waterCost = +(0.08 * weatherDef.waterMultiplier).toFixed(3)
  player.water = Math.max(0, +(player.water - waterCost).toFixed(2))
  player.waterConsumed = +(player.waterConsumed + waterCost).toFixed(2)

  // ── 2. 状态效果推进 ──
  // 检查脱水
  if (player.water <= 0) {
    const existing = player.statusEffects.find(s => s.type === 'dehydration')
    if (existing) {
      if (existing.deathCountdown !== undefined) {
        existing.deathCountdown--
        if (existing.deathCountdown <= 0) {
          deathTriggered = true
          deathCause = 'dehydration'
          statusUpdates.push('你已经两天没有喝到水了……')
        } else {
          statusUpdates.push(`脱水倒计时: ${existing.deathCountdown} 回合`)
        }
      }
    } else {
      player.statusEffects.push({
        type: 'dehydration', speedModifier: -2, turnsRemaining: -1, deathCountdown: 2,
      })
      statusUpdates.push('⚠️ 脱水！速度-2，2回合内必须找到水源')
    }
  } else {
    // 有水则清除脱水
    const idx = player.statusEffects.findIndex(s => s.type === 'dehydration')
    if (idx !== -1) {
      player.statusEffects.splice(idx, 1)
      statusUpdates.push('脱水状态已解除')
    }
  }

  // 检查失温
  const hypo = player.statusEffects.find(s => s.type === 'hypothermia')
  if (hypo && hypo.deathCountdown !== undefined) {
    hypo.deathCountdown--
    if (hypo.deathCountdown <= 0) {
      deathTriggered = true
      deathCause = 'hypothermia'
      statusUpdates.push('你觉得身体越来越热……')
    } else {
      statusUpdates.push(`失温倒计时: ${hypo.deathCountdown} 回合`)
    }
  }

  // 推进有时限的状态效果
  for (let i = player.statusEffects.length - 1; i >= 0; i--) {
    const s = player.statusEffects[i]
    if (s.turnsRemaining > 0) {
      s.turnsRemaining--
      if (s.turnsRemaining <= 0) {
        statusUpdates.push(`${s.type} 状态已自然恢复`)
        player.statusEffects.splice(i, 1)
      }
    }
  }

  // 注意：不在这里提前返回死亡！先推进位置，如果本回合能到终点则通关优先
  const pendingDeath = deathTriggered
  const pendingDeathCause = deathCause

  // ── 3. 推进位置 ──
  const speed = getFinalSpeed(player.currentWeight, player.statusEffects)
  player.speed = speed

  let remaining = speed
  let crossedBoundary = false
  let reachedCamp = false
  let reachedEnd = false

  while (remaining > 0) {
    const seg = ROUTE_SEGMENTS.find(s => s.id === player.segmentId)
    if (!seg) break

    const gridsLeftInSegment = seg.gridCount - player.gridInSegment
    const move = Math.min(remaining, gridsLeftInSegment)

    player.gridInSegment += move
    player.position += move
    remaining -= move

    // 到达段末尾？
    if (player.gridInSegment >= seg.gridCount) {
      // 检查是否通关
      if (seg.id === 12) {
        reachedEnd = true
        break
      }

      // 进入下一段（跳过段10支线）
      crossedBoundary = true
      const nextSegId = getNextMainSegmentId(seg.id)
      if (nextSegId) {
        player.segmentId = nextSegId
        player.gridInSegment = 0

        // 检查新段是否有营地
        const camp = getCampForSegment(nextSegId)
        if (camp) {
          reachedCamp = true
          break  // 到达营地停下
        }
      } else {
        reachedEnd = true
        break
      }
    }
  }

  // 也检查当前段末尾的营地（段末格=营地入口）
  if (!reachedCamp) {
    const currentSeg = ROUTE_SEGMENTS.find(s => s.id === player.segmentId)
    if (currentSeg?.hasCamp && player.gridInSegment >= currentSeg.gridCount - 1) {
      // 还没到段末，但在营地段的最后一格也算到达营地
    }
  }

  player.turnCount++

  // 通关优先于死亡：如果本回合走到了终点，即使快渴死了也算你赢
  const finalDeath = reachedEnd ? false : pendingDeath

  return {
    waterConsumed: waterCost,
    newPosition: player.position,
    newSegmentId: player.segmentId,
    newGridInSegment: player.gridInSegment,
    crossedSegmentBoundary: crossedBoundary,
    reachedCamp,
    reachedEnd,
    statusUpdates: reachedEnd && pendingDeath
      ? [...statusUpdates, '你拖着脱水的身体踉跄着冲过了终点……']
      : statusUpdates,
    deathTriggered: finalDeath,
    deathCause: finalDeath ? pendingDeathCause : undefined,
  }
}

/**
 * 获取主干路线的下一段 ID（跳过段10支线）
 */
function getNextMainSegmentId(currentId: number): number | null {
  // 主干序列: 1,2,3,4,5,6,7,8,9,11,12（跳过10）
  const mainSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12]
  const idx = mainSequence.indexOf(currentId)
  if (idx === -1 || idx === mainSequence.length - 1) return null
  return mainSequence[idx + 1]
}

/**
 * 检查当前位置是否有下撤路线入口
 */
export function checkDescentAvailable(player: PlayerState): string | null {
  const seg = ROUTE_SEGMENTS.find(s => s.id === player.segmentId)
  return seg?.descentRouteId ?? null
}
