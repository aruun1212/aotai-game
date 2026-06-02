import { defineStore } from 'pinia'
import { ref, computed, triggerRef } from 'vue'
import type {
  GameState, GamePhase, PlayerState, WeatherType,
  GameEvent, TurnLogEntry, Season, ItemInstance, Ending,
} from '@/models/types'
import { transition } from '@/engine/stateMachine'
import { createRng, generateSeed, type Rng } from '@/engine/random'
import { getPreset } from '@/data/presets'
import { calculateSpeed } from '@/engine/speed'
import { ITEMS } from '@/data/items'
import { ROUTE_SEGMENTS } from '@/data/routes'

export const useGameStore = defineStore('game', () => {
  // ── 核心状态 ──
  const state = ref<GameState>({
    phase: 'SEASON_SELECT',
    player: createDefaultPlayer(),
    weather: 'cloudy',
    seed: generateSeed(),
    currentEvent: null,
    eventQueue: [],
    turnLog: [],
    segmentEventCounts: {},
    triggeredEventIds: [],
  })

  const ending = ref<Ending | null>(null)
  let rng: Rng = createRng(state.value.seed)

  // ── 计算属性 ──
  const phase = computed(() => state.value.phase)
  const player = computed(() => state.value.player)
  const weather = computed(() => state.value.weather)
  const currentEvent = computed(() => state.value.currentEvent)
  const turnLog = computed(() => state.value.turnLog)
  const currentSegment = computed(() =>
    ROUTE_SEGMENTS.find(s => s.id === state.value.player.segmentId) ?? ROUTE_SEGMENTS[0]!
  )

  // ── 状态切换 ──
  function setPhase(newPhase: GamePhase) {
    state.value.phase = transition(state.value.phase, newPhase)
  }

  // ── 新游戏 ──
  function newGame(season: Season) {
    const seed = generateSeed()
    rng = createRng(seed)
    state.value = {
      phase: 'LOADOUT',
      player: { ...createDefaultPlayer(), season },
      weather: season === 'winter' ? 'cloudy' : 'sunny',
      seed,
      currentEvent: null,
      eventQueue: [],
      turnLog: [],
      segmentEventCounts: {},
      triggeredEventIds: [],
    }
  }

  // ── 确认出发 ──
  function confirmLoadout(presetId: string, items: ItemInstance[]) {
    const preset = getPreset(presetId)
    if (!preset) return
    const weight = items.reduce((sum, it) => sum + (ITEMS[it.defId]?.weight ?? 0), 0)
    state.value.player.presetId = presetId
    state.value.player.inventory = items
    state.value.player.currentWeight = weight
    state.value.player.water = items.filter(i => i.defId === 'water').length
    state.value.player.speed = calculateSpeed(weight, state.value.player.statusEffects)
    setPhase('MARCHING')
  }

  // ── 回合日志 ──
  function addTurnLog(entry: TurnLogEntry) {
    state.value.turnLog.push(entry)
  }

  // ── 事件处理 ──
  function setCurrentEvent(event: GameEvent | null) {
    state.value.currentEvent = event
    if (event) setPhase('EVENT')
  }

  function resolveEvent() {
    state.value.currentEvent = null
    // 检查事件队列
    if (state.value.eventQueue.length > 0) {
      const next = state.value.eventQueue.shift()!
      state.value.currentEvent = next
    } else if (state.value.player.isOnDescent) {
      // 下撤中的事件结束后回到 DESCENT
      setPhase('DESCENT')
    } else {
      // 检查是否在营地段
      if (currentSegment.value.hasCamp && state.value.player.gridInSegment >= currentSegment.value.gridCount - 1) {
        setPhase('CAMP')
      } else {
        setPhase('MARCHING')
      }
    }
  }

  // ── 天气更新 ──
  function setWeather(w: WeatherType) {
    state.value.weather = w
  }

  // ── 玩家状态更新 ──
  function updatePlayer(partial: Partial<PlayerState>) {
    Object.assign(state.value.player, partial)
    // 强制触发 state ref 的响应性更新，确保所有 watch/computed 重新计算
    triggerRef(state)
  }

  // ── 结局 ──
  function setEnding(e: Ending) {
    ending.value = e
    setPhase('ENDING')
  }

  // ── 获取 RNG ──
  function getRng(): Rng {
    return rng
  }

  // ── 存档 ──
  function saveToLocalStorage() {
    // 注意：GameEvent 中有函数（condition），不能直接序列化
    // 存档只保存可序列化的核心状态
    const saveable = {
      phase: state.value.phase,
      player: state.value.player,
      weather: state.value.weather,
      seed: state.value.seed,
      turnLog: state.value.turnLog,
      segmentEventCounts: state.value.segmentEventCounts,
      triggeredEventIds: state.value.triggeredEventIds,
    }
    localStorage.setItem('aotai-save', JSON.stringify(saveable))
  }

  function loadFromLocalStorage(): boolean {
    const raw = localStorage.getItem('aotai-save')
    if (!raw) return false
    try {
      const saved = JSON.parse(raw)
      state.value.phase = saved.phase
      state.value.player = saved.player
      state.value.weather = saved.weather
      state.value.seed = saved.seed
      state.value.turnLog = saved.turnLog ?? []
      state.value.segmentEventCounts = saved.segmentEventCounts ?? {}
      state.value.triggeredEventIds = saved.triggeredEventIds ?? []
      rng = createRng(saved.seed)
      // 快进 RNG 到正确位置（按回合数消耗）
      for (let i = 0; i < saved.player.turnCount * 5; i++) rng.next()
      return true
    } catch {
      return false
    }
  }

  function clearSave() {
    localStorage.removeItem('aotai-save')
  }

  function hasSave(): boolean {
    return localStorage.getItem('aotai-save') !== null
  }

  return {
    state, ending, phase, player, weather, currentEvent, turnLog, currentSegment,
    setPhase, newGame, confirmLoadout, addTurnLog,
    setCurrentEvent, resolveEvent, setWeather,
    updatePlayer, setEnding, getRng,
    saveToLocalStorage, loadFromLocalStorage, clearSave, hasSave,
  }
})

function createDefaultPlayer(): PlayerState {
  return {
    season: 'summer',
    presetId: 'balanced',
    position: 0,
    segmentId: 1,
    gridInSegment: 0,
    inventory: [],
    water: 0,
    currentWeight: 0,
    speed: 3,
    statusEffects: [],
    missedMeals: 0,
    turnCount: 0,
    eventsEncountered: 0,
    itemsConsumed: 0,
    waterConsumed: 0,
    isOnDescent: false,
    descentRouteId: null,
    descentTurn: 0,
  }
}
