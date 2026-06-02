#!/usr/bin/env python3
# gen_events_final.py - Generate complete events.ts with unicode escapes
# Chinese text is stored as \uXXXX in raw strings so it passes through
# to TypeScript where the JS runtime interprets them as Chinese characters.

import os

path = os.path.join('src', 'data', 'events.ts')
f = open(path, 'w', encoding='utf-8')

f.write(r"""import type { GameEvent, Season } from '@/models/types'

// ==========================================================
// Universal Events U01 ~ U12
// ==========================================================

export const U01_ANKLE_SPRAIN: GameEvent = {
  id: 'U01', category: 'encounter', subtype: 'body',
  segments: [1,2,3,4,5,6,7,8,9,10,11,12], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u4e0b\u5761\u65f6\u53f3\u811a\u8e29\u5728\u4e00\u5757\u677e\u52a8\u7684\u788e\u77f3\u4e0a\uff0c\u811a\u8e1d\u731b\u5730\u5411\u5185\u7ffb\u6298\u3002\u4e00\u9635\u5267\u75db\u4ece\u811a\u8e1d\u8513\u5ef6\u5230\u5c0f\u817f\u2014\u2014\u4f60\u626d\u4f24\u4e86\u3002',
  choices: [
    {
      id: 'U01-1', text: '\u4f7f\u7528\u6025\u6551\u5305\u5904\u7406', requiresItem: 'firstaid',
      itemCost: { defId: 'firstaid', count: 1 },
      consequences: [
        { type: 'consume_item', payload: 'firstaid' },
        { type: 'remove_status', payload: 'sprain' },
      ],
      narrative: '\u4f60\u719f\u7ec3\u5730\u7f20\u4e0a\u7ef7\u5e26\uff0c\u51b0\u6577\u5341\u4e94\u5206\u949f\u3002\u8fd8\u80fd\u8d70\u3002',
    },
    {
      id: 'U01-2', text: '\u54ac\u7259\u7ee7\u7eed\u8d70',
      consequences: [
        { type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: -1 } },
      ],
      narrative: '\u4f60\u4e00\u7638\u4e00\u62d0\u5730\u7ad9\u8d77\u6765\u3002\u6bcf\u4e00\u6b65\u90fd\u5728\u63d0\u9192\u4f60\u8fd9\u4e2a\u9519\u8bef\u3002',
    },
  ],
}

export const U02_ALTITUDE_SICKNESS: GameEvent = {
  id: 'U02', category: 'encounter', subtype: 'body',
  segments: [3,4,5,6,7,8,9,10,11], seasons: ['winter','summer'],
  isFixed: false,
  condition: (state) => state.segmentId >= 3,
  narrative: '\u592a\u9633\u7a74\u5f00\u59cb\u7a81\u7a81\u5730\u8df3\uff0c\u80c3\u91cc\u7ffb\u6c5f\u5012\u6d77\u3002\u4f60\u8e72\u4e0b\u6765\u5e72\u5455\u4e86\u4e24\u6b21\uff0c\u773c\u524d\u53d1\u9ed1\u3002\u8fd9\u662f\u9ad8\u53cd\u3002',
  choices: [
    {
      id: 'U02-1', text: '\u670d\u7528\u9ad8\u53cd\u836f', requiresItem: 'altitude_med',
      itemCost: { defId: 'altitude_med', count: 1 },
      consequences: [
        { type: 'consume_item', payload: 'altitude_med' },
        { type: 'remove_status', payload: 'altitude_sickness' },
      ],
      narrative: '\u836f\u7247\u54bd\u4e0b\u53bb\u4e8c\u5341\u5206\u949f\u540e\uff0c\u5934\u75db\u6162\u6162\u9000\u6f6e\u3002',
    },
    {
      id: 'U02-2', text: '\u539f\u5730\u4f11\u606f\u534a\u5c0f\u65f6',
      consequences: [{ type: 'skip_turn' }],
      probability: 0.5,
      narrative: '\u4f60\u95ed\u4e0a\u773c\u775b\u9760\u5728\u77f3\u5934\u4e0a\u3002\u5929\u65cb\u5730\u8f6c\u7684\u611f\u89c9\u6162\u6162\u6d88\u9000\u3002',
      failNarrative: '\u4f60\u4f11\u606f\u4e86\u534a\u5c0f\u65f6\uff0c\u4f46\u5934\u75db\u4e0d\u51cf\u53cd\u589e\u3002',
      failConsequences: [
        { type: 'add_status', payload: { type: 'altitude_sickness', speedModifier: -1, turnsRemaining: -1 } },
      ],
    },
    {
      id: 'U02-3', text: '\u786c\u6491\u7740\u7ee7\u7eed',
      consequences: [
        { type: 'add_status', payload: { type: 'altitude_sickness', speedModifier: -1, turnsRemaining: -1 } },
      ],
      narrative: '\u4f60\u6447\u6447\u6643\u6643\u7ad9\u8d77\u6765\u3002\u4e16\u754c\u5728\u65cb\u8f6c\u3002',
    },
  ],
}

export const U03_BACKPACK_WET: GameEvent = {
  id: 'U03', category: 'encounter', subtype: 'equipment',
  segments: [1,2,3,4,5,6,7,8,9,10,11,12], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u4f60\u6458\u4e0b\u80cc\u5305\u68c0\u67e5\u65f6\uff0c\u53d1\u73b0\u5e95\u90e8\u5df2\u7ecf\u6e7f\u900f\u4e86\u3002\u62c9\u5f00\u62c9\u94fe\uff0c\u91cc\u9762\u79ef\u4e86\u4e00\u5c42\u6c34\u3002',
  choices: [
    {
      id: 'U03-1', text: '\u7528\u9632\u6c34\u888b\u62a2\u6551', requiresItem: 'drybag',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u5e78\u597d\u4f60\u6709\u9632\u6c34\u888b\uff0c\u91cd\u8981\u7269\u8d44\u90fd\u5728\u91cc\u9762\u3002\u53ea\u662f\u5916\u5c42\u8863\u7269\u6e7f\u4e86\u3002',
    },
    {
      id: 'U03-2', text: '\u7d27\u6025\u6652\u5e72',
      consequences: [{ type: 'skip_turn' }],
      narrative: '\u4f60\u505c\u4e0b\u6765\u628a\u80cc\u5305\u91cc\u7684\u4e1c\u897f\u4e00\u4ef6\u4ef6\u62ff\u51fa\u6765\u6652\u3002\u803d\u8bef\u4e86\u4e0d\u5c11\u65f6\u95f4\u3002',
    },
    {
      id: 'U03-3', text: '\u7ee7\u7eed\u8d76\u8def\u4e0d\u7ba1',
      consequences: [{ type: 'damage_item', payload: 'biscuit' }],
      narrative: '\u7b49\u4f60\u665a\u4e0a\u518d\u6253\u5f00\u80cc\u5305\u65f6\uff0c\u538b\u7f29\u997c\u5e72\u5df2\u7ecf\u6ce1\u70c2\u4e86\u3002',
    },
  ],
}

export const U04_SUNSET: GameEvent = {
  id: 'U04', category: 'encounter', subtype: 'discovery',
  segments: [2,3,4,5,6,7,8,9], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u4f60\u62ac\u5934\uff0c\u897f\u8fb9\u7684\u5929\u7a7a\u6b63\u5728\u71c3\u70e7\u3002\u4e91\u5c42\u88ab\u67d3\u6210\u6df1\u7ea2\u548c\u91d1\u8272\uff0c\u79e6\u5cad\u7684\u5c71\u810a\u7ebf\u50cf\u4e00\u9053\u9ed1\u8272\u7684\u526a\u5f71\u6a2a\u4e98\u5929\u9645\u3002\u4f60\u7ad9\u5728\u8fd9\u91cc\uff0c\u6d77\u62d4\u4e09\u5343\u591a\u7c73\uff0c\u6574\u4e2a\u4e16\u754c\u5b89\u9759\u5f97\u53ea\u5269\u98ce\u58f0\u3002',
  choices: [
    {
      id: 'U04-1', text: '\u9a7b\u8db3\u6b23\u8d4f',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u62cd\u4e86\u5f20\u7167\u7247\uff0c\u4f46\u4f60\u77e5\u9053\u7167\u7247\u6c38\u8fdc\u62cd\u4e0d\u51fa\u8fd9\u79cd\u611f\u89c9\u3002',
    },
    {
      id: 'U04-2', text: '\u7ee7\u7eed\u8d76\u8def',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u4f4e\u5934\u770b\u4e86\u773c\u8f68\u8ff9\uff0c\u7ee7\u7eed\u8d70\u3002\u8eab\u540e\u7684\u5929\u7a7a\u8fd8\u5728\u71c3\u70e7\uff0c\u4f46\u4f60\u5df2\u7ecf\u4e0d\u770b\u4e86\u3002',
    },
  ],
}

export const U05_WILD_WATER: GameEvent = {
  id: 'U05', category: 'encounter', subtype: 'discovery',
  segments: [1,2,3,4,5,6,7,8,9,10,11], seasons: ['summer'],
  isFixed: false,
  narrative: '\u704c\u6728\u4e1b\u540e\u9762\u4f20\u6765\u6c34\u58f0\u3002\u62e8\u5f00\u679d\u53f6\uff0c\u4e00\u80a1\u7ec6\u6d41\u4ece\u5ca9\u7f1d\u4e2d\u6e17\u51fa\uff0c\u5728\u77f3\u5934\u4e0a\u6c47\u6210\u4e00\u5c0f\u6d3c\u6e05\u6c34\u3002',
  choices: [
    {
      id: 'U05-1', text: '\u7528\u51c0\u6c34\u7247\u51c0\u5316\u540e\u88c5\u74f6', requiresItem: 'purifier',
      itemCost: { defId: 'purifier', count: 1 },
      consequences: [
        { type: 'consume_item', payload: 'purifier' },
        { type: 'modify_water', payload: 1 },
      ],
      narrative: '\u4f60\u5c0f\u5fc3\u7ffc\u7ffc\u5730\u51c0\u5316\u4e86\u4e00\u5347\u6c34\u3002\u51b0\u51c9\u7684\u6c34\u4ece\u5589\u5499\u6ed1\u4e0b\u53bb\uff0c\u6574\u4e2a\u4eba\u90fd\u6d3b\u8fc7\u6765\u4e86\u3002',
    },
    {
      id: 'U05-2', text: '\u76f4\u63a5\u996e\u7528',
      consequences: [{ type: 'modify_water', payload: 0.5 }],
      probability: 0.7,
      narrative: '\u4f60\u6367\u8d77\u6c34\u5c31\u559d\u3002\u7518\u751c\u51b0\u51c9\u3002',
      failNarrative: '\u4f60\u6367\u8d77\u6c34\u5c31\u559d\u2014\u2014\u51e0\u5c0f\u65f6\u540e\u8179\u75db\u5f00\u59cb\u4e86\u3002',
      failConsequences: [
        { type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: 2 } },
      ],
    },
    {
      id: 'U05-3', text: '\u4e0d\u559d\uff0c\u7ee7\u7eed\u8d70',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u4e0d\u786e\u5b9a\u6c34\u8d28\uff0c\u51b3\u5b9a\u4e0d\u5192\u9669\u3002',
    },
  ],
}

export const U06_POLE_BREAK: GameEvent = {
  id: 'U06', category: 'encounter', subtype: 'equipment',
  segments: [1,2,3,4,5,6,7,8,9,10,11,12], seasons: ['winter','summer'],
  isFixed: false,
  condition: (state) => state.inventory.some(i => i.defId === 'pole' && !i.damaged),
  narrative: '\u4e0b\u4e00\u4e2a\u9661\u5761\u65f6\u4f60\u628a\u5168\u8eab\u91cd\u91cf\u538b\u5728\u767b\u5c71\u6756\u4e0a\uff0c\u201c\u5494\u5693\u201d\u4e00\u58f0\u2014\u2014\u6756\u6746\u4ece\u4e2d\u95f4\u65ad\u6210\u4e24\u622a\u3002',
  choices: [
    {
      id: 'U06-1', text: '\u7528\u4fee\u7406\u5de5\u5177\u4fee\u590d', requiresItem: 'repair_kit',
      itemCost: { defId: 'repair_kit', count: 1 },
      consequences: [{ type: 'consume_item', payload: 'repair_kit' }],
      narrative: '\u4f60\u7528\u80f6\u5e26\u548c\u91d1\u5c5e\u7247\u628a\u6756\u6746\u56fa\u5b9a\u4f4f\u3002\u80fd\u51d1\u5408\u7528\u3002',
    },
    {
      id: 'U06-2', text: '\u4e22\u6389\u65ad\u6756\u51cf\u91cd',
      consequences: [{ type: 'consume_item', payload: 'pole' }],
      narrative: '\u4f60\u628a\u4e24\u622a\u65ad\u6756\u6254\u5728\u8def\u8fb9\u3002\u8f7b\u4e86\u4e00\u70b9\uff0c\u4f46\u63a5\u4e0b\u6765\u7684\u9661\u5761\u8981\u9760\u81ea\u5df1\u4e86\u3002',
    },
    {
      id: 'U06-3', text: '\u5e26\u7740\u65ad\u6756\u7ee7\u7eed',
      consequences: [{ type: 'damage_item', payload: 'pole' }],
      narrative: '\u65ad\u6756\u585e\u56de\u80cc\u5305\uff0c\u8bf4\u4e0d\u5b9a\u4ee5\u540e\u80fd\u4fee\u3002',
    },
  ],
}

export const U07_JUMP_WARMING: GameEvent = {
  id: 'U07', category: 'encounter', subtype: 'body',
  segments: [3,4,5,6,7,8,9,10], seasons: ['winter'],
  isFixed: false,
  condition: (state) => state.statusEffects.some(s => s.type === 'hypothermia'),
  narrative: '\u4f60\u6ca1\u6709\u5e10\u7bf7\uff0c\u6ca1\u6709\u7761\u888b\uff0c\u98ce\u628a\u4f53\u6e29\u4e00\u5ea6\u4e00\u5ea6\u5730\u62bd\u8d70\u3002\u4f60\u60f3\u8d77\u4e86\u4e00\u4e2a\u4f20\u8bf4\u2014\u2014\u6709\u4eba\u5c31\u662f\u9760\u8e66\u8df3\u6491\u8fc7\u4e86\u9ccc\u592a\u7684\u51ac\u591c\u3002\u4f60\u5f00\u59cb\u8df3\u3002',
  choices: [
    {
      id: 'U07-1', text: '\u62fc\u547d\u8e66\u8df3\u5230\u5929\u4eae',
      itemCost: { defId: 'gel', count: 1 },
      consequences: [{ type: 'consume_item', payload: 'gel' }],
      probability: 0.6,
      narrative: '\u4f60\u8df3\u4e86\u4e00\u6574\u591c\u3002\u817f\u5df2\u7ecf\u4e0d\u662f\u4f60\u7684\u4e86\u3002\u4f46\u592a\u9633\u51fa\u6765\u4e86\u3002',
      failNarrative: '\u4f60\u8df3\u4e86\u56db\u4e2a\u5c0f\u65f6\u5c31\u518d\u4e5f\u8df3\u4e0d\u52a8\u4e86\u3002\u6d51\u8eab\u53d1\u6296\uff0c\u5f00\u59cb\u60f3\u5931\u6e29\u6b7b\u4ea1\u662f\u4ec0\u4e48\u611f\u89c9\u3002',
      failConsequences: [],
    },
    {
      id: 'U07-2', text: '\u653e\u5f03\u6323\u624e',
      consequences: [],
      narrative: '\u4f60\u8e61\u7f29\u5728\u96ea\u5730\u91cc\uff0c\u95ed\u4e0a\u773c\u775b\u3002',
    },
  ],
}

export const U08_BURN_CLOTHES: GameEvent = {
  id: 'U08', category: 'encounter', subtype: 'equipment',
  segments: [3,4,5,6,7,8,9,10], seasons: ['winter'],
  isFixed: false,
  condition: (state) => state.statusEffects.some(s => s.type === 'hypothermia'),
  narrative: '\u6240\u6709\u7684\u67f4\u90fd\u662f\u6e7f\u7684\uff0c\u6253\u706b\u673a\u7684\u6c14\u5feb\u7528\u5b8c\u4e86\u3002\u4f60\u76ef\u7740\u81ea\u5df1\u8eab\u4e0a\u7684\u8863\u7269\uff0c\u505a\u4e86\u4e00\u4e2a\u7591\u72c2\u7684\u51b3\u5b9a\u3002',
  choices: [
    {
      id: 'U08-1', text: '\u70e7\u6389\u4e00\u4ef6\u88c5\u5907\u751f\u706b',
      consequences: [
        { type: 'consume_item', payload: 'raincoat' },
        { type: 'remove_status', payload: 'hypothermia' },
      ],
      narrative: '\u5e72\u71e5\u7684\u5e03\u6599\u7ec8\u4e8e\u70b9\u71c3\u4e86\u706b\u5806\u3002\u706b\u5149\u6620\u5728\u4f60\u8138\u4e0a\uff0c\u6cea\u6c34\u4e0d\u77e5\u4ec0\u4e48\u65f6\u5019\u6d41\u4e0b\u6765\u4e86\u3002',
    },
    {
      id: 'U08-2', text: '\u7ee7\u7eed\u8bd5\u7740\u70b9\u6e7f\u67f4',
      consequences: [{ type: 'skip_turn' }],
      probability: 0.2,
      narrative: '\u2026\u2026\u5c45\u7136\u7740\u4e86\u3002',
      failNarrative: '\u4f60\u53c8\u8bd5\u4e86\u534a\u4e2a\u5c0f\u65f6\u3002\u5947\u8ff9\u6ca1\u6709\u53d1\u751f\u3002',
      failConsequences: [],
    },
    {
      id: 'U08-3', text: '\u653e\u5f03\u751f\u706b\uff0c\u9760\u4f53\u6e29\u786c\u6297',
      consequences: [],
      narrative: '\u5931\u6e29\u7ee7\u7eed\u5012\u8ba1\u65f6\u3002',
    },
  ],
}

export const U09_FORAGE: GameEvent = {
  id: 'U09', category: 'encounter', subtype: 'discovery',
  segments: [1,2,3,4,5,6,7,8,9,10,11], seasons: ['summer'],
  isFixed: false,
  condition: (state) => !state.inventory.some(i => i.defId === 'biscuit' || i.defId === 'meal'),
  narrative: '\u80cc\u5305\u91cc\u5df2\u7ecf\u6ca1\u6709\u4efb\u4f55\u80fd\u5403\u7684\u4e1c\u897f\u4e86\u3002\u4f60\u5f00\u59cb\u6253\u91cf\u5468\u56f4\u7684\u690d\u88ab\u2014\u2014\u7af9\u53f6\u3001\u91ce\u8349\u3001\u4e0d\u77e5\u540d\u7684\u6d46\u679c\u3002',
  choices: [
    {
      id: 'U09-1', text: '\u6458\u7af9\u53f6\u548c\u5ae9\u8349\u5c1d\u8bd5',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.5,
      narrative: '\u4f60\u56bc\u8d77\u6765\u4e0d\u82e6\u4e0d\u6da9\u7684\u5c31\u541e\u4e0b\u53bb\u3002\u7af9\u53f6\u662f\u6700\u591a\u7684\u3002',
      failNarrative: '\u4f60\u5632\u4e86\u51e0\u53e3\uff0c\u4f46\u4ec0\u4e48\u4e5f\u6ca1\u5403\u8fdb\u53bb\u3002',
      failConsequences: [],
    },
    {
      id: 'U09-2', text: '\u5c1d\u8bd5\u5403\u6606\u866b',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.4,
      narrative: '\u4f60\u628a\u4e00\u53ea\u7532\u866b\u653e\u8fdb\u5634\u91cc\u2026\u2026\u52c9\u5f3a\u54bd\u4e0b\u53bb\u4e86\u3002',
      failNarrative: '\u4f60\u628a\u4e00\u53ea\u7532\u866b\u653e\u8fdb\u5634\u91cc\u2026\u2026\u4e0d\u884c\uff0c\u8fd8\u662f\u5410\u51fa\u6765\u4e86\u3002',
      failConsequences: [],
    },
    {
      id: 'U09-3', text: '\u4e0d\u5403\uff0c\u7ee7\u7eed\u5fcd',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u51b3\u5b9a\u4e0d\u5192\u9669\u3002\u80c3\u5728\u6297\u8bae\u3002',
    },
  ],
}

export const U10_HALLUCINATION: GameEvent = {
  id: 'U10', category: 'encounter', subtype: 'body',
  segments: [3,4,5,6,7,8,9,10], seasons: ['winter','summer'],
  isFixed: false,
  condition: (state) => state.speed <= 2 && state.statusEffects.some(s => s.deathCountdown !== undefined),
  narrative: '\u4f60\u770b\u5230\u524d\u65b9\u6709\u4eba\u3002\u4e09\u4e2a\u80cc\u7740\u5927\u5305\u7684\u9a74\u53cb\u7ad9\u5728\u5c71\u810a\u4e0a\u5411\u4f60\u62db\u624b\uff0c\u65c1\u8fb9\u8fd8\u642d\u7740\u7eff\u8272\u7684\u5e10\u7bf7\u3002\u4f60\u52a0\u5feb\u811a\u6b65\u51b2\u8fc7\u53bb\u2014\u2014',
  choices: [
    {
      id: 'U10-1', text: '\u51b2\u5411\u90a3\u4e9b\u4eba',
      consequences: [{ type: 'skip_turn' }],
      narrative: '\u4ec0\u4e48\u90fd\u6ca1\u6709\u3002\u6ca1\u6709\u4eba\uff0c\u6ca1\u6709\u5e10\u7bf7\u3002\u53ea\u6709\u98ce\u548c\u77f3\u5934\u3002\u4f60\u8e72\u5728\u5730\u4e0a\uff0c\u5927\u53e3\u5598\u6c14\u3002',
    },
    {
      id: 'U10-2', text: '\u505c\u4e0b\u6765\uff0c\u6df1\u547c\u5438\uff0c\u4e0d\u8981\u76f8\u4fe1',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u95ed\u4e0a\u773c\u775b\u6570\u5230\u5341\u3002\u518d\u775e\u5f00\u65f6\uff0c\u5c71\u810a\u4e0a\u7a7a\u65e0\u4e00\u4eba\u3002\u4f60\u77e5\u9053\u81ea\u5df1\u7684\u5927\u8111\u5df2\u7ecf\u4e0d\u53ef\u9760\u4e86\u3002',
    },
  ],
}

export const U11_DROP_GEAR: GameEvent = {
  id: 'U11', category: 'encounter', subtype: 'equipment',
  segments: [1,2,3,4,5,6,7,8,9,10,11,12], seasons: ['winter','summer'],
  isFixed: false,
  condition: (state) => state.speed <= 2,
  narrative: '\u4f60\u8d70\u4e0d\u52a8\u4e86\u3002\u80cc\u5305\u50cf\u4e00\u5757\u5de8\u77f3\u538b\u5728\u80a9\u4e0a\u3002\u4f60\u5f00\u59cb\u76d8\u7b97\u2014\u2014\u54ea\u4e9b\u4e1c\u897f\u53ef\u4ee5\u6254\u6389\uff1f',
  choices: [
    {
      id: 'U11-1', text: '\u4e22\u5f03\u6700\u91cd\u7684\u4e00\u4ef6\u975e\u5fc5\u9700\u54c1',
      consequences: [{ type: 'consume_item', payload: 'rope' }],
      narrative: '\u80cc\u5305\u8f7b\u4e86\u3002\u4f46\u4f60\u6254\u6389\u7684\u4e1c\u897f\uff0c\u53ef\u80fd\u4ee5\u540e\u4f1a\u8981\u4f60\u7684\u547d\u3002',
    },
    {
      id: 'U11-2', text: '\u5168\u90e8\u4fdd\u7559\uff0c\u54ac\u7259\u7ee7\u7eed',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u54ac\u7740\u7259\u628a\u80cc\u5305\u91cd\u65b0\u7529\u4e0a\u80a9\u8180\u3002',
    },
  ],
}

export const U12_TAKIN: GameEvent = {
  id: 'U12', category: 'encounter', subtype: 'discovery',
  segments: [3,4,5,6,7,8,9], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u704c\u6728\u4e1b\u7a81\u7136\u5267\u70c8\u6643\u52a8\u3002\u4e00\u5934\u5e9e\u5927\u7684\u7f9a\u725b\u4ece\u4e1b\u4e2d\u51b2\u51fa\u6765\uff0c\u4f60\u4eec\u56db\u76ee\u76f8\u5bf9\u2014\u2014\u5b83\u6bd4\u4f60\u60f3\u8c61\u7684\u5927\u5f97\u591a\u3002',
  choices: [
    {
      id: 'U12-1', text: '\u7f13\u6162\u540e\u9000\uff0c\u4e0d\u8981\u8dd1',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.8,
      narrative: '\u5b83\u76ef\u4e86\u4f60\u51e0\u79d2\u949f\uff0c\u7529\u4e86\u7529\u5934\uff0c\u8f6c\u8eab\u94bb\u8fdb\u4e86\u6811\u6797\u3002',
      failNarrative: '\u5b83\u53d7\u60ca\u5411\u4f60\u51b2\u8fc7\u6765\uff01\u4f60\u4fa7\u8eab\u8eb2\u5f00\uff0c\u4f46\u80a9\u8180\u88ab\u649e\u4e86\u4e00\u4e0b\u3002',
      failConsequences: [
        { type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: 1 } },
      ],
    },
    {
      id: 'U12-2', text: '\u8ddf\u7740\u5b83\u8d70',
      requiresCondition: (state) => state.statusEffects.some(s => s.type === 'lost'),
      consequences: [{ type: 'remove_status', payload: 'lost' }],
      narrative: '\u7f9a\u725b\u5728\u96ea\u5730\u4e0a\u7559\u4e0b\u6e05\u6670\u7684\u8e44\u5370\u3002\u4f60\u8ddf\u7740\u5b83\u7684\u811a\u5370\u524d\u884c\u2014\u2014\u5b83\u80fd\u901a\u8fc7\u7684\u5730\u65b9\uff0c\u4f60\u4e5f\u80fd\u901a\u8fc7\u3002',
    },
  ],
}

""")

# Part 1 done
print(f'Universal events written: {os.path.getsize(path)} bytes')
