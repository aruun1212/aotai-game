import type { GamePhase } from '@/models/types'

/** 状态机合法转换表 */
const VALID_TRANSITIONS: Record<GamePhase, GamePhase[]> = {
  SEASON_SELECT: ['LOADOUT'],
  LOADOUT:       ['MARCHING'],
  MARCHING:      ['EVENT', 'CAMP', 'DESCENT', 'ENDING'],
  EVENT:         ['MARCHING', 'CAMP', 'DESCENT', 'ENDING'],  // EVENT→DESCENT for returning from descent events
  CAMP:          ['MARCHING'],
  DESCENT:       ['EVENT', 'ENDING'],
  ENDING:        ['SEASON_SELECT'],  // restart
}

/** 检查转换是否合法 */
export function canTransition(from: GamePhase, to: GamePhase): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false
}

/** 执行状态转换（如果非法则抛出错误） */
export function transition(current: GamePhase, target: GamePhase): GamePhase {
  if (!canTransition(current, target)) {
    // 任何状态在死亡时都可以跳到 ENDING
    if (target === 'ENDING') return target
    throw new Error(`Invalid transition: ${current} → ${target}`)
  }
  return target
}
