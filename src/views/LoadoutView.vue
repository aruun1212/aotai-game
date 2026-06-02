<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { PRESETS, type Preset } from '@/data/presets'
import { ITEMS, ITEM_LIST } from '@/data/items'
import type { ItemInstance } from '@/models/types'

const router = useRouter()
const game = useGameStore()

const activePresetId = ref('balanced')
const inventory = ref<ItemInstance[]>([])

const activePreset = computed(() => PRESETS.find(p => p.id === activePresetId.value)!)

// Initialize from preset
function loadPreset(preset: Preset) {
  activePresetId.value = preset.id
  inventory.value = JSON.parse(JSON.stringify(preset.defaultItems))
}
loadPreset(activePreset.value)

watch(activePresetId, () => loadPreset(activePreset.value))

// Computed
const totalWeight = computed(() =>
  inventory.value.reduce((sum, it) => sum + (ITEMS[it.defId]?.weight ?? 0), 0)
)

const weightPercent = computed(() =>
  Math.min(100, (totalWeight.value / activePreset.value.weightCap) * 100)
)

const isOverWeight = computed(() => totalWeight.value > activePreset.value.weightCap)

const waterCount = computed(() => inventory.value.filter(i => i.defId === 'water').length)
const biscuitCount = computed(() => inventory.value.filter(i => i.defId === 'biscuit').length)

const canDepart = computed(() =>
  !isOverWeight.value &&
  waterCount.value >= activePreset.value.lockedWater &&
  biscuitCount.value >= activePreset.value.lockedBiscuit
)

// Item counting
function countItem(defId: string): number {
  return inventory.value.filter(i => i.defId === defId).length
}

function addItem(defId: string) {
  const def = ITEMS[defId]
  if (!def) return
  if (totalWeight.value + def.weight > activePreset.value.weightCap) return
  inventory.value.push({
    defId,
    damaged: false,
    ...(def.durabilityType === 'durable_fuel' ? { fuelCharges: def.maxFuelCharges } : {}),
  })
}

function removeItem(defId: string) {
  // Cannot remove below locked minimums
  if (defId === 'water' && waterCount.value <= activePreset.value.lockedWater) return
  if (defId === 'biscuit' && biscuitCount.value <= activePreset.value.lockedBiscuit) return
  const idx = inventory.value.findLastIndex(i => i.defId === defId)
  if (idx >= 0) inventory.value.splice(idx, 1)
}

function canRemove(defId: string): boolean {
  if (defId === 'water') return waterCount.value > activePreset.value.lockedWater
  if (defId === 'biscuit') return biscuitCount.value > activePreset.value.lockedBiscuit
  return countItem(defId) > 0
}

function durabilityLabel(type: string): string {
  switch (type) {
    case 'consumable': return '消耗品'
    case 'durable': return '持久'
    case 'durable_fuel': return '有限次'
    default: return ''
  }
}

function confirmDeparture() {
  if (!canDepart.value) return
  game.confirmLoadout(activePresetId.value, inventory.value)
  router.push('/game')
}
</script>

<template>
  <div class="loadout-view">
    <h1 class="page-title">出发准备</h1>

    <!-- Preset tabs -->
    <div class="preset-tabs">
      <button
        v-for="p in PRESETS" :key="p.id"
        :class="['preset-tab', { active: activePresetId === p.id }]"
        @click="loadPreset(p)"
      >
        <span class="tab-emoji">{{ p.emoji }}</span>
        <span class="tab-name">{{ p.name }}</span>
      </button>
    </div>

    <p class="preset-desc">{{ activePreset.description }}</p>

    <!-- Weight bar -->
    <div class="weight-section">
      <div class="weight-bar-wrapper">
        <div class="weight-bar" :class="{ over: isOverWeight }" :style="{ width: weightPercent + '%' }"></div>
      </div>
      <span class="weight-label" :class="{ over: isOverWeight }">
        {{ totalWeight.toFixed(1) }} / {{ activePreset.weightCap }} kg
      </span>
      <span class="speed-badge">→ 速度 {{ activePreset.initialSpeed }}</span>
    </div>

    <!-- Item grid -->
    <div class="item-grid">
      <div v-for="itemDef in ITEM_LIST" :key="itemDef.id" class="item-card">
        <div class="item-header">
          <span class="item-emoji">{{ itemDef.emoji }}</span>
          <span class="item-name">{{ itemDef.name }}</span>
          <span
            class="item-type-tag"
            :class="itemDef.durabilityType"
          >{{ durabilityLabel(itemDef.durabilityType) }}</span>
          <span class="item-weight">{{ itemDef.weight }}kg</span>
        </div>
        <p class="item-desc">{{ itemDef.description }}</p>
        <div class="item-controls">
          <button class="ctrl-btn" :disabled="!canRemove(itemDef.id)" @click="removeItem(itemDef.id)">&minus;</button>
          <span class="item-count">{{ countItem(itemDef.id) }}</span>
          <button class="ctrl-btn" :disabled="totalWeight + itemDef.weight > activePreset.weightCap" @click="addItem(itemDef.id)">+</button>
        </div>
        <div v-if="(itemDef.id === 'water' || itemDef.id === 'biscuit')" class="locked-hint">
          ⛔ 最少 {{ itemDef.id === 'water' ? activePreset.lockedWater : activePreset.lockedBiscuit }}
        </div>
      </div>
    </div>

    <!-- Depart button -->
    <button class="btn-depart" :disabled="!canDepart" @click="confirmDeparture">
      踏上鳌太线
    </button>
  </div>
</template>

<style scoped>
.loadout-view {
  min-height: 100vh;
  max-width: 720px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}

.page-title {
  font-family: var(--font-title);
  font-size: 2rem;
  color: var(--color-accent);
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.preset-tabs {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.preset-tab {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: all var(--transition-fast);
  font-family: var(--font-ui);
  color: var(--color-text-dim);
  font-size: 0.9rem;
}

.preset-tab.active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: rgba(212, 167, 83, 0.08);
}

.preset-tab:hover {
  border-color: var(--color-accent);
}

.tab-emoji { font-size: 1.2rem; }

.preset-desc {
  text-align: center;
  color: var(--color-text-dim);
  font-size: 0.85rem;
  font-family: var(--font-narrative);
  margin-bottom: var(--spacing-lg);
}

.weight-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.weight-bar-wrapper {
  flex: 1;
  height: 8px;
  background: var(--color-bg-card);
  border-radius: 4px;
  overflow: hidden;
}

.weight-bar {
  height: 100%;
  background: var(--color-accent);
  border-radius: 4px;
  transition: width var(--transition-normal), background var(--transition-fast);
}

.weight-bar.over {
  background: var(--color-danger);
}

.weight-label {
  font-size: 0.85rem;
  color: var(--color-text-dim);
  white-space: nowrap;
}

.weight-label.over {
  color: var(--color-danger);
}

.speed-badge {
  font-size: 0.8rem;
  background: var(--color-bg-card);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  color: var(--color-safety);
  white-space: nowrap;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.item-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  position: relative;
}

.item-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: 4px;
}

.item-emoji { font-size: 1.1rem; }
.item-name { font-size: 0.85rem; font-weight: bold; flex: 1; }
.item-weight { font-size: 0.75rem; color: var(--color-text-dim); }

.item-type-tag {
  font-size: 0.6rem;
  padding: 1px 5px;
  border-radius: 3px;
  white-space: nowrap;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.item-type-tag.consumable {
  background: rgba(180, 40, 40, 0.15);
  color: var(--color-danger);
  border: 1px solid rgba(180, 40, 40, 0.3);
}

.item-type-tag.durable {
  background: rgba(127, 181, 213, 0.12);
  color: var(--color-safety);
  border: 1px solid rgba(127, 181, 213, 0.3);
}

.item-type-tag.durable_fuel {
  background: rgba(212, 167, 83, 0.12);
  color: var(--color-accent);
  border: 1px solid rgba(212, 167, 83, 0.3);
}

.item-desc {
  font-size: 0.72rem;
  color: var(--color-text-dim);
  line-height: 1.4;
  margin-bottom: var(--spacing-xs);
}

.item-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.ctrl-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-bg-panel);
  color: var(--color-text);
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.ctrl-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.ctrl-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.item-count {
  font-size: 1rem;
  font-weight: bold;
  min-width: 24px;
  text-align: center;
  color: var(--color-accent);
}

.locked-hint {
  font-size: 0.65rem;
  color: var(--color-warning);
  text-align: center;
  margin-top: 2px;
}

.btn-depart {
  display: block;
  width: 100%;
  padding: var(--spacing-md);
  background: var(--color-accent);
  color: var(--color-bg);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-title);
  font-size: 1.3rem;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-depart:hover:not(:disabled) {
  background: #e0b363;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(212, 167, 83, 0.3);
}

.btn-depart:disabled {
  background: var(--color-border);
  color: var(--color-text-dim);
  cursor: not-allowed;
}
</style>
