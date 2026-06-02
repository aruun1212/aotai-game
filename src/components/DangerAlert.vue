<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const game = useGameStore()

interface DangerInfo {
  icon: string
  label: string
  message: string
  countdown: number
}

const dangers = computed<DangerInfo[]>(() => {
  const result: DangerInfo[] = []

  // 检查脱水
  const dehydration = game.player.statusEffects.find(s => s.type === 'dehydration')
  if (dehydration) {
    const cd = dehydration.deathCountdown ?? 0
    result.push({
      icon: '🏜️',
      label: '严重脱水',
      message: cd > 0
        ? `还剩 ${cd} 回合找到水源，否则将无法继续行进！`
        : '你已经无法继续行进了……',
      countdown: cd,
    })
  } else if (game.player.water <= 0) {
    result.push({
      icon: '💧',
      label: '缺水警告',
      message: '水已经耗尽！下一回合将进入脱水状态，2回合内必须补水！',
      countdown: 3,
    })
  } else if (game.player.water < 0.4) {
    result.push({
      icon: '💧',
      label: '水量极低',
      message: `仅剩 ${game.player.water.toFixed(1)}L 水，很快就会耗尽！`,
      countdown: -1,
    })
  }

  // 检查失温
  const hypothermia = game.player.statusEffects.find(s => s.type === 'hypothermia')
  if (hypothermia) {
    const cd = hypothermia.deathCountdown ?? 0
    result.push({
      icon: '❄️',
      label: '失温',
      message: cd > 0
        ? `体温持续下降，还剩 ${cd} 回合！需要保暖措施或躲避风雪！`
        : '你的意识正在模糊……',
      countdown: cd,
    })
  }

  // 检查力竭
  const exhaustion = game.player.statusEffects.find(s => s.type === 'exhaustion')
  if (exhaustion && exhaustion.deathCountdown !== undefined) {
    result.push({
      icon: '😵',
      label: '力竭',
      message: `身体到达极限，还剩 ${exhaustion.deathCountdown} 回合！必须休息！`,
      countdown: exhaustion.deathCountdown,
    })
  }

  return result
})

const hasDanger = computed(() => dangers.value.length > 0)
</script>

<template>
  <div v-if="hasDanger" class="danger-alerts">
    <div
      v-for="(d, i) in dangers"
      :key="i"
      class="danger-alert"
      :class="{ critical: d.countdown <= 1 && d.countdown >= 0 }"
    >
      <div class="danger-header">
        <span class="danger-icon">{{ d.icon }}</span>
        <span class="danger-label">{{ d.label }}</span>
        <span v-if="d.countdown >= 0" class="danger-countdown">
          {{ d.countdown === 0 ? '💀' : `⏳ ${d.countdown}回合` }}
        </span>
      </div>
      <div class="danger-message">{{ d.message }}</div>
    </div>
  </div>
</template>

<style scoped>
.danger-alerts {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin: var(--spacing-sm) 0;
}

.danger-alert {
  background: rgba(180, 40, 40, 0.15);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  animation: pulse-border 2s ease-in-out infinite;
}

.danger-alert.critical {
  background: rgba(220, 30, 30, 0.25);
  border-width: 2px;
  animation: pulse-critical 0.8s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% { border-color: var(--color-danger); }
  50% { border-color: rgba(180, 40, 40, 0.4); }
}

@keyframes pulse-critical {
  0%, 100% { 
    border-color: var(--color-danger);
    box-shadow: 0 0 8px rgba(220, 30, 30, 0.5);
  }
  50% { 
    border-color: #ff4444;
    box-shadow: 0 0 16px rgba(255, 68, 68, 0.7);
  }
}

.danger-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: 2px;
}

.danger-icon {
  font-size: 1.1rem;
}

.danger-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-danger);
  letter-spacing: 0.05em;
}

.danger-countdown {
  margin-left: auto;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-danger);
}

.danger-message {
  font-size: 0.82rem;
  color: var(--color-text);
  line-height: 1.4;
  font-family: var(--font-narrative);
}
</style>
