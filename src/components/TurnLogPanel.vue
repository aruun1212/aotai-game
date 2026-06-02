
<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const game = useGameStore()
const expanded = ref(false)
const logContainer = ref<HTMLElement | null>(null)

const logs = computed(() => game.turnLog)
const logCount = computed(() => logs.value.length)

// Auto-scroll to bottom when new entries arrive
watch(logCount, async () => {
  if (expanded.value && logContainer.value) {
    await nextTick()
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
})

function toggle() {
  expanded.value = !expanded.value
}
</script>

<template>
  <div class="turn-log" :class="{ expanded }">
    <button class="log-toggle" @click="toggle">
      {{ expanded ? '▼' : '▶' }} 行进日志
      <span class="log-count">{{ logCount }}</span>
    </button>

    <div v-if="expanded" ref="logContainer" class="log-entries">
      <div v-if="logs.length === 0" class="log-empty">
        尚无记录。
      </div>
      <div
        v-for="(entry, idx) in logs"
        :key="idx"
        class="log-entry"
      >
        <div class="log-meta">
          <span class="log-turn">第{{ entry.turn }}回合</span>
          <span class="log-segment">{{ entry.segmentName }}</span>
          <span class="log-weather">{{ entry.weather }}</span>
        </div>
        <div class="log-narrative">{{ entry.narrative }}</div>
        <div v-if="entry.choiceMade" class="log-choice">
          → {{ entry.choiceMade }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.turn-log {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.log-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: none;
  color: var(--color-text-dim);
  font-family: var(--font-ui);
  font-size: 0.85rem;
  cursor: pointer;
  text-align: left;
}

.log-toggle:hover {
  color: var(--color-text);
}

.log-count {
  margin-left: auto;
  background: var(--color-accent);
  color: var(--color-bg);
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.log-entries {
  max-height: 240px;
  overflow-y: auto;
  padding: 0 var(--spacing-md) var(--spacing-sm);
  scroll-behavior: smooth;
}

.log-entries::-webkit-scrollbar {
  width: 4px;
}

.log-entries::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 2px;
}

.log-empty {
  color: var(--color-text-dim);
  font-size: 0.8rem;
  font-style: italic;
  padding: var(--spacing-sm) 0;
}

.log-entry {
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.log-entry:last-child {
  border-bottom: none;
}

.log-meta {
  display: flex;
  gap: var(--spacing-sm);
  font-size: 0.75rem;
  color: var(--color-text-dim);
  margin-bottom: 2px;
}

.log-turn {
  color: var(--color-accent);
  font-weight: 600;
}

.log-segment {
  color: var(--color-text);
}

.log-weather {
  margin-left: auto;
  opacity: 0.7;
}

.log-narrative {
  font-size: 0.82rem;
  color: var(--color-text);
  line-height: 1.4;
  font-family: var(--font-narrative);
}

.log-choice {
  font-size: 0.78rem;
  color: var(--color-safety);
  margin-top: 2px;
}
</style>
