<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import ElevationProfile from '@/components/ElevationProfile.vue'
import NarrativePanel from '@/components/NarrativePanel.vue'
import ChoiceButton from '@/components/ChoiceButton.vue'
import StatusBar from '@/components/StatusBar.vue'
import TurnLogPanel from '@/components/TurnLogPanel.vue'
import DangerAlert from '@/components/DangerAlert.vue'
import MapTerrain from '@/components/MapTerrain.vue'
import SupplyRack from '@/components/SupplyRack.vue'

const hasMapTiler = !!import.meta.env.VITE_MAPTILER_KEY
import { executeTurn, checkDescentAvailable } from '@/engine/turn'
import { ITEMS } from '@/data/items'
import { ROUTE_SEGMENTS } from '@/data/routes'
import { generateWalkingNarrative } from '@/data/walkingNarrative'
import { rollEventsForTurn } from '@/engine/events'
import { usePlayerIdentityStore } from '@/stores/playerIdentityStore'
import { recordDeath, findNearbyDead, discoverDead, recordFootprint, bringOutDead, type DeadPlayer } from '@/services/deadPlayerService'
import { playUIClick, playUIConfirm } from '@/lib/audio'
import { updateWeather } from '@/engine/weather'
import { getDescentRoute } from '@/data/descents'
import { supabaseReady } from '@/lib/supabase'
import { fetchRackItems } from '@/services/supplyRackService'
import type { EventChoice, DescentRoute, GameEvent } from '@/models/types'

const router = useRouter()
const game = useGameStore()

// ── 状态效果中文名映射 ──
const STATUS_NAMES: Record<string, string> = {
  hypothermia: '失温', dehydration: '脱水', exhaustion: '力竭',
  hunger: '饥饿', injury: '受伤', sprain: '扭伤', fracture: '骨折',
  lost: '迷路', altitude_sickness: '高反', fatigue: '疲劳',
  sunburn: '晒伤', frostbite: '冻伤', blister: '水泡',
  headache: '头痛', nausea: '恶心', fever: '发烧',
  wet: '湿透', cold: '寒冷', scared: '恐惧', slow: '迟缓',
}

const narrativeReady = ref(true)
const resultText = ref('')
const showResult = ref(false)
const descentRoute = ref<DescentRoute | null>(null)
const descentNarrative = ref('')
const walkingFlavor = ref<string | null>(null)
const showSupplyRack = ref(false)
const campRackCount = ref(0)
const playerIdentity = usePlayerIdentityStore()

// 坏档系统状态
const discoveredDead = ref<DeadPlayer | null>(null)
const showDeadDiscovery = ref(false)
const carriedDeadIds = ref<number[]>([])  // 本局带出的坏档IDs

const phase = computed(() => game.phase)
const event = computed(() => game.currentEvent)
const descentId = computed(() => checkDescentAvailable(game.player))

// ── 下撤决策辅助：计算当前危险属性 ──
interface RiskItem {
  icon: string
  label: string
  value: string
  severity: 'warning' | 'danger' | 'critical'
}

const descentRisks = computed<RiskItem[]>(() => {
  if (!descentId.value) return []
  const p = game.state.player
  const risks: RiskItem[] = []

  // 剩余格子数（当前段到终点的估算）
  const seg = game.currentSegment
  const remainingGridsInSeg = seg.gridCount - p.gridInSegment
  // 粗略估算剩余总格数
  const MAIN_SEG_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12]
  const segIdx = MAIN_SEG_ORDER.indexOf(p.segmentId)
  let totalRemaining = remainingGridsInSeg
  if (segIdx >= 0) {
    for (let i = segIdx + 1; i < MAIN_SEG_ORDER.length; i++) {
      const s = ROUTE_SEGMENTS.find(r => r.id === MAIN_SEG_ORDER[i])
      if (s) totalRemaining += s.gridCount
    }
  }

  // 水量评估：0.08L/格 × 剩余格数 = 预估需水量
  const waterNeeded = +(totalRemaining * 0.08).toFixed(1)
  const waterRatio = p.water / Math.max(0.1, waterNeeded)
  if (p.water <= 0) {
    risks.push({ icon: '🏜️', label: '水', value: '已耗尽！', severity: 'critical' })
  } else if (waterRatio < 0.3) {
    risks.push({ icon: '💧', label: '水', value: `${p.water.toFixed(1)}L（需 ${waterNeeded}L）`, severity: 'danger' })
  } else if (waterRatio < 0.6) {
    risks.push({ icon: '💧', label: '水', value: `${p.water.toFixed(1)}L（需 ${waterNeeded}L）`, severity: 'warning' })
  }

  // 速度评估
  if (p.speed <= 1) {
    risks.push({ icon: '🐢', label: '速度', value: `${p.speed}格/回合（极慢）`, severity: 'critical' })
  } else if (p.speed <= 2) {
    risks.push({ icon: '🚶', label: '速度', value: `${p.speed}格/回合（偏慢）`, severity: 'warning' })
  }

  // 负面状态
  for (const eff of p.statusEffects) {
    if (eff.type === 'dehydration') {
      risks.push({ icon: '🏜️', label: '脱水', value: `${eff.deathCountdown ?? 0}回合内致命`, severity: 'critical' })
    } else if (eff.type === 'hypothermia') {
      risks.push({ icon: '❄️', label: '失温', value: `${eff.deathCountdown ?? 0}回合内致命`, severity: 'critical' })
    } else if (eff.type === 'lost') {
      risks.push({ icon: '🌫️', label: '迷路', value: `速度-2，${eff.turnsRemaining}回合`, severity: 'danger' })
    } else if (eff.speedModifier && eff.speedModifier < 0) {
      const effectLabel = STATUS_NAMES[eff.type] || eff.type
      risks.push({ icon: '🤕', label: effectLabel, value: `速度${eff.speedModifier}`, severity: 'warning' })
    }
  }

  return risks
})

// Check if player has required item for a choice
function hasRequiredItem(choice: EventChoice): boolean {
  if (!choice.requiresItem) return true
  return game.player.inventory.some(i => i.defId === choice.requiresItem && !i.damaged)
}

// March button — advance one turn
function march() {
  playUIConfirm()
  const rng = game.getRng()

  // Roll weather
  const newWeather = updateWeather(game.weather, game.player.season, rng)
  game.setWeather(newWeather)

  // Execute turn: water consumption, status effects, position advance
  const turnResult = executeTurn(game.state.player, newWeather, rng)

  // Sync player state (executeTurn mutates player directly, but we sync computed fields)
  game.updatePlayer({
    water: game.state.player.water,
    position: turnResult.newPosition,
    segmentId: turnResult.newSegmentId,
    gridInSegment: turnResult.newGridInSegment,
    speed: game.state.player.speed,
    statusEffects: [...game.state.player.statusEffects],
    turnCount: game.state.player.turnCount,
    waterConsumed: game.state.player.waterConsumed,
  })

  // Add turn log
  const seg = game.currentSegment
  // Build narrative with water warning
  let marchNarrative = turnResult.statusUpdates.length > 0
    ? turnResult.statusUpdates.join('；')
    : `前进了 ${game.player.speed} 格`

  // Water level warnings (so the player knows they need water!)
  const waterPct = game.player.water / Math.max(1, game.player.inventory.filter(i => i.defId === 'water').length || 3) * 100
  if (game.player.water <= 0) {
    marchNarrative += ' 🚨 没有水了！'
  } else if (game.player.water < 0.5) {
    marchNarrative += ' ⚠️ 水快见底了！'
  } else if (waterPct < 30) {
    marchNarrative += ' 💧 水量偏低，注意补给。'
  }

  game.addTurnLog({
    turn: game.player.turnCount,
    segmentName: seg.name,
    weather: newWeather,
    narrative: marchNarrative,
  })

  // 生成氛围叙事（不影响游戏状态，纯代入感）
  walkingFlavor.value = generateWalkingNarrative(
    seg.terrain || [],
    newWeather,
    rng,
  )

  // Check death
  if (turnResult.deathTriggered) {
    game.setEnding({
      type: 'death',
      narrative: turnResult.statusUpdates.join('\n'),
      deathCause: turnResult.deathCause as any,
      stats: {
        turnsPlayed: game.player.turnCount,
        segmentReached: game.player.segmentId,
        eventsEncountered: game.player.eventsEncountered,
        itemsConsumed: game.player.itemsConsumed,
        waterConsumed: game.player.waterConsumed,
      },
    })
    // 记录坏档到云端
    if (playerIdentity.identity && supabaseReady.value) {
      recordDeath(
        playerIdentity.identity.id,
        playerIdentity.identity.nickname,
        playerIdentity.identity.emoji,
        game.state.player.segmentId,
        game.state.player.gridInSegment,
        turnResult.deathCause ?? null,
        turnResult.statusUpdates.join(' '),
      )
    }
    game.saveToLocalStorage()
    router.push('/ending')
    return
  }

  // Check completion
  if (turnResult.reachedEnd) {
    game.setEnding({
      type: 'completion',
      narrative: '你站在拔仙台的山顶，云海在脚下翻涌。你活着走完了鳌太。',
      stats: {
        turnsPlayed: game.player.turnCount,
        segmentReached: game.player.segmentId,
        eventsEncountered: game.player.eventsEncountered,
        itemsConsumed: game.player.itemsConsumed,
        waterConsumed: game.player.waterConsumed,
      },
    })
    // 记录足迹 + 带出坏档
    if (playerIdentity.identity && supabaseReady.value) {
      recordFootprint(
        playerIdentity.identity.id,
        playerIdentity.identity.nickname,
        playerIdentity.identity.emoji,
        'completion',
        game.state.player.segmentId,
        game.state.player.gridInSegment,
        game.player.turnCount,
        carriedDeadIds.value,
      )
      if (carriedDeadIds.value.length > 0) {
        bringOutDead(carriedDeadIds.value, playerIdentity.identity.id, playerIdentity.identity.nickname)
      }
    }
    game.saveToLocalStorage()
    router.push('/ending')
    return
  }

  // Check camp
  if (turnResult.reachedCamp) {
    game.setPhase('CAMP')
    game.saveToLocalStorage()
    // Check supply rack for items
    checkCampRack()
    return
  }

  // Roll events (seg already defined above for turn log)
  const segEvtCount = game.state.segmentEventCounts[seg.id] ?? 0
  const triggeredIds = new Set(game.state.triggeredEventIds)
  const events = rollEventsForTurn(
    seg.id,
    seg.eventDensity,
    game.player.season,
    game.state.player,
    segEvtCount,
    seg.gridCount,
    game.player.gridInSegment,
    rng,
    triggeredIds,
  )
  // Track events per segment + cross-turn dedup
  game.state.segmentEventCounts[seg.id] = segEvtCount + events.length
  for (const evt of events) {
    game.state.triggeredEventIds.push(evt.id)
  }

  if (events.length > 0) {
    walkingFlavor.value = null  // 有事件时清除氛围叙事
    game.state.eventQueue = events.slice(1)
    game.setCurrentEvent(events[0])
  } else {
    // 没有事件时，有概率发现坏档（30%概率检查）
    if (supabaseReady.value && playerIdentity.identity && rng.next() < 0.30) {
      checkForDeadPlayers()
    }
  }

  game.saveToLocalStorage()
}

// ── 坏档发现 ──
async function checkForDeadPlayers() {
  if (!playerIdentity.identity) return
  const dead = await findNearbyDead(
    game.state.player.segmentId,
    game.state.player.gridInSegment,
    playerIdentity.identity.id,
  )
  if (dead) {
    discoveredDead.value = dead
    showDeadDiscovery.value = true
  }
}

async function handleRecordDead() {
  if (!discoveredDead.value || !playerIdentity.identity) return
  await discoverDead(discoveredDead.value.id, playerIdentity.identity.id)
  carriedDeadIds.value.push(discoveredDead.value.id)
  showDeadDiscovery.value = false
  discoveredDead.value = null
}

function handleIgnoreDead() {
  showDeadDiscovery.value = false
  discoveredDead.value = null
}

function getDeathCauseText(cause: string): string {
  const map: Record<string, string> = {
    dehydration: '脱水', hypothermia: '失温', fall: '滑坠',
    exhaustion: '力竭', altitude_sickness: '高反',
  }
  return map[cause] ?? cause
}

// Choose an event option
/**
 * 装备加成映射：根据事件类型和选项，判断玩家背包中的装备是否能提高成功率
 * 返回加成值 (0~0.4)
 */
function getEquipmentBonus(evt: GameEvent, choice: EventChoice): number {
  const inv = game.player.inventory
  const has = (id: string) => inv.some(i => i.defId === id && !i.damaged)

  const subtype = evt.subtype || ''
  const category = evt.category || ''
  const choiceText = choice.text || ''

  // 绳索：攀爬、陡坡、悬崖、碎石坡相关 +35%
  if (has('rope') && (
    subtype === 'terrain' ||
    choiceText.includes('\u6500') || // 攀
    choiceText.includes('\u722c') || // 爬
    choiceText.includes('\u7ef3') || // 绳
    choiceText.includes('\u7a7f\u8d8a') || // 穿越
    choiceText.includes('\u4e0b\u964d') // 下降
  )) return 0.35

  // 登山杖：行进、平衡、碎石 +30%
  if (has('pole') && (
    subtype === 'terrain' ||
    choiceText.includes('\u63a2') || // 探
    choiceText.includes('\u6d89\u6c34') || // 涉水
    choiceText.includes('\u8d70') || // 走
    choiceText.includes('\u7ed5') // 绕
  )) return 0.30

  // 保暖衣物：天气/失温相关 +35%
  if (has('warm_clothes') && (
    subtype === 'weather' ||
    choiceText.includes('\u6297') || // 抗
    choiceText.includes('\u7b49') || // 等
    choiceText.includes('\u6696') // 暖
  )) return 0.35

  // 炉具+燃料：营地/化雪/加热 +30%
  if (has('stove') && (
    choiceText.includes('\u70e7') || // 烧
    choiceText.includes('\u5316\u96ea') || // 化雪
    choiceText.includes('\u70ed') || // 热
    choiceText.includes('\u7089') // 炉
  )) return 0.30

  // 防水袋：涉水/暴雨相关 +25%
  if (has('dry_bag') && (
    subtype === 'weather' ||
    choiceText.includes('\u6d89\u6c34') || // 涉水
    choiceText.includes('\u96e8') // 雨
  )) return 0.25

  // 药品/冰敷：受伤相关 +30%
  if (has('first_aid') && (
    choiceText.includes('\u5305\u624e') || // 包扎
    choiceText.includes('\u836f') || // 药
    choiceText.includes('\u6cbb') // 治
  )) return 0.30

  return 0
}

/** 获取某选项的装备提示文本（不显示概率，只提示装备名） */
function getEquipmentHint(evt: GameEvent, choice: EventChoice): string | null {
  const inv = game.player.inventory
  const has = (id: string) => inv.some(i => i.defId === id && !i.damaged)
  const bonus = getEquipmentBonus(evt, choice)
  if (bonus <= 0) return null

  // 反查是哪个装备提供的加成
  if (has('rope') && bonus === 0.35 && (evt.subtype === 'terrain' || choice.text?.includes('\u6500') || choice.text?.includes('\u7ef3'))) return '🪢 绳索可能有帮助'
  if (has('pole') && bonus === 0.30 && (evt.subtype === 'terrain' || choice.text?.includes('\u63a2'))) return '🥾 登山杖可能有帮助'
  if (has('warm_clothes') && bonus === 0.35) return '🧥 保暖衣物可能有帮助'
  if (has('stove') && bonus === 0.30) return '🔥 炉具可能有帮助'
  if (has('dry_bag') && bonus === 0.25) return '🎒 防水袋可能有帮助'
  if (has('first_aid') && bonus === 0.30) return '💊 药品可能有帮助'
  return '🎒 你的装备可能有帮助'
}

function selectChoice(choiceId: string) {
  playUIClick()
  if (!event.value) return
  const choice = event.value.choices.find(c => c.id === choiceId)
  if (!choice) return

  const rng = game.getRng()

  // Check probability with equipment bonus
  let success = true
  if (choice.probability !== undefined && choice.probability < 1) {
    let finalProb = choice.probability
    // Equipment bonus: matching gear gives +30% to success chance
    const bonus = getEquipmentBonus(event.value, choice)
    finalProb = Math.min(0.95, finalProb + bonus)
    success = rng.next() < finalProb
  }

  if (success) {
    resultText.value = choice.narrative
    // Apply consequences
    for (const c of choice.consequences) {
      applyConsequence(c)
    }
    // Consume item if needed
    if (choice.itemCost) {
      const idx = game.player.inventory.findIndex(i => i.defId === choice.itemCost!.defId)
      if (idx >= 0) {
        game.player.inventory.splice(idx, 1)
        game.updatePlayer({ itemsConsumed: game.player.itemsConsumed + 1 })
      }
    }
  } else {
    resultText.value = choice.failNarrative || choice.narrative
    if (choice.failConsequences) {
      for (const c of choice.failConsequences) {
        applyConsequence(c)
      }
    }
  }

  showResult.value = true
}

function applyConsequence(c: { type: string; payload?: any }) {
  switch (c.type) {
    case 'add_status':
      game.player.statusEffects.push(c.payload)
      break
    case 'remove_status':
      game.updatePlayer({
        statusEffects: game.player.statusEffects.filter(s => s.type !== c.payload),
      })
      break
    case 'modify_water':
      game.updatePlayer({ water: Math.max(0, game.player.water + (c.payload as number)) })
      break
    case 'modify_speed_temp':
      // Temporary speed mod — simplified: just modify speed directly
      game.updatePlayer({ speed: Math.max(1, game.player.speed + c.payload.delta) })
      break
    case 'skip_turn':
      game.updatePlayer({ turnCount: game.player.turnCount + 1 })
      break
    case 'trigger_death':
      game.setEnding({
        type: 'death',
        narrative: resultText.value,
        stats: {
          turnsPlayed: game.player.turnCount,
          segmentReached: game.player.segmentId,
          eventsEncountered: game.player.eventsEncountered,
          itemsConsumed: game.player.itemsConsumed,
          waterConsumed: game.player.waterConsumed,
        },
      })
      router.push('/ending')
      break
    case 'consume_item': {
      // 消耗物品：从背包中移除一个
      const idx = game.player.inventory.findIndex(i => i.defId === c.payload)
      if (idx >= 0) {
        const itemDef = ITEMS[c.payload]
        game.player.inventory.splice(idx, 1)
        game.updatePlayer({
          itemsConsumed: game.player.itemsConsumed + 1,
          currentWeight: game.player.inventory.reduce(
            (sum, it) => sum + (ITEMS[it.defId]?.weight ?? 0), 0
          ),
        })
        // 消耗品使用提示
        if (itemDef) {
          const remaining = game.player.inventory.filter(i => i.defId === c.payload).length
          resultText.value += `\n\n📦 使用了 ${itemDef.emoji} ${itemDef.name}（剩余 ${remaining}）`
        }
      }
      break
    }
    case 'damage_item': {
      // 损坏物品：标记为 damaged
      const item = game.player.inventory.find(i => i.defId === c.payload && !i.damaged)
      if (item) {
        item.damaged = true
        const itemDef = ITEMS[c.payload]
        if (itemDef) {
          resultText.value += `\n\n⚠️ ${itemDef.emoji} ${itemDef.name} 已损坏，无法继续使用`
        }
      }
      break
    }
    case 'add_item': {
      // 添加物品到背包
      game.player.inventory.push({ defId: c.payload, damaged: false })
      game.updatePlayer({
        currentWeight: game.player.inventory.reduce(
          (sum, it) => sum + (ITEMS[it.defId]?.weight ?? 0), 0
        ),
      })
      break
    }
    case 'trigger_lost':
      game.player.statusEffects.push({
        type: 'lost',
        speedModifier: -2,
        turnsRemaining: 2,
      })
      break
    case 'narrative_only':
    default:
      break
  }
}

function dismissResult() {
  showResult.value = false
  resultText.value = ''
  game.updatePlayer({ eventsEncountered: game.player.eventsEncountered + 1 })
  game.resolveEvent()
  game.saveToLocalStorage()

  // Check if we moved to ending
  if (game.phase === 'ENDING') {
    router.push('/ending')
  }
}

function leaveCamp() {
  game.setPhase('MARCHING')
  game.saveToLocalStorage()
}

async function checkCampRack() {
  if (!supabaseReady.value) { campRackCount.value = 0; return }
  const seg = game.currentSegment
  const campId = getCampIdForSegment(seg.id)
  if (!campId) { campRackCount.value = 0; return }
  const items = await fetchRackItems(campId)
  campRackCount.value = items.length
}

function getCampIdForSegment(segId: number): string | null {
  const map: Record<number, string> = {
    1: 'camp-2900',    // 段1结束到2900营地
    3: 'camp-shuiwozi', // 段3结束到水窝子
    5: 'camp-2800',    // 段5结束到2800营地
    9: 'camp-dayehai', // 段9到大爷海
  }
  return map[segId] ?? null
}

function enterDescent() {
  if (!descentId.value) return
  const route = getDescentRoute(descentId.value)
  if (!route) return

  descentRoute.value = route
  game.updatePlayer({
    isOnDescent: true,
    descentRouteId: descentId.value,
    descentTurn: 0,
  })
  game.setPhase('DESCENT')
  descentNarrative.value = `你决定下撤。沿${route.name}路线，预计${route.turnCount}回合可抵达安全地带。`
  game.saveToLocalStorage()
}

// Descent march — advance one turn on descent route
function descentMarch() {
  if (!descentRoute.value) return
  const rng = game.getRng()
  const route = descentRoute.value

  // Water consumption on descent (simplified: 0.15L per turn)
  const waterCost = 0.06  // 下撤水消耗也同步降低
  const newWater = Math.max(0, +(game.player.water - waterCost).toFixed(2))
  game.updatePlayer({
    water: newWater,
    waterConsumed: +(game.player.waterConsumed + waterCost).toFixed(2),
    descentTurn: game.player.descentTurn + 1,
    turnCount: game.player.turnCount + 1,
  })

  // Add log
  game.addTurnLog({
    turn: game.player.turnCount,
    segmentName: `下撤: ${route.name}`,
    weather: game.weather,
    narrative: `下撤第 ${game.player.descentTurn} 回合`,
  })

  // Check dehydration death on descent
  if (newWater <= 0) {
    const dehydrated = game.player.statusEffects.find(s => s.type === 'dehydration')
    if (dehydrated && dehydrated.deathCountdown !== undefined) {
      dehydrated.deathCountdown--
      if (dehydrated.deathCountdown <= 0) {
        game.setEnding({
          type: 'death',
          narrative: '下撤途中，你已经没有力气继续前进……',
          deathCause: 'dehydration',
          stats: {
            turnsPlayed: game.player.turnCount,
            segmentReached: game.player.segmentId,
            eventsEncountered: game.player.eventsEncountered,
            itemsConsumed: game.player.itemsConsumed,
            waterConsumed: game.player.waterConsumed,
          },
        })
        game.saveToLocalStorage()
        router.push('/ending')
        return
      }
    } else if (!dehydrated) {
      game.player.statusEffects.push({
        type: 'dehydration', speedModifier: -2, turnsRemaining: -1, deathCountdown: 2,
      })
    }
  }

  // Roll descent events for this turn
  const currentTurn = game.player.descentTurn
  const triggerableEvents = route.events.filter((_e, idx) => {
    // Distribute events across turns: event i triggers on turn ceil((i+1) * turnCount / eventCount)
    const triggerTurn = Math.ceil((idx + 1) * route.turnCount / route.events.length)
    return triggerTurn === currentTurn
  })

  for (const de of triggerableEvents) {
    if (de.triggerType === 'fixed' || rng.next() < de.probability) {
      game.setCurrentEvent(de.event)
      game.saveToLocalStorage()
      return
    }
  }

  // Check if descent complete
  if (game.player.descentTurn >= route.turnCount) {
    game.setEnding({
      type: 'descent',
      narrative: `你沿${route.name}安全下撤到了${route.to}。山在身后，你活着离开了。`,
      descentRouteId: route.id,
      stats: {
        turnsPlayed: game.player.turnCount,
        segmentReached: game.player.segmentId,
        eventsEncountered: game.player.eventsEncountered,
        itemsConsumed: game.player.itemsConsumed,
        waterConsumed: game.player.waterConsumed,
      },
    })
    // 记录足迹 + 带出坏档（下撤也算成功走出）
    if (playerIdentity.identity && supabaseReady.value) {
      recordFootprint(
        playerIdentity.identity.id,
        playerIdentity.identity.nickname,
        playerIdentity.identity.emoji,
        'descent',
        game.state.player.segmentId,
        game.state.player.gridInSegment,
        game.player.turnCount,
        carriedDeadIds.value,
      )
      if (carriedDeadIds.value.length > 0) {
        bringOutDead(carriedDeadIds.value, playerIdentity.identity.id, playerIdentity.identity.nickname)
      }
    }
    game.saveToLocalStorage()
    router.push('/ending')
    return
  }

  descentNarrative.value = `下撤中……第 ${currentTurn}/${route.turnCount} 回合。前方的路依然陡峭。`
  game.saveToLocalStorage()
}
</script>

<template>
  <div class="game-view">
    <!-- Top: Map (3D) or Elevation (2D fallback) -->
    <div v-if="hasMapTiler" class="map-area">
      <MapTerrain />
    </div>
    <ElevationProfile v-else />

    <!-- Walking flavor — 纯氛围叙事，不影响游戏 -->
    <transition name="flavor-fade">
      <div v-if="walkingFlavor && phase === 'MARCHING'" class="walking-flavor">
        <span class="flavor-icon">🥾</span>
        <span class="flavor-text">{{ walkingFlavor }}</span>
      </div>
    </transition>

    <!-- Middle: Narrative area -->
    <div class="narrative-area">
      <!-- Event mode -->
      <template v-if="phase === 'EVENT' && event">
        <NarrativePanel
          v-if="!showResult"
          :text="event.narrative"
          @done="narrativeReady = true"
        />
        <NarrativePanel
          v-else
          :text="resultText"
          @done="narrativeReady = true"
        />

        <!-- Choices -->
        <div v-if="!showResult && narrativeReady" class="choices">
          <ChoiceButton
            v-for="choice in event.choices"
            :key="choice.id"
            :choice="choice"
            :disabled="!hasRequiredItem(choice)"
            :unavailable-reason="!hasRequiredItem(choice) ? '缺少所需物品' : ''"
            :equipment-hint="event ? getEquipmentHint(event, choice) : null"
            @select="selectChoice"
          />
        </div>

        <!-- Dismiss result -->
        <button v-if="showResult && narrativeReady" class="btn-continue" @click="dismissResult">
          继续 &raquo;
        </button>
      </template>

      <!-- Marching mode -->
      <template v-else-if="phase === 'MARCHING'">
        <div class="march-panel">
          <p class="march-text">你站在路上，前方是未知。</p>

          <!-- 下撤决策辅助：有下撤选项时显示当前危险属性 -->
          <div v-if="descentId && descentRisks.length > 0" class="descent-risk-panel">
            <div class="risk-header">⚠️ 当前状态评估</div>
            <div class="risk-items">
              <div
                v-for="(r, i) in descentRisks"
                :key="i"
                class="risk-item"
                :class="r.severity"
              >
                <span class="risk-icon">{{ r.icon }}</span>
                <span class="risk-label">{{ r.label }}</span>
                <span class="risk-value">{{ r.value }}</span>
              </div>
            </div>
          </div>

          <div class="march-actions">
            <button class="btn-march" @click="march">继续前进</button>
            <button v-if="descentId" class="btn-descent" @click="enterDescent">
              ⬇️ 选择下撤
            </button>
          </div>
        </div>
      </template>

      <!-- Camp mode -->
      <template v-else-if="phase === 'CAMP'">
        <div class="camp-panel">
          <h3>⛺ 营地</h3>
          <p>你到达了营地。可以休息、补给。</p>

          <!-- Supply rack banner -->
          <div v-if="supabaseReady && campRackCount > 0" class="rack-banner" @click="showSupplyRack = true">
            <span class="rack-banner-icon">📦</span>
            <span class="rack-banner-text">有人在这里留下了东西！</span>
            <span class="rack-banner-count">{{ campRackCount }}件</span>
          </div>

          <div class="camp-actions">
            <button v-if="supabaseReady" class="btn-rack" @click="showSupplyRack = true">
              📦 查看物资架 {{ campRackCount > 0 ? '' : '(空)' }}
            </button>
            <button class="btn-march" @click="leaveCamp">继续出发</button>
          </div>
        </div>

        <!-- Supply rack modal -->
        <SupplyRack
          v-if="showSupplyRack"
          :camp-id="getCampIdForSegment(game.state.player.segmentId) ?? ''"
          @close="showSupplyRack = false; checkCampRack()"
        />
      </template>

      <!-- Descent mode -->
      <template v-else-if="phase === 'DESCENT'">
        <div class="descent-panel">
          <h3>⬇️ 下撤中</h3>
          <NarrativePanel :text="descentNarrative" @done="narrativeReady = true" />
          <div class="descent-progress">
            <span>回合: {{ game.player.descentTurn }} / {{ descentRoute?.turnCount ?? '?' }}</span>
          </div>
          <button class="btn-descent-march" @click="descentMarch">继续下撤</button>
        </div>
      </template>
    </div>

    <!-- Dead player discovery modal -->
    <div v-if="showDeadDiscovery && discoveredDead" class="dead-discovery-overlay">
      <div class="dead-discovery-modal">
        <div class="dead-icon">💀</div>
        <p class="dead-narrative">
          你在路边发现了一处痕迹……{{ discoveredDead.emoji }} <strong>{{ discoveredDead.nickname }}</strong> 似乎曾在此处停下，再也没有起来。
        </p>
        <p v-if="discoveredDead.death_cause" class="dead-cause">
          疑似原因：{{ getDeathCauseText(discoveredDead.death_cause) }}
        </p>
        <div class="dead-actions">
          <button class="btn-record" @click="handleRecordDead">📝 记录此人</button>
          <button class="btn-ignore" @click="handleIgnoreDead">继续前行</button>
        </div>
        <p class="dead-hint">记录后，若你成功走出这座山，这份记录将被带出。</p>
      </div>
    </div>

    <!-- Turn log panel -->
    <TurnLogPanel />

    <!-- Danger alerts — 致命状态醒目提示 -->
    <DangerAlert />

    <!-- Bottom: Status bar -->
    <StatusBar />
  </div>
</template>

<style scoped>
/* Walking flavor — 氛围叙事条 */
.walking-flavor {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(212, 167, 83, 0.06);
  border-left: 3px solid rgba(212, 167, 83, 0.3);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  margin-bottom: var(--spacing-sm);
}

.flavor-icon {
  font-size: 0.9rem;
  opacity: 0.6;
  flex-shrink: 0;
}

.flavor-text {
  font-size: 0.82rem;
  color: var(--color-text-dim);
  font-family: var(--font-narrative);
  font-style: italic;
  line-height: 1.5;
}

.flavor-fade-enter-active,
.flavor-fade-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.flavor-fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.flavor-fade-leave-to {
  opacity: 0;
}

.map-area {
  width: 100%;
  height: 40vh;
  min-height: 260px;
  max-height: 400px;
  margin-bottom: var(--spacing-sm);
}

.game-view {
  min-height: 100vh;
  max-width: 640px;
  margin: 0 auto;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.narrative-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.choices {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.btn-continue, .btn-march, .btn-descent {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  font-family: var(--font-ui);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-continue {
  align-self: flex-end;
  background: var(--color-bg-card);
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.btn-continue:hover {
  background: rgba(212, 167, 83, 0.1);
}

.btn-march {
  background: var(--color-accent);
  color: var(--color-bg);
  border-color: var(--color-accent);
  flex: 1;
}

.btn-march:hover {
  background: #e0b363;
}

.btn-descent {
  background: var(--color-bg-card);
  color: var(--color-safety);
  border-color: var(--color-safety);
}

.btn-descent:hover {
  background: rgba(127, 181, 213, 0.1);
}

.march-panel, .camp-panel {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  text-align: center;
}

.march-text {
  font-family: var(--font-narrative);
  color: var(--color-text-dim);
  margin-bottom: var(--spacing-md);
}

.march-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
}

/* 下撤决策辅助面板 */
.descent-risk-panel {
  background: rgba(180, 40, 40, 0.08);
  border: 1px solid rgba(180, 40, 40, 0.3);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-md);
  text-align: left;
}

.risk-header {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-danger, #b42828);
  margin-bottom: var(--spacing-xs);
  letter-spacing: 0.03em;
}

.risk-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.risk-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 3px;
}

.risk-item.warning {
  color: #d4a753;
  background: rgba(212, 167, 83, 0.08);
}

.risk-item.danger {
  color: #e07040;
  background: rgba(224, 112, 64, 0.1);
}

.risk-item.critical {
  color: #e03030;
  background: rgba(224, 48, 48, 0.12);
  font-weight: 700;
}

.risk-icon {
  flex-shrink: 0;
  font-size: 0.9rem;
}

.risk-label {
  min-width: 3em;
}

.risk-value {
  margin-left: auto;
  font-family: var(--font-ui);
}

.camp-panel h3 {
  font-size: 1.2rem;
  color: var(--color-accent);
  margin-bottom: var(--spacing-sm);
}

.camp-panel p {
  color: var(--color-text-dim);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-md);
}

.descent-panel {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-safety);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  text-align: center;
}

.descent-panel h3 {
  font-size: 1.2rem;
  color: var(--color-safety);
  margin-bottom: var(--spacing-sm);
}

.descent-progress {
  color: var(--color-text-dim);
  font-size: 0.85rem;
  margin: var(--spacing-sm) 0;
}

.btn-descent-march {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-safety);
  font-family: var(--font-ui);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--color-safety);
  color: var(--color-bg);
}

.btn-descent-march:hover {
  background: #9ac6dd;
}

/* Supply rack banner */
.rack-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(212, 167, 83, 0.12);
  border: 1px solid rgba(212, 167, 83, 0.4);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-md);
  cursor: pointer;
  transition: all 0.2s;
  animation: rack-glow 2s ease-in-out infinite;
}

.rack-banner:hover {
  background: rgba(212, 167, 83, 0.2);
}

@keyframes rack-glow {
  0%, 100% { border-color: rgba(212, 167, 83, 0.4); }
  50% { border-color: rgba(212, 167, 83, 0.8); }
}

.rack-banner-icon {
  font-size: 1.3rem;
}

.rack-banner-text {
  flex: 1;
  font-size: 0.9rem;
  color: var(--color-accent);
  font-weight: 600;
}

.rack-banner-count {
  font-size: 0.78rem;
  color: var(--color-text-dim);
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 8px;
  border-radius: 10px;
}

.camp-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.btn-rack {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-dim);
  font-family: var(--font-ui);
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-rack:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* Dead player discovery */
.dead-discovery-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 5, 5, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 950;
  padding: var(--spacing-md);
}

.dead-discovery-modal {
  background: var(--color-bg-panel);
  border: 1px solid rgba(180, 40, 40, 0.5);
  border-radius: var(--radius-lg, 12px);
  padding: var(--spacing-xl, 32px);
  max-width: 380px;
  width: 100%;
  text-align: center;
}

.dead-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  opacity: 0.8;
}

.dead-narrative {
  font-size: 0.9rem;
  color: var(--color-text);
  font-family: var(--font-narrative);
  line-height: 1.7;
  margin-bottom: var(--spacing-sm);
}

.dead-cause {
  font-size: 0.8rem;
  color: var(--color-danger);
  margin-bottom: var(--spacing-md);
}

.dead-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-bottom: var(--spacing-sm);
}

.btn-record {
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-accent);
  background: rgba(212, 167, 83, 0.1);
  color: var(--color-accent);
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-record:hover {
  background: rgba(212, 167, 83, 0.2);
}

.btn-ignore {
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-dim);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ignore:hover {
  border-color: var(--color-text-dim);
}

.dead-hint {
  font-size: 0.75rem;
  color: var(--color-text-dim);
  opacity: 0.6;
  font-style: italic;
}

/* Mobile */
@media (max-width: 640px) {
  .game-view {
    padding: var(--spacing-sm);
    padding-bottom: calc(var(--spacing-sm) + env(safe-area-inset-bottom, 0px));
    gap: var(--spacing-xs);
    min-height: 100dvh;
  }
  .map-area { height: 25vh; min-height: 150px; max-height: 220px; }
  .march-panel, .camp-panel { padding: var(--spacing-sm); }
  .march-actions { flex-direction: column; }
  .camp-actions { flex-direction: column; }
  .btn-march, .btn-descent, .btn-rack { width: 100%; }
}
</style>
