#!/usr/bin/env python3
# gen_events.py - Generate complete events.ts
# All Chinese text encoded as unicode escapes to avoid encoding issues

import os

def w(f, s):
    f.write(s)
    f.write('\n')

path = os.path.join('src', 'data', 'events.ts')
f = open(path, 'w', encoding='utf-8')

# Header
w(f, "import type { GameEvent, Season } from '@/models/types'")
w(f, '')
w(f, '// ==========================================================')
w(f, '// Universal Events U01 ~ U12')
w(f, '// ==========================================================')

# U01
w(f, '')
w(f, 'export const U01_ANKLE_SPRAIN: GameEvent = {')
w(f, "  id: 'U01', category: 'encounter', subtype: 'body',")
w(f, "  segments: [1,2,3,4,5,6,7,8,9,10,11,12], seasons: ['winter','summer'],")
w(f, '  isFixed: false,')
w(f, "  narrative: '\u4e0b\u5761\u65f6\u53f3\u811a\u8e29\u5728\u4e00\u5757\u677e\u52a8\u7684\u788e\u77f3\u4e0a\uff0c\u811a\u8e1d\u731b\u5730\u5411\u5185\u7ffb\u6298\u3002\u4e00\u9635\u5267\u75db\u4ece\u811a\u8e1d\u8513\u5ef6\u5230\u5c0f\u817f\u2014\u2014\u4f60\u626d\u4f24\u4e86\u3002',")
w(f, '  choices: [')
w(f, '    {')
w(f, "      id: 'U01-1', text: '\u4f7f\u7528\u6025\u6551\u5305\u5904\u7406', requiresItem: 'firstaid',")
w(f, "      itemCost: { defId: 'firstaid', count: 1 },")
w(f, '      consequences: [')
w(f, "        { type: 'consume_item', payload: 'firstaid' },")
w(f, "        { type: 'remove_status', payload: 'sprain' },")
w(f, '      ],')
w(f, "      narrative: '\u4f60\u719f\u7ec3\u5730\u7f20\u4e0a\u7ef7\u5e26\uff0c\u51b0\u6577\u5341\u4e94\u5206\u949f\u3002\u8fd8\u80fd\u8d70\u3002',")
w(f, '    },')
w(f, '    {')
w(f, "      id: 'U01-2', text: '\u54ac\u7259\u7ee7\u7eed\u8d70',")
w(f, '      consequences: [')
w(f, "        { type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: -1 } },")
w(f, '      ],')
w(f, "      narrative: '\u4f60\u4e00\u7638\u4e00\u62d0\u5730\u7ad9\u8d77\u6765\u3002\u6bcf\u4e00\u6b65\u90fd\u5728\u63d0\u9192\u4f60\u8fd9\u4e2a\u9519\u8bef\u3002',")
w(f, '    },')
w(f, '  ],')
w(f, '}')

f.close()
print(f'Written to {path}')
