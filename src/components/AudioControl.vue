<script setup lang="ts">
import { ref, watch } from 'vue'
import { playBGM, setBGMVolume, masterVolume, bgmVolume, sfxVolume } from '@/lib/audio'
import bgmMainUrl from '@/assets/audio/bgm/bgm_main.mp3'

const showPanel = ref(false)
const bgmStarted = ref(false)

// Start BGM on first user interaction
function ensureBGM() {
  if (!bgmStarted.value) {
    playBGM(bgmMainUrl, true)
    bgmStarted.value = true
  }
}

// Listen for any click on document to start BGM (browser autoplay policy)
if (typeof document !== 'undefined') {
  document.addEventListener('click', ensureBGM, { once: true })
  document.addEventListener('keydown', ensureBGM, { once: true })
}

// Sync volume changes — BGM needs to respond to both bgmVolume and masterVolume
watch([bgmVolume, masterVolume], () => setBGMVolume(bgmVolume.value))
</script>

<template>
  <div class="audio-control">
    <button class="audio-toggle" @click="showPanel = !showPanel" :title="showPanel ? '关闭音量' : '音量设置'">
      🔊
    </button>

    <Transition name="panel-fade">
      <div v-if="showPanel" class="audio-panel">
        <div class="vol-row">
          <span class="vol-label">🎵 音乐</span>
          <input
            type="range"
            min="0" max="1" step="0.05"
            :value="bgmVolume"
            @input="bgmVolume = +($event.target as HTMLInputElement).value"
          />
        </div>
        <div class="vol-row">
          <span class="vol-label">🔔 音效</span>
          <input
            type="range"
            min="0" max="1" step="0.05"
            :value="sfxVolume"
            @input="sfxVolume = +($event.target as HTMLInputElement).value"
          />
        </div>
        <div class="vol-row">
          <span class="vol-label">🔈 总音量</span>
          <input
            type="range"
            min="0" max="1" step="0.05"
            :value="masterVolume"
            @input="masterVolume = +($event.target as HTMLInputElement).value"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.audio-control {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 999;
}

.audio-toggle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-bg-panel);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.audio-toggle:hover {
  border-color: var(--color-accent);
  box-shadow: 0 2px 8px rgba(212, 167, 83, 0.2);
}

.audio-panel {
  position: absolute;
  top: 44px;
  left: 0;
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md, 8px);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.vol-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vol-label {
  font-size: 0.75rem;
  color: var(--color-text-dim);
  min-width: 55px;
}

input[type="range"] {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--color-border);
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-accent);
  cursor: pointer;
}

.panel-fade-enter-active, .panel-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.panel-fade-enter-from, .panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
