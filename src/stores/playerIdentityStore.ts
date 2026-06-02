import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, supabaseReady } from '@/lib/supabase'

const STORAGE_KEY = 'aotai-player-identity'

export interface PlayerIdentity {
  id: string        // UUID
  nickname: string  // max 8 chars
  emoji: string     // single emoji
}

export const usePlayerIdentityStore = defineStore('playerIdentity', () => {
  const identity = ref<PlayerIdentity | null>(null)
  const isReady = computed(() => identity.value !== null)
  const needsCreation = ref(false)

  // ── Load from localStorage ──
  function loadFromStorage(): boolean {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    try {
      const saved = JSON.parse(raw) as PlayerIdentity
      if (saved.id && saved.nickname && saved.emoji) {
        identity.value = saved
        return true
      }
    } catch { /* ignore */ }
    return false
  }

  // ── Save to localStorage ──
  function saveToStorage() {
    if (identity.value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(identity.value))
    }
  }

  // ── Sync to Supabase ──
  async function syncToSupabase() {
    if (!supabase || !supabaseReady.value || !identity.value) return

    const { error } = await supabase
      .from('players')
      .upsert({
        id: identity.value.id,
        nickname: identity.value.nickname,
        emoji: identity.value.emoji,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })

    if (error) {
      console.warn('[Identity] Sync failed:', error.message)
    }
  }

  // ── Create new identity ──
  async function createIdentity(nickname: string, emoji: string) {
    // Enforce constraints
    const name = (nickname.trim() || '旅人').slice(0, 8)
    const emo = emoji || '🧑'

    // Generate UUID
    const id = crypto.randomUUID()

    identity.value = { id, nickname: name, emoji: emo }
    saveToStorage()
    needsCreation.value = false

    // Sync to DB
    await syncToSupabase()
  }

  // ── Update identity ──
  async function updateIdentity(nickname: string, emoji: string) {
    if (!identity.value) return

    const name = (nickname.trim() || '旅人').slice(0, 8)
    const emo = emoji || '🧑'

    identity.value.nickname = name
    identity.value.emoji = emo
    saveToStorage()

    // Sync to DB
    await syncToSupabase()
  }

  // ── Init on app start ──
  async function init() {
    const loaded = loadFromStorage()
    if (!loaded) {
      needsCreation.value = true
      return
    }
    // Verify/sync with Supabase if available
    if (supabase && supabaseReady.value) {
      await syncToSupabase()
    }
  }

  return {
    identity,
    isReady,
    needsCreation,
    init,
    createIdentity,
    updateIdentity,
  }
})
