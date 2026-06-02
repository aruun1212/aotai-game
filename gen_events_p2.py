#!/usr/bin/env python3
# gen_events_p2.py - Append segment-specific events to events.ts
import os

path = os.path.join('src', 'data', 'events.ts')
f = open(path, 'a', encoding='utf-8')

f.write(r"""
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
      probability: 0.7,
      narrative: '\u4f60\u9009\u4e86\u770b\u8d77\u6765\u597d\u8d70\u7684\u90a3\u6761\u2014\u2014\u8fd0\u6c14\u4e0d\u9519\uff0c\u8d70\u5bf9\u4e86\u3002',
      failNarrative: '\u4f60\u8d70\u9519\u4e86\uff0c\u7ed5\u4e86\u4e00\u5927\u5708\u624d\u56de\u5230\u6b63\u8def\u3002',
      failConsequences: [{ type: 'skip_turn' }],
    },
    {
      id: 'S01-02-3', text: '\u505c\u4e0b\u6765\u4ed4\u7ec6\u89c2\u5bdf\u8def\u9762\u75d5\u8ff9',
      consequences: [{ type: 'narrative_only' }],
      probability: 0.9,
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
      probability: 0.5,
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
      probability: 0.85,
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

""")

f.close()
print(f'Segment events S01-S03 appended: {os.path.getsize(path)} bytes')
