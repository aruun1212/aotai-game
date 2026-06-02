<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { usePlayerIdentityStore } from '@/stores/playerIdentityStore'
import { initSupabase, supabaseReady } from '@/lib/supabase'
import { ref, onMounted } from 'vue'
import type { Season } from '@/models/types'
import PlayerIdentityEditor from '@/components/PlayerIdentityEditor.vue'
import FeedbackToast from '@/components/FeedbackToast.vue'
import Leaderboard from '@/components/Leaderboard.vue'
import FootprintWorld from '@/components/FootprintWorld.vue'
import { resetLocalPickCount } from '@/services/supplyRackService'

const router = useRouter()
const game = useGameStore()
const identity = usePlayerIdentityStore()
const showEasterEgg = ref(false)
const saveExists = ref(game.hasSave())
const showIdentityEditor = ref(false)
const showLeaderboard = ref(false)

onMounted(async () => {
  // Init Supabase connection
  await initSupabase()
  // Init player identity
  await identity.init()
  // If no identity, modal will show via needsCreation
})

function selectSeason(season: Season) {
  resetLocalPickCount()  // 新游戏重置取物次数
  game.newGame(season)
  router.push('/loadout')
}

function handleWinterHover() {
  showEasterEgg.value = true
}

function handleClearSave() {
  game.clearSave()
  saveExists.value = false
}

function openIdentityEditor() {
  showIdentityEditor.value = true
}
</script>

<template>
  <div class="season-select">
    <!-- Footprint world background -->
    <FootprintWorld />

    <!-- Identity creation modal (first visit) -->
    <PlayerIdentityEditor
      v-if="identity.needsCreation"
      mode="create"
      @done="identity.needsCreation = false"
    />
    <!-- Identity edit modal -->
    <PlayerIdentityEditor
      v-if="showIdentityEditor && !identity.needsCreation"
      mode="edit"
      @done="showIdentityEditor = false"
    />

    <!-- Player identity badge (top-right) -->
    <div v-if="identity.isReady" class="identity-badge" @click="openIdentityEditor">
      <span class="badge-emoji">{{ identity.identity?.emoji }}</span>
      <span class="badge-name">{{ identity.identity?.nickname }}</span>
      <span class="badge-edit">&#9998;</span>
    </div>

    <header class="title-area">
      <h1 class="main-title">鳌太·众人之路</h1>
      <p class="subtitle">"不是你征服了这座山，是这座山暂时宽恕了你。"</p>
    </header>

    <div class="season-cards">
      <div class="season-card summer" @click="selectSeason('summer')">
        <div class="card-icon">☀️</div>
        <h2>夏季穿越</h2>
        <p class="season-desc">Z月—10月。暑热、雷暴、浓雾。<br/>水源较充足，但暴雨可能封路。<br/>是大多数穿越者的选择。</p>
        <div class="difficulty">难度：★★★☆☆</div>
      </div>

      <div class="season-card winter" @click="selectSeason('winter')" @mouseenter="handleWinterHover">
        <div class="card-icon">❄️</div>
        <h2>冬季穿越</h2>
        <p class="season-desc">11月—3月。暴风雪、极寒、白芒芒。<br/>水源冰冻，需要炉具化雪。<br/>生还率显著下降。</p>
        <div class="difficulty">难度：★★★★☆</div>
      </div>
    </div>

    <Transition name="fade">
      <p v-if="showEasterEgg" class="easter-egg">
        "我命由我不由天"——某位28岁领队出发前说的最后一句话。
      </p>
    </Transition>

    <div v-if="saveExists" class="resume-prompt">
      <p>发现未完成的行程…</p>
      <button class="btn-resume" @click="game.loadFromLocalStorage(); router.push('/game')">继续行程</button>
      <button class="btn-clear" @click="handleClearSave">放弃存档</button>
    </div>

    <!-- Leaderboard button -->
    <button v-if="supabaseReady" class="btn-leaderboard" @click="showLeaderboard = true">
      🏆 好人榜
    </button>

    <!-- Leaderboard modal -->
    <Leaderboard v-if="showLeaderboard" @close="showLeaderboard = false" />

    <!-- Notification toasts -->
    <FeedbackToast />

    <!-- Author info -->
    <footer class="author-footer">
      Made with &#10084; by <a href="https://github.com/aruun1212" target="_blank" rel="noopener">@aruun1212</a>
    </footer>
  </div>
</template>

<style scoped>
.season-select {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  gap: var(--spacing-xl);
  overflow: hidden;
}

.title-area {
  text-align: center;
}

.main-title {
  font-family: var(--font-title);
  font-size: 3rem;
  color: var(--color-accent);
  letter-spacing: 0.3em;
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  color: var(--color-text-dim);
  font-family: var(--font-narrative);
  font-style: italic;
  font-size: 0.95rem;
}

.season-cards {
  display: flex;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
  justify-content: center;
}

.season-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl) var(--spacing-lg);
  width: 280px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.season-card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.season-card.summer::before {
  background: radial-gradient(circle at 50% 30%, rgba(212, 167, 83, 0.1), transparent 70%);
}

.season-card.winter::before {
  background: radial-gradient(circle at 50% 30%, rgba(127, 181, 213, 0.1), transparent 70%);
}

.season-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.season-card:hover::before {
  opacity: 1;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.season-card h2 {
  font-family: var(--font-narrative);
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.season-desc {
  font-size: 0.85rem;
  color: var(--color-text-dim);
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
}

.difficulty {
  font-size: 0.9rem;
  color: var(--color-accent);
}

.easter-egg {
  color: var(--color-danger);
  font-size: 0.8rem;
  font-family: var(--font-narrative);
  font-style: italic;
  opacity: 0.7;
  text-align: center;
  max-width: 400px;
}

.resume-prompt {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: center;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.resume-prompt p {
  color: var(--color-text-dim);
  font-size: 0.9rem;
}

.btn-resume, .btn-clear {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  cursor: pointer;
  font-family: var(--font-ui);
  font-size: 0.85rem;
  transition: all var(--transition-fast);
}

.btn-resume {
  background: var(--color-accent);
  color: var(--color-bg);
  border-color: var(--color-accent);
}

.btn-resume:hover {
  background: #e0b363;
}

.btn-clear {
  background: transparent;
  color: var(--color-text-dim);
}

.btn-clear:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Identity badge */
.identity-badge {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 6px 14px 6px 8px;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 100;
}

.identity-badge:hover {
  border-color: var(--color-accent);
  box-shadow: 0 2px 12px rgba(212, 167, 83, 0.2);
}

.badge-emoji {
  font-size: 1.3rem;
}

.badge-name {
  font-size: 0.85rem;
  color: var(--color-text);
  font-weight: 500;
}

.badge-edit {
  font-size: 0.7rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.identity-badge:hover .badge-edit {
  opacity: 1;
}

.btn-leaderboard {
  padding: 10px 24px;
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

/* Mobile */
@media (max-width: 640px) {
  .main-title { font-size: 2rem; letter-spacing: 0.15em; }
  .season-cards { flex-direction: column; align-items: center; gap: var(--spacing-md); }
  .season-card { width: 100%; max-width: 320px; padding: var(--spacing-lg) var(--spacing-md); }
  .card-icon { font-size: 2rem; }
  .identity-badge { top: 10px; right: 10px; padding: 4px 10px 4px 6px; }
  .badge-emoji { font-size: 1.1rem; }
  .badge-name { font-size: 0.78rem; }
}

.author-footer {
  position: fixed;
  bottom: 12px;
  right: 16px;
  font-size: 0.72rem;
  color: var(--color-text-dim);
  opacity: 0.5;
  z-index: 10;
}

.author-footer a {
  color: var(--color-accent);
  text-decoration: none;
}

.author-footer a:hover {
  opacity: 1;
  text-decoration: underline;
}
</style>
