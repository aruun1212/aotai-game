<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { usePlayerIdentityStore } from '@/stores/playerIdentityStore'
import { supabaseReady, initSupabase } from '@/lib/supabase'
import { ITEMS } from '@/data/items'
import {
  fetchRackItems,
  leaveItem,
  pickItem,
  getLocalPickCount,
  incrementLocalPickCount,
  type CampItem,
} from '@/services/supplyRackService'

const game = useGameStore()
const identity = usePlayerIdentityStore()

const props = defineProps<{
  campId: string
}>()

const emit = defineEmits<{
  close: []
}>()

const rackItems = ref<CampItem[]>([])
const loading = ref(true)
const pickCount = ref(getLocalPickCount())
const maxPicks = 3
const canPick = computed(() => pickCount.value < maxPicks)

// Leave item state
const showLeavePanel = ref(false)
const leaveInProgress = ref(false)
const leftThisVisit = ref(0)
const maxLeavePerVisit = 3

// Feedback messages
const feedbackMsg = ref<string | null>(null)

onMounted(async () => {
  // 确保 Supabase 和 identity 已初始化
  if (!supabaseReady.value) await initSupabase()
  if (!identity.identity) await identity.init()
  await loadRack()
})

async function loadRack() {
  loading.value = true
  rackItems.value = await fetchRackItems(props.campId)
  loading.value = false
}

function getItemDef(defId: string) {
  return ITEMS[defId]
}

// ── Pick item ──
async function handlePick(item: CampItem) {
  if (!identity.identity) return
  // 取自己当次留的不受次数限制；取他人的才检查额度
  const isSelfItem = item.owner_id === identity.identity.id
  if (!isSelfItem && !canPick.value) return

  const result = await pickItem(item.id, identity.identity.id, identity.identity.nickname, isSelfItem)

  if (result.alreadyPicked) {
    feedbackMsg.value = '这件物资已被其他旅人取走了'
    rackItems.value = await fetchRackItems(props.campId)
    setTimeout(() => { feedbackMsg.value = null }, 2500)
    return
  }

  if (result.success) {
    // Add to player inventory
    const qty = item.item_quantity
    if (item.item_def_id === 'water') {
      game.updatePlayer({ water: game.state.player.water + qty })
    } else {
      game.state.player.inventory.push({ defId: item.item_def_id, damaged: false })
      game.updatePlayer({
        currentWeight: game.state.player.inventory.reduce(
          (sum, it) => sum + (ITEMS[it.defId]?.weight ?? 0), 0
        ),
      })
    }

    // 只有取他人物资才扣次数
    if (!isSelfItem) {
      incrementLocalPickCount()
      pickCount.value = getLocalPickCount()
    }

    const itemDef = getItemDef(item.item_def_id)
    if (isSelfItem) {
      feedbackMsg.value = `取回了 ${itemDef?.emoji ?? ''} ${itemDef?.name ?? item.item_def_id}`
    } else {
      feedbackMsg.value = `获得了 ${itemDef?.emoji ?? ''} ${itemDef?.name ?? item.item_def_id}！（${item.owner_emoji} ${item.owner_name} 留下的）`
    }
    // 强制刷新列表
    rackItems.value = await fetchRackItems(props.campId)
    setTimeout(() => { feedbackMsg.value = null }, 3000)
  }
}

// ── Leave item ──
const leaveableItems = computed(() => {
  const inv = game.state.player.inventory
  // Group by defId, show distinct types
  const seen = new Set<string>()
  const result: { defId: string; count: number }[] = []
  for (const item of inv) {
    if (!seen.has(item.defId)) {
      seen.add(item.defId)
      result.push({
        defId: item.defId,
        count: inv.filter(i => i.defId === item.defId).length,
      })
    }
  }
  // Also add water as special case
  if (game.state.player.water > 0 && !seen.has('water')) {
    result.unshift({ defId: 'water', count: 1 })
  }
  return result
})

async function handleLeave(defId: string) {
  console.log('[SupplyRack] handleLeave called:', defId, 'identity:', identity.identity, 'leaveInProgress:', leaveInProgress.value, 'leftThisVisit:', leftThisVisit.value)

  // 如果 identity 未初始化，尝试初始化
  if (!identity.identity) {
    await identity.init()
  }
  if (!identity.identity || leaveInProgress.value) {
    console.warn('[SupplyRack] Cannot leave: identity missing or in progress')
    return
  }
  if (leftThisVisit.value >= maxLeavePerVisit) return

  leaveInProgress.value = true

  let quantity = 1
  if (defId === 'water') {
    // Leave 0.5L of water
    quantity = 0.5
    if (game.state.player.water < 0.5) {
      feedbackMsg.value = '水量不足，无法留下'
      leaveInProgress.value = false
      setTimeout(() => { feedbackMsg.value = null }, 2000)
      return
    }
    game.updatePlayer({ water: game.state.player.water - 0.5 })
  } else {
    // Remove one from inventory
    const idx = game.state.player.inventory.findIndex(i => i.defId === defId)
    if (idx < 0) {
      leaveInProgress.value = false
      return
    }
    game.state.player.inventory.splice(idx, 1)
    game.updatePlayer({
      currentWeight: game.state.player.inventory.reduce(
        (sum, it) => sum + (ITEMS[it.defId]?.weight ?? 0), 0
      ),
    })
  }

  const success = await leaveItem(
    props.campId,
    identity.identity.id,
    identity.identity.nickname,
    identity.identity.emoji,
    defId,
    quantity,
  )

  if (success) {
    leftThisVisit.value++
    const itemDef = getItemDef(defId)
    feedbackMsg.value = `留下了 ${itemDef?.emoji ?? ''} ${itemDef?.name ?? defId}。后来的旅人会感谢你的。`
  } else {
    feedbackMsg.value = '留下失败，请稍后再试'
  }

  // 强制刷新物资架列表
  rackItems.value = await fetchRackItems(props.campId)
  leaveInProgress.value = false
  setTimeout(() => { feedbackMsg.value = null }, 3000)
}
</script>

<template>
  <div class="supply-rack-overlay" @click.self="emit('close')">
    <div class="supply-rack-modal">
      <div class="rack-header">
        <h2>📦 物资架</h2>
        <button class="btn-close" @click="emit('close')">×</button>
      </div>

      <!-- Pick counter -->
      <div class="pick-info">
        <span>本次穿越剩余取走他人物资次数：</span>
        <span class="pick-count" :class="{ empty: !canPick }">
          {{ maxPicks - pickCount }} / {{ maxPicks }}
        </span>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedbackMsg" class="rack-feedback">{{ feedbackMsg }}</div>
      </Transition>

      <!-- Loading -->
      <div v-if="loading" class="rack-loading">加载中...</div>

      <!-- Rack items -->
      <div v-else class="rack-items">
        <div v-if="rackItems.length === 0" class="rack-empty">
          物资架空空如也。要不要留点什么给后来的旅人？
        </div>
        <div v-for="item in rackItems" :key="item.id" class="rack-item">
          <div class="item-left">
            <span class="item-owner">{{ item.owner_emoji }}</span>
            <div class="item-info">
              <span class="item-name">{{ getItemDef(item.item_def_id)?.emoji }} {{ getItemDef(item.item_def_id)?.name ?? item.item_def_id }}</span>
              <span class="item-from">{{ item.owner_name }} 留</span>
            </div>
          </div>
          <div class="item-right">
            <span v-if="item.item_def_id === 'water'" class="item-qty">{{ item.item_quantity }}L</span>
            <button
              class="btn-pick"
              :disabled="!canPick && item.owner_id !== identity.identity?.id"
              @click="handlePick(item)"
            >
              {{ item.owner_id === identity.identity?.id ? '取回' : (canPick ? '取走' : '已满') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Leave section -->
      <div class="leave-section">
        <button
          v-if="!showLeavePanel"
          class="btn-leave-toggle"
          :disabled="leftThisVisit >= maxLeavePerVisit"
          @click="showLeavePanel = true"
        >
          🎁 留下物资 ({{ leftThisVisit }}/{{ maxLeavePerVisit }})
        </button>

        <div v-if="showLeavePanel" class="leave-panel">
          <div class="leave-title">选择要留下的物资：</div>
          <div class="leave-items">
            <button
              v-for="li in leaveableItems"
              :key="li.defId"
              class="leave-item-btn"
              :disabled="leftThisVisit >= maxLeavePerVisit || leaveInProgress"
              @click="handleLeave(li.defId)"
            >
              {{ getItemDef(li.defId)?.emoji }} {{ getItemDef(li.defId)?.name ?? li.defId }}
              <span class="leave-qty">×{{ li.defId === 'water' ? game.state.player.water.toFixed(1) + 'L' : li.count }}</span>
            </button>
          </div>
          <button class="btn-leave-cancel" @click="showLeavePanel = false">收起</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.supply-rack-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 8, 5, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 900;
  padding: var(--spacing-md);
}

.supply-rack-modal {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg, 12px);
  padding: var(--spacing-lg);
  max-width: 420px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.rack-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.rack-header h2 {
  font-size: 1.1rem;
  color: var(--color-accent);
}

.btn-close {
  font-size: 1.5rem;
  background: none;
  border: none;
  color: var(--color-text-dim);
  cursor: pointer;
}

.pick-info {
  font-size: 0.8rem;
  color: var(--color-text-dim);
  margin-bottom: var(--spacing-sm);
  text-align: center;
}

.pick-count {
  font-weight: 700;
  color: var(--color-accent);
}

.pick-count.empty {
  color: var(--color-danger);
}

.rack-feedback {
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-accent);
  padding: 8px;
  background: rgba(212, 167, 83, 0.1);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.rack-loading {
  text-align: center;
  color: var(--color-text-dim);
  padding: var(--spacing-lg);
}

.rack-empty {
  text-align: center;
  color: var(--color-text-dim);
  font-size: 0.85rem;
  padding: var(--spacing-lg);
  font-family: var(--font-narrative);
}

.rack-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: var(--spacing-md);
}

.rack-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-owner {
  font-size: 1.3rem;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 0.88rem;
  color: var(--color-text);
}

.item-from {
  font-size: 0.72rem;
  color: var(--color-text-dim);
}

.item-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-qty {
  font-size: 0.8rem;
  color: var(--color-text-dim);
}

.btn-pick {
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-accent);
  background: transparent;
  color: var(--color-accent);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-pick:hover:not(:disabled) {
  background: rgba(212, 167, 83, 0.15);
}

.btn-pick:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: var(--color-text-dim);
  color: var(--color-text-dim);
}

/* Leave section */
.leave-section {
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-md);
}

.btn-leave-toggle {
  width: 100%;
  padding: 10px;
  border-radius: var(--radius-md);
  border: 1px dashed var(--color-border);
  background: transparent;
  color: var(--color-text-dim);
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-leave-toggle:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.btn-leave-toggle:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.leave-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.leave-title {
  font-size: 0.82rem;
  color: var(--color-text-dim);
}

.leave-items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.leave-item-btn {
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
}

.leave-item-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  background: rgba(212, 167, 83, 0.08);
}

.leave-item-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.leave-qty {
  font-size: 0.72rem;
  color: var(--color-text-dim);
  margin-left: 4px;
}

.btn-leave-cancel {
  align-self: flex-end;
  padding: 4px 10px;
  border: none;
  background: none;
  color: var(--color-text-dim);
  font-size: 0.78rem;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
