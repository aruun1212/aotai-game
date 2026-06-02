import type { DescentRoute } from '@/models/types'
import {
  D97_01_SCREE_SLIDE,
  D96_01_CLIFF_DESCENT,
  D96_02_RIVER_CROSSING,
  D96_03_VALLEY_LOST,
  D93_01_LONG_FOREST,
  D95_01_CLIFF_TRAVERSE,
  D95_02_RIVER_FORD,
  D88_01_DENSE_FOREST,
  D88_02_LOG_BRIDGE,
} from './events'

/** 5 \u6761\u4e0b\u64a4\u8def\u7ebf */
export const DESCENT_ROUTES: DescentRoute[] = [
  {
    id: 'D97', name: '\u5bfc\u822a\u5854\u219223\u516c\u91cc\u5904', from: '\u5bfc\u822a\u5854', to: '23\u516c\u91cc\u5904',
    difficulty: 3, distanceKm: 7.2, elevationDrop: 1800, turnCount: 2,
    riskTags: ['\u788e\u77f3\u5761', '\u704c\u6728'],
    events: [
      { id: 'D97-E01', triggerType: 'probability', probability: 0.5, event: D97_01_SCREE_SLIDE },
    ],
  },
  {
    id: 'D96', name: '\u98de\u673a\u6881\u2192\u5b9d\u6cb3\u6c9f', from: '\u98de\u673a\u6881', to: '\u5b9d\u6cb3\u6c9f',
    difficulty: 5, distanceKm: 14.4, elevationDrop: 2600, turnCount: 4,
    riskTags: ['\u7edd\u58c1', '\u6025\u6d41', '\u8ff7\u9014', '60\u6bb5\u9661\u5761'],
    events: [
      { id: 'D96-E01', triggerType: 'fixed', probability: 1.0, event: D96_01_CLIFF_DESCENT },
      { id: 'D96-E02', triggerType: 'fixed', probability: 1.0, event: D96_02_RIVER_CROSSING },
      { id: 'D96-E03', triggerType: 'probability', probability: 0.7, event: D96_03_VALLEY_LOST },
    ],
  },
  {
    id: 'D93', name: '2800\u8425\u5730\u2192\u6838\u6843\u576a', from: '2800\u8425\u5730', to: '\u6838\u6843\u576a',
    difficulty: 2, distanceKm: 20.6, elevationDrop: 2100, turnCount: 3,
    riskTags: ['\u8def\u7a0b\u957f', '\u6797\u95f4'],
    events: [
      { id: 'D93-E01', triggerType: 'probability', probability: 0.4, event: D93_01_LONG_FOREST },
    ],
  },
  {
    id: 'D95', name: '\u4e07\u4ed9\u9635\u2192\u8001\u53bf\u57ce', from: '\u4e07\u4ed9\u9635', to: '\u8001\u53bf\u57ce',
    difficulty: 4, distanceKm: 18.9, elevationDrop: 2500, turnCount: 3,
    riskTags: ['\u60ac\u5d16\u6a2a\u5207', '\u6cb3\u8c37\u6d89\u6c34', '\u6700\u9661108%'],
    events: [
      { id: 'D95-E01', triggerType: 'fixed', probability: 1.0, event: D95_01_CLIFF_TRAVERSE },
      { id: 'D95-E02', triggerType: 'probability', probability: 0.6, event: D95_02_RIVER_FORD },
    ],
  },
  {
    id: 'D88', name: '\u5927\u7237\u6d77\u2192\u94c1\u7532\u6811', from: '\u5927\u7237\u6d77', to: '\u94c1\u7532\u6811',
    difficulty: 4, distanceKm: 14.6, elevationDrop: 2900, turnCount: 3,
    riskTags: ['\u5bc6\u6797\u8ff7\u9014', '\u6025\u6d41', '\u72ec\u6728\u6865'],
    events: [
      { id: 'D88-E01', triggerType: 'fixed', probability: 1.0, event: D88_01_DENSE_FOREST },
      { id: 'D88-E02', triggerType: 'probability', probability: 0.7, event: D88_02_LOG_BRIDGE },
    ],
  },
]

export function getDescentRoute(id: string): DescentRoute | undefined {
  return DESCENT_ROUTES.find(r => r.id === id)
}
