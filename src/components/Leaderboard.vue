<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabaseReady } from '@/lib/supabase'
import { usePlayerIdentityStore } from '@/stores/playerIdentityStore'
import {
  fetchItemsLeftRanking,
  fetchPeopleHelpedRanking,
  hasCachedData,
  type LeaderboardEntry,
} from '@/services/leaderboardService'

const emit = defineEmits<{ close: [] }>()
const identity = usePlayerIdentityStore()

const activeTab = ref<'left' | 'helped'>('left')
const itemsLeftList = ref<LeaderboardEntry[]>([])
const peopleHelpedList = ref<LeaderboardEntry[]>([])
const loading = ref(true)
const isOffline = ref(false)

onMounted(async () => {
  if (!supabaseReady.value) {
    isOffline.value = true
    loading.value = false
    return
  }

  try {
    const [left, helped] = await Promise.all([
      fetchItemsLeftRanking(),
      fetchPeopleHelpedRanking(),
    ])
    itemsLeftList.value = left
    peopleHelpedList.value = helped
  } catch {
    isOffline.value = true
  }
  loading.value = false
})

function currentList() {
  return activeTab.value === 'left' ? itemsLeftList.value : peopleHelpedList.value
}

function isCurrentPlayer(entry: LeaderboardEntry): boolean {
  return entry.nickname === identity.identity?.nickname &&
         entry.emoji === identity.identity?.emoji
}
</script>

<template>
  <div class="leaderboard-overlay" @click.self="emit('close')">
    <div class="leaderboard-modal">
      <div class="modal-header">
        <h2>🏆 好人榜</h2>
        <button class="btn-close" @click="emit('close')">×</button>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'left' }"
          @click="activeTab = 'left'"
        >
          留下物资
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'helped' }"
          @click="activeTab = 'helped'"
        >
          救助旅人
        </button>
      </div>

      <!-- Offline indicator -->
      <div v-if="isOffline" class="offline-badge">
        {{ hasCachedData() ? '📡 离线数据' : '暂无数据' }}
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">加载中...</div>

      <!-- Rank list -->
      <div v-else class="rank-list">
        <div v-if="currentList().length === 0" class="empty-state">
          还没有人留下过物资，成为第一位好心人吧！
        </div>
        <div
          v-for="(entry, idx) in currentList()"
          :key="idx"
          class="rank-item"
          :class="{ highlight: isCurrentPlayer(entry) }"
        >
          <span class="rank-number">{{ idx + 1 }}</span>
          <span class="rank-emoji">{{ entry.emoji }}</span>
          <span class="rank-name">{{ entry.nickname }}</span>
          <span class="rank-count">{{ entry.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leaderboard-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 8, 5, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.leaderboard-modal {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg, 12px);
  padding: var(--spacing-lg);
  max-width: 400px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.modal-header h2 {
  font-size: 1.2rem;
  color: var(--color-accent);
  font-family: var(--font-narrative);
}

.btn-close {
  font-size: 1.5rem;
  background: none;
  border: none;
  color: var(--color-text-dim);
  cursor: pointer;
  padding: 4px 8px;
}

.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  padding: 3px;
}

.tab-btn {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: var(--radius-sm);
  background: none;
  color: var(--color-text-dim);
  font-size: 0.85rem;
  font-family: var(--font-ui);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--color-accent);
  color: var(--color-bg);
  font-weight: 700;
}

.offline-badge {
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-dim);
  padding: 4px;
  margin-bottom: var(--spacing-sm);
  opacity: 0.7;
}

.loading {
  text-align: center;
  color: var(--color-text-dim);
  padding: var(--spacing-lg);
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.empty-state {
  text-align: center;
  color: var(--color-text-dim);
  font-size: 0.85rem;
  padding: var(--spacing-lg);
  font-family: var(--font-narrative);
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.03);
}

.rank-item.highlight {
  background: rgba(212, 167, 83, 0.12);
  border: 1px solid rgba(212, 167, 83, 0.3);
}

.rank-number {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-dim);
  min-width: 24px;
  text-align: center;
}

.rank-item:nth-child(1) .rank-number { color: #ffd700; }
.rank-item:nth-child(2) .rank-number { color: #c0c0c0; }
.rank-item:nth-child(3) .rank-number { color: #cd7f32; }

.rank-emoji {
  font-size: 1.2rem;
}

.rank-name {
  flex: 1;
  font-size: 0.88rem;
  color: var(--color-text);
}

.rank-count {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-accent);
}
</style>
