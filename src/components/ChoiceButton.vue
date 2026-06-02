<script setup lang="ts">
import type { EventChoice } from '@/models/types'
import { ITEMS } from '@/data/items'
import { computed } from 'vue'

const props = defineProps<{
  choice: EventChoice
  disabled?: boolean
  unavailableReason?: string
  equipmentHint?: string | null
}>()

const emit = defineEmits<{
  select: [choiceId: string]
}>()

const costLabel = computed(() => {
  if (!props.choice.itemCost) return ''
  const def = ITEMS[props.choice.itemCost.defId]
  return def ? `${def.emoji} -${props.choice.itemCost.count}` : ''
})

const requireLabel = computed(() => {
  if (!props.choice.requiresItem) return ''
  const def = ITEMS[props.choice.requiresItem]
  return def ? `需要 ${def.emoji} ${def.name}` : ''
})
</script>

<template>
  <button
    class="choice-btn"
    :class="{ disabled: disabled }"
    :disabled="disabled"
    :title="unavailableReason || ''"
    @click="emit('select', choice.id)"
  >
    <span class="choice-text">{{ choice.text }}</span>
    <span v-if="costLabel" class="choice-cost">{{ costLabel }}</span>
    <span v-if="disabled && requireLabel" class="choice-require">{{ requireLabel }}</span>
    <span v-if="equipmentHint" class="choice-equipment-hint">
      {{ equipmentHint }}
    </span>
  </button>
</template>

<style scoped>
.choice-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-family: var(--font-ui);
  font-size: 0.9rem;
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-fast);
}

.choice-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  background: rgba(212, 167, 83, 0.05);
}

.choice-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.choice-text {
  flex: 1;
}

.choice-cost {
  font-size: 0.8rem;
  color: var(--color-warning);
  white-space: nowrap;
}

.choice-require {
  font-size: 0.7rem;
  color: var(--color-danger);
  white-space: nowrap;
}

.choice-equipment-hint {
  font-size: 0.72rem;
  color: var(--color-safety);
  background: rgba(127, 181, 213, 0.08);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  font-style: italic;
}
</style>
