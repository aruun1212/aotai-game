<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerIdentityStore } from '@/stores/playerIdentityStore'

const props = defineProps<{
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  done: []
}>()

const store = usePlayerIdentityStore()

const nickname = ref(props.mode === 'edit' ? (store.identity?.nickname ?? '') : '')
const selectedEmoji = ref(props.mode === 'edit' ? (store.identity?.emoji ?? '🧑') : '🧑')

const EMOJI_OPTIONS = [
  '🧑', '👩', '👨', '🧔', '👧', '🦊', '🐕', '🐱',
  '🏔️', '⛰️', '🌲', '🦅', '🐻', '🐺', '🌟', '🔥',
  '🎒', '⛺', '🥾', '🧗', '🏃', '🚶', '🧭', '⚡',
]

async function submit() {
  if (props.mode === 'create') {
    await store.createIdentity(nickname.value, selectedEmoji.value)
  } else {
    await store.updateIdentity(nickname.value, selectedEmoji.value)
  }
  emit('done')
}
</script>

<template>
  <div class="identity-overlay">
    <div class="identity-modal">
      <h2 class="modal-title">
        {{ mode === 'create' ? '你是谁？' : '修改身份' }}
      </h2>
      <p class="modal-desc">
        {{ mode === 'create' ? '给自己取个名字，好让后来的旅人记住你。' : '换个名字或头像？' }}
      </p>

      <!-- Emoji picker -->
      <div class="emoji-section">
        <div class="current-emoji">{{ selectedEmoji }}</div>
        <div class="emoji-grid">
          <button
            v-for="e in EMOJI_OPTIONS"
            :key="e"
            class="emoji-btn"
            :class="{ active: selectedEmoji === e }"
            @click="selectedEmoji = e"
          >
            {{ e }}
          </button>
        </div>
      </div>

      <!-- Nickname input -->
      <div class="nickname-section">
        <label class="nickname-label">昵称</label>
        <input
          v-model="nickname"
          class="nickname-input"
          type="text"
          maxlength="8"
          placeholder="旅人"
          @keyup.enter="submit"
        />
        <span class="char-count">{{ nickname.length }}/8</span>
      </div>

      <!-- Submit -->
      <button class="btn-submit" @click="submit">
        {{ mode === 'create' ? '踏上旅途' : '确认修改' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.identity-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 8, 5, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.identity-modal {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg, 12px);
  padding: var(--spacing-xl, 32px);
  max-width: 380px;
  width: 100%;
  text-align: center;
}

.modal-title {
  font-size: 1.4rem;
  color: var(--color-accent);
  margin-bottom: var(--spacing-xs);
  font-family: var(--font-narrative);
}

.modal-desc {
  font-size: 0.85rem;
  color: var(--color-text-dim);
  margin-bottom: var(--spacing-lg, 24px);
}

.emoji-section {
  margin-bottom: var(--spacing-md);
}

.current-emoji {
  font-size: 3rem;
  margin-bottom: var(--spacing-sm);
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
}

.emoji-btn {
  font-size: 1.2rem;
  padding: 6px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: none;
  cursor: pointer;
  transition: all 0.15s;
}

.emoji-btn:hover {
  background: rgba(212, 167, 83, 0.1);
  border-color: var(--color-border);
}

.emoji-btn.active {
  background: rgba(212, 167, 83, 0.2);
  border-color: var(--color-accent);
}

.nickname-section {
  position: relative;
  margin-bottom: var(--spacing-lg, 24px);
}

.nickname-label {
  display: block;
  text-align: left;
  font-size: 0.8rem;
  color: var(--color-text-dim);
  margin-bottom: 4px;
}

.nickname-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 1rem;
  font-family: var(--font-ui);
  outline: none;
  transition: border-color 0.2s;
}

.nickname-input:focus {
  border-color: var(--color-accent);
}

.nickname-input::placeholder {
  color: var(--color-text-dim);
  opacity: 0.5;
}

.char-count {
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 0.7rem;
  color: var(--color-text-dim);
}

.btn-submit {
  width: 100%;
  padding: 12px;
  border-radius: var(--radius-md);
  border: none;
  background: var(--color-accent);
  color: var(--color-bg);
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-ui);
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover {
  background: #e0b363;
}
</style>
