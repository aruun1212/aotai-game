
<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { ITEMS } from '@/data/items'
import type { ItemDef } from '@/models/types'

const game = useGameStore()

const waterPercent = computed(() => {
  const max = game.player.inventory.filter(i => i.defId === 'water').length || 3
  return Math.min(100, Math.round((game.player.water / max) * 100))
})

const waterLevel = computed(() => {
  if (waterPercent.value > 60) return 'safe'
  if (waterPercent.value > 25) return 'warning'
  return 'danger'
})

const foodCount = computed(() =>
  game.player.inventory.filter(i => {
    const def = ITEMS[i.defId] as ItemDef | undefined
    return def && def.category === 'food'
  }).length
)

const segment = computed(() => game.currentSegment)

const activeEffects = computed(() =>
  game.player.statusEffects.filter(s => s.turnsRemaining !== 0)
)

const weatherEmoji = computed(() => {
  const map: Record<string, string> = {
    sunny: '☀️', cloudy: '⛅', overcast: '☁️',
    light_rain: '🌦️', rain: '🌧️', heavy_rain: '⛈️', thunderstorm: '⛈️',
    fog: '🌫️', heavy_fog: '🌫️',
    light_snow: '🌨️', snow: '❄️', blizzard: '🌨️',
  }
  return map[game.weather] || '🌤️'
})

const weatherName = computed(() => {
  const map: Record<string, string> = {
    sunny: '晴天', cloudy: '多云', overcast: '阴天',
    light_rain: '小雨', rain: '中雨', heavy_rain: '暴雨', thunderstorm: '雷暴',
    fog: '薄雾', heavy_fog: '浓雾',
    light_snow: '小雪', snow: '中雪', blizzard: '暴风雪',
  }
  return map[game.weather] || game.weather
})
</script>

<template>
  <div class="status-bar">
    <!-- 水量 -->
    <div class="stat-group water-group">
      <div class="stat-label">💧 水</div>
      <div class="water-bar-outer">
        <div
          class="water-bar-inner"
          :class="waterLevel"
          :style="{ width: waterPercent + '%' }"
        />
      </div>
      <span class="stat-value">{{ game.player.water.toFixed(1) }}L</span>
    </div>

    <!-- 食物 -->
    <div class="stat-group">
      <span class="stat-label">🍙 食物</span>
      <span class="stat-value">{{ foodCount }}</span>
    </div>

    <!-- 负重 -->
    <div class="stat-group">
      <span class="stat-label">🎒 负重</span>
      <span class="stat-value">{{ game.player.currentWeight.toFixed(1) }}kg</span>
    </div>

    <!-- 速度 -->
    <div class="stat-group">
      <span class="stat-label">👣 速度</span>
      <span class="stat-value">{{ game.player.speed }}格/回合</span>
    </div>

    <!-- 天气 -->
    <div class="stat-group">
      <span class="stat-label">{{ weatherEmoji }}</span>
      <span class="stat-value">{{ weatherName }}</span>
    </div>

    <!-- 回合 -->
    <div class="stat-group">
      <span class="stat-label">⏱️</span>
      <span class="stat-value">第{{ game.player.turnCount }}回合</span>
    </div>

    <!-- 段落 -->
    <div v-if="segment" class="stat-group segment-info">
      <span class="stat-label">📍</span>
      <span class="stat-value">{{ segment.name }}</span>
    </div>

    <!-- 状态效果 -->
    <div v-if="activeEffects.length > 0" class="status-effects">
      <div
        v-for="effect in activeEffects"
        :key="effect.type"
        class="effect-badge"
        :class="effect.type"
      >
        <span class="effect-name">{{ effectName(effect.type) }}</span>
        <span v-if="effect.deathCountdown !== undefined" class="death-countdown">
          ⚠️{{ effect.deathCountdown }}
        </span>
        <span v-else-if="effect.turnsRemaining > 0" class="effect-turns">
          {{ effect.turnsRemaining }}回合
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
function effectName(type: string): string {
  const names: Record<string, string> = {
    hypothermia: '❄️ 失温',
    dehydration: '🏜️ 脱水',
    exhaustion: '😩 力竭',
    hunger: '🍽️ 饥饿',
    injury: '🩹 受伤',
    sprain: '🦶 扭伤',
    fracture: '🦴 骨折',
    lost: '🧭 迷路',
    altitude_sickness: '🏔️ 高反',
    morale_boost: '✨ 鼓舞',
    fatigue: '😵 疲劳',
    sunburn: '🔥 晒伤',
    frostbite: '🥶 冻伤',
    blister: '🦶 水泡',
    headache: '🤕 头痛',
    nausea: '🤢 恶心',
    fever: '🤒 发烧',
    wet: '💦 湿透',
    cold: '🥶 寒冷',
    scared: '😰 恐惧',
    slow: '🐢 迟缓',
  }
  return names[type] || `⚠️ ${type}`
}
</script>

<style scoped>
.status-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
}

.stat-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-label {
  color: var(--color-text-dim);
  font-size: 0.78rem;
}

.stat-value {
  color: var(--color-text);
  font-weight: 500;
}

/* Water bar */
.water-group {
  min-width: 140px;
}

.water-bar-outer {
  width: 60px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 4px;
}

.water-bar-inner {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease, background 0.3s ease;
}

.water-bar-inner.safe {
  background: var(--color-safety);
}

.water-bar-inner.warning {
  background: var(--color-accent);
}

.water-bar-inner.danger {
  background: var(--color-danger);
  animation: pulse-danger 1s ease-in-out infinite;
}

@keyframes pulse-danger {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Segment info */
.segment-info .stat-value {
  color: var(--color-accent);
}

/* Status effects */
.status-effects {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  margin-left: auto;
}

.effect-badge {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--color-border);
}

.effect-badge.hypothermia {
  border-color: var(--color-safety);
  color: var(--color-safety);
}

.effect-badge.dehydration {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.effect-badge.exhaustion,
.effect-badge.hunger {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.effect-badge.morale_boost {
  border-color: #8bc34a;
  color: #8bc34a;
}

.death-countdown {
  color: var(--color-danger);
  font-weight: 700;
  animation: pulse-danger 0.8s ease-in-out infinite;
}

.effect-turns {
  color: var(--color-text-dim);
  font-size: 0.7rem;
}

@media (max-width: 640px) {
  .status-bar {
    gap: var(--spacing-sm);
    padding: var(--spacing-xs) var(--spacing-sm);
    padding-bottom: calc(var(--spacing-xs) + env(safe-area-inset-bottom, 0px));
    font-size: 0.75rem;
  }
  .water-group { min-width: 110px; }
  .water-bar-outer { width: 40px; }
  .segment-info { display: none; }
}
</style>
