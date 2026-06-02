/**
 * 音频管理器 — 统一管理 BGM、SFX、环境音
 */
import { ref } from 'vue'

// ── 全局音量控制 ──
export const masterVolume = ref(0.8)
export const sfxVolume = ref(1.0)
export const bgmVolume = ref(0.25)

// ── BGM 播放器 ──
let bgmAudio: HTMLAudioElement | null = null
let bgmCurrentSrc = ''

export function playBGM(src: string, loop = true) {
  if (bgmCurrentSrc === src && bgmAudio && !bgmAudio.paused) return

  stopBGM()
  bgmAudio = new Audio(src)
  bgmAudio.loop = loop
  bgmAudio.volume = bgmVolume.value * masterVolume.value
  bgmAudio.play().catch(() => {})
  bgmCurrentSrc = src
}

export function stopBGM() {
  if (bgmAudio) {
    bgmAudio.pause()
    bgmAudio.src = ''
    bgmAudio = null
    bgmCurrentSrc = ''
  }
}

export function setBGMVolume(vol: number) {
  bgmVolume.value = vol
  if (bgmAudio) bgmAudio.volume = vol * masterVolume.value
}

// ── SFX 播放（短音效，可叠加） ──
const sfxPool: HTMLAudioElement[] = []

export function playSFX(src: string, volume?: number) {
  const audio = new Audio(src)
  audio.volume = (volume ?? sfxVolume.value) * masterVolume.value
  audio.play().catch(() => {})
  sfxPool.push(audio)
  audio.onended = () => {
    const idx = sfxPool.indexOf(audio)
    if (idx >= 0) sfxPool.splice(idx, 1)
  }
}

// ── Loop SFX（循环音效，如持续红遮罩） ──
let loopAudio: HTMLAudioElement | null = null

export function playLoopSFX(src: string, volume?: number) {
  stopLoopSFX()
  loopAudio = new Audio(src)
  loopAudio.loop = true
  loopAudio.volume = (volume ?? sfxVolume.value * 0.6) * masterVolume.value
  loopAudio.play().catch(() => {})
}

export function stopLoopSFX() {
  if (loopAudio) {
    loopAudio.pause()
    loopAudio.src = ''
    loopAudio = null
  }
}

// ── UI 点击音效 ──
// 使用 Web Audio API 生成简单的点击音（无需外部文件）
let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

/**
 * 播放 UI 点击音（程序化生成的短促"嗒"声）
 */
export function playUIClick() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const vol = ctx.createGain()
    vol.connect(ctx.destination)
    vol.gain.setValueAtTime(0.15 * masterVolume.value, ctx.currentTime)
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.06)
    osc.connect(vol)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.08)
  } catch {
    // Silent fail if audio not supported
  }
}

/**
 * 播放 UI 确认音（略长的"叮"声，用于重要确认按钮）
 */
export function playUIConfirm() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const vol = ctx.createGain()
    vol.connect(ctx.destination)
    vol.gain.setValueAtTime(0.2 * masterVolume.value, ctx.currentTime)
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(660, ctx.currentTime)
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.05)
    osc.connect(vol)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)
  } catch {}
}

/**
 * 播放危险提示音（低沉的"咚"声）
 */
export function playDangerHit() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const vol = ctx.createGain()
    vol.connect(ctx.destination)
    vol.gain.setValueAtTime(0.3 * masterVolume.value, ctx.currentTime)
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(120, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.3)
    osc.connect(vol)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  } catch {}
}
