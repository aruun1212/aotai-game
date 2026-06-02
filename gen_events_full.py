#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# gen_events_full.py - Generate complete events.ts
# Run: python gen_events_full.py

import os, json

path = os.path.join('src', 'data', 'events.ts')

# We build the entire TS file as a single string.
# Chinese characters: use \uXXXX in the TS string literals
# (Python will interpret them, but since we write as UTF-8, result is correct)

TS = r'''import type { GameEvent, Season } from '@/models/types'

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
'''

with open(path, 'w', encoding='utf-8') as f:
    f.write(TS)
print(f'Phase 1 done: {os.path.getsize(path)} bytes')
