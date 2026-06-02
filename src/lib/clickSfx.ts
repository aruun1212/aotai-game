/**
 * Vue 指令：v-click-sfx
 * 用法：在按钮上加 v-click-sfx 即可播放点击音
 * 或者不用指令，直接在 App.vue 全局监听 button click
 */
import { playUIClick } from '@/lib/audio'

/**
 * 全局注册按钮点击音效
 * 在 main.ts 中调用一次即可
 */
export function setupGlobalClickSFX() {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    // 任何 button 或带 role="button" 的元素
    if (
      target.tagName === 'BUTTON' ||
      target.closest('button') ||
      target.getAttribute('role') === 'button'
    ) {
      playUIClick()
    }
  }, { passive: true })
}
