<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabaseReady } from '@/lib/supabase'
import { fetchRecentFootprints, fetchVisibleDead } from '@/services/deadPlayerService'

// Segment positions (simplified Y coordinates for SVG visualization)
const SEGMENT_Y: Record<number, number> = {
  1: 90, 2: 80, 3: 70, 4: 62, 5: 55, 6: 45, 7: 35, 8: 28, 9: 20, 10: 12, 11: 25, 12: 40,
}
const SEGMENT_X: Record<number, number> = {
  1: 5, 2: 15, 3: 25, 4: 35, 5: 45, 6: 55, 7: 65, 8: 75, 9: 82, 10: 88, 11: 90, 12: 95,
}

interface FootprintDot {
  x: number
  y: number
  emoji: string
  type: string  // completion / descent / death
}

const dots = ref<FootprintDot[]>([])
const deadMarkers = ref<{ x: number; y: number }[]>([])
const loaded = ref(false)

onMounted(async () => {
  if (!supabaseReady.value) { loaded.value = true; return }

  const [footprints, dead] = await Promise.all([
    fetchRecentFootprints(40),
    fetchVisibleDead(20),
  ])

  // Convert footprints to dots
  for (const fp of footprints) {
    const seg = fp.max_segment_id
    const baseX = SEGMENT_X[seg] ?? 50
    const baseY = SEGMENT_Y[seg] ?? 50
    dots.value.push({
      x: baseX + (Math.random() - 0.5) * 6,
      y: baseY + (Math.random() - 0.5) * 6,
      emoji: fp.emoji,
      type: fp.ending_type,
    })
  }

  // Convert dead to skull markers
  for (const d of dead) {
    const baseX = SEGMENT_X[d.segment_id] ?? 50
    const baseY = SEGMENT_Y[d.segment_id] ?? 50
    deadMarkers.value.push({
      x: baseX + (Math.random() - 0.5) * 4,
      y: baseY + (Math.random() - 0.5) * 4,
    })
  }

  loaded.value = true
})
</script>

<template>
  <div class="footprint-world" :class="{ loaded }">
    <!-- Ridge line (simplified path) -->
    <svg class="ridge-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <!-- Mountain ridge silhouette -->
      <polyline
        class="ridge-line"
        points="2,92 10,85 18,78 28,68 36,60 46,50 56,42 66,32 76,25 83,18 88,12 92,22 96,38"
        fill="none"
      />

      <!-- Footprint dots -->
      <circle
        v-for="(dot, i) in dots"
        :key="'fp-' + i"
        :cx="dot.x"
        :cy="dot.y"
        :r="0.8"
        class="footprint-dot"
        :class="dot.type"
      />

      <!-- Dead markers -->
      <circle
        v-for="(d, i) in deadMarkers"
        :key="'dead-' + i"
        :cx="d.x"
        :cy="d.y"
        r="1.2"
        class="dead-marker"
      />
    </svg>

    <!-- Stats overlay -->
    <div v-if="dots.length > 0" class="world-stats">
      <span>{{ dots.length }} 位旅人的足迹</span>
      <span v-if="deadMarkers.length > 0"> · {{ deadMarkers.length }} 处遗痕</span>
    </div>
  </div>
</template>

<style scoped>
.footprint-world {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 2s ease;
  z-index: 0;
}

.footprint-world.loaded {
  opacity: 1;
}

.ridge-svg {
  width: 100%;
  height: 100%;
}

.ridge-line {
  stroke: rgba(212, 167, 83, 0.15);
  stroke-width: 0.3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.footprint-dot {
  fill: rgba(212, 167, 83, 0.3);
  animation: dot-fade 4s ease-in-out infinite;
}

.footprint-dot.completion {
  fill: rgba(100, 200, 100, 0.4);
}

.footprint-dot.descent {
  fill: rgba(127, 181, 213, 0.4);
}

.dead-marker {
  fill: rgba(200, 40, 40, 0.5);
  animation: skull-pulse 3s ease-in-out infinite;
}

@keyframes dot-fade {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

@keyframes skull-pulse {
  0%, 100% { opacity: 0.3; r: 1.2; }
  50% { opacity: 0.8; r: 1.5; }
}

.world-stats {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: var(--color-text-dim);
  opacity: 0.5;
  white-space: nowrap;
  font-family: var(--font-ui);
}
</style>
