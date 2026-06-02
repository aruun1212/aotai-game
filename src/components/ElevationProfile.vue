<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { ROUTE_SEGMENTS } from '@/data/routes'

const game = useGameStore()

const segments = ROUTE_SEGMENTS
const currentSegId = computed(() => game.player.segmentId)
const gridInSeg = computed(() => game.player.gridInSegment)

// Calculate progress percentage across all 44 grids
const totalGrids = segments.reduce((sum, s) => sum + s.gridCount, 0)
const completedGrids = computed(() => {
  let grids = 0
  for (const seg of segments) {
    if (seg.id < currentSegId.value) {
      grids += seg.gridCount
    } else if (seg.id === currentSegId.value) {
      grids += gridInSeg.value
    }
  }
  return grids
})

const progressPercent = computed(() => (completedGrids.value / totalGrids) * 100)
</script>

<template>
  <div class="elevation-profile">
    <!-- Progress bar -->
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      <div class="position-dot" :style="{ left: progressPercent + '%' }"></div>
    </div>

    <!-- Segment labels -->
    <div class="seg-labels">
      <span
        v-for="seg in segments" :key="seg.id"
        class="seg-label"
        :class="{
          active: seg.id === currentSegId,
          passed: seg.id < currentSegId,
          future: seg.id > currentSegId
        }"
      >
        {{ seg.id <= currentSegId ? seg.name : '???' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.elevation-profile {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
}

.progress-track {
  position: relative;
  height: 6px;
  background: var(--color-bg-card);
  border-radius: 3px;
  margin-bottom: var(--spacing-sm);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-success), var(--color-accent));
  border-radius: 3px;
  transition: width var(--transition-normal);
}

.position-dot {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: var(--color-accent);
  border: 2px solid var(--color-bg);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: left var(--transition-normal);
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(212, 167, 83, 0.5);
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 4px rgba(212, 167, 83, 0.4); }
  50% { box-shadow: 0 0 12px rgba(212, 167, 83, 0.8); }
}

.seg-labels {
  display: flex;
  justify-content: space-between;
  overflow-x: auto;
  gap: 2px;
}

.seg-label {
  font-size: 0.55rem;
  white-space: nowrap;
  padding: 1px 2px;
  border-radius: 2px;
  transition: all var(--transition-fast);
}

.seg-label.active {
  color: var(--color-accent);
  font-weight: bold;
  font-size: 0.65rem;
}

.seg-label.passed {
  color: var(--color-text-dim);
}

.seg-label.future {
  color: var(--color-border);
}
</style>