<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePlayerIdentityStore } from '@/stores/playerIdentityStore'
import { supabaseReady } from '@/lib/supabase'
import { fetchUnreadNotifications, markAllAsRead } from '@/services/notificationService'

const identity = usePlayerIdentityStore()
const toasts = ref<string[]>([])
const currentToast = ref<string | null>(null)

onMounted(async () => {
  if (!supabaseReady.value || !identity.identity) return

  const notifications = await fetchUnreadNotifications(identity.identity.id)
  if (notifications.length === 0) return

  // Collect messages
  toasts.value = notifications.map(n => n.message)

  // Mark all read
  await markAllAsRead(identity.identity.id)

  // Show one by one
  showNext()
})

function showNext() {
  if (toasts.value.length === 0) {
    currentToast.value = null
    return
  }
  currentToast.value = toasts.value.shift()!
  setTimeout(() => {
    showNext()
  }, 4000)
}

function dismiss() {
  currentToast.value = null
  // Skip remaining
  toasts.value = []
}
</script>

<template>
  <Transition name="toast-slide">
    <div v-if="currentToast" class="feedback-toast" @click="dismiss">
      <span class="toast-icon">📬</span>
      <span class="toast-message">{{ currentToast }}</span>
      <span class="toast-dismiss">×</span>
    </div>
  </Transition>
</template>

<style scoped>
.feedback-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(20, 18, 15, 0.95);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 2000;
  cursor: pointer;
  max-width: 90vw;
  box-shadow: 0 4px 24px rgba(212, 167, 83, 0.3);
}

.toast-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.toast-message {
  font-size: 0.88rem;
  color: var(--color-text);
  font-family: var(--font-narrative);
}

.toast-dismiss {
  font-size: 1.2rem;
  color: var(--color-text-dim);
  opacity: 0.5;
  flex-shrink: 0;
}

.toast-slide-enter-active {
  transition: all 0.4s ease-out;
}
.toast-slide-leave-active {
  transition: all 0.3s ease-in;
}
.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}
</style>
