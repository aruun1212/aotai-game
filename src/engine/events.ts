import type { GameEvent, PlayerState, EventDensity, Season } from '@/models/types'
import { getEventsForSegment, getFixedEventsForSegment } from '@/data/events'
import type { Rng } from '@/engine/random'

/** 密度 → 触发概率 + 双事件概率（难度提升：全线加密） */
const DENSITY_CONFIG: Record<EventDensity, { primary: number; secondary: number }> = {
  low:     { primary: 0.65, secondary: 0.10 },
  medium:  { primary: 0.85, secondary: 0.25 },
  high:    { primary: 0.95, secondary: 0.45 },
  extreme: { primary: 1.00, secondary: 0.55 },
  special: { primary: 1.00, secondary: 0.20 },
}

/**
 * 为当前回合生成事件列表
 * - 先触发固定事件
 * - 再按密度概率触发随机事件
 * - 每段保证至少 1 个事件
 */
export function rollEventsForTurn(
  segmentId: number,
  density: EventDensity,
  season: Season,
  player: PlayerState,
  segmentEventCount: number,
  segmentGridCount: number,
  gridInSegment: number,
  rng: Rng,
  triggeredEventIds: Set<string> = new Set(),
): GameEvent[] {
  const result: GameEvent[] = []

  // ── 1. 固定事件（进入段时触发，跨回合不重复） ──
  if (gridInSegment <= player.speed) {
    const fixedEvents = getFixedEventsForSegment(segmentId, season)
    for (const evt of fixedEvents) {
      if (triggeredEventIds.has(evt.id)) continue  // 已触发过，跳过
      if (!evt.condition || evt.condition(player)) {
        result.push(evt)
      }
    }
  }

  // ── 2. 随机事件 ──
  const config = DENSITY_CONFIG[density]
  if (rng.chance(config.primary)) {
    const candidates = getRandomCandidates(segmentId, season, player, result, triggeredEventIds)
    if (candidates.length > 0) {
      result.push(rng.pick(candidates))
    }
  }

  // 双事件判定
  if (config.secondary > 0 && rng.chance(config.secondary)) {
    const candidates = getRandomCandidates(segmentId, season, player, result, triggeredEventIds)
    if (candidates.length > 0) {
      result.push(rng.pick(candidates))
    }
  }

  // ── 3. 最低保证：每段至少 2 个事件（确保下撤点间有足够抉择） ──
  const MIN_EVENTS_PER_SEGMENT = 2
  if (result.length === 0 && segmentEventCount < MIN_EVENTS_PER_SEGMENT && gridInSegment >= Math.floor(segmentGridCount * 0.4)) {
    // 段已走过40%但事件不足最低保证，强制触发
    const candidates = getRandomCandidates(segmentId, season, player, [], triggeredEventIds)
    if (candidates.length > 0) {
      result.push(rng.pick(candidates))
    }
  }

  return result
}

/**
 * 获取可用的随机事件候选（排除已触发的和不满足条件的）
 */
function getRandomCandidates(
  segmentId: number,
  season: Season,
  player: PlayerState,
  alreadyTriggered: GameEvent[],
  triggeredEventIds: Set<string> = new Set(),
): GameEvent[] {
  const all = getEventsForSegment(segmentId, season)
  const turnIds = new Set(alreadyTriggered.map(e => e.id))

  return all.filter(evt => {
    if (evt.isFixed) return false  // 固定事件不参与随机池
    if (turnIds.has(evt.id)) return false       // 同回合去重
    // 跨回合去重：只对段专属事件去重（id以S开头），通用事件（U开头）可重复
    if (triggeredEventIds.has(evt.id) && !evt.id.startsWith('U')) return false
    if (evt.condition && !evt.condition(player)) return false
    return true
  })
}

/**
 * 解析事件选项后果（应用到玩家状态）
 * 注意：实际的状态修改由 gameStore 或 turn 调用方完成
 * 这里只返回后果描述，不直接修改状态
 */
export function describeConsequences(event: GameEvent, choiceId: string): string[] {
  const choice = event.choices.find(c => c.id === choiceId)
  if (!choice) return []
  return choice.consequences.map(c => {
    switch (c.type) {
      case 'consume_item': return `消耗了 ${c.payload}`
      case 'add_status': return `获得状态: ${c.payload?.type}`
      case 'remove_status': return `解除状态: ${c.payload}`
      case 'modify_water': return `水量变化: ${c.payload > 0 ? '+' : ''}${c.payload}L`
      case 'skip_turn': return '失去了一个回合'
      case 'damage_item': return `${c.payload} 损坏了`
      case 'add_item': return `获得了 ${c.payload}`
      case 'trigger_death': return '致命！'
      case 'trigger_lost': return '迷路了！'
      case 'narrative_only': return ''
      default: return ''
    }
  }).filter(Boolean)
}
