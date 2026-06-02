# -*- coding: utf-8 -*-
"""Generate U13-U27 events as TypeScript with \\uXXXX escapes."""

def esc(s):
    """Escape all non-ASCII to \\uXXXX"""
    return ''.join(f'\\u{ord(c):04x}' if ord(c) > 127 else c for c in s)

EVENTS = [
    ("U13", "encounter", "weather", [1,2,3,4,5,6,7,8,9,10,11,12], None,
     "天色突然暗下来，乌云从西边翻涌而至。大颗的雨滴砸在脸上——暴雨来了。你的背包外层已经开始渗水。",
     [("U13-1", "用防水袋保护装备", "dry_bag", None, None, "[]",
       "你迅速把重要物资塞进防水袋。背包外面湿了，里面依然干燥。", None),
      ("U13-2", "找块岩壁躲一会儿", None, None, None,
       "[{ type: 'skip_turn' }]",
       "你缩在一块突出的岩壁下等雨停。损失了一些时间，但至少没有淋透。", None),
      ("U13-3", "冒雨继续走", None, 0.4, None,
       "[{ type: 'add_status', payload: { type: 'wet', speedModifier: -1, turnsRemaining: 3 } }]",
       "还能走。衣服湿透了，有点冷，但没什么大事。",
       "雨比想象中大得多。体温在快速下降，冷到发抖。"),
     ]),
    ("U14", "encounter", "terrain", [2,3,4,5,6,7,8,9], None,
     "前方的路完全被一片乱石覆盖。每块石头都在你踩上去的瞬间摇晃，像是故意在跟你开玩笑。",
     [("U14-1", "用登山杖试探每一步", "pole", None, None, "[]",
       "杖尖敲击石面的声音回响在山谷里。慢，但稳。", None),
      ("U14-2", "小心翼翼地踩稳走", None, 0.5, None, "[]",
       "你四肢并用，终于穿过了这片乱石区。",
       "一块石头突然翻转——你的脚卡在石缝里扭了一下。"),
     ]),
    ("U15", "encounter", "discovery", [1,2,3,4,5,6,7,8,9,11,12], None,
     "路边有个被遗弃的塑料瓶，里面还有小半瓶水。瓶身上用记号笔写着：给后面的人。",
     [("U15-1", "喝掉它", None, None, None,
       "[{ type: 'modify_water', payload: 0.3 }]",
       "水有点温热，带着阳光的味道。你默默感谢了那个不知名的人。", None),
      ("U15-2", "留给更需要的人", None, None, None, "[]",
       "你把瓶子放回原处。也许后面有人比你更需要它。", None),
     ]),
    ("U16", "encounter", "body", [3,4,5,6,7,8,9], None,
     "连续的上坡让你的大腿灌了铅一样重。每迈一步都要消耗巨大的意志力。你的身体在抗议。",
     [("U16-1", "坐下来休息五分钟", None, None, None,
       "[{ type: 'skip_turn' }]",
       "你坐在石头上大口喘气。五分钟后，腿没那么酸了。", None),
      ("U16-2", "吃点东西补充体力", None, None, None,
       "[{ type: 'consume_item', payload: 'food' }]",
       "压缩饼干在嘴里嚼得咔咔响。糖分让你重新有了力气。", None),
      ("U16-3", "咬牙硬撑", None, 0.5, None, "[]",
       "你用意志力压过了身体的警报。还能走。",
       "腿部肌肉开始不受控制地颤抖。你必须放慢速度。"),
     ]),
    ("U17", "encounter", "equipment", [1,2,3,4,5,6,7,8,9,11,12], None,
     "你低头发现鞋带松了——不对，是鞋底边缘开始脱胶了。这双鞋撑不了多久了。",
     [("U17-1", "用绳子临时绑住", "rope", None, None, "[]",
       "你截了一小段绳子把鞋底缠紧。不好看，但能用。", None),
      ("U17-2", "小心走，尽量别加速", None, 0.6, None, "[]",
       "只要不跑，应该还能撑到终点。",
       "刚走几步鞋底彻底翻开了。你不得不放慢脚步。"),
     ]),
    ("U18", "encounter", "weather", [3,4,5,6,7,8,9,10], None,
     "浓雾突然从山谷里升上来，十米之外完全看不见任何东西。GPS信号也变得断断续续。",
     [("U18-1", "依靠GPS航迹继续", "gps", None, None, "[]",
       "GPS虽然信号不稳，但足够你辨认方向。你在白茫茫中摸索前进。", None),
      ("U18-2", "原地等雾散", None, None, None,
       "[{ type: 'skip_turn' }]",
       "你坐在一块大石头上等待。半小时后，雾气薄了一些，能看清路了。", None),
      ("U18-3", "凭感觉往前走", None, 0.3, None, "[]",
       "你运气不错，走了一段后雾突然散了，脚下还是正路。",
       "你走了不知多久，发现周围的地形完全陌生。你迷路了。"),
     ]),
    ("U19", "encounter", "discovery", [2,3,4,5,6,7,8,9], None,
     "石缝间有一面褪色的经幡在风中猎猎作响。下面压着一块小石头，石头上刻着一行字：平安。",
     [("U19-1", "双手合十默念", None, None, None, "[]",
       "你不知道是谁留下的。但此刻，这两个字让你心里踏实了一些。", None),
      ("U19-2", "也放一块小石头", None, None, None, "[]",
       "你在旁边加了一块石头。也许后来者也需要这份安慰。", None),
     ]),
    ("U20", "encounter", "body", [1,2,3,4,5,6,7,8,9,11], None,
     "你突然觉得头疼欲裂，太阳穴突突地跳。眼前的景色开始微微旋转。",
     [("U20-1", "吃药缓解", "first_aid", None, None, "[]",
       "布洛芬下肚十分钟后，头痛缓解了不少。", None),
      ("U20-2", "喝水休息", None, None, None,
       "[{ type: 'modify_water', payload: -0.2 }]",
       "你大口喝了几口水，在阴凉处坐了一会儿。好多了。", None),
      ("U20-3", "忍着继续走", None, 0.4, None, "[]",
       "头痛在走了一会儿后自己消退了。",
       "头越来越痛，视线模糊，你不得不放慢脚步。"),
     ]),
    ("U21", "encounter", "terrain", [4,5,6,7,8], None,
     "一段近乎垂直的岩壁挡在面前。上面有人打了两个岩钉，挂着一截旧绳子，看起来年代久远。",
     [("U21-1", "用自己的绳子攀登", "rope", None, None, "[]",
       "你把绳子系在岩钉上，三点固定慢慢向上。安全抵达了上方平台。", None),
      ("U21-2", "抓旧绳子往上爬", None, 0.3, None, "[]",
       "旧绳子居然还挺结实。你手脚并用爬了上去。",
       "爬到一半绳子突然崩断！你重重摔了下来，手掌和膝盖都擦伤了。"),
      ("U21-3", "绕路寻找其他通道", None, None, None,
       "[{ type: 'skip_turn' }]",
       "你沿着岩壁走了好一会儿，终于找到一条可以绕上去的小路。", None),
     ]),
    ("U22", "encounter", "equipment", [1,2,3,4,5,6,7,8,9,11,12], None,
     "你打开背包想拿东西时发现——水壶的盖子不知什么时候松了，水洒了一些在包里。",
     [("U22-1", "赶紧拧紧，检查损失", None, None, None,
       "[{ type: 'modify_water', payload: -0.2 }]",
       "损失了大约0.2升水。你暗骂一声，把盖子拧死。", None),
      ("U22-2", "把浸湿的东西拿出来晾干", None, None, None,
       "[{ type: 'modify_water', payload: -0.2 }, { type: 'skip_turn' }]",
       "你停下来把湿掉的东西摊开晾。水损失不大，但耽误了时间。", None),
     ]),
    ("U23", "encounter", "weather", [5,6,7,8,9,10], None,
     "一阵突如其来的冷风从山脊吹过，温度骤降。你的手指开始发麻，鼻尖冻得发红。",
     [("U23-1", "赶紧穿上保暖衣物", "warm_clothes", None, None, "[]",
       "羽绒服裹上身的一瞬间，温暖重新包裹了你。继续走。", None),
      ("U23-2", "加快步伐用运动产热", None, 0.5, None, "[]",
       "你加快步伐，身体确实暖和了起来。",
       "走了一会儿风更大了，运动产生的热量根本不够。你开始打寒颤。"),
     ]),
    ("U24", "encounter", "discovery", [3,4,5,6,7,8,9], None,
     "地上有一双被遗弃的登山鞋，鞋底已经磨穿了。旁边还有一只空的矿泉水瓶和几张压缩饼干的包装纸。",
     [("U24-1", "检查附近有没有其他线索", None, None, None, "[]",
       "除了这些垃圾之外什么也没有。你收拾好心情继续前进。", None),
      ("U24-2", "不看了，继续走", None, None, None, "[]",
       "你移开了目光。山上这样的痕迹太多了。", None),
     ]),
    ("U25", "encounter", "terrain", [2,3,4,5,6,7,8,9,11], None,
     "脚下的泥土变得异常湿滑——昨夜的雨把这段路变成了一条泥河。每一步都可能滑倒。",
     [("U25-1", "用登山杖保持平衡", "pole", None, None, "[]",
       "杖尖插进泥里提供额外支撑。虽然慢，但你稳稳地走过了这段路。", None),
      ("U25-2", "手脚并用爬过去", None, 0.5, None, "[]",
       "裤子和手套全是泥，但你安全通过了。",
       "你一脚踩滑，整个人摔进了泥坑里。站起来时发现脚踝扭了。"),
     ]),
    ("U26", "encounter", "body", [1,2,3,4,5,6,7,8,9,11,12], None,
     "胃在抽搐——你已经很久没吃东西了。手开始抖，走路也开始发飘。低血糖的症状。",
     [("U26-1", "吃东西补充能量", None, None, None,
       "[{ type: 'consume_item', payload: 'food' }]",
       "食物下肚后，身体渐渐恢复了力气。以后不能拖这么久了。", None),
      ("U26-2", "喝几口水顶一顶", None, None, None,
       "[{ type: 'modify_water', payload: -0.1 }]",
       "水勉强压下了胃部的翻搅感，但身体依然虚弱。", None),
      ("U26-3", "忍着继续走", None, 0.3, None, "[]",
       "你咬牙撑过了这阵虚弱感。",
       "眼前一黑，你差点摔倒。身体已经到了极限。"),
     ]),
    ("U27", "encounter", "equipment", [3,4,5,6,7,8,9], None,
     "你低头发现登山杖的杖尖碳钉已经磨平了，杵在石头上直打滑。继续用可能更危险。",
     [("U27-1", "收起登山杖，用手保持平衡", None, 0.5, None, "[]",
       "没有杖也能走，只是要更小心一些。",
       "没有登山杖支撑，你的速度明显慢了下来。"),
      ("U27-2", "继续用，小心点就行", None, 0.4, None, "[]",
       "虽然打滑，但勉强还能用。",
       "杖尖在一块岩石上猛地一滑——整根杖弹出去，杖身撞在石头上裂了。"),
     ]),
]

def gen_ts():
    lines = []
    for (eid, cat, sub, segs, cond, narr, choices) in EVENTS:
        varname = f"{eid}_EVENT"
        lines.append(f"export const {varname}: GameEvent = {{")
        lines.append(f"  id: '{eid}', category: '{cat}', subtype: '{sub}',")
        lines.append(f"  segments: {segs}, seasons: ['winter', 'summer'],")
        lines.append(f"  isFixed: false,")
        lines.append(f"  narrative: '{esc(narr)}',")
        lines.append(f"  choices: [")
        for (cid, text, req, prob, cost, cons, narr2, fail_narr) in choices:
            lines.append(f"    {{")
            lines.append(f"      id: '{cid}', text: '{esc(text)}',")
            if req:
                lines.append(f"      requiresItem: '{req}',")
            if prob is not None:
                lines.append(f"      probability: {prob},")
            lines.append(f"      consequences: {cons},")
            if fail_narr:
                fail_cons = "[]"
                if sub == "terrain" and "扭" in (fail_narr or ""):
                    fail_cons = "[{ type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: -1 } }]"
                elif "迷路" in (fail_narr or ""):
                    fail_cons = "[{ type: 'trigger_lost' }]"
                elif "速度" in (fail_narr or "") or "慢" in (fail_narr or "") or "寒颤" in (fail_narr or ""):
                    fail_cons = "[{ type: 'add_status', payload: { type: 'slow', speedModifier: -1, turnsRemaining: 2 } }]"
                elif "擦伤" in (fail_narr or "") or "摔" in (fail_narr or ""):
                    fail_cons = "[{ type: 'add_status', payload: { type: 'injury', speedModifier: -2, turnsRemaining: 3 } }]"
                elif "极限" in (fail_narr or "") or "颤抖" in (fail_narr or ""):
                    fail_cons = "[{ type: 'add_status', payload: { type: 'fatigue', speedModifier: -1, turnsRemaining: 2 } }]"
                elif "裂" in (fail_narr or ""):
                    fail_cons = "[{ type: 'damage_item', payload: 'pole' }]"
                elif "头" in (fail_narr or "") and "痛" in (fail_narr or ""):
                    fail_cons = "[{ type: 'add_status', payload: { type: 'headache', speedModifier: -1, turnsRemaining: 2 } }]"
                elif "冷" in (fail_narr or "") or "体温" in (fail_narr or ""):
                    fail_cons = "[{ type: 'add_status', payload: { type: 'cold', speedModifier: -1, turnsRemaining: 4 } }]"
                lines.append(f"      failConsequences: {fail_cons},")
                lines.append(f"      failNarrative: '{esc(fail_narr)}',")
            lines.append(f"      narrative: '{esc(narr2)}',")
            lines.append(f"    }},")
        lines.append(f"  ],")
        lines.append(f"}}")
        lines.append(f"")
    return "\n".join(lines)

if __name__ == "__main__":
    content = gen_ts()
    out = r"C:\Users\wuxijin01\PyCharmMiscProject\aotai-game\src\data\events_u13_u27.txt"
    with open(out, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated {len(EVENTS)} events, {len(content)} chars")
