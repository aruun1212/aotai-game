import type { RouteSegment } from '@/models/types'

/** 12 段主干路线，总计 112 格（不含拔仙台支线 4 格） */
export const ROUTE_SEGMENTS: RouteSegment[] = [
  {
    id: 1, name: '塘口→2900营地', from: '塘口', to: '2900营地',
    gridCount: 10, eventDensity: 'high', elevationRange: [1600, 3000],
    hasCamp: true, descentRouteId: null, terrain: ['forest', 'trail'],
  },
  {
    id: 2, name: '2900营地→导航塔', from: '2900营地', to: '导航塔',
    gridCount: 8, eventDensity: 'high', elevationRange: [3000, 3475],
    hasCamp: false, descentRouteId: 'D97', terrain: ['meadow', 'scree'],
  },
  {
    id: 3, name: '导航塔→水窝子', from: '导航塔', to: '水窝子',
    gridCount: 12, eventDensity: 'high', elevationRange: [3200, 3475],
    hasCamp: true, descentRouteId: null, terrain: ['ridge', 'stone_sea', 'scrub'],
  },
  {
    id: 4, name: '水窝子→飞机梁', from: '水窝子', to: '飞机梁',
    gridCount: 8, eventDensity: 'extreme', elevationRange: [3200, 3400],
    hasCamp: false, descentRouteId: 'D96', terrain: ['ridge', 'cliff'],
  },
  {
    id: 5, name: '飞机梁→2800营地', from: '飞机梁', to: '2800营地',
    gridCount: 10, eventDensity: 'high', elevationRange: [2900, 3400],
    hasCamp: true, descentRouteId: null, terrain: ['forest', 'scree'],
  },
  {
    id: 6, name: '2800营地→金字塔垭口', from: '2800营地', to: '金字塔垭口',
    gridCount: 12, eventDensity: 'extreme', elevationRange: [2900, 3500],
    hasCamp: false, descentRouteId: 'D93', terrain: ['steep', 'scrub', 'scree'],
  },
  {
    id: 7, name: '金字塔→塔3→老边墓地', from: '金字塔垭口', to: '老边墓地',
    gridCount: 14, eventDensity: 'extreme', elevationRange: [3300, 3500],
    hasCamp: false, descentRouteId: null, terrain: ['cliff', 'stone_sea', 'technical'],
  },
  {
    id: 8, name: '老边墓地→万仙阵', from: '老边墓地', to: '万仙阵',
    gridCount: 12, eventDensity: 'extreme', elevationRange: [3300, 3400],
    hasCamp: false, descentRouteId: 'D95', terrain: ['stone_sea'],
  },
  {
    id: 9, name: '万仙阵→跑马梁→大爷海', from: '万仙阵', to: '大爷海',
    gridCount: 8, eventDensity: 'extreme', elevationRange: [3400, 3600],
    hasCamp: true, descentRouteId: 'D88', terrain: ['meadow', 'open'],
  },
  {
    id: 10, name: '拔仙台(可选)', from: '大爷海', to: '拔仙台',
    gridCount: 4, eventDensity: 'special', elevationRange: [3600, 3771],
    hasCamp: false, descentRouteId: null, terrain: ['scree', 'summit'],
  },
  {
    id: 11, name: '大爷海→文宫庙→下板寺', from: '大爷海', to: '下板寺',
    gridCount: 10, eventDensity: 'high', elevationRange: [2700, 3600],
    hasCamp: false, descentRouteId: null, terrain: ['trail', 'road'],
  },
  {
    id: 12, name: '下板寺→汤峪', from: '下板寺', to: '汤峪',
    gridCount: 8, eventDensity: 'medium', elevationRange: [700, 2700],
    hasCamp: false, descentRouteId: null, terrain: ['road'],
  },
]

/** 计算段起始的绝对格子位置 */
export function getSegmentStartGrid(segmentId: number): number {
  let start = 0
  for (const seg of ROUTE_SEGMENTS) {
    if (seg.id === segmentId) return start
    if (seg.id !== 10) start += seg.gridCount  // 拔仙台是支线，不计入主干格子
  }
  return start
}

/** 根据绝对格子位置找到当前段 */
export function getSegmentAtGrid(gridPos: number): RouteSegment {
  let accumulated = 0
  for (const seg of ROUTE_SEGMENTS) {
    if (seg.id === 10) continue  // 支线不在主干序列中
    if (gridPos < accumulated + seg.gridCount) return seg
    accumulated += seg.gridCount
  }
  return ROUTE_SEGMENTS[ROUTE_SEGMENTS.length - 1]
}
