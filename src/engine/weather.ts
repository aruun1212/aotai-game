import type { WeatherType, Season, PlayerState } from '@/models/types'
import { WEATHER_POOLS, WEATHER_SIMILARITY, WEATHER_DEFS } from '@/data/weather'
import type { Rng } from '@/engine/random'

const WEATHER_CHANGE_CHANCE = 0.90
const CONTINUITY_BONUS = 5  // 降低连续性偏好，让天气更狂暴

/**
 * 每回合天气更新：90% 概率变化，鳌太的天气就是这么善变
 */
export function updateWeather(current: WeatherType, season: Season, rng: Rng): WeatherType {
  // 25% 概率不变
  if (!rng.chance(WEATHER_CHANGE_CHANCE)) return current

  const pool = WEATHER_POOLS[season]
  if (!pool) return current

  // 构建加权列表（含连续性偏好）
  const types: WeatherType[] = []
  const weights: number[] = []
  const similarTypes = WEATHER_SIMILARITY[current] ?? []

  for (const [type, baseWeight] of Object.entries(pool.weights)) {
    if (baseWeight <= 0) continue
    const wt = type as WeatherType
    let finalWeight = baseWeight
    // 连续性偏好：相似天气 +10%
    if (similarTypes.includes(wt)) {
      finalWeight += CONTINUITY_BONUS
    }
    types.push(wt)
    weights.push(finalWeight)
  }

  if (types.length === 0) return current
  return rng.weightedChoice(types, weights)
}

/**
 * 获取天气对行进的综合影响
 */
export function getWeatherEffects(weather: WeatherType, season: Season, terrain: string[]) {
  const def = WEATHER_DEFS[weather]

  let slopeModifier = def.slopeModifier
  let speedModifier = def.speedModifier

  // 冬季脊线段+暴风雪：额外 -1 速度
  if (season === 'winter' && terrain.includes('ridge') && (weather === 'blizzard' || weather === 'light_snow')) {
    speedModifier -= 1
  }

  // 冬季陡坡：摔倒概率 ×1.5
  if (season === 'winter') {
    slopeModifier *= 1.5
  }

  return {
    waterMultiplier: def.waterMultiplier,
    slopeModifier,
    speedModifier,
    name: def.name,
    emoji: def.emoji,
  }
}

/**
 * 检查是否应触发失温
 */
export function checkHypothermia(weather: WeatherType, player: PlayerState): boolean {
  if (weather !== 'blizzard') return false
  const hasWarmClothes = player.inventory.some(i => i.defId === 'warm_clothes' && !i.damaged)
  return !hasWarmClothes
}
