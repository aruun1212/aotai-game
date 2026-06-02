import type { GameEvent, Season } from '@/models/types'

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
      probability: 0.2,
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
      probability: 0.25,
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
      probability: 0.25,
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
      probability: 0.2,
      narrative: '\u4f60\u56bc\u8d77\u6765\u4e0d\u82e6\u4e0d\u6da9\u7684\u5c31\u541e\u4e0b\u53bb\u3002\u7af9\u53f6\u662f\u6700\u591a\u7684\u3002',
      failNarrative: '\u4f60\u5632\u4e86\u51e0\u53e3\uff0c\u4f46\u4ec0\u4e48\u4e5f\u6ca1\u5403\u8fdb\u53bb\u3002',
      failConsequences: [],
    },
    {
      id: 'U09-2', text: '\u5c1d\u8bd5\u5403\u6606\u866b',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.2,
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
      probability: 0.3,
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


// ==========================================================
// Segment-Specific Events S01 ~ S12
// ==========================================================

// -- Segment 1: Tangkou -> 2900 Camp --

export const S01_01_DEPARTURE: GameEvent = {
  id: 'S01-01', category: 'encounter', subtype: 'fixed',
  segments: [1], seasons: ['winter','summer'],
  isFixed: true,
  narrative: '\u51cc\u6668\u7684\u5858\u53e3\u6751\u53ea\u6709\u51e0\u6237\u4eba\u5bb6\u4eae\u7740\u706f\u3002\u4f60\u80cc\u4e0a\u5305\uff0c\u6df1\u5438\u4e00\u53e3\u6c14\uff0c\u8e0f\u4e0a\u4e86\u90a3\u6761\u901a\u5f80\u9ccc\u5c71\u7684\u571f\u8def\u3002\u8eab\u540e\u662f\u6700\u540e\u4e00\u76cf\u8def\u706f\uff0c\u524d\u65b9\u662f\u65e0\u5c3d\u7684\u9ed1\u6697\u548c\u677e\u6811\u6797\u7684\u6c14\u5473\u3002\u4f60\u77e5\u9053\uff0c\u4ece\u8fd9\u4e00\u6b65\u5f00\u59cb\uff0c\u624b\u673a\u4fe1\u53f7\u4f1a\u8d8a\u6765\u8d8a\u5f31\uff0c\u76f4\u5230\u5f7b\u5e95\u6d88\u5931\u3002',
  choices: [
    {
      id: 'S01-01-1', text: '\u56de\u5934\u770b\u6700\u540e\u4e00\u773c',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u56de\u5934\u770b\u4e86\u4e00\u773c\u3002\u6751\u5b50\u91cc\u7684\u706f\u5149\u50cf\u4e00\u9897\u5c0f\u5c0f\u7684\u661f\u661f\u3002\u7136\u540e\u4f60\u8f6c\u8fc7\u8eab\uff0c\u4e0d\u518d\u56de\u5934\u3002',
    },
    {
      id: 'S01-01-2', text: '\u4e0d\u770b\uff0c\u76f4\u63a5\u8d70',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4e0d\u56de\u5934\u3002\u56de\u5934\u7684\u8bdd\u5c31\u8d70\u4e0d\u4e86\u4e86\u3002',
    },
  ],
}

export const S01_02_FORK: GameEvent = {
  id: 'S01-02', category: 'encounter', subtype: 'route',
  segments: [1], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u6811\u6797\u91cc\u7684\u5c0f\u8def\u5206\u6210\u4e86\u4e24\u6761\u3002\u5de6\u8fb9\u770b\u8d77\u6765\u5bbd\u4e00\u4e9b\u4f46\u6709\u79ef\u6c34\uff0c\u53f3\u8fb9\u7a84\u4e14\u9661\u3002\u4e24\u6b65\u8defAPP\u4e0a\u7684\u8f68\u8ff9\u5728\u8fd9\u91cc\u6709\u4e9b\u504f\u79fb\u3002',
  choices: [
    {
      id: 'S01-02-1', text: '\u67e5\u770bGPS\u786e\u8ba4\u8def\u7ebf', requiresItem: 'gps',
      consequences: [{ type: 'narrative_only' }],
      narrative: 'GPS\u663e\u793a\u5e94\u8be5\u8d70\u53f3\u8fb9\u3002\u4f60\u5e86\u5e78\u81ea\u5df1\u5e26\u4e86\u8fd9\u4e1c\u897f\u3002',
    },
    {
      id: 'S01-02-2', text: '\u51ed\u76f4\u89c9\u8d70\u5bbd\u8def',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.25,
      narrative: '\u4f60\u9009\u4e86\u770b\u8d77\u6765\u597d\u8d70\u7684\u90a3\u6761\u2014\u2014\u8fd0\u6c14\u4e0d\u9519\uff0c\u8d70\u5bf9\u4e86\u3002',
      failNarrative: '\u4f60\u8d70\u9519\u4e86\uff0c\u7ed5\u4e86\u4e00\u5927\u5708\u624d\u56de\u5230\u6b63\u8def\u3002',
      failConsequences: [{ type: 'skip_turn' }],
    },
    {
      id: 'S01-02-3', text: '\u505c\u4e0b\u6765\u4ed4\u7ec6\u89c2\u5bdf\u8def\u9762\u75d5\u8ff9',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.3,
      narrative: '\u4f60\u8e72\u4e0b\u6765\u770b\u5730\u9762\u3002\u53f3\u8fb9\u7684\u8def\u4e0a\u6709\u6a21\u7cca\u7684\u811a\u5370\uff0c\u6709\u4eba\u8d70\u8fc7\u3002',
      failNarrative: '\u5730\u9762\u4e0a\u4ec0\u4e48\u75d5\u8ff9\u90fd\u6ca1\u6709\u3002\u4f60\u968f\u4fbf\u9009\u4e86\u4e00\u6761\u3002',
      failConsequences: [],
    },
  ],
}

export const S01_03_FOG: GameEvent = {
  id: 'S01-03', category: 'encounter', subtype: 'atmosphere',
  segments: [1], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u7ffb\u8fc7\u4e00\u4e2a\u5c71\u5761\u540e\uff0c\u4f60\u8d70\u8fdb\u4e86\u4e00\u7247\u6d53\u96fe\u4e4b\u4e2d\u3002\u80fd\u89c1\u5ea6\u4e0d\u5230\u5341\u7c73\uff0c\u524d\u65b9\u7684\u677e\u6811\u53d8\u6210\u4e86\u6a21\u7cca\u7684\u7070\u5f71\u3002\u6f6e\u6e7f\u7684\u96fe\u6c14\u51dd\u7ed3\u5728\u776b\u6bdb\u4e0a\u3002',
  choices: [
    {
      id: 'S01-03-1', text: '\u6253\u5f00GPS\u5bfc\u822a\u6162\u884c', requiresItem: 'gps',
      consequences: [{ type: 'narrative_only' }],
      narrative: 'GPS\u7684\u84dd\u70b9\u5728\u96fe\u4e2d\u662f\u552f\u4e00\u53ef\u9760\u7684\u4e1c\u897f\u3002',
    },
    {
      id: 'S01-03-2', text: '\u6cbf\u7740\u8def\u9762\u75d5\u8ff9\u6478\u7d22\u524d\u8fdb',
      consequences: [
        { type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: 1 } },
      ],
      narrative: '\u4f60\u5f2f\u7740\u8170\u76ef\u7740\u5730\u9762\uff0c\u4e00\u6b65\u4e00\u6b65\u5f80\u524d\u631a\u3002',
    },
  ],
}

// -- Segment 2: 2900 Camp -> Navigation Tower --

export const S02_01_TREELINE: GameEvent = {
  id: 'S02-01', category: 'encounter', subtype: 'atmosphere',
  segments: [2], seasons: ['winter','summer'],
  isFixed: true,
  narrative: '\u677e\u6811\u6797\u7a81\u7136\u6d88\u5931\u4e86\u3002\u4f60\u8d70\u51fa\u4e86\u6811\u7ebf\uff0c\u773c\u524d\u662f\u4e00\u671b\u65e0\u9645\u7684\u9ad8\u5c71\u8349\u7538\u548c\u88f8\u9732\u7684\u788e\u77f3\u5761\u3002\u98ce\u4ece\u56db\u9762\u516b\u65b9\u6d8c\u6765\uff0c\u6ca1\u6709\u4efb\u4f55\u906e\u6321\u3002\u4f60\u7b2c\u4e00\u6b21\u771f\u5207\u5730\u611f\u53d7\u5230\u2014\u2014\u8fd9\u91cc\u662f\u6d77\u62d4\u4e09\u5343\u7c73\u3002',
  choices: [
    {
      id: 'S02-01-1', text: '\u505c\u4e0b\u6765\u9002\u5e94\u4e00\u4e0b',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u7ad9\u5728\u6797\u7ebf\u8fb9\u7f18\uff0c\u5927\u53e3\u547c\u5438\u7a00\u8584\u7684\u7a7a\u6c14\u3002\u8fdc\u5904\u7684\u5c71\u5ce6\u5c42\u5c42\u53e0\u53e0\uff0c\u4e00\u76f4\u5ef6\u4f38\u5230\u5929\u9645\u3002\u503c\u4e86\u3002',
    },
    {
      id: 'S02-01-2', text: '\u52a0\u5feb\u811a\u6b65\uff0c\u8d81\u5929\u6c14\u597d\u8d76\u8def',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u4f4e\u5934\u770b\u4e86\u773c\u65f6\u95f4\uff0c\u7ee7\u7eed\u5f80\u4e0a\u8d70\u3002',
    },
  ],
}

export const S02_02_WIND: GameEvent = {
  id: 'S02-02', category: 'encounter', subtype: 'atmosphere',
  segments: [2], seasons: ['winter'],
  isFixed: false,
  narrative: '\u63a5\u8fd1\u5bfc\u822a\u5854\u65f6\uff0c\u98ce\u7a81\u7136\u53d8\u5f97\u50cf\u5200\u5b50\u4e00\u6837\u3002\u8fd9\u91cc\u662f\u9ccc\u5c71\u7684\u6700\u9ad8\u70b9\u9644\u8fd1\uff0c\u5b8c\u5168\u66b4\u9732\u5728\u98ce\u96ea\u4e2d\u3002\u5bfc\u822a\u5854\u7684\u94c1\u67b6\u5728\u72c2\u98ce\u4e2d\u55e1\u55e1\u4f5c\u54cd\u3002',
  choices: [
    {
      id: 'S02-02-1', text: '\u7a7f\u4e0a\u4fdd\u6696\u8863\u7269\u5168\u901f\u901a\u8fc7', requiresItem: 'warm_clothes',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u628a\u51b2\u950b\u8863\u62c9\u94fe\u62c9\u5230\u9876\uff0c\u5e3d\u5b50\u538b\u5230\u773c\u775b\u3002\u98ce\u6253\u5728\u8138\u4e0a\u50cf\u9488\u624e\uff0c\u4f46\u4f60\u8fd8\u80fd\u8d70\u3002',
    },
    {
      id: 'S02-02-2', text: '\u8e72\u4e0b\u6765\u7b49\u98ce\u5c0f\u4e00\u70b9',
      consequences: [{ type: 'skip_turn' }],
      probability: 0.2,
      narrative: '\u4f60\u8e72\u5728\u788e\u77f3\u540e\u9762\uff0c\u98ce\u4ece\u5934\u9876\u547c\u5578\u800c\u8fc7\u3002',
      failNarrative: '\u98ce\u4e00\u76f4\u6ca1\u505c\u3002\u4f60\u767d\u7b49\u4e86\u4e00\u4e2a\u56de\u5408\u3002',
      failConsequences: [],
    },
    {
      id: 'S02-02-3', text: '\u786c\u51b2',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.2,
      narrative: '\u4f60\u5f2f\u7740\u8170\u51b2\u8fdb\u98ce\u96ea\u91cc\u3002\u4e09\u5206\u949f\u540e\u4f60\u5f00\u59cb\u53d1\u6296\uff0c\u7259\u9f7f\u54af\u54af\u4f5c\u54cd\u3002',
      failNarrative: '\u4f60\u51b2\u8fdb\u98ce\u96ea\u91cc\u2014\u2014\u4f53\u6e29\u6025\u5267\u4e0b\u964d\u3002',
      failConsequences: [
        { type: 'add_status', payload: { type: 'hypothermia', speedModifier: -2, turnsRemaining: -1, deathCountdown: 3 } },
      ],
    },
  ],
}

// -- Segment 3: Navigation Tower -> Shuiwozi --

export const S03_01_STONE_SEA: GameEvent = {
  id: 'S03-01', category: 'encounter', subtype: 'route',
  segments: [3], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u9ea6\u79f8\u5cad\u4e0a\uff0c\u5de8\u77f3\u5806\u79ef\u5982\u5c71\u3002\u6bcf\u4e00\u5757\u77f3\u5934\u90fd\u6709\u684c\u5b50\u5927\u5c0f\uff0c\u7f1d\u9699\u6df1\u4e0d\u89c1\u5e95\u3002\u4f60\u5fc5\u987b\u5728\u77f3\u5934\u4e4b\u95f4\u8df3\u8dc3\u524d\u884c\uff0c\u4e00\u811a\u8e29\u7a7a\u5c31\u662f\u51e0\u7c73\u6df1\u7684\u77f3\u7f1d\u3002',
  choices: [
    {
      id: 'S03-01-1', text: '\u7528\u767b\u5c71\u6756\u63a2\u8def\uff0c\u5c0f\u5fc3\u7ffc\u7ffc\u901a\u8fc7', requiresItem: 'pole',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u7528\u6756\u5c16\u6572\u51fb\u6bcf\u4e00\u5757\u77f3\u5934\uff0c\u786e\u8ba4\u5b83\u4e0d\u4f1a\u677e\u52a8\u624d\u8e0f\u4e0a\u53bb\u3002\u6162\uff0c\u4f46\u5b89\u5168\u3002',
    },
    {
      id: 'S03-01-2', text: '\u5feb\u901f\u8df3\u8dc3\u901a\u8fc7',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.3,
      narrative: '\u4f60\u50cf\u7334\u5b50\u4e00\u6837\u5728\u77f3\u6d77\u4e0a\u8df3\u8dc3\u3002\u901f\u5ea6\u5feb\u4e86\uff0c\u4f46\u6bcf\u4e00\u8df3\u90fd\u662f\u8d4c\u535a\u3002',
      failNarrative: '\u4f60\u8e29\u5230\u4e00\u5757\u677e\u52a8\u7684\u77f3\u5934\u2014\u2014\u811a\u8e1d\u626d\u4e86\u3002',
      failConsequences: [
        { type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: -1 } },
      ],
    },
    {
      id: 'S03-01-3', text: '\u7ed5\u884c\u704c\u6728\u4e1b',
      consequences: [
        { type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: 1 } },
      ],
      narrative: '\u704c\u6728\u4e1b\u624e\u4eba\uff0c\u4f46\u81f3\u5c11\u811a\u4e0b\u662f\u5b9e\u5730\u3002',
    },
  ],
}

export const S03_02_MEMORIAL: GameEvent = {
  id: 'S03-02', category: 'encounter', subtype: 'atmosphere',
  segments: [3], seasons: ['winter','summer'],
  isFixed: true,
  narrative: '\u8def\u8fb9\u7684\u77f3\u5934\u5806\u4e0a\uff0c\u4f60\u770b\u5230\u4e86\u51e0\u6761\u892a\u8272\u7684\u7ecf\u5e61\u548c\u4e00\u5757\u94c1\u724c\u3002\u8d70\u8fd1\u770b\u2014\u2014\u4e0a\u9762\u523b\u7740\u540d\u5b57\u548c\u65e5\u671f\u3002\u4e0d\u6b62\u4e00\u4e2a\u540d\u5b57\u3002\u6700\u8fd1\u7684\u4e00\u4e2a\u65e5\u671f\u662f\u53bb\u5e74\u7684\u3002\n\n\u98ce\u5439\u52a8\u7ecf\u5e61\uff0c\u53d1\u51fa\u5657\u5657\u7684\u58f0\u54cd\u3002\u4f60\u7ad9\u5728\u8fd9\u91cc\uff0c\u611f\u53d7\u5230\u4e00\u79cd\u4ece\u80c3\u91cc\u5347\u8d77\u7684\u5bd2\u610f\u2014\u2014\u8fd9\u4e0d\u662f\u9ad8\u53cd\uff0c\u8fd9\u662f\u6050\u60e7\u3002',
  choices: [
    {
      id: 'S03-02-1', text: '\u9ed8\u54c0\u7247\u523b',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u6458\u4e0b\u5e3d\u5b50\uff0c\u4f4e\u5934\u7ad9\u4e86\u4e00\u5206\u949f\u3002\u98ce\u5728\u8033\u8fb9\u547c\u5578\u3002\u7136\u540e\u4f60\u91cd\u65b0\u6234\u4e0a\u5e3d\u5b50\uff0c\u7ee7\u7eed\u8d70\u3002',
    },
    {
      id: 'S03-02-2', text: '\u62cd\u7167\u8bb0\u5f55',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u62cd\u4e86\u5f20\u7167\u7247\u3002\u5c4f\u5e55\u4e0a\u7684\u56fe\u50cf\u6bd4\u8089\u773c\u770b\u5230\u7684\u5e73\u9759\u5f97\u591a\u3002',
    },
    {
      id: 'S03-02-3', text: '\u5feb\u6b65\u79bb\u5f00',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u52a0\u5feb\u811a\u6b65\u8d70\u8fc7\u53bb\u3002\u4e0d\u60f3\u5728\u8fd9\u91cc\u591a\u505c\u4e00\u79d2\u3002',
    },
  ],
}

export const S03_03_FAST_HIKERS: GameEvent = {
  id: 'S03-03', category: 'encounter', subtype: 'atmosphere',
  segments: [3], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u8eab\u540e\u4f20\u6765\u811a\u6b65\u58f0\u3002\u4f60\u56de\u5934\u770b\u2014\u2014\u4e24\u4e2a\u4eba\u6b63\u4ee5\u4e0d\u53ef\u601d\u8bae\u7684\u901f\u5ea6\u63a5\u8fd1\u4f60\u3002\u4ed6\u4eec\u7684\u5305\u6bd4\u4f60\u7684\u5927\u4e00\u500d\uff0c\u4f46\u8d70\u5f97\u6bd4\u4f60\u5feb\u4e24\u500d\u3002\u64e6\u80a9\u800c\u8fc7\u65f6\uff0c\u5176\u4e2d\u4e00\u4e2a\u4eba\u505c\u4e0b\u6765\u770b\u4e86\u4f60\u4e00\u773c\u3002\u201c\u5c0f\u5fc3\u540e\u9762\u4e09\u5929\u7684\u8def\uff0c\u4eca\u5929\u8d70\u7684\u662f\u5168\u7a0b\u6700\u8f7b\u677e\u7684\u3002\u201d\u7136\u540e\u4ed6\u4eec\u6d88\u5931\u5728\u524d\u65b9\u7684\u96fe\u91cc\u3002',
  choices: [
    {
      id: 'S03-03-1', text: '\u8bb0\u4f4f\u4ed6\u7684\u8bdd',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u628a\u8fd9\u53e5\u8bdd\u8bb0\u5728\u5fc3\u91cc\u3002\u6700\u8f7b\u677e\u7684\u2026\u2026\u90a3\u63a5\u4e0b\u6765\u662f\u4ec0\u4e48\uff1f',
    },
    {
      id: 'S03-03-2', text: '\u8bd5\u7740\u8ddf\u4e0a\u4ed6\u4eec',
      consequences: [
        { type: 'add_status', payload: { type: 'exhaustion', speedModifier: -1, turnsRemaining: 1 } },
      ],
      narrative: '\u4f60\u62fc\u547d\u52a0\u901f\uff0c\u8bd5\u56fe\u8ddf\u4e0a\u4ed6\u4eec\u7684\u6b65\u4f10\u3002\u5341\u5206\u949f\u540e\u4f60\u5c31\u8ddf\u4e22\u4e86\u3002',
    },
  ],
}


// -- Segment 4: Shuiwozi -> Feijiliang --

export const S04_01_RIDGE: GameEvent = {
  id: 'S04-01', category: 'encounter', subtype: 'route',
  segments: [4], seasons: ['winter'],
  isFixed: false,
  narrative: '\u98de\u673a\u6881\u662f\u4e00\u6761\u72ed\u7a84\u7684\u5c71\u810a\uff0c\u4e24\u4fa7\u662f\u8fd1\u4e4e\u5782\u76f4\u7684\u60ac\u5d16\u3002\u98ce\u4ece\u5de6\u4fa7\u731b\u70c8\u5730\u5439\u6765\uff0c\u4f60\u5fc5\u987b\u4fa7\u7740\u8eab\u5b50\u8d70\uff0c\u6bcf\u4e00\u6b65\u90fd\u8d34\u7740\u5c71\u810a\u5185\u4fa7\u3002\u79ef\u96ea\u8986\u76d6\u4e86\u8fb9\u7f18\u2014\u2014\u4f60\u4e0d\u77e5\u9053\u811a\u4e0b\u7684\u5730\u9762\u5728\u54ea\u91cc\u7ed3\u675f\u3001\u60ac\u5d16\u5728\u54ea\u91cc\u5f00\u59cb\u3002',
  choices: [
    {
      id: 'S04-01-1', text: '\u7528\u767b\u5c71\u6756\u63a2\u6d4b\u8fb9\u7f18', requiresItem: 'pole',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u6756\u5c16\u621b\u8fdb\u96ea\u91cc\uff0c\u5de6\u8fb9\u8fd9\u91cc\u2014\u2014\u6ca1\u6709\u5e95\u3002\u4f60\u540e\u9000\u534a\u6b65\uff0c\u8d34\u7740\u53f3\u4fa7\u7ee7\u7eed\u8d70\u3002',
    },
    {
      id: 'S04-01-2', text: '\u530d\u5310\u524d\u8fdb',
      consequences: [{ type: 'narrative_only' }],
      probability: 1.0,
      narrative: '\u4f60\u8db4\u5728\u5730\u4e0a\uff0c\u7528\u624b\u6252\u7740\u788e\u77f3\u4e00\u5bf8\u4e00\u5bf8\u5730\u5f80\u524d\u631a\u3002\u4e22\u4eba\uff0c\u4f46\u662f\u6d3b\u7740\u3002',
    },
    {
      id: 'S04-01-3', text: '\u6b63\u5e38\u884c\u8d70',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.3,
      narrative: '\u4f60\u6df1\u5438\u4e00\u53e3\u6c14\uff0c\u76f4\u7acb\u7740\u8d70\u4e0a\u4e86\u5c71\u810a\u3002',
      failNarrative: '\u4f60\u7684\u811a\u5728\u79ef\u96ea\u4e0a\u6253\u6ed1\u2014\u2014',
      failConsequences: [{ type: 'trigger_death' }],
    },
  ],
}

export const S04_02_CLOUD_SEA: GameEvent = {
  id: 'S04-02', category: 'encounter', subtype: 'discovery',
  segments: [4], seasons: ['summer'],
  isFixed: false,
  narrative: '\u4f60\u8d70\u4e0a\u98de\u673a\u6881\u6700\u9ad8\u70b9\u7684\u65f6\u5019\uff0c\u547c\u5438\u505c\u4e86\u4e00\u79d2\u3002\n\n\u811a\u4e0b\u662f\u4e00\u7247\u767d\u8272\u7684\u6d77\u6d0b\u2014\u2014\u4e91\u6d77\u3002\u4f60\u7ad9\u5728\u4e91\u6d77\u4e4b\u4e0a\uff0c\u56db\u5468\u7684\u5c71\u5cf0\u50cf\u4e00\u5ea7\u5ea7\u5c9b\u5c7f\u4ece\u767d\u8272\u4e2d\u63a2\u51fa\u5934\u6765\u3002\u592a\u9633\u628a\u4e91\u6d77\u7684\u8868\u9762\u67d3\u6210\u91d1\u8272\u3002\u4f60\u4ece\u6ca1\u89c1\u8fc7\u8fd9\u79cd\u666f\u8272\u3002',
  choices: [
    {
      id: 'S04-02-1', text: '\u5750\u4e0b\u6765\uff0c\u4ec0\u4e48\u90fd\u4e0d\u60f3',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u5728\u98de\u673a\u6881\u4e0a\u5750\u4e86\u5341\u5206\u949f\u3002\u98ce\u5f88\u5927\uff0c\u4f46\u4f60\u4e0d\u60f3\u8d70\u3002\u8fd9\u53ef\u80fd\u662f\u4f60\u8fd9\u8f88\u5b50\u770b\u5230\u7684\u6700\u7f8e\u7684\u4e1c\u897f\u3002',
    },
    {
      id: 'S04-02-2', text: '\u7ee7\u7eed\u8d70',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u604b\u604b\u4e0d\u820d\u5730\u7ad9\u8d77\u6765\u3002\u6bcf\u8d70\u51e0\u6b65\u5c31\u5fcd\u4e0d\u4f4f\u56de\u5934\u770b\u4e00\u773c\u3002',
    },
  ],
}

// -- Segment 5: Feijiliang -> 2800 Camp --

export const S05_01_DEEP_SNOW: GameEvent = {
  id: 'S05-01', category: 'encounter', subtype: 'route',
  segments: [5], seasons: ['winter'],
  isFixed: false,
  narrative: '\u4ece\u98de\u673a\u6881\u4e0b\u6765\u540e\u8fdb\u5165\u4e00\u7247\u677e\u6811\u6797\u3002\u79ef\u96ea\u8d8a\u6765\u8d8a\u6df1\u2014\u2014\u5148\u662f\u819d\u76d6\uff0c\u7136\u540e\u662f\u5927\u817f\uff0c\u6709\u4e9b\u5730\u65b9\u80fd\u6ca1\u5230\u8170\u90e8\u3002\u6bcf\u4e00\u6b65\u90fd\u8981\u628a\u6574\u6761\u817f\u4ece\u96ea\u91cc\u62d4\u51fa\u6765\u518d\u8fc8\u8fdb\u53bb\u3002',
  choices: [
    {
      id: 'S05-01-1', text: '\u7cfb\u7d27\u96ea\u5957\uff0c\u8e29\u7740\u524d\u4eba\u811a\u5370\u8d70',
      consequences: [
        { type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: 1 } },
      ],
      narrative: '\u4f60\u5c3d\u91cf\u8e29\u5728\u5df2\u6709\u7684\u51f9\u5751\u91cc\u3002\u819d\u76d6\u4ee5\u4e0b\u5168\u662f\u6e7f\u7684\u3002',
    },
    {
      id: 'S05-01-2', text: '\u7ed5\u884c\u6811\u6797\u8fb9\u7f18\u627e\u6d45\u96ea\u533a',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.25,
      narrative: '\u4f60\u7ed5\u4e86\u4e00\u5927\u5708\uff0c\u627e\u5230\u4e00\u7247\u88ab\u98ce\u5439\u8584\u7684\u96ea\u5730\u3002',
      failNarrative: '\u4f60\u7ed5\u4e86\u5f88\u4e45\uff0c\u4f46\u54ea\u91cc\u90fd\u662f\u6df1\u96ea\u3002\u6d6a\u8d39\u4e86\u65f6\u95f4\u3002',
      failConsequences: [{ type: 'skip_turn' }],
    },
    {
      id: 'S05-01-3', text: '\u5f3a\u884c\u8e9f\u8fc7\u53bb',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.2,
      narrative: '\u4f60\u54ac\u7740\u7259\u4e00\u6b65\u4e00\u6b65\u5f80\u524d\u8e9a\u3002',
      failNarrative: '\u96ea\u704c\u8fdb\u978b\u91cc\uff0c\u811a\u8dbe\u5df2\u7ecf\u6ca1\u6709\u77e5\u89c9\u4e86\u3002',
      failConsequences: [
        { type: 'add_status', payload: { type: 'hypothermia', speedModifier: -2, turnsRemaining: -1, deathCountdown: 3 } },
      ],
    },
  ],
}

export const S05_02_DUSK: GameEvent = {
  id: 'S05-02', category: 'encounter', subtype: 'atmosphere',
  segments: [5], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u8fdc\u5904\u6811\u4e1b\u95f4\u9732\u51fa\u4e86\u51e0\u4e2a\u5e10\u7bf7\u7684\u8f6e\u5ed3\u2014\u20142800\u8425\u5730\u3002\u8fd9\u662f\u9ccc\u592a\u7ebf\u7684\u4e2d\u95f4\u70b9\uff0c\u5f88\u591a\u4eba\u5728\u8fd9\u91cc\u505a\u51fa\u51b3\u5b9a\uff1a\u7ee7\u7eed\uff0c\u8fd8\u662f\u4e0b\u6492\u3002\u4f60\u770b\u4e86\u770b\u81ea\u5df1\u7684\u6c34\u58f6\uff0c\u53c8\u770b\u4e86\u770b\u524d\u65b9\u6e10\u6697\u7684\u5929\u8272\u3002',
  choices: [
    {
      id: 'S05-02-1', text: '\u52a0\u5feb\u811a\u6b65\u8d76\u5230\u8425\u5730',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u51e0\u4e4e\u662f\u8dd1\u7740\u51b2\u8fdb\u8425\u5730\u7684\u3002\u7ec8\u4e8e\u53ef\u4ee5\u6b47\u4e00\u4f1a\u513f\u4e86\u3002',
    },
  ],
}

// -- Segment 6: 2800 Camp -> Jinzita Pass --

export const S06_01_NANTIANMEN: GameEvent = {
  id: 'S06-01', category: 'encounter', subtype: 'route',
  segments: [6], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u5357\u5929\u95e8\u662f\u4e00\u6bb5\u6f2b\u957f\u800c\u9661\u5ced\u7684\u4e0a\u5761\u3002\u788e\u77f3\u5761\u9762\u5728\u811a\u4e0b\u6ed1\u52a8\uff0c\u6bcf\u8d70\u4e09\u6b65\u5c31\u6ed1\u56de\u53bb\u4e00\u6b65\u3002\u4f60\u80fd\u611f\u89c9\u5230\u6d77\u62d4\u5728\u8fc5\u901f\u6500\u5347\u2014\u2014\u547c\u5438\u8d8a\u6765\u8d8a\u91cd\uff0c\u5fc3\u8df3\u8d8a\u6765\u8d8a\u5feb\u3002',
  choices: [
    {
      id: 'S06-01-1', text: 'Z\u5b57\u5f62\u4e0a\u5761\u8282\u7701\u4f53\u529b',
      consequences: [
        { type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: 1 } },
      ],
      narrative: '\u4f60\u50cf\u86c7\u4e00\u6837\u5728\u5c71\u5761\u4e0a\u4e4b\u5b57\u5f62\u524d\u8fdb\u3002\u6162\uff0c\u4f46\u819d\u76d6\u611f\u8c22\u4f60\u3002',
    },
    {
      id: 'S06-01-2', text: '\u76f4\u7ebf\u722c\u5761',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.3,
      narrative: '\u4f60\u76ef\u7740\u9876\u90e8\uff0c\u4e00\u6b65\u4e00\u6b65\u76f4\u7ebf\u5f80\u4e0a\u3002\u817f\u5728\u6296\u3002',
      failNarrative: '\u4f53\u529b\u900f\u652f\u4e86\uff0c\u4e0b\u56de\u5408\u4f60\u4f1a\u611f\u89c9\u5230\u3002',
      failConsequences: [
        { type: 'add_status', payload: { type: 'exhaustion', speedModifier: -1, turnsRemaining: 1 } },
      ],
    },
  ],
}

export const S06_02_CRY_IN_WIND: GameEvent = {
  id: 'S06-02', category: 'encounter', subtype: 'atmosphere',
  segments: [6], seasons: ['winter'],
  isFixed: false,
  narrative: '\u5357\u5929\u95e8\u7684\u704c\u6728\u4e1b\u4e2d\uff0c\u4f60\u9690\u7ea6\u542c\u5230\u4ec0\u4e48\u58f0\u97f3\u3002\u98ce\u58f0\u592a\u5927\uff0c\u4f60\u4e0d\u786e\u5b9a\u2014\u2014\u53ef\u80fd\u662f\u98ce\u7a7f\u8fc7\u6811\u679d\u7684\u545c\u54bd\uff0c\u4e5f\u53ef\u80fd\u662f\u2026\u2026\u4eba\u58f0\uff1f',
  choices: [
    {
      id: 'S06-02-1', text: '\u505c\u4e0b\u6765\u4ed4\u7ec6\u542c',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u5c4f\u4f4f\u547c\u5438\u3002\u98ce\u58f0\u3001\u6811\u679d\u58f0\u3001\u4f60\u81ea\u5df1\u7684\u5fc3\u8df3\u58f0\u3002\u7136\u540e\u2014\u2014\u4ec0\u4e48\u90fd\u6ca1\u6709\u4e86\u3002\u4e5f\u8bb8\u4ece\u6765\u5c31\u6ca1\u6709\u4eba\u3002\u4e5f\u8bb8\u6709\u4eba\u66fe\u5728\u8fd9\u91cc\u7b49\u4e86\u5f88\u4e45\uff0c\u7b49\u5230\u518d\u4e5f\u53d1\u4e0d\u51fa\u58f0\u97f3\u3002',
    },
    {
      id: 'S06-02-2', text: '\u4e0d\u7ba1\uff0c\u7ee7\u7eed\u8d70',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u4f4e\u5934\u7ee7\u7eed\u8d70\u3002\u5728\u9ccc\u592a\u7ebf\u4e0a\uff0c\u4f60\u6ca1\u6709\u4f59\u529b\u53bb\u641c\u6551\u4efb\u4f55\u4eba\u3002\u751a\u81f3\u6ca1\u6709\u4f59\u529b\u641c\u6551\u81ea\u5df1\u3002',
    },
  ],
}

export const S06_03_JINZITA: GameEvent = {
  id: 'S06-03', category: 'encounter', subtype: 'route',
  segments: [6], seasons: ['winter'],
  isFixed: false,
  narrative: '\u91d1\u5b57\u5854\u8def\u6bb5\u2014\u2014\u9ccc\u592a\u7ebf\u6700\u8ba9\u4eba\u5d29\u6e83\u7684\u4e00\u6bb5\u3002\u53cc\u811a\u90fd\u704c\u6ee1\u4e86\u96ea\uff0c\u6df1\u96ea\u9f50\u8170\uff0c\u6bcf\u4e00\u6b65\u90fd\u5728\u6d88\u8017\u6700\u540e\u7684\u4f53\u80fd\u3002\u4f60\u65e0\u6570\u6b21\u56de\u671b\u8eab\u540e\u76842800\u65b9\u5411\u2014\u2014\u4f46\u8eab\u540e\u7684\u811a\u5370\u5df2\u7ecf\u88ab\u98ce\u96ea\u586b\u5e73\u4e86\u3002',
  choices: [
    {
      id: 'S06-03-1', text: '\u54ac\u7259\u7ee7\u7eed\u5f80\u4e0a\u722c',
      consequences: [{ type: 'modify_water', payload: -0.2 }],
      narrative: '\u4f60\u653e\u7a7a\u5927\u8111\uff0c\u628a\u6240\u6709\u6ce8\u610f\u529b\u96c6\u4e2d\u5728\u4e0b\u4e00\u6b65\u3002\u5de6\u811a\uff0c\u53f3\u811a\uff0c\u5de6\u811a\uff0c\u53f3\u811a\u3002',
    },
    {
      id: 'S06-03-2', text: '\u627e\u4e00\u4e2a\u907f\u98ce\u5904\u4f11\u606f',
      consequences: [{ type: 'skip_turn' }],
      probability: 0.3,
      narrative: '\u4f60\u5728\u5ca9\u77f3\u4e4b\u95f4\u641c\u7d22\u3002\u4e00\u4e2a\u53ea\u80fd\u5bb9\u7eb3\u4e00\u4e2a\u4eba\u7684\u51f9\u6d1e\u2014\u2014\u591f\u4e86\u3002',
      failNarrative: '\u5230\u5904\u662f\u5149\u79c3\u79c3\u7684\u788e\u77f3\uff0c\u6ca1\u6709\u4efb\u4f55\u53ef\u4ee5\u8eb2\u907f\u7684\u5730\u65b9\u3002',
      failConsequences: [],
    },
    {
      id: 'S06-03-3', text: '\u5c1d\u8bd5\u539f\u8def\u8fd4\u56de2800',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u7684\u811a\u5370\u5df2\u88ab\u98ce\u96ea\u8986\u76d6\u3002\u8fd4\u56de2800\u8425\u5730\u7684\u8def\u5df2\u7ecf\u770b\u4e0d\u5230\u4e86\u3002',
    },
  ],
}

// -- Segment 7: Jinzita -> Ta3 -> Laobian Cemetery --

export const S07_01_TA1: GameEvent = {
  id: 'S07-01', category: 'encounter', subtype: 'route',
  segments: [7], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u5854\u4e00\u77d7\u7acb\u5728\u773c\u524d\u3002\u8fd9\u4e0d\u662f\u666e\u901a\u7684\u5c71\u5761\u2014\u2014\u8fd9\u662f\u8fd1\u4e4e\u5782\u76f4\u7684\u5ca9\u58c1\uff0c\u66b4\u9732\u7684\u77f3\u5934\u7f1d\u662f\u552f\u4e00\u7684\u624b\u811a\u70b9\u3002\u5934\u706f\u7167\u51fa\u7684\u5149\u5728\u9ed1\u6697\u4e2d\u53ea\u80fd\u8986\u76d6\u773c\u524d\u4e24\u7c73\u3002',
  choices: [
    {
      id: 'S07-01-1', text: '\u7528\u7ef3\u7d22\u8f85\u52a9\u6500\u767b', requiresItem: 'rope',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u628a\u7ef3\u7d22\u7cfb\u5728\u7a81\u51fa\u7684\u5ca9\u77f3\u4e0a\uff0c\u4e00\u6bb5\u4e00\u6bb5\u5730\u6500\u5347\u3002\u6bcf\u4e00\u6b65\u90fd\u5c0f\u5fc3\u786e\u8ba4\u652f\u70b9\u3002',
    },
    {
      id: 'S07-01-2', text: '\u5f92\u624b\u6500\u767b',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.3,
      narrative: '\u4f60\u6293\u4f4f\u51b0\u51b7\u7684\u77f3\u5934\u7f1d\uff0c\u624b\u6307\u5feb\u8981\u5931\u53bb\u77e5\u89c9\u3002\u4e00\u6b65\uff0c\u4e24\u6b65\uff0c\u4e09\u6b65\u2014\u2014\u4e0d\u8981\u5f80\u4e0b\u770b\u3002',
      failNarrative: '\u4f60\u7684\u624b\u6307\u5728\u5ca9\u77f3\u4e0a\u6253\u6ed1\u2014\u2014',
      failConsequences: [{ type: 'trigger_death' }],
    },
    {
      id: 'S07-01-3', text: '\u4ece\u5de6\u4fa7\u6a2a\u5207\u7ed5\u884c',
      consequences: [
        { type: 'add_status', payload: { type: 'sprain', speedModifier: -2, turnsRemaining: 1 } },
      ],
      narrative: '\u5de6\u4fa7\u7684\u6a2a\u5207\u8def\u6bb5\u53c8\u957f\u53c8\u9661\uff0c\u4f46\u81f3\u5c11\u4e0d\u7528\u6500\u5ca9\u3002',
    },
  ],
}

export const S07_02_NORTH_SLOPE: GameEvent = {
  id: 'S07-02', category: 'encounter', subtype: 'route',
  segments: [7], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u4f60\u6253\u5f00\u79bb\u7ebf\u5730\u56fe\uff0c\u53d1\u73b0\u5854\u4e00\u5317\u5761\u4e0b\u65b9\u6807\u6ce8\u7740\u201c\u767d\u4e91\u5ce1\u201d\u7b49\u5730\u540d\u3002\u6709\u5730\u540d\uff0c\u662f\u4e0d\u662f\u610f\u5473\u7740\u6709\u4eba\u70df\uff1f\u6709\u8def\uff1f',
  choices: [
    {
      id: 'S07-02-1', text: '\u4ece\u5317\u5761\u4e0b\u6492',
      consequences: [{ type: 'trigger_lost' }],
      narrative: '\u26a0\ufe0f \u4ece\u91d1\u5b57\u5854\u3001\u5854\u4e00\u5230\u767d\u4e91\u5ce1\uff0c\u6839\u672c\u6ca1\u6709\u8def\u3002\u4e5f\u4ece\u6765\u6ca1\u4eba\u4ece\u8fd9\u91cc\u8d70\u51fa\u6765\u8fc7\u3002\u5730\u56fe\u4e0a\u6709\u5730\u540d\uff0c\u4e0d\u4ee3\u8868\u6709\u8def\u3002',
    },
    {
      id: 'S07-02-2', text: '\u7ee7\u7eed\u8d70\u4e3b\u5e72\u8def\u7ebf',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u5408\u4e0a\u5730\u56fe\u3002\u4e0d\u8d70\u6ca1\u628a\u63e1\u7684\u8def\u3002',
    },
  ],
}

export const S07_03_WHITE_TENT: GameEvent = {
  id: 'S07-03', category: 'encounter', subtype: 'atmosphere',
  segments: [7], seasons: ['winter','summer'],
  isFixed: true,
  narrative: '\u5728\u5854\u4e00\u548c\u5854\u4e8c\u4e4b\u95f4\u7684\u788e\u77f3\u5761\u4e0a\uff0c\u4f60\u770b\u5230\u4e86\u4e00\u9876\u65e7\u5e10\u7bf7\u3002\u767d\u8272\u7684\uff0c\u534a\u5854\u7740\uff0c\u5e10\u7bf7\u5e03\u88ab\u98ce\u62bd\u6253\u5f97\u5664\u5566\u4f5c\u54cd\u3002\u770b\u8d77\u6765\u5df2\u7ecf\u5728\u8fd9\u91cc\u5f88\u4e45\u4e86\u3002\n\n\u4f60\u8d70\u8fd1\u4e86\u51e0\u6b65\u3002\u5e10\u7bf7\u62c9\u94fe\u6ca1\u6709\u5b8c\u5168\u62c9\u4e0a\uff0c\u91cc\u9762\u6f06\u9ed1\u4e00\u7247\u3002',
  choices: [
    {
      id: 'S07-03-1', text: '\u6253\u5f00\u5e10\u7bf7\u67e5\u770b',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u5e10\u7bf7\u91cc\u7a7a\u7a7a\u8361\u8361\u3002\u53ea\u6709\u4e00\u4e2a\u53d1\u9709\u7684\u7761\u888b\u548c\u4e00\u74f6\u7ffb\u5012\u7684\u6c34\u3002\u6c34\u5df2\u7ecf\u51bb\u6210\u4e86\u51b0\u3002\u4f46\u4f60\u603b\u89c9\u5f97\uff0c\u8fd9\u9876\u5e10\u7bf7\u91cc\u66fe\u7ecf\u53d1\u751f\u8fc7\u4ec0\u4e48\u3002',
    },
    {
      id: 'S07-03-2', text: '\u4e0d\u770b\uff0c\u7ed5\u8fc7\u53bb',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u7ed5\u5f00\u5e10\u7bf7\uff0c\u52a0\u5feb\u811a\u6b65\u3002\u6709\u4e9b\u4e1c\u897f\uff0c\u4e0d\u770b\u6bd4\u8f83\u597d\u3002',
    },
    {
      id: 'S07-03-3', text: '\u5728\u5e10\u7bf7\u91cc\u77ed\u6682\u907f\u98ce',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u94bb\u8fdb\u5e10\u7bf7\uff0c\u6321\u4f4f\u4e86\u98ce\u3002\u53ea\u5f85\u4e94\u5206\u949f\u3002\u4e94\u5206\u949f\u5c31\u591f\u4e86\u3002',
    },
  ],
}

export const S07_04_CEMETERY: GameEvent = {
  id: 'S07-04', category: 'encounter', subtype: 'atmosphere',
  segments: [7], seasons: ['winter','summer'],
  isFixed: true,
  narrative: '\u77f3\u7891\u5c31\u5728\u8def\u8fb9\u3002\u4e0d\u662f\u4e00\u5757\u2014\u2014\u662f\u597d\u51e0\u5757\u3002\u6709\u7684\u662f\u6b63\u5f0f\u7684\u77f3\u7891\uff0c\u6709\u7684\u53ea\u662f\u77f3\u5934\u4e0a\u7528\u6cb9\u6f06\u5199\u7684\u540d\u5b57\u548c\u65e5\u671f\u3002\u6bcf\u4e00\u4e2a\u540d\u5b57\u80cc\u540e\u90fd\u662f\u4e00\u4e2a\u518d\u4e5f\u6ca1\u6709\u8d70\u5b8c\u9ccc\u592a\u7ebf\u7684\u4eba\u3002\u77f3\u7891\u4e0a\u6709\u4eba\u653e\u4e86\u4e00\u6735\u5feb\u8981\u67af\u840e\u7684\u91ce\u82b1\u3002',
  choices: [
    {
      id: 'S07-04-1', text: '\u505c\u4e0b\u6765\uff0c\u8bfb\u6bcf\u4e00\u4e2a\u540d\u5b57',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u7ad9\u5728\u90a3\u91cc\u8bfb\u4e86\u4e94\u5206\u949f\u3002\u6bcf\u4e00\u4e2a\u540d\u5b57\u90fd\u662f\u4e00\u4e2a\u4eba\uff0c\u6709\u5bb6\u4eba\uff0c\u6709\u670b\u53cb\uff0c\u51fa\u53d1\u524d\u53ef\u80fd\u4e5f\u548c\u4f60\u4e00\u6837\u89c9\u5f97\u201c\u6211\u80fd\u8d70\u5b8c\u201d\u3002',
    },
    {
      id: 'S07-04-2', text: '\u656c\u754f\u5730\u7ecf\u8fc7',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u4f4e\u7740\u5934\u8d70\u8fc7\u53bb\u3002\u4f60\u77e5\u9053\u81ea\u5df1\u53ef\u80fd\u4f1a\u6210\u4e3a\u4e0b\u4e00\u4e2a\u540d\u5b57\u3002\u4e5f\u53ef\u80fd\u4e0d\u4f1a\u3002',
    },
  ],
}


// -- Segment 8: Laobian Cemetery -> Wanxianzhen --

export const S08_01_STONE_SEA: GameEvent = {
  id: 'S08-01', category: 'encounter', subtype: 'route',
  segments: [8], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u773c\u524d\u662f\u4e00\u7247\u770b\u4e0d\u5230\u5c3d\u5934\u7684\u788e\u77f3\u6d77\u6d0b\u3002\u6ca1\u6709\u8def\uff0c\u6ca1\u6709\u6807\u8bb0\uff0c\u53ea\u6709\u5927\u5927\u5c0f\u5c0f\u7684\u77f3\u5934\u4ece\u811a\u4e0b\u4e00\u76f4\u5ef6\u4f38\u5230\u5929\u9645\u7ebf\u3002GPS\u4e0a\u663e\u793a\u4f60\u5e94\u8be5\u5411\u4e1c\uff0c\u4f46\u4f60\u9762\u524d\u7684\u77f3\u6d77\u5411\u4e1c\u3001\u5411\u5317\u3001\u5411\u5357\u770b\u8d77\u6765\u5b8c\u5168\u6ca1\u6709\u533a\u522b\u3002',
  choices: [
    {
      id: 'S08-01-1', text: '\u4e25\u683c\u6309GPS\u65b9\u5411\u524d\u8fdb', requiresItem: 'gps',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u6b7b\u6b7b\u76ef\u7740GPS\u7684\u65b9\u5411\u7bad\u5934\u3002\u4e1c\uff0c\u5c31\u662f\u4e1c\u3002',
    },
    {
      id: 'S08-01-2', text: '\u5bfb\u627e\u524d\u4eba\u7559\u4e0b\u7684\u77f3\u5806\u6807\u8bb0',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.25,
      narrative: '\u4f60\u5728\u77f3\u5934\u4e0a\u641c\u7d22\u2014\u2014\u6709\u4eba\u7528\u5c0f\u77f3\u5934\u5792\u4e86\u7bad\u5934\uff01',
      failNarrative: '\u4f60\u5728\u77f3\u6d77\u4e2d\u641c\u7d22\u4e86\u534a\u5c0f\u65f6\uff0c\u4ec0\u4e48\u6807\u8bb0\u90fd\u6ca1\u627e\u5230\u3002',
      failConsequences: [{ type: 'trigger_lost' }],
    },
    {
      id: 'S08-01-3', text: '\u51ed\u65b9\u5411\u611f\u8d70',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.2,
      narrative: '\u4f60\u9009\u4e86\u4e00\u4e2a\u770b\u8d77\u6765\u5bf9\u7684\u65b9\u5411\u5f00\u59cb\u8d70\u3002',
      failNarrative: '\u4f60\u8d70\u4e86\u4e00\u4e2a\u5c0f\u65f6\u2014\u2014\u7136\u540e\u770b\u5230\u5730\u4e0a\u6709\u811a\u5370\u3002\u7b49\u7b49\uff0c\u8fd9\u662f\u4f60\u81ea\u5df1\u7684\u811a\u5370\u3002',
      failConsequences: [{ type: 'trigger_lost' }],
    },
  ],
}

export const S08_02_LOST: GameEvent = {
  id: 'S08-02', category: 'encounter', subtype: 'route',
  segments: [8], seasons: ['winter','summer'],
  isFixed: false,
  condition: (state) => state.statusEffects.some(s => s.type === 'lost'),
  narrative: '\u4f60\u8d70\u4e86\u4e00\u4e2a\u5c0f\u65f6\u3002\u77f3\u5934\u3001\u77f3\u5934\u3001\u8fd8\u662f\u77f3\u5934\u3002\u7136\u540e\u4f60\u770b\u5230\u5730\u4e0a\u6709\u811a\u5370\u2014\u2014\u7b49\u7b49\uff0c\u8fd9\u662f\u4f60\u81ea\u5df1\u7684\u811a\u5370\u3002\u4f60\u2026\u2026\u4e00\u76f4\u5728\u8f6c\u5708\u3002\n\n\u6050\u614c\u5f00\u59cb\u4ece\u80c3\u91cc\u5f80\u4e0a\u6d8c\u3002',
  choices: [
    {
      id: 'S08-02-1', text: '\u51b7\u9759\u4e0b\u6765\uff0c\u7528\u592a\u9633\u5224\u65ad\u65b9\u5411',
      consequences: [{ type: 'remove_status', payload: 'lost' }],
      probability: 0.25,
      narrative: '\u4f60\u62ac\u5934\u770b\u5929\u3002\u592a\u9633\u5728\u2026\u2026\u90a3\u8fb9\u3002\u4e1c\u8fb9\u5e94\u8be5\u662f\u90a3\u4e2a\u65b9\u5411\u3002',
      failNarrative: '\u4e91\u5c42\u592a\u539a\u4e86\uff0c\u4ec0\u4e48\u90fd\u770b\u4e0d\u5230\u3002',
      failConsequences: [],
    },
    {
      id: 'S08-02-2', text: '\u968f\u673a\u9009\u4e00\u4e2a\u65b9\u5411\u8d70',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.2,
      narrative: '\u4f60\u95ed\u4e0a\u773c\u8f6c\u4e86\u4e2a\u5708\uff0c\u7136\u540e\u775e\u5f00\u773c\u5f80\u524d\u8d70\u3002',
      failNarrative: '\u4f60\u53c8\u8d70\u4e86\u4e0d\u77e5\u9053\u591a\u4e45\u3002\u811a\u5370\u518d\u6b21\u51fa\u73b0\u5728\u4f60\u9762\u524d\u3002',
      failConsequences: [{ type: 'trigger_death' }],
    },
    {
      id: 'S08-02-3', text: '\u5927\u58f0\u547c\u6551',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.1,
      narrative: '\u8fdc\u5904\u4f20\u6765\u4e00\u4e2a\u6a21\u7cca\u7684\u56de\u58f0\u3002\u90a3\u4e2a\u65b9\u5411\u3002',
      failNarrative: '\u4f60\u7684\u58f0\u97f3\u5728\u77f3\u6d77\u4e2d\u56de\u8361\uff0c\u7136\u540e\u6d88\u5931\u3002\u6ca1\u6709\u4eba\u56de\u5e94\u3002',
      failConsequences: [],
    },
  ],
}

export const S08_03_FOOTPRINTS: GameEvent = {
  id: 'S08-03', category: 'encounter', subtype: 'discovery',
  segments: [8], seasons: ['winter'],
  isFixed: false,
  narrative: '\u5927\u96ea\u8986\u76d6\u7684\u77f3\u6d77\u4e2d\uff0c\u4f60\u6ce8\u610f\u5230\u4e00\u4e32\u811a\u5370\u3002\u96ea\u5df2\u7ecf\u586b\u4e86\u5927\u534a\uff0c\u4f46\u8f6e\u5ed3\u8fd8\u5728\u3002\u8fd9\u4e32\u811a\u5370\u5f88\u8be1\u5f02\uff1a\u65f6\u800c\u7b14\u76f4\u5411\u524d\uff0c\u65f6\u800c\u5927\u5e45\u504f\u8f6c90\u5ea6\uff0c\u6709\u4e00\u6bb5\u751a\u81f3\u5728\u4e00\u4e2a\u5c0f\u5708\u5b50\u91cc\u8f6c\u4e86\u597d\u51e0\u5708\u3002\n\n\u6700\u540e\u811a\u5370\u6d88\u5931\u5728\u4e00\u4e2a\u96ea\u5751\u65c1\u8fb9\u3002\u96ea\u5751\u91cc\u6709\u8e66\u8df3\u7684\u75d5\u8ff9\u2014\u2014\u5f88\u591a\u5f88\u591a\u8e66\u8df3\u7684\u75d5\u8ff9\u3002\u7136\u540e\u811a\u5370\u53c8\u51fa\u73b0\u4e86\uff0c\u7b14\u76f4\u5730\u5411\u4e1c\u5ef6\u4f38\uff0c\u6d88\u5931\u5728\u8fdc\u65b9\u3002\n\n\u4e0d\u7ba1\u7559\u4e0b\u8fd9\u4e32\u811a\u5370\u7684\u4eba\u662f\u8c01\uff0c\u4ed6\u6700\u7ec8\u8d70\u51fa\u53bb\u4e86\u3002',
  choices: [
    {
      id: 'S08-03-1', text: '\u6cbf\u7740\u811a\u5370\u7684\u6700\u7ec8\u65b9\u5411\u8d70',
      consequences: [{ type: 'remove_status', payload: 'lost' }],
      narrative: '\u4f60\u9009\u62e9\u76f8\u4fe1\u8fd9\u4e2a\u964c\u751f\u4eba\u3002\u4ed6\u6bd4\u4f60\u66f4\u65e9\u7ecf\u5386\u8fc7\u8fd9\u7247\u77f3\u6d77\uff0c\u800c\u4e14\u4ed6\u6d3b\u7740\u8d70\u4e86\u51fa\u53bb\u3002',
    },
    {
      id: 'S08-03-2', text: '\u53ea\u662f\u770b\u770b\uff0c\u6309\u81ea\u5df1\u7684\u5224\u65ad\u8d70',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u811a\u5370\u662f\u522b\u4eba\u7684\u8def\u3002\u4f60\u6709\u4f60\u81ea\u5df1\u7684\u3002',
    },
  ],
}

// -- Segment 9: Wanxianzhen -> Paoma Ridge -> Dayehai --

export const S09_01_PAOMA: GameEvent = {
  id: 'S09-01', category: 'encounter', subtype: 'atmosphere',
  segments: [9], seasons: ['winter','summer'],
  isFixed: true,
  narrative: '\u8d70\u51fa\u4e07\u4ed9\u9635\u7684\u77f3\u6d77\u540e\uff0c\u4f60\u6765\u5230\u4e86\u8dd1\u9a6c\u6881\u2014\u2014\u4e00\u7247\u5bbd\u9614\u5e73\u5766\u7684\u9ad8\u5c71\u8349\u7538\u3002\u89c6\u91ce\u7a81\u7136\u4ece\u96f6\u53d8\u6210\u4e86\u65e0\u9650\u8fdc\u3002\u4f60\u80fd\u770b\u5230\u8fdc\u5904\u5927\u7237\u6d77\u65b9\u5411\u7684\u5c71\u5cf0\u3002\n\n\u4f60\u5df2\u7ecf\u8d70\u4e86\u5f88\u8fdc\u4e86\u3002',
  choices: [
    {
      id: 'S09-01-1', text: '\u4eab\u53d7\u8fd9\u7247\u523b\u7684\u8f7b\u677e',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u6df1\u5438\u4e00\u53e3\u6c14\u3002\u7a7a\u6c14\u7a00\u8584\u4f46\u5e72\u51c0\u3002\u4f60\u8fd8\u6d3b\u7740\uff0c\u4f60\u8fd8\u5728\u8d70\u3002',
    },
    {
      id: 'S09-01-2', text: '\u52a0\u5feb\u811a\u6b65\uff0c\u8d81\u5929\u8272\u597d',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u4e0d\u6562\u505c\u4e0b\u6765\u3002\u5929\u8272\u5728\u53d8\u3002',
    },
  ],
}

export const S09_02_LIGHT: GameEvent = {
  id: 'S09-02', category: 'encounter', subtype: 'discovery',
  segments: [9], seasons: ['winter','summer'],
  isFixed: false,
  narrative: '\u4f60\u8d70\u5728\u8dd1\u9a6c\u6881\u4e0a\uff0c\u56db\u5468\u4e00\u7247\u6f06\u9ed1\u3002\u7136\u540e\u4f60\u770b\u5230\u4e86\u2014\u2014\u8fdc\u65b9\uff0c\u4e1c\u8fb9\u504f\u5357\u7684\u65b9\u5411\uff0c\u6709\u4e00\u4e2a\u5fae\u5f31\u7684\u5149\u70b9\u3002\u4e0d\u662f\u661f\u661f\uff0c\u662f\u5730\u9762\u4e0a\u7684\u5149\u3002\u90a3\u662f\u5927\u7237\u6d77\u4fdd\u62a4\u7ad9\u7684\u706f\u5149\u3002\n\n\u4f60\u5df2\u7ecf\u5f88\u4e45\u6ca1\u6709\u770b\u5230\u4eba\u9020\u5149\u6e90\u4e86\u3002',
  choices: [
    {
      id: 'S09-02-1', text: '\u671d\u7740\u706f\u5149\u7684\u65b9\u5411\u8d70',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u76ef\u7740\u90a3\u4e2a\u5149\u70b9\u8d70\u3002\u5b83\u6bd4GPS\u66f4\u8ba9\u4f60\u5b89\u5fc3\u3002',
    },
  ],
}

export const S09_03_THUNDER: GameEvent = {
  id: 'S09-03', category: 'encounter', subtype: 'route',
  segments: [9], seasons: ['summer'],
  isFixed: false,
  narrative: '\u5929\u7a7a\u4e2d\u4f20\u6765\u4f4e\u6c89\u7684\u8f70\u9e23\u3002\u4f60\u62ac\u5934\u2014\u2014\u4e4c\u4e91\u6b63\u4ee5\u8089\u773c\u53ef\u89c1\u7684\u901f\u5ea6\u4ece\u897f\u8fb9\u6d8c\u8fc7\u6765\u3002\u8dd1\u9a6c\u6881\u662f\u4e00\u7247\u5b8c\u5168\u66b4\u9732\u7684\u9ad8\u5730\uff0c\u4f60\u662f\u8fd9\u7247\u8349\u7538\u4e0a\u6700\u9ad8\u7684\u4e1c\u897f\u3002\u5934\u53d1\u5f00\u59cb\u7ad6\u8d77\u6765\u3002',
  choices: [
    {
      id: 'S09-03-1', text: '\u6254\u6389\u767b\u5c71\u6756\uff0c\u8e72\u4f4e\u8eab\u4f53\u5feb\u901f\u901a\u8fc7',
      consequences: [{ type: 'consume_item', payload: 'pole' }],
      narrative: '\u4f60\u628a\u6240\u6709\u91d1\u5c5e\u7269\u54c1\u8fdc\u8fdc\u6254\u5f00\uff0c\u8e72\u7740\u5f80\u524d\u8dd1\u3002\u95ea\u7535\u5728\u8eab\u540e\u7684\u5c71\u810a\u4e0a\u70b8\u5f00\u3002',
    },
    {
      id: 'S09-03-2', text: '\u5728\u6700\u4f4e\u6d3c\u5904\u8db4\u4e0b\u7b49\u96f7\u66b4\u8fc7\u53bb',
      consequences: [{ type: 'skip_turn' }],
      narrative: '\u4f60\u8db4\u5728\u8349\u5730\u4e0a\uff0c\u8138\u8d34\u7740\u51b0\u51b7\u7684\u6ce5\u571f\u3002\u95ea\u7535\u4e00\u9053\u63a5\u4e00\u9053\u3002\u4f60\u80fd\u95fb\u5230\u81ed\u6c27\u7684\u5473\u9053\u3002',
    },
    {
      id: 'S09-03-3', text: '\u5192\u9669\u7ee7\u7eed\u5feb\u901f\u884c\u8fdb',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.3,
      narrative: '\u4f60\u8d4c\u4e86\u4e00\u628a\u2014\u2014\u5728\u96f7\u66b4\u4e2d\u76f4\u7acb\u884c\u8d70\u7a7f\u8fc7\u9ad8\u5c71\u8349\u7538\u3002',
      failNarrative: '\u4e00\u9053\u767d\u5149\u2014\u2014',
      failConsequences: [{ type: 'trigger_death' }],
    },
  ],
}

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

// ==========================================================
// Event Pool Index & Export Functions
// ==========================================================

/** All universal events */

// ══ Universal Events U13-U27 (expanded pool) ══
export const U13_EVENT: GameEvent = {
  id: 'U13', category: 'encounter', subtype: 'weather',
  segments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u5929\u8272\u7a81\u7136\u6697\u4e0b\u6765\uff0c\u4e4c\u4e91\u4ece\u897f\u8fb9\u7ffb\u6d8c\u800c\u81f3\u3002\u5927\u9897\u7684\u96e8\u6ef4\u7838\u5728\u8138\u4e0a\u2014\u2014\u66b4\u96e8\u6765\u4e86\u3002\u4f60\u7684\u80cc\u5305\u5916\u5c42\u5df2\u7ecf\u5f00\u59cb\u6e17\u6c34\u3002',
  choices: [
    {
      id: 'U13-1', text: '\u7528\u9632\u6c34\u888b\u4fdd\u62a4\u88c5\u5907',
      requiresItem: 'dry_bag',
      consequences: [],
      narrative: '\u4f60\u8fc5\u901f\u628a\u91cd\u8981\u7269\u8d44\u585e\u8fdb\u9632\u6c34\u888b\u3002\u80cc\u5305\u5916\u9762\u6e7f\u4e86\uff0c\u91cc\u9762\u4f9d\u7136\u5e72\u71e5\u3002',
    },
    {
      id: 'U13-2', text: '\u627e\u5757\u5ca9\u58c1\u8eb2\u4e00\u4f1a\u513f',
      consequences: [{ type: 'skip_turn' }],
      narrative: '\u4f60\u7f29\u5728\u4e00\u5757\u7a81\u51fa\u7684\u5ca9\u58c1\u4e0b\u7b49\u96e8\u505c\u3002\u635f\u5931\u4e86\u4e00\u4e9b\u65f6\u95f4\uff0c\u4f46\u81f3\u5c11\u6ca1\u6709\u6dcb\u900f\u3002',
    },
    {
      id: 'U13-3', text: '\u5192\u96e8\u7ee7\u7eed\u8d70',
      probability: 0.4,
      consequences: [{ type: 'add_status', payload: { type: 'wet', speedModifier: -1, turnsRemaining: 3 } }],
      failConsequences: [{ type: 'add_status', payload: { type: 'cold', speedModifier: -1, turnsRemaining: 4 } }],
      failNarrative: '\u96e8\u6bd4\u60f3\u8c61\u4e2d\u5927\u5f97\u591a\u3002\u4f53\u6e29\u5728\u5feb\u901f\u4e0b\u964d\uff0c\u51b7\u5230\u53d1\u6296\u3002',
      narrative: '\u8fd8\u80fd\u8d70\u3002\u8863\u670d\u6e7f\u900f\u4e86\uff0c\u6709\u70b9\u51b7\uff0c\u4f46\u6ca1\u4ec0\u4e48\u5927\u4e8b\u3002',
    },
  ],
}

export const U14_EVENT: GameEvent = {
  id: 'U14', category: 'encounter', subtype: 'terrain',
  segments: [2, 3, 4, 5, 6, 7, 8, 9], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u524d\u65b9\u7684\u8def\u5b8c\u5168\u88ab\u4e00\u7247\u4e71\u77f3\u8986\u76d6\u3002\u6bcf\u5757\u77f3\u5934\u90fd\u5728\u4f60\u8e29\u4e0a\u53bb\u7684\u77ac\u95f4\u6447\u6643\uff0c\u50cf\u662f\u6545\u610f\u5728\u8ddf\u4f60\u5f00\u73a9\u7b11\u3002',
  choices: [
    {
      id: 'U14-1', text: '\u7528\u767b\u5c71\u6756\u8bd5\u63a2\u6bcf\u4e00\u6b65',
      requiresItem: 'pole',
      consequences: [],
      narrative: '\u6756\u5c16\u6572\u51fb\u77f3\u9762\u7684\u58f0\u97f3\u56de\u54cd\u5728\u5c71\u8c37\u91cc\u3002\u6162\uff0c\u4f46\u7a33\u3002',
    },
    {
      id: 'U14-2', text: '\u5c0f\u5fc3\u7ffc\u7ffc\u5730\u8e29\u7a33\u8d70',
      probability: 0.5,
      consequences: [],
      failConsequences: [{ type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: -1 } }],
      failNarrative: '\u4e00\u5757\u77f3\u5934\u7a81\u7136\u7ffb\u8f6c\u2014\u2014\u4f60\u7684\u811a\u5361\u5728\u77f3\u7f1d\u91cc\u626d\u4e86\u4e00\u4e0b\u3002',
      narrative: '\u4f60\u56db\u80a2\u5e76\u7528\uff0c\u7ec8\u4e8e\u7a7f\u8fc7\u4e86\u8fd9\u7247\u4e71\u77f3\u533a\u3002',
    },
  ],
}

export const U15_EVENT: GameEvent = {
  id: 'U15', category: 'encounter', subtype: 'discovery',
  segments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u8def\u8fb9\u6709\u4e2a\u88ab\u9057\u5f03\u7684\u5851\u6599\u74f6\uff0c\u91cc\u9762\u8fd8\u6709\u5c0f\u534a\u74f6\u6c34\u3002\u74f6\u8eab\u4e0a\u7528\u8bb0\u53f7\u7b14\u5199\u7740\uff1a\u7ed9\u540e\u9762\u7684\u4eba\u3002',
  choices: [
    {
      id: 'U15-1', text: '\u559d\u6389\u5b83',
      consequences: [{ type: 'modify_water', payload: 0.3 }],
      narrative: '\u6c34\u6709\u70b9\u6e29\u70ed\uff0c\u5e26\u7740\u9633\u5149\u7684\u5473\u9053\u3002\u4f60\u9ed8\u9ed8\u611f\u8c22\u4e86\u90a3\u4e2a\u4e0d\u77e5\u540d\u7684\u4eba\u3002',
    },
    {
      id: 'U15-2', text: '\u7559\u7ed9\u66f4\u9700\u8981\u7684\u4eba',
      consequences: [],
      narrative: '\u4f60\u628a\u74f6\u5b50\u653e\u56de\u539f\u5904\u3002\u4e5f\u8bb8\u540e\u9762\u6709\u4eba\u6bd4\u4f60\u66f4\u9700\u8981\u5b83\u3002',
    },
  ],
}

export const U16_EVENT: GameEvent = {
  id: 'U16', category: 'encounter', subtype: 'body',
  segments: [3, 4, 5, 6, 7, 8, 9], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u8fde\u7eed\u7684\u4e0a\u5761\u8ba9\u4f60\u7684\u5927\u817f\u704c\u4e86\u94c5\u4e00\u6837\u91cd\u3002\u6bcf\u8fc8\u4e00\u6b65\u90fd\u8981\u6d88\u8017\u5de8\u5927\u7684\u610f\u5fd7\u529b\u3002\u4f60\u7684\u8eab\u4f53\u5728\u6297\u8bae\u3002',
  choices: [
    {
      id: 'U16-1', text: '\u5750\u4e0b\u6765\u4f11\u606f\u4e94\u5206\u949f',
      consequences: [{ type: 'skip_turn' }],
      narrative: '\u4f60\u5750\u5728\u77f3\u5934\u4e0a\u5927\u53e3\u5598\u6c14\u3002\u4e94\u5206\u949f\u540e\uff0c\u817f\u6ca1\u90a3\u4e48\u9178\u4e86\u3002',
    },
    {
      id: 'U16-2', text: '\u5403\u70b9\u4e1c\u897f\u8865\u5145\u4f53\u529b',
      consequences: [{ type: 'consume_item', payload: 'food' }],
      narrative: '\u538b\u7f29\u997c\u5e72\u5728\u5634\u91cc\u56bc\u5f97\u5494\u5494\u54cd\u3002\u7cd6\u5206\u8ba9\u4f60\u91cd\u65b0\u6709\u4e86\u529b\u6c14\u3002',
    },
    {
      id: 'U16-3', text: '\u54ac\u7259\u786c\u6491',
      probability: 0.5,
      consequences: [],
      failConsequences: [{ type: 'add_status', payload: { type: 'slow', speedModifier: -1, turnsRemaining: 2 } }],
      failNarrative: '\u817f\u90e8\u808c\u8089\u5f00\u59cb\u4e0d\u53d7\u63a7\u5236\u5730\u98a4\u6296\u3002\u4f60\u5fc5\u987b\u653e\u6162\u901f\u5ea6\u3002',
      narrative: '\u4f60\u7528\u610f\u5fd7\u529b\u538b\u8fc7\u4e86\u8eab\u4f53\u7684\u8b66\u62a5\u3002\u8fd8\u80fd\u8d70\u3002',
    },
  ],
}

export const U17_EVENT: GameEvent = {
  id: 'U17', category: 'encounter', subtype: 'equipment',
  segments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u4f60\u4f4e\u5934\u53d1\u73b0\u978b\u5e26\u677e\u4e86\u2014\u2014\u4e0d\u5bf9\uff0c\u662f\u978b\u5e95\u8fb9\u7f18\u5f00\u59cb\u8131\u80f6\u4e86\u3002\u8fd9\u53cc\u978b\u6491\u4e0d\u4e86\u591a\u4e45\u4e86\u3002',
  choices: [
    {
      id: 'U17-1', text: '\u7528\u7ef3\u5b50\u4e34\u65f6\u7ed1\u4f4f',
      requiresItem: 'rope',
      consequences: [],
      narrative: '\u4f60\u622a\u4e86\u4e00\u5c0f\u6bb5\u7ef3\u5b50\u628a\u978b\u5e95\u7f20\u7d27\u3002\u4e0d\u597d\u770b\uff0c\u4f46\u80fd\u7528\u3002',
    },
    {
      id: 'U17-2', text: '\u5c0f\u5fc3\u8d70\uff0c\u5c3d\u91cf\u522b\u52a0\u901f',
      probability: 0.6,
      consequences: [],
      failConsequences: [{ type: 'add_status', payload: { type: 'slow', speedModifier: -1, turnsRemaining: 2 } }],
      failNarrative: '\u521a\u8d70\u51e0\u6b65\u978b\u5e95\u5f7b\u5e95\u7ffb\u5f00\u4e86\u3002\u4f60\u4e0d\u5f97\u4e0d\u653e\u6162\u811a\u6b65\u3002',
      narrative: '\u53ea\u8981\u4e0d\u8dd1\uff0c\u5e94\u8be5\u8fd8\u80fd\u6491\u5230\u7ec8\u70b9\u3002',
    },
  ],
}

export const U18_EVENT: GameEvent = {
  id: 'U18', category: 'encounter', subtype: 'weather',
  segments: [3, 4, 5, 6, 7, 8, 9, 10], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u6d53\u96fe\u7a81\u7136\u4ece\u5c71\u8c37\u91cc\u5347\u4e0a\u6765\uff0c\u5341\u7c73\u4e4b\u5916\u5b8c\u5168\u770b\u4e0d\u89c1\u4efb\u4f55\u4e1c\u897f\u3002GPS\u4fe1\u53f7\u4e5f\u53d8\u5f97\u65ad\u65ad\u7eed\u7eed\u3002',
  choices: [
    {
      id: 'U18-1', text: '\u4f9d\u9760GPS\u822a\u8ff9\u7ee7\u7eed',
      requiresItem: 'gps',
      consequences: [],
      narrative: 'GPS\u867d\u7136\u4fe1\u53f7\u4e0d\u7a33\uff0c\u4f46\u8db3\u591f\u4f60\u8fa8\u8ba4\u65b9\u5411\u3002\u4f60\u5728\u767d\u832b\u832b\u4e2d\u6478\u7d22\u524d\u8fdb\u3002',
    },
    {
      id: 'U18-2', text: '\u539f\u5730\u7b49\u96fe\u6563',
      consequences: [{ type: 'skip_turn' }],
      narrative: '\u4f60\u5750\u5728\u4e00\u5757\u5927\u77f3\u5934\u4e0a\u7b49\u5f85\u3002\u534a\u5c0f\u65f6\u540e\uff0c\u96fe\u6c14\u8584\u4e86\u4e00\u4e9b\uff0c\u80fd\u770b\u6e05\u8def\u4e86\u3002',
    },
    {
      id: 'U18-3', text: '\u51ed\u611f\u89c9\u5f80\u524d\u8d70',
      probability: 0.3,
      consequences: [],
      failConsequences: [{ type: 'trigger_lost' }],
      failNarrative: '\u4f60\u8d70\u4e86\u4e0d\u77e5\u591a\u4e45\uff0c\u53d1\u73b0\u5468\u56f4\u7684\u5730\u5f62\u5b8c\u5168\u964c\u751f\u3002\u4f60\u8ff7\u8def\u4e86\u3002',
      narrative: '\u4f60\u8fd0\u6c14\u4e0d\u9519\uff0c\u8d70\u4e86\u4e00\u6bb5\u540e\u96fe\u7a81\u7136\u6563\u4e86\uff0c\u811a\u4e0b\u8fd8\u662f\u6b63\u8def\u3002',
    },
  ],
}

export const U19_EVENT: GameEvent = {
  id: 'U19', category: 'encounter', subtype: 'discovery',
  segments: [2, 3, 4, 5, 6, 7, 8, 9], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u77f3\u7f1d\u95f4\u6709\u4e00\u9762\u892a\u8272\u7684\u7ecf\u5e61\u5728\u98ce\u4e2d\u730e\u730e\u4f5c\u54cd\u3002\u4e0b\u9762\u538b\u7740\u4e00\u5757\u5c0f\u77f3\u5934\uff0c\u77f3\u5934\u4e0a\u523b\u7740\u4e00\u884c\u5b57\uff1a\u5e73\u5b89\u3002',
  choices: [
    {
      id: 'U19-1', text: '\u53cc\u624b\u5408\u5341\u9ed8\u5ff5',
      consequences: [],
      narrative: '\u4f60\u4e0d\u77e5\u9053\u662f\u8c01\u7559\u4e0b\u7684\u3002\u4f46\u6b64\u523b\uff0c\u8fd9\u4e24\u4e2a\u5b57\u8ba9\u4f60\u5fc3\u91cc\u8e0f\u5b9e\u4e86\u4e00\u4e9b\u3002',
    },
    {
      id: 'U19-2', text: '\u4e5f\u653e\u4e00\u5757\u5c0f\u77f3\u5934',
      consequences: [],
      narrative: '\u4f60\u5728\u65c1\u8fb9\u52a0\u4e86\u4e00\u5757\u77f3\u5934\u3002\u4e5f\u8bb8\u540e\u6765\u8005\u4e5f\u9700\u8981\u8fd9\u4efd\u5b89\u6170\u3002',
    },
  ],
}

export const U20_EVENT: GameEvent = {
  id: 'U20', category: 'encounter', subtype: 'body',
  segments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u4f60\u7a81\u7136\u89c9\u5f97\u5934\u75bc\u6b32\u88c2\uff0c\u592a\u9633\u7a74\u7a81\u7a81\u5730\u8df3\u3002\u773c\u524d\u7684\u666f\u8272\u5f00\u59cb\u5fae\u5fae\u65cb\u8f6c\u3002',
  choices: [
    {
      id: 'U20-1', text: '\u5403\u836f\u7f13\u89e3',
      requiresItem: 'first_aid',
      consequences: [],
      narrative: '\u5e03\u6d1b\u82ac\u4e0b\u809a\u5341\u5206\u949f\u540e\uff0c\u5934\u75db\u7f13\u89e3\u4e86\u4e0d\u5c11\u3002',
    },
    {
      id: 'U20-2', text: '\u559d\u6c34\u4f11\u606f',
      consequences: [{ type: 'modify_water', payload: -0.2 }],
      narrative: '\u4f60\u5927\u53e3\u559d\u4e86\u51e0\u53e3\u6c34\uff0c\u5728\u9634\u51c9\u5904\u5750\u4e86\u4e00\u4f1a\u513f\u3002\u597d\u591a\u4e86\u3002',
    },
    {
      id: 'U20-3', text: '\u5fcd\u7740\u7ee7\u7eed\u8d70',
      probability: 0.4,
      consequences: [],
      failConsequences: [{ type: 'add_status', payload: { type: 'slow', speedModifier: -1, turnsRemaining: 2 } }],
      failNarrative: '\u5934\u8d8a\u6765\u8d8a\u75db\uff0c\u89c6\u7ebf\u6a21\u7cca\uff0c\u4f60\u4e0d\u5f97\u4e0d\u653e\u6162\u811a\u6b65\u3002',
      narrative: '\u5934\u75db\u5728\u8d70\u4e86\u4e00\u4f1a\u513f\u540e\u81ea\u5df1\u6d88\u9000\u4e86\u3002',
    },
  ],
}

export const U21_EVENT: GameEvent = {
  id: 'U21', category: 'encounter', subtype: 'terrain',
  segments: [4, 5, 6, 7, 8], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u4e00\u6bb5\u8fd1\u4e4e\u5782\u76f4\u7684\u5ca9\u58c1\u6321\u5728\u9762\u524d\u3002\u4e0a\u9762\u6709\u4eba\u6253\u4e86\u4e24\u4e2a\u5ca9\u9489\uff0c\u6302\u7740\u4e00\u622a\u65e7\u7ef3\u5b50\uff0c\u770b\u8d77\u6765\u5e74\u4ee3\u4e45\u8fdc\u3002',
  choices: [
    {
      id: 'U21-1', text: '\u7528\u81ea\u5df1\u7684\u7ef3\u5b50\u6500\u767b',
      requiresItem: 'rope',
      consequences: [],
      narrative: '\u4f60\u628a\u7ef3\u5b50\u7cfb\u5728\u5ca9\u9489\u4e0a\uff0c\u4e09\u70b9\u56fa\u5b9a\u6162\u6162\u5411\u4e0a\u3002\u5b89\u5168\u62b5\u8fbe\u4e86\u4e0a\u65b9\u5e73\u53f0\u3002',
    },
    {
      id: 'U21-2', text: '\u6293\u65e7\u7ef3\u5b50\u5f80\u4e0a\u722c',
      probability: 0.3,
      consequences: [],
      failConsequences: [{ type: 'add_status', payload: { type: 'injury', speedModifier: -2, turnsRemaining: 3 } }],
      failNarrative: '\u722c\u5230\u4e00\u534a\u7ef3\u5b50\u7a81\u7136\u5d29\u65ad\uff01\u4f60\u91cd\u91cd\u6454\u4e86\u4e0b\u6765\uff0c\u624b\u638c\u548c\u819d\u76d6\u90fd\u64e6\u4f24\u4e86\u3002',
      narrative: '\u65e7\u7ef3\u5b50\u5c45\u7136\u8fd8\u633a\u7ed3\u5b9e\u3002\u4f60\u624b\u811a\u5e76\u7528\u722c\u4e86\u4e0a\u53bb\u3002',
    },
    {
      id: 'U21-3', text: '\u7ed5\u8def\u5bfb\u627e\u5176\u4ed6\u901a\u9053',
      consequences: [{ type: 'skip_turn' }],
      narrative: '\u4f60\u6cbf\u7740\u5ca9\u58c1\u8d70\u4e86\u597d\u4e00\u4f1a\u513f\uff0c\u7ec8\u4e8e\u627e\u5230\u4e00\u6761\u53ef\u4ee5\u7ed5\u4e0a\u53bb\u7684\u5c0f\u8def\u3002',
    },
  ],
}

export const U22_EVENT: GameEvent = {
  id: 'U22', category: 'encounter', subtype: 'equipment',
  segments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u4f60\u6253\u5f00\u80cc\u5305\u60f3\u62ff\u4e1c\u897f\u65f6\u53d1\u73b0\u2014\u2014\u6c34\u58f6\u7684\u76d6\u5b50\u4e0d\u77e5\u4ec0\u4e48\u65f6\u5019\u677e\u4e86\uff0c\u6c34\u6d12\u4e86\u4e00\u4e9b\u5728\u5305\u91cc\u3002',
  choices: [
    {
      id: 'U22-1', text: '\u8d76\u7d27\u62e7\u7d27\uff0c\u68c0\u67e5\u635f\u5931',
      consequences: [{ type: 'modify_water', payload: -0.2 }],
      narrative: '\u635f\u5931\u4e86\u5927\u7ea60.2\u5347\u6c34\u3002\u4f60\u6697\u9a82\u4e00\u58f0\uff0c\u628a\u76d6\u5b50\u62e7\u6b7b\u3002',
    },
    {
      id: 'U22-2', text: '\u628a\u6d78\u6e7f\u7684\u4e1c\u897f\u62ff\u51fa\u6765\u667e\u5e72',
      consequences: [{ type: 'modify_water', payload: -0.2 }, { type: 'skip_turn' }],
      narrative: '\u4f60\u505c\u4e0b\u6765\u628a\u6e7f\u6389\u7684\u4e1c\u897f\u644a\u5f00\u667e\u3002\u6c34\u635f\u5931\u4e0d\u5927\uff0c\u4f46\u803d\u8bef\u4e86\u65f6\u95f4\u3002',
    },
  ],
}

export const U23_EVENT: GameEvent = {
  id: 'U23', category: 'encounter', subtype: 'weather',
  segments: [5, 6, 7, 8, 9, 10], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u4e00\u9635\u7a81\u5982\u5176\u6765\u7684\u51b7\u98ce\u4ece\u5c71\u810a\u5439\u8fc7\uff0c\u6e29\u5ea6\u9aa4\u964d\u3002\u4f60\u7684\u624b\u6307\u5f00\u59cb\u53d1\u9ebb\uff0c\u9f3b\u5c16\u51bb\u5f97\u53d1\u7ea2\u3002',
  choices: [
    {
      id: 'U23-1', text: '\u8d76\u7d27\u7a7f\u4e0a\u4fdd\u6696\u8863\u7269',
      requiresItem: 'warm_clothes',
      consequences: [],
      narrative: '\u7fbd\u7ed2\u670d\u88f9\u4e0a\u8eab\u7684\u4e00\u77ac\u95f4\uff0c\u6e29\u6696\u91cd\u65b0\u5305\u88f9\u4e86\u4f60\u3002\u7ee7\u7eed\u8d70\u3002',
    },
    {
      id: 'U23-2', text: '\u52a0\u5feb\u6b65\u4f10\u7528\u8fd0\u52a8\u4ea7\u70ed',
      probability: 0.5,
      consequences: [],
      failConsequences: [{ type: 'add_status', payload: { type: 'slow', speedModifier: -1, turnsRemaining: 2 } }],
      failNarrative: '\u8d70\u4e86\u4e00\u4f1a\u513f\u98ce\u66f4\u5927\u4e86\uff0c\u8fd0\u52a8\u4ea7\u751f\u7684\u70ed\u91cf\u6839\u672c\u4e0d\u591f\u3002\u4f60\u5f00\u59cb\u6253\u5bd2\u98a4\u3002',
      narrative: '\u4f60\u52a0\u5feb\u6b65\u4f10\uff0c\u8eab\u4f53\u786e\u5b9e\u6696\u548c\u4e86\u8d77\u6765\u3002',
    },
  ],
}

export const U24_EVENT: GameEvent = {
  id: 'U24', category: 'encounter', subtype: 'discovery',
  segments: [3, 4, 5, 6, 7, 8, 9], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u5730\u4e0a\u6709\u4e00\u53cc\u88ab\u9057\u5f03\u7684\u767b\u5c71\u978b\uff0c\u978b\u5e95\u5df2\u7ecf\u78e8\u7a7f\u4e86\u3002\u65c1\u8fb9\u8fd8\u6709\u4e00\u53ea\u7a7a\u7684\u77ff\u6cc9\u6c34\u74f6\u548c\u51e0\u5f20\u538b\u7f29\u997c\u5e72\u7684\u5305\u88c5\u7eb8\u3002',
  choices: [
    {
      id: 'U24-1', text: '\u68c0\u67e5\u9644\u8fd1\u6709\u6ca1\u6709\u5176\u4ed6\u7ebf\u7d22',
      consequences: [],
      narrative: '\u9664\u4e86\u8fd9\u4e9b\u5783\u573e\u4e4b\u5916\u4ec0\u4e48\u4e5f\u6ca1\u6709\u3002\u4f60\u6536\u62fe\u597d\u5fc3\u60c5\u7ee7\u7eed\u524d\u8fdb\u3002',
    },
    {
      id: 'U24-2', text: '\u4e0d\u770b\u4e86\uff0c\u7ee7\u7eed\u8d70',
      consequences: [],
      narrative: '\u4f60\u79fb\u5f00\u4e86\u76ee\u5149\u3002\u5c71\u4e0a\u8fd9\u6837\u7684\u75d5\u8ff9\u592a\u591a\u4e86\u3002',
    },
  ],
}

export const U25_EVENT: GameEvent = {
  id: 'U25', category: 'encounter', subtype: 'terrain',
  segments: [2, 3, 4, 5, 6, 7, 8, 9, 11], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u811a\u4e0b\u7684\u6ce5\u571f\u53d8\u5f97\u5f02\u5e38\u6e7f\u6ed1\u2014\u2014\u6628\u591c\u7684\u96e8\u628a\u8fd9\u6bb5\u8def\u53d8\u6210\u4e86\u4e00\u6761\u6ce5\u6cb3\u3002\u6bcf\u4e00\u6b65\u90fd\u53ef\u80fd\u6ed1\u5012\u3002',
  choices: [
    {
      id: 'U25-1', text: '\u7528\u767b\u5c71\u6756\u4fdd\u6301\u5e73\u8861',
      requiresItem: 'pole',
      consequences: [],
      narrative: '\u6756\u5c16\u63d2\u8fdb\u6ce5\u91cc\u63d0\u4f9b\u989d\u5916\u652f\u6491\u3002\u867d\u7136\u6162\uff0c\u4f46\u4f60\u7a33\u7a33\u5730\u8d70\u8fc7\u4e86\u8fd9\u6bb5\u8def\u3002',
    },
    {
      id: 'U25-2', text: '\u624b\u811a\u5e76\u7528\u722c\u8fc7\u53bb',
      probability: 0.5,
      consequences: [],
      failConsequences: [{ type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: -1 } }],
      failNarrative: '\u4f60\u4e00\u811a\u8e29\u6ed1\uff0c\u6574\u4e2a\u4eba\u6454\u8fdb\u4e86\u6ce5\u5751\u91cc\u3002\u7ad9\u8d77\u6765\u65f6\u53d1\u73b0\u811a\u8e1d\u626d\u4e86\u3002',
      narrative: '\u88e4\u5b50\u548c\u624b\u5957\u5168\u662f\u6ce5\uff0c\u4f46\u4f60\u5b89\u5168\u901a\u8fc7\u4e86\u3002',
    },
  ],
}

export const U26_EVENT: GameEvent = {
  id: 'U26', category: 'encounter', subtype: 'body',
  segments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u80c3\u5728\u62bd\u6410\u2014\u2014\u4f60\u5df2\u7ecf\u5f88\u4e45\u6ca1\u5403\u4e1c\u897f\u4e86\u3002\u624b\u5f00\u59cb\u6296\uff0c\u8d70\u8def\u4e5f\u5f00\u59cb\u53d1\u98d8\u3002\u4f4e\u8840\u7cd6\u7684\u75c7\u72b6\u3002',
  choices: [
    {
      id: 'U26-1', text: '\u5403\u4e1c\u897f\u8865\u5145\u80fd\u91cf',
      consequences: [{ type: 'consume_item', payload: 'food' }],
      narrative: '\u98df\u7269\u4e0b\u809a\u540e\uff0c\u8eab\u4f53\u6e10\u6e10\u6062\u590d\u4e86\u529b\u6c14\u3002\u4ee5\u540e\u4e0d\u80fd\u62d6\u8fd9\u4e48\u4e45\u4e86\u3002',
    },
    {
      id: 'U26-2', text: '\u559d\u51e0\u53e3\u6c34\u9876\u4e00\u9876',
      consequences: [{ type: 'modify_water', payload: -0.1 }],
      narrative: '\u6c34\u52c9\u5f3a\u538b\u4e0b\u4e86\u80c3\u90e8\u7684\u7ffb\u6405\u611f\uff0c\u4f46\u8eab\u4f53\u4f9d\u7136\u865a\u5f31\u3002',
    },
    {
      id: 'U26-3', text: '\u5fcd\u7740\u7ee7\u7eed\u8d70',
      probability: 0.3,
      consequences: [],
      failConsequences: [{ type: 'add_status', payload: { type: 'injury', speedModifier: -2, turnsRemaining: 3 } }],
      failNarrative: '\u773c\u524d\u4e00\u9ed1\uff0c\u4f60\u5dee\u70b9\u6454\u5012\u3002\u8eab\u4f53\u5df2\u7ecf\u5230\u4e86\u6781\u9650\u3002',
      narrative: '\u4f60\u54ac\u7259\u6491\u8fc7\u4e86\u8fd9\u9635\u865a\u5f31\u611f\u3002',
    },
  ],
}

export const U27_EVENT: GameEvent = {
  id: 'U27', category: 'encounter', subtype: 'equipment',
  segments: [3, 4, 5, 6, 7, 8, 9], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u4f60\u4f4e\u5934\u53d1\u73b0\u767b\u5c71\u6756\u7684\u6756\u5c16\u78b3\u9489\u5df2\u7ecf\u78e8\u5e73\u4e86\uff0c\u6775\u5728\u77f3\u5934\u4e0a\u76f4\u6253\u6ed1\u3002\u7ee7\u7eed\u7528\u53ef\u80fd\u66f4\u5371\u9669\u3002',
  choices: [
    {
      id: 'U27-1', text: '\u6536\u8d77\u767b\u5c71\u6756\uff0c\u7528\u624b\u4fdd\u6301\u5e73\u8861',
      probability: 0.5,
      consequences: [],
      failConsequences: [{ type: 'add_status', payload: { type: 'slow', speedModifier: -1, turnsRemaining: 2 } }],
      failNarrative: '\u6ca1\u6709\u767b\u5c71\u6756\u652f\u6491\uff0c\u4f60\u7684\u901f\u5ea6\u660e\u663e\u6162\u4e86\u4e0b\u6765\u3002',
      narrative: '\u6ca1\u6709\u6756\u4e5f\u80fd\u8d70\uff0c\u53ea\u662f\u8981\u66f4\u5c0f\u5fc3\u4e00\u4e9b\u3002',
    },
    {
      id: 'U27-2', text: '\u7ee7\u7eed\u7528\uff0c\u5c0f\u5fc3\u70b9\u5c31\u884c',
      probability: 0.4,
      consequences: [],
      failConsequences: [{ type: 'damage_item', payload: 'pole' }],
      failNarrative: '\u6756\u5c16\u5728\u4e00\u5757\u5ca9\u77f3\u4e0a\u731b\u5730\u4e00\u6ed1\u2014\u2014\u6574\u6839\u6756\u5f39\u51fa\u53bb\uff0c\u6756\u8eab\u649e\u5728\u77f3\u5934\u4e0a\u88c2\u4e86\u3002',
      narrative: '\u867d\u7136\u6253\u6ed1\uff0c\u4f46\u52c9\u5f3a\u8fd8\u80fd\u7528\u3002',
    },
  ],
}


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
  U13_EVENT,
  U14_EVENT,
  U15_EVENT,
  U16_EVENT,
  U17_EVENT,
  U18_EVENT,
  U19_EVENT,
  U20_EVENT,
  U21_EVENT,
  U22_EVENT,
  U23_EVENT,
  U24_EVENT,
  U25_EVENT,
  U26_EVENT,
  U27_EVENT,
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


// ==========================================================
// Descent Route Events D97 / D96 / D93 / D95 / D88
// ==========================================================


// -- D97 导航塔->23km 处 --

export const D97_01_SCREE_SLIDE: GameEvent = {
  id: 'D97-01', category: 'encounter', subtype: 'terrain',
  segments: [], seasons: ['winter', 'summer'],
  isFixed: false,
  narrative: '\u4e0b\u64a4\u7684\u788e\u77f3\u5761\u6bd4\u4f60\u60f3\u8c61\u7684\u6ed1\u3002\u6bcf\u8d70\u4e00\u6b65\uff0c\u811a\u4e0b\u7684\u788e\u77f3\u5c31\u5e26\u7740\u4f60\u5f80\u4e0b\u6e9c\u534a\u7c73\u3002\u50cf\u5728\u8d70\u4e00\u4e2a\u6c38\u8fdc\u5230\u4e0d\u4e86\u5e95\u7684\u6c99\u4e18\u3002',
  choices: [
    {
      id: 'D97-01-1', text: '\u7528\u767b\u5c71\u6756\u63a7\u5236\u901f\u5ea6',
      requiresItem: 'pole',
      consequences: [],
      narrative: '\u6756\u5c16\u6233\u8fdb\u788e\u77f3\u7f1d\u91cc\uff0c\u4f60\u4e00\u6b65\u4e00\u6b65\u7a33\u7a33\u5730\u4e0b\u964d\u3002',
    },
    {
      id: 'D97-01-2', text: '\u5750\u4e0b\u6765\u6ed1',
      consequences: [{ type: 'modify_speed_temp', payload: { delta: 1, turns: 1 } }],
      narrative: '\u4f60\u4e00\u5c41\u80a1\u5750\u5728\u788e\u77f3\u4e0a\u5f80\u4e0b\u6ed1\u3002\u88e4\u5b50\u5b8c\u4e86\uff0c\u4f46\u786e\u5b9e\u5feb\u3002',
      probability: 0.3,
      failNarrative: '\u4f60\u4e00\u5c41\u80a1\u5750\u5728\u788e\u77f3\u4e0a\u5f80\u4e0b\u6ed1\u2014\u2014\u788e\u77f3\u91cc\u85cf\u7740\u5c16\u9510\u7684\u5ca9\u89d2\uff0c\u88e4\u5b50\u522e\u7834\u4e86\uff0c\u5927\u817f\u5916\u4fa7\u4e00\u9053\u8840\u53e3\u3002',
      failConsequences: [{ type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: 2 } }],
    },
    {
      id: 'D97-01-3', text: '\u5c0f\u5fc3\u7ffc\u7ffc\u8d70',
      consequences: [{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }],
      narrative: '\u4f60\u8e72\u7740\u91cd\u5fc3\uff0c\u4e00\u6b65\u4e00\u6b65\u632a\u3002\u6162\u5f97\u4ee4\u4eba\u6293\u72c2\uff0c\u4f46\u5b89\u5168\u3002',
    }
  ],
}


// -- D96 \u98de\u673a\u6881->{u('\u5b9d\u6cb3\u6c9f')} --

export const D96_01_CLIFF_DESCENT: GameEvent = {
  id: 'D96-01', category: 'encounter', subtype: 'terrain',
  segments: [], seasons: ['winter', 'summer'],
  isFixed: true,
  narrative: '\u8fd9\u4e0d\u662f\u4e0b\u5c71\u2014\u2014\u8fd9\u662f\u6500\u5ca9\u3002\u53ea\u4e0d\u8fc7\u65b9\u5411\u662f\u53cd\u7684\u3002\u4f60\u9762\u671d\u5ca9\u58c1\uff0c\u811a\u5728\u4e0b\u9762\u60ac\u7a7a\u6478\u7d22\u652f\u70b9\u3002\u8eab\u540e\u5c31\u662f\u51e0\u5341\u7c73\u7684\u5782\u76f4\u843d\u5dee\u3002\u5f80\u4e0b\u770b\u4e00\u773c\uff0c\u80c3\u5c31\u7ffb\u4e0a\u6765\u4e86\u3002',
  choices: [
    {
      id: 'D96-01-1', text: '\u7528\u7ef3\u7d22\u56fa\u5b9a\u4e0b\u964d',
      requiresItem: 'rope',
      consequences: [],
      narrative: '\u4f60\u628a\u7ef3\u7d22\u7cfb\u5728\u7a81\u51fa\u7684\u5ca9\u77f3\u4e0a\uff0c\u80cc\u5bf9\u60ac\u5d16\u4e00\u7c73\u4e00\u7c73\u5730\u653e\u4e0b\u53bb\u3002\u624b\u81c2\u5728\u6296\uff0c\u4f46\u7ef3\u7d22\u4e0d\u4f1a\u9a97\u4f60\u3002',
    },
    {
      id: 'D96-01-2', text: '\u5f92\u624b\u6500\u964d',
      consequences: [],
      narrative: '\u4f60\u6293\u4f4f\u5ca9\u58c1\u4e0a\u6bcf\u4e00\u4e2a\u80fd\u6293\u7684\u4e1c\u897f\u3002\u624b\u6307\u5173\u8282\u6cdb\u767d\uff0c\u6307\u7532\u65ad\u4e86\u4e24\u6839\u3002\u4f46\u4f60\u4e0b\u6765\u4e86\u3002',
      probability: 0.25,
      failNarrative: '\u4f60\u7684\u624b\u6307\u4ece\u5ca9\u58c1\u4e0a\u6ed1\u8131\u3002\u5760\u843d\u7684\u90a3\u4e00\u79d2\uff0c\u4e16\u754c\u5b89\u9759\u4e86\u3002',
      failConsequences: [{ type: 'trigger_death' }],
    },
    {
      id: 'D96-01-3', text: '\u5bfb\u627e\u7ed5\u884c\u8def\u7ebf',
      consequences: [{ type: 'modify_speed_temp', payload: { delta: -2, turns: 1 } }],
      narrative: '\u4f60\u6cbf\u7740\u5d16\u8fb9\u8d70\u4e86\u534a\u5c0f\u65f6\uff0c\u627e\u5230\u4e86\u4e00\u6761\u52c9\u5f3a\u80fd\u8d70\u7684\u659c\u5761\u3002',
      probability: 0.25,
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
      id: 'D96-02-1', text: '\u7528\u7ef3\u7d22\u505a\u8f85\u52a9\u8fc7\u6cb3',
      requiresItem: 'rope',
      consequences: [],
      narrative: '\u4f60\u628a\u7ef3\u7d22\u4e00\u7aef\u7cfb\u5728\u5cb8\u8fb9\u7684\u6811\u4e0a\uff0c\u53e6\u4e00\u7aef\u7ed1\u5728\u8170\u4e0a\u3002\u51b0\u51b7\u7684\u6cb3\u6c34\u6ca1\u8fc7\u5927\u817f\uff0c\u4f46\u7ef3\u7d22\u8ba9\u4f60\u4e0d\u81f3\u4e8e\u88ab\u51b2\u8d70\u3002',
    },
    {
      id: 'D96-02-2', text: '\u627e\u6700\u7a84\u5904\u8df3\u8fc7\u53bb',
      consequences: [],
      narrative: '\u4f60\u52a9\u8dd1\u3001\u8d77\u8df3\u2014\u2014\u811a\u5c16\u582a\u582a\u8e29\u5230\u5bf9\u5cb8\u7684\u77f3\u5934\u4e0a\u3002\u4f60\u8db4\u5728\u5730\u4e0a\u5598\u4e86\u5f88\u4e45\u3002',
      probability: 0.25,
      failNarrative: '\u4f60\u5dee\u4e86\u534a\u6b65\u3002\u51b0\u51b7\u7684\u6cb3\u6c34\u77ac\u95f4\u5305\u88f9\u4e86\u4f60\u3002',
      failConsequences: [{ type: 'add_status', payload: { type: 'hypothermia', speedModifier: -2, turnsRemaining: 3, deathCountdown: 5 } }, { type: 'modify_water', payload: -0.5 }],
    },
    {
      id: 'D96-02-3', text: '\u6cbf\u6cb3\u5cb8\u8d70\u627e\u6d45\u6ee9',
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
      id: 'D96-03-1', text: '\u4e25\u683c\u6309GPS\u65b9\u5411\u780d\u8def\u524d\u8fdb',
      requiresItem: 'gps',
      consequences: [{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }],
      narrative: '\u4f60\u7528\u767b\u5c71\u6756\u62e8\u5f00\u704c\u6728\uff0c\u4e00\u7c73\u4e00\u7c73\u5730\u63a8\u8fdb\u3002\u8138\u4e0a\u3001\u624b\u4e0a\u5168\u662f\u5212\u75d5\u3002',
    },
    {
      id: 'D96-03-2', text: '\u51ed\u76f4\u89c9\u627e\u8def',
      consequences: [],
      narrative: '\u4f60\u9009\u4e86\u770b\u8d77\u6765\u7a00\u758f\u4e00\u70b9\u7684\u65b9\u5411\u2014\u2014\u8fd0\u6c14\u4e0d\u9519\uff0c\u8d70\u5bf9\u4e86\u3002',
      probability: 0.2,
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
  narrative: '\u6838\u6843\u576a\u7684\u4e0b\u64a4\u8def\u6e29\u67d4\u5f97\u4e0d\u50cf\u9ccc\u592a\u3002\u677e\u6811\u6797\u3001\u6eaa\u6d41\u3001\u5076\u5c14\u7684\u9e1f\u53eb\u3002\u5982\u679c\u4e0d\u662f\u817f\u5df2\u7ecf\u5e9f\u4e86\uff0c\u8fd9\u751a\u81f3\u7b97\u662f\u4e00\u6b21\u6109\u5feb\u7684\u6563\u6b65\u3002\n\n\u4f60\u8d70\u4e86\u5f88\u4e45\u5f88\u4e45\u3002\u4e8c\u5341\u516c\u91cc\u5728\u5c71\u91cc\u7684\u611f\u89c9\uff0c\u548c\u57ce\u5e02\u91cc\u5b8c\u5168\u4e0d\u540c\u3002\u4f46\u6bcf\u8d70\u4e00\u6b65\uff0c\u4f60\u90fd\u5728\u8fdc\u79bb\u5371\u9669\u3002',
  choices: [
    {
      id: 'D93-01-1', text: '\u4eab\u53d7\u8fd9\u6bb5\u5b89\u5168\u7684\u8def',
      consequences: [{ type: 'narrative_only' }],
      narrative: '\u4f60\u7b2c\u4e00\u6b21\u653e\u677e\u4e86\u7d27\u7ef7\u7684\u795e\u7ecf\u3002\u547c\u5438\u987a\u7545\u4e86\uff0c\u80a9\u8180\u677e\u4e0b\u6765\u4e86\u3002\u4f60\u8fd8\u6d3b\u7740\u3002',
    }
  ],
}


// -- D95 \u4e07\u4ed9\u9635->{u('\u8001\u53bf\u57ce')} --

export const D95_01_CLIFF_TRAVERSE: GameEvent = {
  id: 'D95-01', category: 'encounter', subtype: 'terrain',
  segments: [], seasons: ['winter', 'summer'],
  isFixed: true,
  narrative: '\u4e0b\u64a4\u8def\u4e0a\u6a2a\u5207\u8fc7\u4e00\u6bb5\u60ac\u5d16\u3002\u8def\u9762\u53ea\u6709\u534a\u7c73\u5bbd\uff0c\u5185\u4fa7\u662f\u5ca9\u58c1\uff0c\u5916\u4fa7\u662f\u770b\u4e0d\u5230\u5e95\u7684\u6df1\u6e0a\u3002\u811a\u4e0b\u7684\u77f3\u5934\u677e\u52a8\u5f97\u50cf\u968f\u65f6\u4f1a\u584c\u3002',
  choices: [
    {
      id: 'D95-01-1', text: '\u7528\u7ef3\u7d22\u505a\u5b89\u5168\u7ef3\u901a\u8fc7',
      requiresItem: 'rope',
      consequences: [],
      narrative: '\u4f60\u628a\u7ef3\u7d22\u7cfb\u5728\u5ca9\u58c1\u4e0a\u65b9\u7684\u7a81\u51fa\u7269\u4e0a\uff0c\u8d34\u7740\u5ca9\u58c1\u4e00\u6b65\u4e00\u6b65\u6a2a\u79fb\u3002\u7ef3\u7d22\u5728\u624b\u91cc\uff0c\u5fc3\u5c31\u5b9a\u4e86\u3002',
    },
    {
      id: 'D95-01-2', text: '\u8d34\u58c1\u6162\u884c',
      consequences: [],
      narrative: '\u4f60\u9762\u671d\u5ca9\u58c1\uff0c\u53cc\u624b\u6293\u7740\u77f3\u5934\u7f1d\uff0c\u811a\u5c16\u6a2a\u7740\u632a\u3002\u6bcf\u4e00\u6b65\u90fd\u5728\u548c\u91cd\u529b\u8d4c\u535a\u3002\u4f46\u4f60\u8d62\u4e86\u3002',
      probability: 0.3,
      failNarrative: '\u811a\u4e0b\u7684\u77f3\u5934\u7a81\u7136\u788e\u88c2\u3002\u4f60\u7684\u8eab\u4f53\u5411\u5916\u503e\u659c\u2014\u2014',
      failConsequences: [{ type: 'trigger_death' }],
    },
    {
      id: 'D95-01-3', text: '\u627e\u5176\u4ed6\u8def',
      consequences: [{ type: 'modify_speed_temp', payload: { delta: -2, turns: 1 } }],
      narrative: '\u4f60\u6cbf\u7740\u5d16\u8fb9\u6765\u56de\u627e\u4e86\u534a\u5c0f\u65f6\uff0c\u7ec8\u4e8e\u53d1\u73b0\u4e00\u6761\u7ed5\u884c\u7684\u5c0f\u8def\u3002\u867d\u7136\u591a\u8d70\u4e86\u4e00\u5927\u622a\uff0c\u4f46\u81f3\u5c11\u4e0d\u7528\u5728\u60ac\u5d16\u4e0a\u8d70\u94a2\u4e1d\u3002',
      probability: 0.2,
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
      id: 'D95-02-1', text: '\u7528\u767b\u5c71\u6756\u63a2\u8def\u6d89\u6c34',
      requiresItem: 'pole',
      consequences: [],
      narrative: '\u6756\u5c16\u5728\u6c34\u4e0b\u8bd5\u63a2\u6bcf\u4e00\u5757\u77f3\u5934\u3002\u4f60\u8e29\u7740\u7a33\u5f53\u7684\u77f3\u5934\uff0c\u4e00\u6b65\u6b65\u8fc7\u4e86\u6cb3\u3002',
    },
    {
      id: 'D95-02-2', text: '\u5c0f\u5fc3\u7ffc\u7ffc\u8d70',
      consequences: [],
      narrative: '\u4f60\u6276\u7740\u65c1\u8fb9\u7684\u77f3\u5934\u8d70\u3002\u811a\u5e95\u6ed1\u4e86\u51e0\u6b21\uff0c\u4f46\u6bcf\u6b21\u90fd\u6293\u4f4f\u4e86\u3002\u6709\u60ca\u65e0\u9669\u3002',
      probability: 0.25,
      failNarrative: '\u811a\u5e95\u7a81\u7136\u4e00\u6ed1\u2014\u2014\u4f60\u6574\u4e2a\u4eba\u6454\u8fdb\u4e86\u6cb3\u91cc\u3002\u51b0\u51b7\u7684\u6cb3\u6c34\u6d78\u900f\u4e86\u5168\u8eab\u3002',
      failConsequences: [{ type: 'add_status', payload: { type: 'hypothermia', speedModifier: -1, turnsRemaining: 2, deathCountdown: 6 } }],
    }
  ],
}


// -- D88 \u5927\u7237\u6d77->{u('\u94c1\u7532\u6811')} --

export const D88_01_DENSE_FOREST: GameEvent = {
  id: 'D88-01', category: 'encounter', subtype: 'terrain',
  segments: [], seasons: ['winter', 'summer'],
  isFixed: true,
  narrative: '\u4ece\u5927\u7237\u6d77\u5f80\u5357\u4e0b\u64a4\uff0c\u5f88\u5feb\u5c31\u8fdb\u5165\u4e86\u5bc6\u4e0d\u900f\u98ce\u7684\u539f\u59cb\u68ee\u6797\u3002\u6811\u51a0\u906e\u853d\u4e86\u5929\u7a7a\uff0cGPS\u4fe1\u53f7\u5728\u6811\u6797\u91cc\u65ad\u65ad\u7eed\u7eed\u3002\u8def\u9762\u88ab\u843d\u53f6\u548c\u67af\u679d\u8986\u76d6\uff0c\u6839\u672c\u5206\u4e0d\u6e05\u54ea\u91cc\u662f\u8def\u54ea\u91cc\u4e0d\u662f\u8def\u3002\n\n\u4f60\u60f3\u8d77\u4e86\u90a3\u4e2a\u5728\u8fd9\u7247\u68ee\u6797\u91cc\u8ff7\u5931\u4e86\u516b\u5929\u7684\u4eba\u3002\u4ed6\u6700\u540e\u9760\u5403\u7af9\u53f6\u548c\u6811\u76ae\u6d3b\u4e86\u4e0b\u6765\u3002',
  choices: [
    {
      id: 'D88-01-1', text: '\u9891\u7e41\u68c0\u67e5GPS\uff0c\u6bcf\u8d7050\u7c73\u786e\u8ba4\u4e00\u6b21\u65b9\u5411',
      requiresItem: 'gps',
      consequences: [{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }],
      narrative: '\u4f60\u50cf\u504f\u6267\u72c2\u4e00\u6837\u6bcf\u8d70\u4e00\u5c0f\u6bb5\u5c31\u638f\u51faGPS\u3002\u6162\uff0c\u4f46\u4f60\u77e5\u9053\u81ea\u5df1\u5728\u54ea\u3002',
    },
    {
      id: 'D88-01-2', text: '\u6cbf\u7740\u6eaa\u6d41\u65b9\u5411\u8d70',
      consequences: [],
      narrative: '\u6c34\u603b\u662f\u5f80\u4e0b\u6d41\u7684\u3002\u4f60\u8ddf\u7740\u6eaa\u6d41\u8d70\uff0c\u6eaa\u6d41\u5e26\u4f60\u7a7f\u8fc7\u4e86\u5bc6\u6797\u3002',
      probability: 0.3,
      failNarrative: '\u4f60\u8ddf\u7740\u6eaa\u6d41\u8d70\u2014\u2014\u4f46\u8fd9\u6761\u6eaa\u6d41\u62d0\u8fdb\u4e86\u4e00\u6761\u8d8a\u6765\u8d8a\u7a84\u7684\u5c71\u6c9f\u3002\u4f60\u4e0d\u5f97\u4e0d\u539f\u8def\u8fd4\u56de\u3002',
      failConsequences: [{ type: 'modify_speed_temp', payload: { delta: -2, turns: 1 } }],
    },
    {
      id: 'D88-01-3', text: '\u51ed\u611f\u89c9\u5f80\u4e0b\u8d70',
      consequences: [],
      narrative: '\u4e0b\u5c31\u5bf9\u4e86\u3002\u4f60\u9009\u4e86\u4e00\u4e2a\u770b\u8d77\u6765\u5411\u4e0b\u7684\u65b9\u5411\uff0c\u8fd0\u6c14\u4e0d\u9519\u3002',
      probability: 0.25,
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
      id: 'D88-02-1', text: '\u9a91\u5728\u6811\u5e72\u4e0a\u632a\u8fc7\u53bb',
      consequences: [],
      narrative: '\u4f60\u5750\u5728\u6811\u5e72\u4e0a\uff0c\u53cc\u624b\u6293\u7740\u6811\u76ae\uff0c\u4e00\u70b9\u4e00\u70b9\u5f80\u5bf9\u5cb8\u632a\u3002\u88e4\u5b50\u6e7f\u4e86\uff0c\u4f46\u8fc7\u53bb\u4e86\u3002',
      probability: 0.3,
      failNarrative: '\u6811\u5e72\u7a81\u7136\u8f6c\u52a8\u4e86\u4e00\u4e0b\u2014\u2014\u4f60\u6b7b\u6b7b\u62b1\u4f4f\u6811\u5e72\uff0c\u82b1\u4e86\u4e94\u5206\u949f\u624d\u7a33\u4f4f\u3002\u88e4\u5b50\u6e7f\u900f\u4e86\u3002',
      failConsequences: [{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }],
    },
    {
      id: 'D88-02-2', text: '\u7ad9\u7740\u8d70\u8fc7\u53bb',
      consequences: [],
      narrative: '\u4f60\u5f20\u5f00\u53cc\u81c2\u4fdd\u6301\u5e73\u8861\u3002\u4e00\u6b65\uff0c\u4e24\u6b65\u2026\u2026\u4e09\u6b65\u2014\u2014\u4f60\u5230\u4e86\u5bf9\u5cb8\u3002',
      probability: 0.25,
      failNarrative: '\u4f60\u5f20\u5f00\u53cc\u81c2\u4fdd\u6301\u5e73\u8861\u3002\u4e00\u6b65\uff0c\u4e24\u6b65\u2014\u2014\u811a\u5e95\u7a81\u7136\u6253\u6ed1\u3002\u51b0\u51b7\u7684\u6cb3\u6c34\u541e\u6ca1\u4e86\u4f60\u3002',
      failConsequences: [{ type: 'add_status', payload: { type: 'hypothermia', speedModifier: -1, turnsRemaining: 2, deathCountdown: 6 } }],
    },
    {
      id: 'D88-02-3', text: '\u4e0d\u8d70\u72ec\u6728\u6865\uff0c\u6d89\u6c34\u8fc7\u6cb3',
      consequences: [{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }],
      narrative: '\u4f60\u653e\u5f03\u4e86\u90a3\u6839\u770b\u8d77\u6765\u968f\u65f6\u4f1a\u65ad\u7684\u6811\u5e72\uff0c\u76f4\u63a5\u8e5a\u8fdb\u4e86\u51b0\u51b7\u7684\u6cb3\u6c34\u91cc\u3002\u5b89\u5168\uff0c\u4f46\u51b7\u5f97\u8981\u547d\u3002',
    }
  ],
}

