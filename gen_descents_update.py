#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Rewrite descents.ts to import and reference descent events from events.ts."""
import os

def u(text):
    """Convert Chinese text to \\uXXXX escape sequences."""
    return ''.join(f'\\u{ord(c):04x}' if ord(c) > 127 else c for c in text)

DESCENTS_FILE = os.path.join('src', 'data', 'descents.ts')

content = f"""import type {{ DescentRoute }} from '@/models/types'
import {{
  D97_01_SCREE_SLIDE,
  D96_01_CLIFF_DESCENT,
  D96_02_RIVER_CROSSING,
  D96_03_VALLEY_LOST,
  D93_01_LONG_FOREST,
  D95_01_CLIFF_TRAVERSE,
  D95_02_RIVER_FORD,
  D88_01_DENSE_FOREST,
  D88_02_LOG_BRIDGE,
}} from './events'

/** 5 {u('条下撤路线')} */
export const DESCENT_ROUTES: DescentRoute[] = [
  {{
    id: 'D97', name: '{u('导航塔→23公里处')}', from: '{u('导航塔')}', to: '{u('23公里处')}',
    difficulty: 3, distanceKm: 7.2, elevationDrop: 1800, turnCount: 2,
    riskTags: ['{u('碎石坡')}', '{u('灌木')}'],
    events: [
      {{ id: 'D97-E01', triggerType: 'probability', probability: 0.5, event: D97_01_SCREE_SLIDE }},
    ],
  }},
  {{
    id: 'D96', name: '{u('飞机梁→宝河沟')}', from: '{u('飞机梁')}', to: '{u('宝河沟')}',
    difficulty: 5, distanceKm: 14.4, elevationDrop: 2600, turnCount: 4,
    riskTags: ['{u('绝壁')}', '{u('急流')}', '{u('迷途')}', '{u('60段陡坡')}'],
    events: [
      {{ id: 'D96-E01', triggerType: 'fixed', probability: 1.0, event: D96_01_CLIFF_DESCENT }},
      {{ id: 'D96-E02', triggerType: 'fixed', probability: 1.0, event: D96_02_RIVER_CROSSING }},
      {{ id: 'D96-E03', triggerType: 'probability', probability: 0.7, event: D96_03_VALLEY_LOST }},
    ],
  }},
  {{
    id: 'D93', name: '{u('2800营地→核桃坪')}', from: '{u('2800营地')}', to: '{u('核桃坪')}',
    difficulty: 2, distanceKm: 20.6, elevationDrop: 2100, turnCount: 3,
    riskTags: ['{u('路程长')}', '{u('林间')}'],
    events: [
      {{ id: 'D93-E01', triggerType: 'probability', probability: 0.4, event: D93_01_LONG_FOREST }},
    ],
  }},
  {{
    id: 'D95', name: '{u('万仙阵→老县城')}', from: '{u('万仙阵')}', to: '{u('老县城')}',
    difficulty: 4, distanceKm: 18.9, elevationDrop: 2500, turnCount: 3,
    riskTags: ['{u('悬崖横切')}', '{u('河谷涉水')}', '{u('最陡108%')}'],
    events: [
      {{ id: 'D95-E01', triggerType: 'fixed', probability: 1.0, event: D95_01_CLIFF_TRAVERSE }},
      {{ id: 'D95-E02', triggerType: 'probability', probability: 0.6, event: D95_02_RIVER_FORD }},
    ],
  }},
  {{
    id: 'D88', name: '{u('大爷海→铁甲树')}', from: '{u('大爷海')}', to: '{u('铁甲树')}',
    difficulty: 4, distanceKm: 14.6, elevationDrop: 2900, turnCount: 3,
    riskTags: ['{u('密林迷途')}', '{u('急流')}', '{u('独木桥')}'],
    events: [
      {{ id: 'D88-E01', triggerType: 'fixed', probability: 1.0, event: D88_01_DENSE_FOREST }},
      {{ id: 'D88-E02', triggerType: 'probability', probability: 0.7, event: D88_02_LOG_BRIDGE }},
    ],
  }},
]

export function getDescentRoute(id: string): DescentRoute | undefined {{
  return DESCENT_ROUTES.find(r => r.id === id)
}}
"""

with open(DESCENTS_FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"descents.ts rewritten: {len(content)} bytes")
