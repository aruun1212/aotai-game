<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  text: string
  speed?: number // chars per second, default 30
}>()

const emit = defineEmits<{
  done: []
}>()

const displayText = ref('')
const isComplete = ref(false)
let timer: ReturnType<typeof setInterval> | null = null
let charIndex = 0

function startTypewriter() {
  stop()
  displayText.value = ''
  charIndex = 0
  isComplete.value = false

  const cps = props.speed ?? 30
  const interval = 1000 / cps

  timer = setInterval(() => {
    if (charIndex < props.text.length) {
      displayText.value += props.text[charIndex]
      charIndex++
    } else {
      isComplete.value = true
      stop()
      emit('done')
    }
  }, interval)
}

function skip() {
  stop()
  displayText.value = props.text
  isComplete.value = true
  emit('done')
}

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch(() => props.text, () => {
  startTypewriter()
}, { immediate: true })

onUnmounted(stop)
</script>

<template>
  <div class="narrative-panel">
    <div class="narrative-text" v-html="displayText.replace(/\n/g, '<br/>')"></div>
    <button v-if="!isComplete" class="skip-btn" @click="skip">跳过 &raquo;</button>
  </div>
</template>

<style scoped>
.narrative-panel {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  position: relative;
  min-height: 120px;
}

.narrative-text {
  font-family: var(--font-narrative);
  font-size: 1rem;
  line-height: 2;
  color: var(--color-text);
  white-space: pre-wrap;
}

.skip-btn {
  position: absolute;
  bottom: var(--spacing-sm);
  right: var(--spacing-sm);
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-dim);
  font-size: 0.75rem;
  padding: 2px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.skip-btn:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}
</style>