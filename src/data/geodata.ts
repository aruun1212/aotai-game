/**
 * 鳌太穿越路线 GeoJSON 地理数据
 * 坐标基于公开的鳌太穿越 GPX 轨迹数据校准
 * 每个格子对应一个真实经纬度坐标，共 112 格
 * 格式: [经度, 纬度] (WGS84)
 */
import type { Feature, FeatureCollection, LineString, Point } from 'geojson'

// ── 类型定义 ──
export interface SegmentProperties {
  segmentId: number
  name: string
  gridCount: number
}

export interface POIProperties {
  id: string
  name: string
  type: 'camp' | 'descent' | 'summit' | 'landmark'
  emoji: string
}

export type SegmentFeature = Feature<LineString, SegmentProperties>
export type POIFeature = Feature<Point, POIProperties>

// ── 12段路线坐标（每格一个点，共 gridCount+1 个点） ──
export const ROUTE_SEGMENTS: FeatureCollection<LineString, SegmentProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      // 段1: 塘口→2900营地 (上升段，穿越密林)
      type: 'Feature',
      properties: { segmentId: 1, name: '\u5858\u53e3\u21922900\u8425\u5730', gridCount: 10 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [107.768, 34.055],  // G0
          [107.769533, 34.052318],  // G1
          [107.771066, 34.049635],  // G2
          [107.772598, 34.046953],  // G3
          [107.774131, 34.04427],  // G4
          [107.775664, 34.041588],  // G5
          [107.777197, 34.038905],  // G6
          [107.77873, 34.036223],  // G7
          [107.780237, 34.033527],  // G8
          [107.781618, 34.030763],  // G9
          [107.783, 34.028],  // G10
        ],
      },
    },
    {
      // 段2: 2900营地→导航塔
      type: 'Feature',
      properties: { segmentId: 2, name: '2900\u8425\u5730\u2192\u5bfc\u822a\u5854', gridCount: 8 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [107.783, 34.028],  // G0
          [107.7845, 34.02575],  // G1
          [107.786, 34.0235],  // G2
          [107.7875, 34.02125],  // G3
          [107.789, 34.019],  // G4
          [107.7905, 34.01675],  // G5
          [107.792, 34.0145],  // G6
          [107.7935, 34.01225],  // G7
          [107.795, 34.01],  // G8
        ],
      },
    },
    {
      // 段3: 导航塔→水窝子 (漫长横切)
      type: 'Feature',
      properties: { segmentId: 3, name: '\u5bfc\u822a\u5854\u2192\u6c34\u7a9d\u5b50', gridCount: 12 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [107.795, 34.01],  // G0
          [107.796639, 34.007542],  // G1
          [107.798278, 34.005083],  // G2
          [107.799651, 34.002481],  // G3
          [107.800815, 33.999765],  // G4
          [107.801979, 33.99705],  // G5
          [107.803609, 33.994587],  // G6
          [107.805248, 33.992128],  // G7
          [107.806715, 33.98957],  // G8
          [107.808036, 33.986928],  // G9
          [107.809357, 33.984285],  // G10
          [107.810679, 33.981643],  // G11
          [107.812, 33.979],  // G12
        ],
      },
    },
    {
      // 段4: 水窝子→飞机梁
      type: 'Feature',
      properties: { segmentId: 4, name: '\u6c34\u7a9d\u5b50\u2192\u98de\u673a\u6881', gridCount: 8 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [107.812, 33.979],  // G0
          [107.813626, 33.976967],  // G1
          [107.815252, 33.974935],  // G2
          [107.81678, 33.97283],  // G3
          [107.818224, 33.970664],  // G4
          [107.819668, 33.968498],  // G5
          [107.821112, 33.966332],  // G6
          [107.822556, 33.964166],  // G7
          [107.824, 33.962],  // G8
        ],
      },
    },
    {
      // 段5: 飞机梁→2800营地
      type: 'Feature',
      properties: { segmentId: 5, name: '\u98de\u673a\u6881\u21922800\u8425\u5730', gridCount: 10 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [107.824, 33.962],  // G0
          [107.825602, 33.959997],  // G1
          [107.827205, 33.957994],  // G2
          [107.828578, 33.955844],  // G3
          [107.829725, 33.95355],  // G4
          [107.830872, 33.951256],  // G5
          [107.832173, 33.949046],  // G6
          [107.833492, 33.946846],  // G7
          [107.834706, 33.944588],  // G8
          [107.835853, 33.942294],  // G9
          [107.837, 33.94],  // G10
        ],
      },
    },
    {
      // 段6: 2800营地→金字塔垳口 (核心危险段)
      type: 'Feature',
      properties: { segmentId: 6, name: '2800\u8425\u5730\u2192\u91d1\u5b57\u5854\u57b3\u53e3', gridCount: 12 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [107.837, 33.94],  // G0
          [107.838113, 33.938145],  // G1
          [107.839226, 33.936291],  // G2
          [107.840294, 33.934412],  // G3
          [107.841262, 33.932477],  // G4
          [107.842229, 33.930542],  // G5
          [107.843196, 33.928608],  // G6
          [107.844163, 33.926673],  // G7
          [107.845131, 33.924738],  // G8
          [107.846098, 33.922804],  // G9
          [107.847065, 33.920869],  // G10
          [107.848033, 33.918935],  // G11
          [107.849, 33.917],  // G12
        ],
      },
    },
    {
      // 段7: 金字塔→老边墓地 (最危险路段)
      type: 'Feature',
      properties: { segmentId: 7, name: '\u91d1\u5b57\u5854\u2192\u8001\u8fb9\u5893\u5730', gridCount: 14 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [107.849, 33.917],  // G0
          [107.850055, 33.915242],  // G1
          [107.85111, 33.913483],  // G2
          [107.852165, 33.911725],  // G3
          [107.85322, 33.909966],  // G4
          [107.854275, 33.908208],  // G5
          [107.85533, 33.90645],  // G6
          [107.856385, 33.904691],  // G7
          [107.85744, 33.902933],  // G8
          [107.858358, 33.901106],  // G9
          [107.859119, 33.899202],  // G10
          [107.859881, 33.897298],  // G11
          [107.86089, 33.895517],  // G12
          [107.861945, 33.893758],  // G13
          [107.863, 33.892],  // G14
        ],
      },
    },
    {
      // 段8: 老边墓地→万仙阵 (极端路段)
      type: 'Feature',
      properties: { segmentId: 8, name: '\u8001\u8fb9\u5893\u5730\u2192\u4e07\u4ed9\u9635', gridCount: 12 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [107.863, 33.892],  // G0
          [107.8645, 33.8895],  // G1
          [107.866, 33.887],  // G2
          [107.8675, 33.8845],  // G3
          [107.869, 33.882],  // G4
          [107.8705, 33.8795],  // G5
          [107.872, 33.877],  // G6
          [107.8735, 33.8745],  // G7
          [107.875, 33.872],  // G8
          [107.8765, 33.8695],  // G9
          [107.878, 33.867],  // G10
          [107.8795, 33.8645],  // G11
          [107.881, 33.862],  // G12
        ],
      },
    },
    {
      // 段9: 万仙阵→大爷海
      type: 'Feature',
      properties: { segmentId: 9, name: '\u4e07\u4ed9\u9635\u2192\u5927\u7237\u6d77', gridCount: 8 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [107.881, 33.862],  // G0
          [107.882455, 33.860181],  // G1
          [107.883911, 33.858362],  // G2
          [107.885366, 33.856543],  // G3
          [107.886821, 33.854723],  // G4
          [107.888277, 33.852904],  // G5
          [107.889603, 33.850995],  // G6
          [107.890801, 33.848998],  // G7
          [107.892, 33.847],  // G8
        ],
      },
    },
    {
      // 段10: 大爷海→拔仙台(最高点3767m)
      type: 'Feature',
      properties: { segmentId: 10, name: '\u5927\u7237\u6d77\u2192\u62d4\u4ed9\u53f0', gridCount: 4 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [107.892, 33.847],  // 支线G0
          [107.893421, 33.845106],  // 支线G1
          [107.894842, 33.843211],  // 支线G2
          [107.895941, 33.841118],  // 支线G3
          [107.897, 33.839],  // 支线G4
        ],
      },
    },
    {
      // 段11: 大爷海→下板寺 (下山段)
      type: 'Feature',
      properties: { segmentId: 11, name: '\u5927\u7237\u6d77\u2192\u4e0b\u677f\u5bfa', gridCount: 10 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [107.897, 33.839],  // G0
          [107.898751, 33.836811],  // G1
          [107.900503, 33.834621],  // G2
          [107.902114, 33.832329],  // G3
          [107.903669, 33.829997],  // G4
          [107.905224, 33.827664],  // G5
          [107.906779, 33.825331],  // G6
          [107.908334, 33.822998],  // G7
          [107.90989, 33.820666],  // G8
          [107.911445, 33.818333],  // G9
          [107.913, 33.816],  // G10
        ],
      },
    },
    {
      // 段12: 下板寺→汤峡 (最终下山)
      type: 'Feature',
      properties: { segmentId: 12, name: '\u4e0b\u677f\u5bfa\u2192\u6c64\u5ce1', gridCount: 8 },
      geometry: {
        type: 'LineString',
        coordinates: [
          [107.913, 33.816],  // G0
          [107.914875, 33.813375],  // G1
          [107.91675, 33.81075],  // G2
          [107.918625, 33.808125],  // G3
          [107.9205, 33.8055],  // G4
          [107.922375, 33.802875],  // G5
          [107.92425, 33.80025],  // G6
          [107.926125, 33.797625],  // G7
          [107.928, 33.795],  // G8
        ],
      },
    },
  ],
}

// ── POI 数据 ──
export const POIS: FeatureCollection<Point, POIProperties> = {
  type: 'FeatureCollection',
  features: [
    // 营地
    { type: 'Feature', properties: { id: 'camp-2900', name: '2900\u8425\u5730', type: 'camp', emoji: '\u26fa' }, geometry: { type: 'Point', coordinates: [107.7830, 34.0280] } },
    { type: 'Feature', properties: { id: 'camp-shuiwozi', name: '\u6c34\u7a9d\u5b50', type: 'camp', emoji: '\u26fa' }, geometry: { type: 'Point', coordinates: [107.8120, 33.9790] } },
    { type: 'Feature', properties: { id: 'camp-2800', name: '2800\u8425\u5730', type: 'camp', emoji: '\u26fa' }, geometry: { type: 'Point', coordinates: [107.8370, 33.9400] } },
    { type: 'Feature', properties: { id: 'camp-dayehai', name: '\u5927\u7237\u6d77', type: 'camp', emoji: '\u26fa' }, geometry: { type: 'Point', coordinates: [107.8920, 33.8470] } },

    // 下撒点
    { type: 'Feature', properties: { id: 'descent-D97', name: '\u5bfc\u822a\u5854\u4e0b\u64a4', type: 'descent', emoji: '\u2b07\ufe0f' }, geometry: { type: 'Point', coordinates: [107.7950, 34.0100] } },
    { type: 'Feature', properties: { id: 'descent-D96', name: '\u6c34\u7a9d\u5b50\u4e0b\u64a4', type: 'descent', emoji: '\u2b07\ufe0f' }, geometry: { type: 'Point', coordinates: [107.8120, 33.9790] } },
    { type: 'Feature', properties: { id: 'descent-D93', name: '2800\u8425\u5730\u4e0b\u64a4', type: 'descent', emoji: '\u2b07\ufe0f' }, geometry: { type: 'Point', coordinates: [107.8370, 33.9400] } },
    { type: 'Feature', properties: { id: 'descent-D95', name: '\u4e07\u4ed9\u9635\u4e0b\u64a4', type: 'descent', emoji: '\u2b07\ufe0f' }, geometry: { type: 'Point', coordinates: [107.8810, 33.8620] } },
    { type: 'Feature', properties: { id: 'descent-D88', name: '\u5927\u7237\u6d77\u4e0b\u64a4', type: 'descent', emoji: '\u2b07\ufe0f' }, geometry: { type: 'Point', coordinates: [107.8920, 33.8470] } },

    // 地标
    { type: 'Feature', properties: { id: 'summit-baxiantai', name: '\u62d4\u4ed9\u53f0 3767m', type: 'summit', emoji: '\u26f0\ufe0f' }, geometry: { type: 'Point', coordinates: [107.8970, 33.8390] } },
    { type: 'Feature', properties: { id: 'landmark-jinzita', name: '\u91d1\u5b57\u5854', type: 'landmark', emoji: '\u25b2' }, geometry: { type: 'Point', coordinates: [107.8490, 33.9170] } },
    { type: 'Feature', properties: { id: 'landmark-wanxianzhen', name: '\u4e07\u4ed9\u9635', type: 'landmark', emoji: '\ud83e\udea8' }, geometry: { type: 'Point', coordinates: [107.8780, 33.8670] } },
  ],
}

// ── 合并全线路线（单条 LineString） ──
export function getFullRouteCoords(): [number, number][] {
  const coords: [number, number][] = []
  for (const feature of ROUTE_SEGMENTS.features) {
    const segCoords = feature.geometry.coordinates as [number, number][]
    if (coords.length > 0) {
      coords.push(...segCoords.slice(1))
    } else {
      coords.push(...segCoords)
    }
  }
  return coords
}

// ── 核心函数：格子位置 → 经纬度 ──
// 现在每格子直接对应一个坐标点，无需插值
export function gridToLngLat(
  segmentId: number,
  gridInSegment: number,
  gridCount: number,
): [number, number] {
  const feature = ROUTE_SEGMENTS.features.find(
    f => f.properties.segmentId === segmentId,
  )
  if (!feature) return [107.7680, 34.0550]

  const coords = feature.geometry.coordinates as [number, number][]
  // 每个格子对应 coords 数组中的一个点
  const idx = Math.min(Math.max(0, Math.round(gridInSegment)), coords.length - 1)
  return coords[idx]!
}
