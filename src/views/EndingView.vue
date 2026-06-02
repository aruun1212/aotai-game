<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { getDescentRoute } from '@/data/descents'
import { supabaseReady } from '@/lib/supabase'
import Leaderboard from '@/components/Leaderboard.vue'
import { resetLocalPickCount } from '@/services/supplyRackService'

const router = useRouter()
const game = useGameStore()
const showLeaderboard = ref(false)

// 进入结局页面时自动清除存档——游戏已结束，不需要继续
onMounted(() => {
  game.clearSave()
  resetLocalPickCount()  // 重置取物计数（新局重新开始）
})

const ending = computed(() => game.ending)

const endingTitle = computed(() => {
  if (!ending.value) return ''
  switch (ending.value.type) {
    case 'completion': return '\ud83c\udfc6 完美通关'
    case 'descent': return '✅ 体面下撤'
    case 'death': return '\ud83d\udc80 坏档'
    default: return ''
  }
})

const endingNarrative = computed(() => {
  if (!ending.value) return ''
  if (ending.value.type === 'completion') {
    return '你走完了鳌太线。\n\n不是你征服了这座山，是这座山暂时宽恕了你。'
  }
  if (ending.value.type === 'descent') {
    const route = ending.value.descentRouteId ? getDescentRoute(ending.value.descentRouteId) : null
    const routeName = route ? route.name : '未知路线'
    return `你没有走完鳌太线——但你走出了山。\n\n下撤路线：${routeName}\n\n在鳌太线上，活着走出来就是最大的胜利。\n\n体面地下撤，是最大的智慧。`
  }
  // death
  return ending.value.narrative || '你再也没有从山上下来。'
})

const stats = computed(() => ending.value?.stats)

function playAgain() {
  game.clearSave()
  router.push('/')
}
</script>

<template>
  <div class="ending-view" :class="ending?.type">
    <h1 class="ending-title">{{ endingTitle }}</h1>

    <div class="ending-narrative">
      <p v-for="(line, i) in endingNarrative.split('\n')" :key="i">
        {{ line }}<br v-if="!line" />
      </p>
    </div>

    <div v-if="stats" class="stats-panel">
      <h3>行程统计</h3>
      <div class="stat-row">
        <span>回合数</span><span>{{ stats.turnsPlayed }}</span>
      </div>
      <div class="stat-row">
        <span>到达段位</span><span>第{{ stats.segmentReached }}段</span>
      </div>
      <div class="stat-row">
        <span>遇到事件</span><span>{{ stats.eventsEncountered }}</span>
      </div>
      <div class="stat-row">
        <span>消耗物品</span><span>{{ stats.itemsConsumed }}</span>
      </div>
      <div class="stat-row">
        <span>消耗水量</span><span>{{ stats.waterConsumed.toFixed(1) }}L</span>
      </div>
    </div>

    <button class="btn-replay" @click="playAgain">
      再走一次
    </button>

    <button v-if="supabaseReady" class="btn-leaderboard" @click="showLeaderboard = true">
      🏆 好人榜
    </button>

    <Leaderboard v-if="showLeaderboard" @close="showLeaderboard = false" />
  </div>
</template>

<style scoped>
.ending-view {
  min-height: 100vh;
  max-width: 560px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xl);
  text-align: center;
}

.ending-title {
  font-family: var(--font-title);
  font-size: 2.5rem;
  letter-spacing: 0.2em;
}

.ending-view.completion .ending-title { color: var(--color-accent); }
.ending-view.descent .ending-title { color: var(--color-success); }
.ending-view.death .ending-title { color: var(--color-danger); }

.ending-narrative {
  font-family: var(--font-narrative);
  font-size: 1rem;
  line-height: 2;
  color: var(--color-text);
  max-width: 480px;
}

.ending-narrative p {
  margin-bottom: var(--spacing-sm);
}

.stats-panel {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  width: 100%;
  max-width: 320px;
}

.stats-panel h3 {
  font-size: 0.9rem;
  color: var(--color-accent);
  margin-bottom: var(--spacing-sm);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  padding: 4px 0;
  border-bottom: 1px solid var(--color-border);
}

.stat-row:last-child { border-bottom: none; }

.stat-row span:first-child { color: var(--color-text-dim); }

.btn-replay {
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--color-bg-card);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
  color: var(--color-accent);
  font-family: var(--font-title);
  font-size: 1.2rem;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-replay:hover {
  background: rgba(212, 167, 83, 0.1);
  transform: translateY(-2px);
}

.btn-leaderboard {
  padding: var(--spacing-xs) var(--spacing-lg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-accent);
  background: transparent;
  color: var(--color-accent);
  font-size: 0.9rem;
  font-family: var(--font-ui);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-leaderboard:hover {
  background: rgba(212, 167, 83, 0.1);
}
</style>
