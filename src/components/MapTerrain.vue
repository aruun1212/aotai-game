<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import maplibregl from 'maplibre-gl'
import { useGameStore } from '@/stores/gameStore'
import {
  ROUTE_SEGMENTS,
  POIS,
  getFullRouteCoords,
  gridToLngLat,
} from '@/data/geodata'

const game = useGameStore()
const mapContainer = ref<HTMLElement | null>(null)
let map: maplibregl.Map | null = null
let playerMarker: maplibregl.Marker | null = null

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string

// ── 天气氛围映射 ──
interface Atmosphere {
  fogColor: string
  fogRange: [number, number]
  fogOpacity: number
  lightIntensity: number
  lightColor: string
}

function getAtmosphere(weather: string): Atmosphere {
  switch (weather) {
    case 'heavy_fog':
      return { fogColor: '#cccccc', fogRange: [0.5, 4], fogOpacity: 0.9, lightIntensity: 0.3, lightColor: '#999999' }
    case 'blizzard':
    case 'light_snow':
      return { fogColor: '#e8e8f0', fogRange: [1, 6], fogOpacity: 0.7, lightIntensity: 0.4, lightColor: '#aabbcc' }
    case 'heavy_rain':
    case 'thunderstorm':
      return { fogColor: '#555566', fogRange: [2, 8], fogOpacity: 0.6, lightIntensity: 0.3, lightColor: '#667788' }
    case 'light_rain':
      return { fogColor: '#889999', fogRange: [3, 10], fogOpacity: 0.4, lightIntensity: 0.5, lightColor: '#88aaaa' }
    case 'cloudy':
    case 'overcast':
      return { fogColor: '#aabbcc', fogRange: [4, 14], fogOpacity: 0.3, lightIntensity: 0.6, lightColor: '#bbccdd' }
    case 'sunny':
    default:
      return { fogColor: '#88bbee', fogRange: [6, 20], fogOpacity: 0.1, lightIntensity: 1.0, lightColor: '#ffffff' }
  }
}

// ── 当前段和位置 ──
// 直接读 state.player 确保 Vue 能追踪深层属性变化
const currentSegmentId = computed(() => game.state.player.segmentId)
const currentGrid = computed(() => game.state.player.gridInSegment)
const currentGridCount = computed(() => game.currentSegment?.gridCount ?? 4)
const currentWeather = computed(() => game.state.weather)

// ── 红色受伤遮罩逻辑 ──
const damageFlash = ref(false) // 瞬间闪红（受到伤害/负面状态时）
const dangerPersist = ref(false) // 持续红色遮罩（水/速度低于危险值）

// 判断是否处于持续危险状态
const isDangerState = computed(() => {
  const p = game.state.player
  // 水量低于 0.4L 或已脱水
  if (p.water < 0.4) return true
  // 速度因负面状态降到 1 以下
  if (p.speed <= 1) return true
  // 有失温或脱水状态
  if (p.statusEffects.some(s => s.type === 'dehydration' || s.type === 'hypothermia')) return true
  return false
})

import { playDangerHit, playSFX, playLoopSFX, stopLoopSFX } from '@/lib/audio'

// 判断是否受到了新的伤害/负面状态（通过 statusEffects 数量增加检测）
let prevEffectCount = 0
function triggerDamageFlash() {
  damageFlash.value = true
  // 播放短促伤害音效（如果有外部文件就用外部，否则用程序化音效）
  try {
    const hitSrc = new URL('@/assets/audio/sfx/hit_short.mp3', import.meta.url).href
    playSFX(hitSrc, 1.0)
  } catch {
    playDangerHit()
  }
  setTimeout(() => { damageFlash.value = false }, 600)
}

const playerLngLat = computed(() =>
  gridToLngLat(currentSegmentId.value, currentGrid.value, currentGridCount.value)
)

// ── 初始化地图 ──
onMounted(() => {
  if (!mapContainer.value || !MAPTILER_KEY) return

  // 初始中心 = 玩家当前位置，保证一进游戏就能看到自己
  const startPos = playerLngLat.value

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`,
    center: startPos,
    zoom: 13,
    pitch: 20,
    bearing: -15,
    antialias: true,
    maxPitch: 85,
  })

  map.on('load', () => {
    if (!map) return

    // ── 3D 地形 ──
    map.addSource('terrain-dem', {
      type: 'raster-dem',
      url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_KEY}`,
      tileSize: 256,
    })
    map.setTerrain({ source: 'terrain-dem', exaggeration: 1.5 })

    // ── 天空 ──
    map.addLayer({
      id: 'sky',
      type: 'sky',
      paint: {
        'sky-type': 'atmosphere',
        'sky-atmosphere-sun': [0, 30],
        'sky-atmosphere-sun-intensity': 5,
      },
    })

    // ── 未走路线（虚线） ──
    const fullCoords = getFullRouteCoords()
    map.addSource('route-unvisited', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: fullCoords },
      },
    })
    map.addLayer({
      id: 'route-unvisited-line',
      type: 'line',
      source: 'route-unvisited',
      paint: {
        'line-color': '#ffffff',
        'line-opacity': 0.3,
        'line-width': 3,
        'line-dasharray': [2, 4],
      },
    })

    // ── 已走路线（实线） ──
    map.addSource('route-visited', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: [fullCoords[0]!] },
      },
    })
    map.addLayer({
      id: 'route-visited-line',
      type: 'line',
      source: 'route-visited',
      paint: {
        'line-color': '#d4a753',
        'line-opacity': 0.9,
        'line-width': 4,
      },
    })

    // ── POI 标记 ──
    for (const poi of POIS.features) {
      const el = document.createElement('div')
      el.className = 'poi-marker'
      el.innerHTML = `<span class="poi-emoji">${poi.properties.emoji}</span>`
      el.title = poi.properties.name

      new maplibregl.Marker({ element: el })
        .setLngLat(poi.geometry.coordinates as [number, number])
        .setPopup(
          new maplibregl.Popup({ offset: 12, closeButton: false })
            .setHTML(`<div class="poi-popup">${poi.properties.emoji} ${poi.properties.name}</div>`)
        )
        .addTo(map!)
    }

    // ── 玩家标记 ──
    const playerEl = document.createElement('div')
    playerEl.className = 'player-marker'
    playerEl.innerHTML = '<div class="player-dot"></div>'

    playerMarker = new maplibregl.Marker({ element: playerEl })
      .setLngLat(playerLngLat.value)
      .addTo(map!)

    // 初始更新已走路线
    updateVisitedRoute()
    applyWeatherAtmosphere(currentWeather.value)
  })
})

// ── 更新已走路线 ──
function updateVisitedRoute() {
  if (!map || !map.getSource('route-visited')) return

  // 收集所有已走过的坐标
  const visitedCoords: [number, number][] = []
  for (const feature of ROUTE_SEGMENTS.features) {
    const segId = feature.properties.segmentId
    const coords = feature.geometry.coordinates as [number, number][]

    if (segId < currentSegmentId.value) {
      // 完全走完的段
      if (visitedCoords.length === 0) {
        visitedCoords.push(...coords)
      } else {
        visitedCoords.push(...coords.slice(1))
      }
    } else if (segId === currentSegmentId.value) {
      // 当前段：插值到当前位置
      const currentPos = playerLngLat.value
      if (visitedCoords.length === 0) {
        visitedCoords.push(coords[0]!)
      }
      // 添加到当前位置为止的所有中间点
      const t = currentGrid.value / Math.max(1, currentGridCount.value)
      const numPoints = Math.floor(t * (coords.length - 1))
      for (let i = 1; i <= numPoints; i++) {
        visitedCoords.push(coords[i]!)
      }
      visitedCoords.push(currentPos)
      break
    }
  }

  if (visitedCoords.length < 2) return

  const source = map.getSource('route-visited') as maplibregl.GeoJSONSource
  source.setData({
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates: visitedCoords },
  })
}

// ── 天气氛围 ──
function applyWeatherAtmosphere(weather: string) {
  if (!map) return
  const atm = getAtmosphere(weather)

  map.setFog({
    color: atm.fogColor,
    range: atm.fogRange,
    'horizon-blend': atm.fogOpacity * 0.1,
  } as any)

  map.setLight({
    anchor: 'viewport',
    color: atm.lightColor,
    intensity: atm.lightIntensity,
  })
}

// ── Watch 变化 ──
// 监听玩家回合数（每次 march 必定 +1，最可靠的触发源）
watch(
  () => game.state.player.turnCount,
  () => {
    if (!map || !playerMarker) return

    const newPos = playerLngLat.value
    console.log('[MapTerrain] turnCount changed → flyTo', newPos, 'seg:', currentSegmentId.value, 'grid:', currentGrid.value)

    // 更新标记位置
    playerMarker.setLngLat(newPos)

    // 相机跟随
    map.flyTo({
      center: newPos,
      zoom: 13,
      pitch: 25,
      bearing: map.getBearing(),
      duration: 1500,
      essential: true,
    })

    // 更新路线
    updateVisitedRoute()
  },
)

watch(currentWeather, (weather) => {
  applyWeatherAtmosphere(weather)
})

// 监听负面状态变化 → 触发伤害闪红
watch(
  () => game.state.player.statusEffects.length,
  (newCount) => {
    if (newCount > prevEffectCount) {
      triggerDamageFlash()
    }
    prevEffectCount = newCount
  },
)

// 监听持续危险状态
watch(isDangerState, (danger) => {
  dangerPersist.value = danger
  // 持续危险时播放循环音效
  if (danger) {
    try {
      const loopSrc = new URL('@/assets/audio/sfx/hit_loop.mp3', import.meta.url).href
      playLoopSFX(loopSrc, 0.6)
    } catch { /* 文件不存在时静默 */ }
  } else {
    stopLoopSFX()
  }
}, { immediate: true })

// ── 清理 ──
onUnmounted(() => {
  stopLoopSFX()
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="map-terrain-wrapper">
    <div ref="mapContainer" class="map-container" />
    <!-- 红色受伤/危险遮罩 -->
    <transition name="damage-flash">
      <div v-if="damageFlash" class="map-overlay-damage flash" />
    </transition>
    <div v-if="dangerPersist && !damageFlash" class="map-overlay-damage persist" />
    <div class="map-overlay-segment">
      📍 {{ game.currentSegment?.name || '出发点' }}
    </div>
  </div>
</template>

<style scoped>
.map-terrain-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 280px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.map-container {
  width: 100%;
  height: 100%;
}

.map-overlay-segment {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(20, 18, 15, 0.85);
  color: var(--color-accent);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.78rem;
  font-family: var(--font-ui);
  pointer-events: none;
  border: 1px solid rgba(212, 167, 83, 0.3);
}

/* 红色受伤/危险遮罩 — 类似FPS中弹效果 */
.map-overlay-damage {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: var(--radius-md);
  z-index: 5;
}

.map-overlay-damage.flash {
  background: radial-gradient(
    ellipse at center,
    transparent 40%,
    rgba(200, 30, 30, 0.5) 80%,
    rgba(150, 0, 0, 0.7) 100%
  );
  animation: damage-hit 0.6s ease-out forwards;
}

.map-overlay-damage.persist {
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    rgba(180, 30, 30, 0.2) 80%,
    rgba(120, 0, 0, 0.4) 100%
  );
  animation: danger-pulse 2.5s ease-in-out infinite;
}

@keyframes damage-hit {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes danger-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.damage-flash-enter-active {
  animation: damage-hit 0.6s ease-out;
}
.damage-flash-leave-active {
  transition: opacity 0.3s ease-out;
}
.damage-flash-leave-to {
  opacity: 0;
}
</style>

<style>
/* 全局样式（Mapbox markers 不在 scoped 范围内） */
.player-marker {
  width: 20px;
  height: 20px;
}

.player-dot {
  width: 16px;
  height: 16px;
  background: #d4a753;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(212, 167, 83, 0.8), 0 0 24px rgba(212, 167, 83, 0.4);
  animation: player-pulse 2s ease-in-out infinite;
}

@keyframes player-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 12px rgba(212, 167, 83, 0.8); }
  50% { transform: scale(1.2); box-shadow: 0 0 20px rgba(212, 167, 83, 1); }
}

.poi-marker {
  cursor: pointer;
}

.poi-emoji {
  font-size: 18px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

.poi-popup {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 4px;
  white-space: nowrap;
}

.maplibregl-popup-content {
  background: rgba(20, 18, 15, 0.9) !important;
  color: #e8e0d0 !important;
  border: 1px solid rgba(212, 167, 83, 0.4) !important;
  border-radius: 6px !important;
  padding: 4px 8px !important;
  font-family: 'ZCOOL XiaoWei', serif !important;
}

.maplibregl-popup-tip {
  border-top-color: rgba(20, 18, 15, 0.9) !important;
}
</style>
