#!/usr/bin/env python3
# gen_events_p5.py - Append segment 10-12 events + event pool index
import os

path = os.path.join('src', 'data', 'events.ts')
f = open(path, 'a', encoding='utf-8')

# Segment 10: Dayehai -> Baxiantai (optional summit)
f.write(r"""
// -- Segment 10: Dayehai -> Baxiantai (Summit) --

export const S10_01_DAYEHAI: GameEvent = {
  id: 'S10-01', category: 'encounter', subtype: 'fixed',
  segments: [10], seasons: ['winter','summer'],
  isFixed: true,
  narrative: '\u5927\u7237\u6d77\u3002\u6d77\u62d43600\u7c73\uff0c\u4e00\u6c6a\u6df1\u84dd\u8272\u7684\u9ad8\u5c71\u6e56\u6cca\u5d4c\u5728\u7fa4\u5c71\u4e4b\u95f4\u3002\u6e56\u6c34\u6e05\u6f88\u89c1\u5e95\uff0c\u6c34\u9762\u5982\u955c\u3002\u8fd9\u91cc\u6709\u4e00\u95f4\u677f\u623f\u2014\u2014\u592a\u767d\u5c71\u4fdd\u62a4\u7ad9\u7684\u503c\u73ed\u70b9\u3002\n\n\u5f80\u5317\u2026\u2026\u62d4\u4ed9\u53f0\uff0c\u79e6\u5cad\u6700\u9ad8\u5cf0\uff0c\u6d77\u62d43771.2\u7c73\u3002\u53ea\u67090.6\u516c\u91cc\u7684\u5782\u76f4\u6500\u5347\u3002',
  choices: [
    {
      id: 'S10-01-1', text: '\u51b2\u9876\u62d4\u4ed9\u53f0',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u6c89\u7740\u8138\u5f80\u5317\u8d70\u53bb\u3002\u6700\u540e\u7684600\u7c73\u3002',
    },
    {
      id: 'S10-01-2', text: '\u76f4\u63a5\u4e1c\u884c\u4e0b\u5c71',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u770b\u4e86\u4e00\u773c\u5317\u65b9\u7684\u5c71\u5cf0\uff0c\u7136\u540e\u8f6c\u5411\u4e1c\u65b9\u3002\u4e0d\u662f\u6bcf\u4e2a\u4eba\u90fd\u9700\u8981\u767b\u9876\u3002',
    },
  ],
}
""")

# S10-02 summit
f.write(r"""
export const S10_02_SUMMIT: GameEvent = {
  id: 'S10-02', category: 'encounter', subtype: 'fixed',
  segments: [10], seasons: ['winter','summer'],
  isFixed: true,
  narrative: '\u4f60\u6cbf\u7740\u788e\u77f3\u5761\u5411\u4e0a\u6500\u767b\u3002\u98ce\u8d8a\u6765\u8d8a\u5927\uff0c\u7a7a\u6c14\u8d8a\u6765\u8d8a\u7a00\u8584\u3002\n\n\u7136\u540e\u4f60\u770b\u5230\u4e86\u6807\u5fd7\u2014\u2014\u4e00\u6839\u94c1\u6746\u4e0a\u6302\u7740\u4e00\u5757\u94c1\u724c\uff1a\u201c\u62d4\u4ed9\u53f0 3771.2m\u201d\u3002\n\n\u4f60\u7ad9\u5728\u4e86\u79e6\u5cad\u7684\u6700\u9ad8\u70b9\u3002\u98ce\u4ece\u56db\u9762\u516b\u65b9\u5439\u6765\uff0c\u5439\u5f97\u4f60\u7ad9\u4e0d\u7a33\u3002\u4f46\u4f60\u4e0d\u60f3\u4e0b\u53bb\u3002\u4f60\u60f3\u5728\u8fd9\u91cc\u591a\u7ad9\u4e00\u4f1a\u513f\u3002',
  choices: [
    {
      id: 'S10-02-1', text: '\u5728\u5c71\u9876\u7ad9\u4e00\u4f1a\u513f',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u7ad9\u5728\u90a3\u91cc\uff0c\u95ed\u4e0a\u773c\u775b\u3002\u4e0d\u662f\u4f60\u5f81\u670d\u4e86\u8fd9\u5ea7\u5c71\uff0c\u662f\u8fd9\u5ea7\u5c71\u6682\u65f6\u5bbd\u6055\u4e86\u4f60\u3002',
    },
    {
      id: 'S10-02-2', text: '\u8fd4\u56de\u5927\u7237\u6d77',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u6700\u540e\u770b\u4e86\u4e00\u773c\u811a\u4e0b\u7684\u4e16\u754c\uff0c\u7136\u540e\u8f6c\u8eab\u4e0b\u5c71\u3002',
    },
  ],
}
""")

# Segment 11: Dayehai -> Xiabangsi
f.write(r"""
// -- Segment 11: Dayehai -> Wengongmiao -> Xiabangsi --

export const S11_01_NOODLES: GameEvent = {
  id: 'S11-01', category: 'encounter', subtype: 'discovery',
  segments: [11], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u5c0f\u6587\u516c\u5e99\u7684\u623f\u95f4\u91cc\uff0c\u4f60\u627e\u5230\u4e86\u4e00\u4e9b\u524d\u4eba\u7559\u4e0b\u7684\u7269\u8d44\uff1a\u51e0\u5305\u5ef6\u671f\u7684\u65b9\u4fbf\u9762\u3001\u4e00\u7f50\u5feb\u8fc7\u671f\u7684\u54b8\u83dc\u3001\u8fd8\u6709\u534a\u74f6\u77ff\u6cc9\u6c34\u3002',
  choices: [
    {
      id: 'S11-01-1', text: '\u5403\u4e00\u5305\u6ce1\u9762\uff0c\u7559\u4e0b\u4e00\u4e9b\u81ea\u5df1\u7684\u7269\u8d44',
      consequences: [{ type: 'modify_water', payload: 0.5 }],
      narrative: '\u8fd9\u662f\u4f60\u5403\u8fc7\u6700\u597d\u5403\u7684\u6ce1\u9762\u3002\u4f60\u628a\u4e00\u5305\u997c\u5e72\u653e\u5728\u67b6\u5b50\u4e0a\u3002\u4e0b\u4e00\u4e2a\u4eba\u4e5f\u8bb8\u7528\u5f97\u4e0a\u3002',
    },
    {
      id: 'S11-01-2', text: '\u53ea\u62ff\u6c34\uff0c\u4e0d\u78b0\u98df\u7269',
      consequences: [{ type: 'modify_water', payload: 0.5 }],
      narrative: '\u8fd9\u4e9b\u4e1c\u897f\u53ef\u80fd\u662f\u67d0\u4e2a\u4eba\u7684\u6551\u547d\u7cae\u3002\u4f60\u53ea\u62ff\u4e86\u534a\u74f6\u6c34\u3002',
    },
    {
      id: 'S11-01-3', text: '\u4ec0\u4e48\u90fd\u4e0d\u62ff',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u5173\u4e0a\u95e8\uff0c\u7ee7\u7eed\u8d70\u3002',
    },
  ],
}
""")

# S11-02 concrete road
f.write(r"""
export const S11_02_ROAD: GameEvent = {
  id: 'S11-02', category: 'encounter', subtype: 'atmosphere',
  segments: [11], seasons: ['winter','summer'],
  isFixed: true,
  narrative: '\u6c34\u6ce5\u8def\u3002\u4f60\u8e29\u5728\u6c34\u6ce5\u8def\u4e0a\u7684\u90a3\u4e00\u523b\uff0c\u819d\u76d6\u5dee\u70b9\u8f6f\u4e86\u3002\u8fd9\u662f\u4f60\u51e0\u5929\u6765\u7b2c\u4e00\u6b21\u8e29\u5728\u5e73\u6574\u7684\u8def\u9762\u4e0a\u3002\u516c\u8def\u4e24\u8fb9\u6709\u62a4\u680f\uff0c\u6709\u5f2f\u9053\u955c\u3002\n\n\u4f60\u5df2\u7ecf\u56de\u5230\u4e86\u4eba\u7c7b\u4e16\u754c\u7684\u8fb9\u7f18\u3002',
  choices: [
    {
      id: 'S11-02-1', text: '\u6cbf\u516c\u8def\u8d70',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u6cbf\u7740\u516c\u8def\u5f80\u4e0b\u8d70\u3002\u81f3\u5c11\u4e0d\u7528\u770bGPS\u4e86\u3002',
    },
  ],
}
""")

# Segment 12: Xiabangsi -> Tangyu
f.write(r"""
// -- Segment 12: Xiabangsi -> Tangyu --

export const S12_01_LAST_ROAD: GameEvent = {
  id: 'S12-01', category: 'encounter', subtype: 'atmosphere',
  segments: [12], seasons: ['winter','summer'],
  isFixed: true,
  narrative: '\u4e0b\u677f\u5bfa\u5230\u6c64\u5cea\uff0c\u5341\u51e0\u516c\u91cc\u7684\u666f\u533a\u516c\u8def\u3002\u4f60\u5df2\u7ecf\u8d70\u4e86\u51e0\u5341\u516c\u91cc\u7684\u9ccc\u592a\u7ebf\uff0c\u8fd9\u6bb5\u8def\u5e94\u8be5\u662f\u5c0f\u610f\u601d\u3002\n\n\u4f46\u4f60\u7684\u811a\u5e95\u677f\u53d7\u4e0d\u4e86\u4e86\u3002\u6c34\u6ce5\u8def\u6bd4\u788e\u77f3\u5761\u66f4\u6298\u78e8\u819d\u76d6\u3002',
  choices: [
    {
      id: 'S12-01-1', text: '\u6162\u6162\u8d70',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u4e0d\u6025\u4e86\u3002\u6700\u5371\u9669\u7684\u90e8\u5206\u5df2\u7ecf\u8fc7\u53bb\u4e86\u3002\u4f60\u4e00\u6b65\u4e00\u6b65\u5f80\u4e0b\u8d70\uff0c\u4eab\u53d7\u8fd9\u79cd\u786e\u5b9a\u6027\u3002',
    },
  ],
}
""")

# S12-02 finish
f.write(r"""
export const S12_02_FINISH: GameEvent = {
  id: 'S12-02', category: 'encounter', subtype: 'fixed',
  segments: [12], seasons: ['winter','summer'],
  isFixed: true,
  narrative: '\u4f60\u5230\u8fbe\u666f\u533a\u5e95\u90e8\u65f6\uff0c\u5929\u5df2\u7ecf\u9ed1\u4e86\u3002\u4fdd\u5b89\u5ba4\u7684\u706f\u4eae\u7740\u3002\u4e00\u4e2a\u4fdd\u5b89\u4ece\u7a97\u53e3\u63a2\u51fa\u5934\u6765\uff0c\u4e0a\u4e0b\u6253\u91cf\u4e86\u4f60\u4e00\u773c\uff1a\n\n\u201c\u4f60\u4ece\u54ea\u6765\u7684\uff1f\u201d\n\u201c\u9ccc\u592a\u7ebf\u3002\u201d\n\u201c\u2026\u2026\u8d70\u8fc7\u6765\u7684\uff1f\u201d\n\u201c\u8d70\u8fc7\u6765\u7684\u3002\u201d\n\n\u4ed6\u7aef\u4e86\u676f\u70ed\u6c34\u7ed9\u4f60\uff0c\u7136\u540e\u5f00\u59cb\u5199\u7b14\u5f55\u3002\u4f60\u559d\u7740\u70ed\u6c34\uff0c\u7b7e\u7740\u4fdd\u8bc1\u4e66\uff0c\u7b2c\u4e00\u6b21\u89c9\u5f97\u88ab\u76d8\u95ee\u662f\u4e00\u4ef6\u5e78\u798f\u7684\u4e8b\u3002',
  choices: [
    {
      id: 'S12-02-1', text: '\u7b7e\u4fdd\u8bc1\u4e66',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u7b7e\u4e86\u4fdd\u8bc1\u4e66\u3002\u5750\u4e0a\u4e86\u56de\u7a0b\u7684\u8f66\u3002\u7a97\u5916\u7684\u706f\u5149\u8d8a\u6765\u8d8a\u5bc6\u96c6\u2014\u2014\u4f60\u56de\u5230\u4e86\u4eba\u95f4\u3002',
    },
  ],
}
""")

# Event pool index + export functions
f.write(r"""
// ==========================================================
// Event Pool Index & Export Functions
// ==========================================================

/** All universal events */
export const UNIVERSAL_EVENTS: GameEvent[] = [
  U01_ANKLE_SPRAIN,
  U02_ALTITUDE_SICKNESS,
  U03_BACKPACK_WET,
  U04_SUNSET,
  U05_WILD_WATER,
  U06_POLE_BREAK,
  U07_JUMP_WARMING,
  U08_BURN_CLOTHES,
  U09_FORAGE,
  U10_HALLUCINATION,
  U11_DROP_GEAR,
  U12_TAKIN,
]

/** All segment-specific fixed events */
export const FIXED_EVENTS: GameEvent[] = [
  S01_01_DEPARTURE,
  S02_01_TREELINE,
  S03_02_MEMORIAL,
  S07_03_WHITE_TENT,
  S07_04_CEMETERY,
  S09_01_PAOMA,
  S10_01_DAYEHAI,
  S10_02_SUMMIT,
  S11_02_ROAD,
  S12_01_LAST_ROAD,
  S12_02_FINISH,
]

/** All segment-specific random events */
export const SEGMENT_EVENTS: GameEvent[] = [
  S01_02_FORK,
  S01_03_FOG,
  S02_02_WIND,
  S03_01_STONE_SEA,
  S03_03_FAST_HIKERS,
  S04_01_RIDGE,
  S04_02_CLOUD_SEA,
  S05_01_DEEP_SNOW,
  S05_02_DUSK,
  S06_01_NANTIANMEN,
  S06_02_CRY_IN_WIND,
  S06_03_JINZITA,
  S07_01_TA1,
  S07_02_NORTH_SLOPE,
  S08_01_STONE_SEA,
  S08_02_LOST,
  S08_03_FOOTPRINTS,
  S09_02_LIGHT,
  S09_03_THUNDER,
  S11_01_NOODLES,
]

/** All events merged pool */
export const ALL_EVENTS: GameEvent[] = [
  ...UNIVERSAL_EVENTS,
  ...FIXED_EVENTS,
  ...SEGMENT_EVENTS,
]

/** Filter events by segment + season */
export function getEventsForSegment(segmentId: number, season: 'winter' | 'summer'): GameEvent[] {
  return ALL_EVENTS.filter(e =>
    e.segments.includes(segmentId) && e.seasons.includes(season)
  )
}

/** Get fixed events for a segment */
export function getFixedEventsForSegment(segmentId: number, season: 'winter' | 'summer'): GameEvent[] {
  return FIXED_EVENTS.filter(e =>
    e.segments.includes(segmentId) && e.seasons.includes(season)
  )
}
""")

f.close()
print(f'Final events.ts: {os.path.getsize(path)} bytes')
