// ── 季节 ──
export type Season = 'winter' | 'summer'

// ── 事件密度 ──
export type EventDensity = 'low' | 'medium' | 'high' | 'extreme' | 'special'

// ── 路线段 ──
export interface RouteSegment {
  id: number
  name: string
  from: string
  to: string
  gridCount: number
  eventDensity: EventDensity
  elevationRange: [number, number]
  hasCamp: boolean
  descentRouteId: string | null
  terrain: string[]  // e.g. ['ridge', 'stone_sea', 'forest']
}

// ── 下撤路线 ──
export interface DescentRoute {
  id: string
  name: string
  from: string
  to: string
  difficulty: number        // 1-5 stars
  distanceKm: number
  elevationDrop: number
  turnCount: number
  riskTags: string[]
  events: DescentEvent[]
}

export interface DescentEvent {
  id: string
  triggerType: 'fixed' | 'probability'
  probability: number       // 0-1, fixed events = 1
  event: GameEvent
}

// ── 营地 ──
export interface Camp {
  id: string
  name: string
  segmentId: number
  waterRefill: { summer: number; winterWithStove: number; winterWithoutStove: number }
  description: string
}

// ── 物资定义 ──
export type DurabilityType = 'consumable' | 'durable' | 'durable_fuel'

export interface ItemDef {
  id: string
  name: string
  emoji: string
  weight: number
  durabilityType: DurabilityType
  maxFuelCharges?: number   // only for durable_fuel
  description: string
}

// ── 物资实例（背包中） ──
export interface ItemInstance {
  defId: string
  damaged: boolean
  fuelCharges?: number      // remaining fuel for durable_fuel
}

// ── 天气 ──
export type WeatherType =
  | 'sunny' | 'cloudy' | 'light_rain' | 'heavy_fog'
  | 'heavy_rain' | 'thunderstorm' | 'light_snow' | 'blizzard'

export interface WeatherDef {
  type: WeatherType
  name: string
  emoji: string
  waterMultiplier: number
  slopeModifier: number     // multiplier for fall probability
  speedModifier: number     // additional speed mod (e.g. ridge wind)
}

export interface WeatherPool {
  season: Season
  weights: Record<WeatherType, number>  // probability weights (sum to 100)
}

// ── 事件系统 ──
export type EventCategory = 'weather' | 'encounter' | 'social_placeholder'
export type EventSubtype = 'body' | 'equipment' | 'discovery' | 'atmosphere' | 'route' | 'fixed' | 'terrain'

export interface EventChoice {
  id: string
  text: string
  itemCost?: { defId: string; count: number }   // item consumed
  requiresItem?: string                          // defId needed, grayed out if absent
  requiresCondition?: (state: PlayerState) => boolean
  consequences: EventConsequence[]
  narrative: string                              // result text
  probability?: number                           // success probability for risky choices
  failNarrative?: string                         // text on failure
  failConsequences?: EventConsequence[]
}

export type ConsequenceType =
  | 'consume_item'
  | 'add_status'
  | 'remove_status'
  | 'modify_water'
  | 'modify_speed_temp'   // temporary speed modifier for N turns
  | 'skip_turn'
  | 'damage_item'
  | 'add_item'
  | 'trigger_death'
  | 'trigger_lost'
  | 'narrative_only'

export interface EventConsequence {
  type: ConsequenceType
  payload?: any  // typed per consequence type at runtime
}

export interface GameEvent {
  id: string
  category: EventCategory
  subtype: EventSubtype
  segments: number[]        // which segments can trigger this
  seasons: Season[]         // which seasons
  condition?: (state: PlayerState) => boolean
  narrative: string
  choices: EventChoice[]
  isFixed: boolean          // always triggers at location
}

// ── 状态效果 ──
export type StatusEffectType =
  | 'dehydration' | 'hunger' | 'exhaustion'
  | 'hypothermia' | 'altitude_sickness' | 'sprain'
  | 'lost'

export interface StatusEffect {
  type: StatusEffectType
  speedModifier: number     // negative
  turnsRemaining: number    // -1 = until cured; 0 = permanent until specific action
  deathCountdown?: number   // turns until death (for delayed death)
}

// ── 玩家状态 ──
export interface PlayerState {
  season: Season
  presetId: string
  position: number          // absolute grid position (0-43 main trunk)
  segmentId: number         // current segment (1-12)
  gridInSegment: number     // position within current segment
  inventory: ItemInstance[]
  water: number             // liters, float
  currentWeight: number
  speed: number
  statusEffects: StatusEffect[]
  missedMeals: number       // consecutive missed meals
  turnCount: number
  eventsEncountered: number
  itemsConsumed: number
  waterConsumed: number
  isOnDescent: boolean
  descentRouteId: string | null
  descentTurn: number
}

// ── 游戏状态机 ──
export type GamePhase =
  | 'SEASON_SELECT' | 'LOADOUT' | 'MARCHING'
  | 'EVENT' | 'CAMP' | 'DESCENT' | 'ENDING'

export interface GameState {
  phase: GamePhase
  player: PlayerState
  weather: WeatherType
  seed: number
  currentEvent: GameEvent | null
  eventQueue: GameEvent[]   // pending events for this turn
  turnLog: TurnLogEntry[]
  segmentEventCounts: Record<number, number>  // track events per segment for minimum guarantee
  triggeredEventIds: string[]  // track which events have been seen (cross-turn dedup)
}

// ── 回合日志 ──
export interface TurnLogEntry {
  turn: number
  segmentName: string
  weather: string
  narrative: string
  choiceMade?: string
}

// ── 结局 ──
export type EndingType = 'completion' | 'descent' | 'death'
export type DeathCause = 'dehydration' | 'hypothermia' | 'lost' | 'fall' | 'altitude_sickness'

export interface EndingStats {
  turnsPlayed: number
  segmentReached: number
  eventsEncountered: number
  itemsConsumed: number
  waterConsumed: number
}

export interface Ending {
  type: EndingType
  narrative: string
  deathCause?: DeathCause
  descentRouteId?: string
  stats?: EndingStats
}
