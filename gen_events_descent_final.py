#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Auto-generated descent event writer. Run: python gen_events_descent_final.py"""
import os

EVENTS_FILE = os.path.join('src', 'data', 'events.ts')
DESCENTS_FILE = os.path.join('src', 'data', 'descents.ts')

TS_BLOCK = """

// ==========================================================
// Descent Route Events D97 / D96 / D93 / D95 / D88
// ==========================================================


// -- D97 \u5bfc\u822a\u5854->23km \u5904 --

export const D97_01_SCREE_SLIDE: GameEvent = {
  id: 'D97-01', category: 'encounter', subtype: 'terrain',
  segments: [], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u4e0b\u64a4\u7684\u788e\u77f3\u5761\u6bd4\u4f60\u60f3\u8c61\u7684\u6ed1\u3002\u6bcf\u8d70\u4e00\u6b65\uff0c\u811a\u4e0b\u7684\u788e\u77f3\u5c31\u5e26\u7740\u4f60\u5f80\u4e0b\u6e9c\u534a\u7c73\u3002\u50cf\u5728\u8d70\u4e00\u4e2a\u6c38\u8fdc\u5230\u4e0d\u4e86\u5e95\u7684\u6c99\u4e18\u3002',
  choices: [
    {
      id: 'D97-01-1', text: '\u7528\u767b\u5c71\u6756\u63a7\u5236\u901f\u5ea6'
      requiresItem: 'pole'
      consequences: [],
      narrative: '\u6756\u5c16\u6233\u8fdb\u788e\u77f3\u7f1d\u91cc\uff0c\u4f60\u4e00\u6b65\u4e00\u6b65\u7a33\u7a33\u5730\u4e0b\u964d\u3002',
    },
    {
      id: 'D97-01-2', text: '\u5750\u4e0b\u6765\u6ed1'
      consequences: [{ type: 'modify_speed_temp', payload: { delta: 1, turns: 1 } }],
      narrative: '\u4f60\u4e00\u5c41\u80a1\u5750\u5728\u788e\u77f3\u4e0a\u5f80\u4e0b\u6ed1\u3002\u88e4\u5b50\u5b8c\u4e86\uff0c\u4f46\u786e\u5b9e\u5feb\u3002',
      probability: 0.8,
      failNarrative: '\u4f60\u4e00\u5c41\u80a1\u5750\u5728\u788e\u77f3\u4e0a\u5f80\u4e0b\u6ed1\u2014\u2014\u788e\u77f3\u91cc\u85cf\u7740\u5c16\u9510\u7684\u5ca9\u89d2\uff0c\u88e4\u5b50\u522e\u7834\u4e86\uff0c\u5927\u817f\u5916\u4fa7\u4e00\u9053\u8840\u53e3\u3002',
      failConsequences: [{ type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: 2 } }],
    },
    {
      id: 'D97-01-3', text: '\u5c0f\u5fc3\u7ffc\u7ffc\u8d70'
      consequences: [{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }],
      narrative: '\u4f60\u8e72\u7740\u91cd\u5fc3\uff0c\u4e00\u6b65\u4e00\u6b65\u632a\u3002\u6162\u5f97\u4ee4\u4eba\u6293\u72c2\uff0c\u4f46\u5b89\u5168\u3002',
    }
  ],
}


// -- D96 \u98de\u673a\u6881->{u('宝河沟')} --

export const D96_01_CLIFF_DESCENT: GameEvent = {
  id: 'D96-01', category: 'encounter', subtype: 'terrain',
  segments: [], seasons: ['winter', 'summer'],
  isFixed: true,
  narrative: '\u8fd9\u4e0d\u662f\u4e0b\u5c71\u2014\u2014\u8fd9\u662f\u6500\u5ca9\u3002\u53ea\u4e0d\u8fc7\u65b9\u5411\u662f\u53cd\u7684\u3002\u4f60\u9762\u671d\u5ca9\u58c1\uff0c\u811a\u5728\u4e0b\u9762\u60ac\u7a7a\u6478\u7d22\u652f\u70b9\u3002\u8eab\u540e\u5c31\u662f\u51e0\u5341\u7c73\u7684\u5782\u76f4\u843d\u5dee\u3002\u5f80\u4e0b\u770b\u4e00\u773c\uff0c\u80c3\u5c31\u7ffb\u4e0a\u6765\u4e86\u3002',
  choices: [
    {
      id: 'D96-01-1', text: '\u7528\u7ef3\u7d22\u56fa\u5b9a\u4e0b\u964d'
      requiresItem: 'rope'
      consequences: [],
      narrative: '\u4f60\u628a\u7ef3\u7d22\u7cfb\u5728\u7a81\u51fa\u7684\u5ca9\u77f3\u4e0a\uff0c\u80cc\u5bf9\u60ac\u5d16\u4e00\u7c73\u4e00\u7c73\u5730\u653e\u4e0b\u53bb\u3002\u624b\u81c2\u5728\u6296\uff0c\u4f46\u7ef3\u7d22\u4e0d\u4f1a\u9a97\u4f60\u3002',
    },
    {
      id: 'D96-01-2', text: '\u5f92\u624b\u6500\u964d'
      consequences: [],
      narrative: '\u4f60\u6293\u4f4f\u5ca9\u58c1\u4e0a\u6bcf\u4e00\u4e2a\u80fd\u6293\u7684\u4e1c\u897f\u3002\u624b\u6307\u5173\u8282\u6cdb\u767d\uff0c\u6307\u7532\u65ad\u4e86\u4e24\u6839\u3002\u4f46\u4f60\u4e0b\u6765\u4e86\u3002',
      probability: 0.65,
      failNarrative: '\u4f60\u7684\u624b\u6307\u4ece\u5ca9\u58c1\u4e0a\u6ed1\u8131\u3002\u5760\u843d\u7684\u90a3\u4e00\u79d2\uff0c\u4e16\u754c\u5b89\u9759\u4e86\u3002',
      failConsequences: [{ type: 'trigger_death' }],
    },
    {
      id: 'D96-01-3', text: '\u5bfb\u627e\u7ed5\u884c\u8def\u7ebf'
      consequences: [{ type: 'modify_speed_temp', payload: { delta: -2, turns: 1 } }],
      narrative: '\u4f60\u6cbf\u7740\u5d16\u8fb9\u8d70\u4e86\u534a\u5c0f\u65f6\uff0c\u627e\u5230\u4e86\u4e00\u6761\u52c9\u5f3a\u80fd\u8d70\u7684\u659c\u5761\u3002',
      probability: 0.7,
      failNarrative: '\u7ed5\u4e86\u4e00\u5927\u5708\uff0c\u54ea\u91cc\u90fd\u662f\u60ac\u5d16\u3002\u4f60\u4e0d\u5f97\u4e0d\u56de\u5230\u539f\u6765\u7684\u4f4d\u7f6e\u3002',
      failConsequences: [{ type: 'skip_turn' }],
    }
  ],
}

export const D96_02_RIVER_CROSSING: GameEvent = {
  id: 'D96-02', category: 'encounter', subtype: 'terrain',
  segments: [], seasons: ['winter', 'summer'],
  isFixed: true,
  narrative: '\u5c71\u8c37\u5e95\u90e8\u662f\u4e00\u6761\u6e4d\u6025\u7684\u6cb3\u6d41\u3002\u6cb3\u6c34\u6d51\u6d4a\u51b0\u51b7\uff0c\u6c34\u9762\u5bbd\u7ea6\u4e94\u516d\u7c73\u3002\u6ca1\u6709\u6865\uff0c\u6ca1\u6709\u6d45\u6ee9\u3002\u5bf9\u5cb8\u7684\u8def\u5c31\u5728\u90a3\u91cc\uff0c\u4f46\u4f60\u5f97\u5148\u6d3b\u7740\u8fc7\u53bb\u3002',
  choices: [
    {
      id: 'D96-02-1', text: '\u7528\u7ef3\u7d22\u505a\u8f85\u52a9\u8fc7\u6cb3'
      requiresItem: 'rope'
      consequences: [],
      narrative: '\u4f60\u628a\u7ef3\u7d22\u4e00\u7aef\u7cfb\u5728\u5cb8\u8fb9\u7684\u6811\u4e0a\uff0c\u53e6\u4e00\u7aef\u7ed1\u5728\u8170\u4e0a\u3002\u51b0\u51b7\u7684\u6cb3\u6c34\u6ca1\u8fc7\u5927\u817f\uff0c\u4f46\u7ef3\u7d22\u8ba9\u4f60\u4e0d\u81f3\u4e8e\u88ab\u51b2\u8d70\u3002',
    },
    {
      id: 'D96-02-2', text: '\u627e\u6700\u7a84\u5904\u8df3\u8fc7\u53bb'
      consequences: [],
      narrative: '\u4f60\u52a9\u8dd1\u3001\u8d77\u8df3\u2014\u2014\u811a\u5c16\u582a\u582a\u8e29\u5230\u5bf9\u5cb8\u7684\u77f3\u5934\u4e0a\u3002\u4f60\u8db4\u5728\u5730\u4e0a\u5598\u4e86\u5f88\u4e45\u3002',
      probability: 0.6,
      failNarrative: '\u4f60\u5dee\u4e86\u534a\u6b65\u3002\u51b0\u51b7\u7684\u6cb3\u6c34\u77ac\u95f4\u5305\u88f9\u4e86\u4f60\u3002',
      failConsequences: [{ type: 'add_status', payload: { type: 'hypothermia', speedModifier: -2, turnsRemaining: 3, deathCountdown: 5 } }, { type: 'modify_water', payload: -0.5 }],
    },
    {
      id: 'D96-02-3', text: '\u6cbf\u6cb3\u5cb8\u8d70\u627e\u6d45\u6ee9'
      consequences: [{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }],
      narrative: '\u4f60\u6cbf\u7740\u6cb3\u8d70\u4e86\u5f88\u4e45\uff0c\u7ec8\u4e8e\u627e\u5230\u4e00\u5904\u6c34\u53ea\u5230\u819d\u76d6\u7684\u6d45\u6ee9\u3002',
    }
  ],
}

export const D96_03_VALLEY_LOST: GameEvent = {
  id: 'D96-03', category: 'encounter', subtype: 'terrain',
  segments: [], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u8fd9\u6761\u8def\u592a\u4e45\u6ca1\u4eba\u8d70\u4e86\u3002\u704c\u6728\u5c01\u8def\uff0c\u6811\u679d\u6253\u5728\u8138\u4e0a\uff0c\u811a\u4e0b\u7684\u5c0f\u5f84\u65f6\u6709\u65f6\u65e0\u3002GPS\u4e0a\u663e\u793a\u4f60\u5e94\u8be5\u5728\u8def\u4e0a\uff0c\u4f46\u4f60\u7684\u811a\u4e0b\u53ea\u6709\u6742\u8349\u548c\u70c2\u6ce5\u3002',
  choices: [
    {
      id: 'D96-03-1', text: '\u4e25\u683c\u6309GPS\u65b9\u5411\u780d\u8def\u524d\u8fdb'
      requiresItem: 'gps'
      consequences: [{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }],
      narrative: '\u4f60\u7528\u767b\u5c71\u6756\u62e8\u5f00\u704c\u6728\uff0c\u4e00\u7c73\u4e00\u7c73\u5730\u63a8\u8fdb\u3002\u8138\u4e0a\u3001\u624b\u4e0a\u5168\u662f\u5212\u75d5\u3002',
    },
    {
      id: 'D96-03-2', text: '\u51ed\u76f4\u89c9\u627e\u8def'
      consequences: [],
      narrative: '\u4f60\u9009\u4e86\u770b\u8d77\u6765\u7a00\u758f\u4e00\u70b9\u7684\u65b9\u5411\u2014\u2014\u8fd0\u6c14\u4e0d\u9519\uff0c\u8d70\u5bf9\u4e86\u3002',
      probability: 0.5,
      failNarrative: '\u4f60\u9009\u4e86\u770b\u8d77\u6765\u7a00\u758f\u4e00\u70b9\u7684\u65b9\u5411\u2014\u2014\u8d70\u4e86\u4e00\u4e2a\u5c0f\u65f6\u624d\u53d1\u73b0\u662f\u6b7b\u8def\u3002\u53ea\u80fd\u539f\u8def\u8fd4\u56de\u3002',
      failConsequences: [{ type: 'modify_speed_temp', payload: { delta: -2, turns: 1 } }],
    }
  ],
}


// -- D93 2800->\u6838\u6843\u576a --

export const D93_01_LONG_FOREST: GameEvent = {
  id: 'D93-01', category: 'encounter', subtype: 'atmosphere',
  segments: [], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u6838\u6843\u576a\u7684\u4e0b\u64a4\u8def\u6e29\u67d4\u5f97\u4e0d\u50cf\u9ccc\u592a\u3002\u677e\u6811\u6797\u3001\u6eaa\u6d41\u3001\u5076\u5c14\u7684\u9e1f\u53eb\u3002\u5982\u679c\u4e0d\u662f\u817f\u5df2\u7ecf\u5e9f\u4e86\uff0c\u8fd9\u751a\u81f3\u7b97\u662f\u4e00\u6b21\u6109\u5feb\u7684\u6563\u6b65\u3002

\u4f60\u8d70\u4e86\u5f88\u4e45\u5f88\u4e45\u3002\u4e8c\u5341\u516c\u91cc\u5728\u5c71\u91cc\u7684\u611f\u89c9\uff0c\u548c\u57ce\u5e02\u91cc\u5b8c\u5168\u4e0d\u540c\u3002\u4f46\u6bcf\u8d70\u4e00\u6b65\uff0c\u4f60\u90fd\u5728\u8fdc\u79bb\u5371\u9669\u3002',
  choices: [
    {
      id: 'D93-01-1', text: '\u4eab\u53d7\u8fd9\u6bb5\u5b89\u5168\u7684\u8def'
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u7b2c\u4e00\u6b21\u653e\u677e\u4e86\u7d27\u7ef7\u7684\u795e\u7ecf\u3002\u547c\u5438\u987a\u7545\u4e86\uff0c\u80a9\u8180\u677e\u4e0b\u6765\u4e86\u3002\u4f60\u8fd8\u6d3b\u7740\u3002',
    }
  ],
}


// -- D95 \u4e07\u4ed9\u9635->{u('老县城')} --

export const D95_01_CLIFF_TRAVERSE: GameEvent = {
  id: 'D95-01', category: 'encounter', subtype: 'terrain',
  segments: [], seasons: ['winter', 'summer'],
  isFixed: true,
  narrative: '\u4e0b\u64a4\u8def\u4e0a\u6a2a\u5207\u8fc7\u4e00\u6bb5\u60ac\u5d16\u3002\u8def\u9762\u53ea\u6709\u534a\u7c73\u5bbd\uff0c\u5185\u4fa7\u662f\u5ca9\u58c1\uff0c\u5916\u4fa7\u662f\u770b\u4e0d\u5230\u5e95\u7684\u6df1\u6e0a\u3002\u811a\u4e0b\u7684\u77f3\u5934\u677e\u52a8\u5f97\u50cf\u968f\u65f6\u4f1a\u584c\u3002',
  choices: [
    {
      id: 'D95-01-1', text: '\u7528\u7ef3\u7d22\u505a\u5b89\u5168\u7ef3\u901a\u8fc7'
      requiresItem: 'rope'
      consequences: [],
      narrative: '\u4f60\u628a\u7ef3\u7d22\u7cfb\u5728\u5ca9\u58c1\u4e0a\u65b9\u7684\u7a81\u51fa\u7269\u4e0a\uff0c\u8d34\u7740\u5ca9\u58c1\u4e00\u6b65\u4e00\u6b65\u6a2a\u79fb\u3002\u7ef3\u7d22\u5728\u624b\u91cc\uff0c\u5fc3\u5c31\u5b9a\u4e86\u3002',
    },
    {
      id: 'D95-01-2', text: '\u8d34\u58c1\u6162\u884c'
      consequences: [],
      narrative: '\u4f60\u9762\u671d\u5ca9\u58c1\uff0c\u53cc\u624b\u6293\u7740\u77f3\u5934\u7f1d\uff0c\u811a\u5c16\u6a2a\u7740\u632a\u3002\u6bcf\u4e00\u6b65\u90fd\u5728\u548c\u91cd\u529b\u8d4c\u535a\u3002\u4f46\u4f60\u8d62\u4e86\u3002',
      probability: 0.85,
      failNarrative: '\u811a\u4e0b\u7684\u77f3\u5934\u7a81\u7136\u788e\u88c2\u3002\u4f60\u7684\u8eab\u4f53\u5411\u5916\u503e\u659c\u2014\u2014',
      failConsequences: [{ type: 'trigger_death' }],
    },
    {
      id: 'D95-01-3', text: '\u627e\u5176\u4ed6\u8def'
      consequences: [{ type: 'modify_speed_temp', payload: { delta: -2, turns: 1 } }],
      narrative: '\u4f60\u6cbf\u7740\u5d16\u8fb9\u6765\u56de\u627e\u4e86\u534a\u5c0f\u65f6\uff0c\u7ec8\u4e8e\u53d1\u73b0\u4e00\u6761\u7ed5\u884c\u7684\u5c0f\u8def\u3002\u867d\u7136\u591a\u8d70\u4e86\u4e00\u5927\u622a\uff0c\u4f46\u81f3\u5c11\u4e0d\u7528\u5728\u60ac\u5d16\u4e0a\u8d70\u94a2\u4e1d\u3002',
      probability: 0.5,
      failNarrative: '\u8fd9\u6761\u8def\u53ea\u6709\u4e00\u6761\u7ebf\u3002\u6ca1\u6709\u522b\u7684\u9009\u62e9\u3002\u4f60\u4e0d\u5f97\u4e0d\u56de\u6765\u9762\u5bf9\u90a3\u6bb5\u60ac\u5d16\u3002',
      failConsequences: [{ type: 'skip_turn' }],
    }
  ],
}

export const D95_02_RIVER_FORD: GameEvent = {
  id: 'D95-02', category: 'encounter', subtype: 'terrain',
  segments: [], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u63a5\u8fd1\u8001\u53bf\u57ce\u65f6\u8981\u7a7f\u8fc7\u4e00\u7247\u6cb3\u8c37\u3002\u6c34\u4e0d\u6df1\uff0c\u4f46\u77f3\u5934\u4e0a\u957f\u6ee1\u4e86\u9752\u82d4\uff0c\u6ed1\u5f97\u50cf\u62b9\u4e86\u6cb9\u3002',
  choices: [
    {
      id: 'D95-02-1', text: '\u7528\u767b\u5c71\u6756\u63a2\u8def\u6d89\u6c34'
      requiresItem: 'pole'
      consequences: [],
      narrative: '\u6756\u5c16\u5728\u6c34\u4e0b\u8bd5\u63a2\u6bcf\u4e00\u5757\u77f3\u5934\u3002\u4f60\u8e29\u7740\u7a33\u5f53\u7684\u77f3\u5934\uff0c\u4e00\u6b65\u6b65\u8fc7\u4e86\u6cb3\u3002',
    },
    {
      id: 'D95-02-2', text: '\u5c0f\u5fc3\u7ffc\u7ffc\u8d70'
      consequences: [],
      narrative: '\u4f60\u6276\u7740\u65c1\u8fb9\u7684\u77f3\u5934\u8d70\u3002\u811a\u5e95\u6ed1\u4e86\u51e0\u6b21\uff0c\u4f46\u6bcf\u6b21\u90fd\u6293\u4f4f\u4e86\u3002\u6709\u60ca\u65e0\u9669\u3002',
      probability: 0.7,
      failNarrative: '\u811a\u5e95\u7a81\u7136\u4e00\u6ed1\u2014\u2014\u4f60\u6574\u4e2a\u4eba\u6454\u8fdb\u4e86\u6cb3\u91cc\u3002\u51b0\u51b7\u7684\u6cb3\u6c34\u6d78\u900f\u4e86\u5168\u8eab\u3002',
      failConsequences: [{ type: 'add_status', payload: { type: 'hypothermia', speedModifier: -1, turnsRemaining: 2, deathCountdown: 6 } }],
    }
  ],
}


// -- D88 \u5927\u7237\u6d77->{u('铁甲树')} --

export const D88_01_DENSE_FOREST: GameEvent = {
  id: 'D88-01', category: 'encounter', subtype: 'terrain',
  segments: [], seasons: ['winter', 'summer'],
  isFixed: true,
  narrative: '\u4ece\u5927\u7237\u6d77\u5f80\u5357\u4e0b\u64a4\uff0c\u5f88\u5feb\u5c31\u8fdb\u5165\u4e86\u5bc6\u4e0d\u900f\u98ce\u7684\u539f\u59cb\u68ee\u6797\u3002\u6811\u51a0\u906e\u853d\u4e86\u5929\u7a7a\uff0cGPS\u4fe1\u53f7\u5728\u6811\u6797\u91cc\u65ad\u65ad\u7eed\u7eed\u3002\u8def\u9762\u88ab\u843d\u53f6\u548c\u67af\u679d\u8986\u76d6\uff0c\u6839\u672c\u5206\u4e0d\u6e05\u54ea\u91cc\u662f\u8def\u54ea\u91cc\u4e0d\u662f\u8def\u3002

\u4f60\u60f3\u8d77\u4e86\u90a3\u4e2a\u5728\u8fd9\u7247\u68ee\u6797\u91cc\u8ff7\u5931\u4e86\u516b\u5929\u7684\u4eba\u3002\u4ed6\u6700\u540e\u9760\u5403\u7af9\u53f6\u548c\u6811\u76ae\u6d3b\u4e86\u4e0b\u6765\u3002',
  choices: [
    {
      id: 'D88-01-1', text: '\u9891\u7e41\u68c0\u67e5GPS\uff0c\u6bcf\u8d7050\u7c73\u786e\u8ba4\u4e00\u6b21\u65b9\u5411'
      requiresItem: 'gps'
      consequences: [{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }],
      narrative: '\u4f60\u50cf\u504f\u6267\u72c2\u4e00\u6837\u6bcf\u8d70\u4e00\u5c0f\u6bb5\u5c31\u638f\u51faGPS\u3002\u6162\uff0c\u4f46\u4f60\u77e5\u9053\u81ea\u5df1\u5728\u54ea\u3002',
    },
    {
      id: 'D88-01-2', text: '\u6cbf\u7740\u6eaa\u6d41\u65b9\u5411\u8d70'
      consequences: [],
      narrative: '\u6c34\u603b\u662f\u5f80\u4e0b\u6d41\u7684\u3002\u4f60\u8ddf\u7740\u6eaa\u6d41\u8d70\uff0c\u6eaa\u6d41\u5e26\u4f60\u7a7f\u8fc7\u4e86\u5bc6\u6797\u3002',
      probability: 0.8,
      failNarrative: '\u4f60\u8ddf\u7740\u6eaa\u6d41\u8d70\u2014\u2014\u4f46\u8fd9\u6761\u6eaa\u6d41\u62d0\u8fdb\u4e86\u4e00\u6761\u8d8a\u6765\u8d8a\u7a84\u7684\u5c71\u6c9f\u3002\u4f60\u4e0d\u5f97\u4e0d\u539f\u8def\u8fd4\u56de\u3002',
      failConsequences: [{ type: 'modify_speed_temp', payload: { delta: -2, turns: 1 } }],
    },
    {
      id: 'D88-01-3', text: '\u51ed\u611f\u89c9\u5f80\u4e0b\u8d70'
      consequences: [],
      narrative: '\u4e0b\u5c31\u5bf9\u4e86\u3002\u4f60\u9009\u4e86\u4e00\u4e2a\u770b\u8d77\u6765\u5411\u4e0b\u7684\u65b9\u5411\uff0c\u8fd0\u6c14\u4e0d\u9519\u3002',
      probability: 0.6,
      failNarrative: '\u4f60\u5728\u5bc6\u6797\u91cc\u8f6c\u4e86\u4e24\u4e2a\u5c0f\u65f6\u3002\u6bcf\u68f5\u6811\u770b\u8d77\u6765\u90fd\u4e00\u6837\u3002\u4f60\u5f00\u59cb\u7406\u89e3\u90a3\u4e2a\u4eba\u7684\u7edd\u671b\u4e86\u3002',
      failConsequences: [{ type: 'trigger_lost' }, { type: 'modify_speed_temp', payload: { delta: -3, turns: 1 } }],
    }
  ],
}

export const D88_02_LOG_BRIDGE: GameEvent = {
  id: 'D88-02', category: 'encounter', subtype: 'terrain',
  segments: [], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u53c8\u4e00\u6761\u6cb3\u62e6\u5728\u9762\u524d\u3002\u8fd9\u6b21\u6cb3\u4e0a\u5012\u4e86\u4e00\u68f5\u67af\u6811\uff0c\u52c9\u5f3a\u642d\u4e86\u4e2a\u5929\u7136\u72ec\u6728\u6865\u3002\u6811\u5e72\u6e7f\u6ed1\uff0c\u76f4\u5f84\u4e0d\u5230\u4e09\u5341\u5398\u7c73\u3002\u6cb3\u6c34\u5728\u4e0b\u9762\u8f70\u9e23\u3002',
  choices: [
    {
      id: 'D88-02-1', text: '\u9a91\u5728\u6811\u5e72\u4e0a\u632a\u8fc7\u53bb'
      consequences: [],
      narrative: '\u4f60\u5750\u5728\u6811\u5e72\u4e0a\uff0c\u53cc\u624b\u6293\u7740\u6811\u76ae\uff0c\u4e00\u70b9\u4e00\u70b9\u5f80\u5bf9\u5cb8\u632a\u3002\u88e4\u5b50\u6e7f\u4e86\uff0c\u4f46\u8fc7\u53bb\u4e86\u3002',
      probability: 0.9,
      failNarrative: '\u6811\u5e72\u7a81\u7136\u8f6c\u52a8\u4e86\u4e00\u4e0b\u2014\u2014\u4f60\u6b7b\u6b7b\u62b1\u4f4f\u6811\u5e72\uff0c\u82b1\u4e86\u4e94\u5206\u949f\u624d\u7a33\u4f4f\u3002\u88e4\u5b50\u6e7f\u900f\u4e86\u3002',
      failConsequences: [{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }],
    },
    {
      id: 'D88-02-2', text: '\u7ad9\u7740\u8d70\u8fc7\u53bb'
      consequences: [],
      narrative: '\u4f60\u5f20\u5f00\u53cc\u81c2\u4fdd\u6301\u5e73\u8861\u3002\u4e00\u6b65\uff0c\u4e24\u6b65\u2026\u2026\u4e09\u6b65\u2014\u2014\u4f60\u5230\u4e86\u5bf9\u5cb8\u3002',
      probability: 0.6,
      failNarrative: '\u4f60\u5f20\u5f00\u53cc\u81c2\u4fdd\u6301\u5e73\u8861\u3002\u4e00\u6b65\uff0c\u4e24\u6b65\u2014\u2014\u811a\u5e95\u7a81\u7136\u6253\u6ed1\u3002\u51b0\u51b7\u7684\u6cb3\u6c34\u541e\u6ca1\u4e86\u4f60\u3002',
      failConsequences: [{ type: 'add_status', payload: { type: 'hypothermia', speedModifier: -1, turnsRemaining: 2, deathCountdown: 6 } }],
    },
    {
      id: 'D88-02-3', text: '\u4e0d\u8d70\u72ec\u6728\u6865\uff0c\u6d89\u6c34\u8fc7\u6cb3'
      consequences: [{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }],
      narrative: '\u4f60\u653e\u5f03\u4e86\u90a3\u6839\u770b\u8d77\u6765\u968f\u65f6\u4f1a\u65ad\u7684\u6811\u5e72\uff0c\u76f4\u63a5\u8e5a\u8fdb\u4e86\u51b0\u51b7\u7684\u6cb3\u6c34\u91cc\u3002\u5b89\u5168\uff0c\u4f46\u51b7\u5f97\u8981\u547d\u3002',
    }
  ],
}

"""

# Append to events.ts
with open(EVENTS_FILE, 'r', encoding='utf-8') as f:
    content = f.read()
content = content.rstrip() + '\n' + TS_BLOCK
with open(EVENTS_FILE, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Descent events appended: {len(content)} bytes")
