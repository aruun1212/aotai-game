# -*- coding: utf-8 -*-
"""Generate 15 new universal events (U13-U27) for the Ao Tai game."""

EVENTS = [
    {
        "id": "U13", "category": "encounter", "subtype": "weather",
        "segments": [1,2,3,4,5,6,7,8,9,10,11,12],
        "narrative": "天色突然暗下来，乌云从西边翻涌而至。大颗的雨滴砸在脸上——暴雨来了。你的背包外层已经开始渗水。",
        "choices": [
            {"id": "U13-1", "text": "用防水袋保护装备", "requiresItem": "dry_bag",
             "consequences": [], "narrative": "你迅速把重要物资塞进防水袋。背包外面湿了，里面依然干燥。"},
            {"id": "U13-2", "text": "找块岩壁躲一会儿",
             "consequences": [{"type": "skip_turn"}],
             "narrative": "你缩在一块突出的岩壁下等雨停。损失了一些时间，但至少没有淋透。"},
            {"id": "U13-3", "text": "冒雨继续走",
             "probability": 0.4,
             "consequences": [{"type": "add_status", "payload": {"type": "wet", "speedModifier": -1, "turnsRemaining": 3}}],
             "failConsequences": [{"type": "add_status", "payload": {"type": "cold", "speedModifier": -1, "turnsRemaining": 4}}],
             "narrative": "还能走。衣服湿透了，有点冷，但没什么大事。",
             "failNarrative": "雨比想象中大得多。体温在快速下降，冷到发抖。"},
        ]
    },
    {
        "id": "U14", "category": "encounter", "subtype": "terrain",
        "segments": [2,3,4,5,6,7,8,9],
        "narrative": "前方的路完全被一片乱石覆盖。每块石头都在你踩上去的瞬间摇晃，像是故意在跟你开玩笑。",
        "choices": [
            {"id": "U14-1", "text": "用登山杖试探每一步", "requiresItem": "pole",
             "consequences": [], "narrative": "杖尖敲击石面的声音回响在山谷里。慢，但稳。"},
            {"id": "U14-2", "text": "小心翼翼地踩稳走",
             "probability": 0.5,
             "consequences": [],
             "failConsequences": [{"type": "add_status", "payload": {"type": "sprain", "speedModifier": -1, "turnsRemaining": -1}}],
             "narrative": "你四肢并用，终于穿过了这片乱石区。",
             "failNarrative": "一块石头突然翻转——你的脚卡在石缝里扭了一下。"},
        ]
    },
    {
        "id": "U15", "category": "encounter", "subtype": "discovery",
        "segments": [1,2,3,4,5,6,7,8,9,11,12],
        "narrative": "路边有个被遗弃的塑料瓶，里面还有小半瓶水。瓶身上用记号笔写着："给后面的人。"",
        "choices": [
            {"id": "U15-1", "text": "喝掉它",
             "consequences": [{"type": "modify_water", "payload": 0.3}],
             "narrative": "水有点温热，带着阳光的味道。你默默感谢了那个不知名的人。"},
            {"id": "U15-2", "text": "留给更需要的人",
             "consequences": [],
             "narrative": "你把瓶子放回原处。也许后面有人比你更需要它。"},
        ]
    },
    {
        "id": "U16", "category": "encounter", "subtype": "body",
        "segments": [3,4,5,6,7,8,9],
        "narrative": "连续的上坡让你的大腿灌了铅一样重。每迈一步都要消耗巨大的意志力。你的身体在抗议。",
        "choices": [
            {"id": "U16-1", "text": "坐下来休息五分钟",
             "consequences": [{"type": "skip_turn"}],
             "narrative": "你坐在石头上大口喘气。五分钟后，腿没那么酸了。"},
            {"id": "U16-2", "text": "吃点东西补充体力",
             "consequences": [{"type": "consume_item", "payload": "food"}],
             "narrative": "压缩饼干在嘴里嚼得咔咔响。糖分让你重新有了力气。"},
            {"id": "U16-3", "text": "咬牙硬撑",
             "probability": 0.5,
             "consequences": [],
             "failConsequences": [{"type": "add_status", "payload": {"type": "fatigue", "speedModifier": -1, "turnsRemaining": 2}}],
             "narrative": "你用意志力压过了身体的警报。还能走。",
             "failNarrative": "腿部肌肉开始不受控制地颤抖。你必须放慢速度。"},
        ]
    },
    {
        "id": "U17", "category": "encounter", "subtype": "equipment",
        "segments": [1,2,3,4,5,6,7,8,9,11,12],
        "narrative": "你低头发现鞋带松了——不对，是鞋底边缘开始脱胶了。这双鞋撑不了多久了。",
        "choices": [
            {"id": "U17-1", "text": "用绳子临时绑住",
             "requiresItem": "rope",
             "consequences": [],
             "narrative": "你截了一小段绳子把鞋底缠紧。不好看，但能用。"},
            {"id": "U17-2", "text": "小心走，尽量别加速",
             "probability": 0.6,
             "consequences": [],
             "failConsequences": [{"type": "add_status", "payload": {"type": "slow", "speedModifier": -1, "turnsRemaining": 3}}],
             "narrative": "只要不跑，应该还能撑到终点。",
             "failNarrative": "刚走几步鞋底彻底翻开了。你不得不放慢脚步，每一步都小心翼翼。"},
        ]
    },
    {
        "id": "U18", "category": "encounter", "subtype": "weather",
        "segments": [3,4,5,6,7,8,9,10],
        "narrative": "浓雾突然从山谷里升上来，十米之外完全看不见任何东西。GPS 信号也变得断断续续。",
        "choices": [
            {"id": "U18-1", "text": "依靠 GPS 航迹继续", "requiresItem": "gps",
             "consequences": [],
             "narrative": "GPS 虽然信号不稳，但足够你辨认方向。你在白茫茫中摸索前进。"},
            {"id": "U18-2", "text": "原地等雾散",
             "consequences": [{"type": "skip_turn"}],
             "narrative": "你坐在一块大石头上等待。半小时后，雾气薄了一些，能看清路了。"},
            {"id": "U18-3", "text": "凭感觉往前走",
             "probability": 0.3,
             "consequences": [],
             "failConsequences": [{"type": "trigger_lost"}],
             "narrative": "你运气不错，走了一段后雾突然散了，脚下还是正路。",
             "failNarrative": "你走了不知多久，发现周围的地形完全陌生。你迷路了。"},
        ]
    },
    {
        "id": "U19", "category": "encounter", "subtype": "discovery",
        "segments": [2,3,4,5,6,7,8,9],
        "narrative": "石缝间有一面褪色的经幡在风中猎猎作响。下面压着一块小石头，石头上刻着一行字："平安"。",
        "choices": [
            {"id": "U19-1", "text": "双手合十默念",
             "consequences": [],
             "narrative": "你不知道是谁留下的。但此刻，这两个字让你心里踏实了一些。"},
            {"id": "U19-2", "text": "也放一块小石头",
             "consequences": [],
             "narrative": "你在旁边加了一块石头。也许后来者也需要这份安慰。"},
        ]
    },
    {
        "id": "U20", "category": "encounter", "subtype": "body",
        "segments": [1,2,3,4,5,6,7,8,9,11],
        "narrative": "你突然觉得头疼欲裂，太阳穴突突地跳。眼前的景色开始微微旋转。",
        "choices": [
            {"id": "U20-1", "text": "吃药缓解", "requiresItem": "first_aid",
             "consequences": [],
             "narrative": "布洛芬下肚十分钟后，头痛缓解了不少。"},
            {"id": "U20-2", "text": "喝水休息",
             "consequences": [{"type": "modify_water", "payload": -0.2}],
             "narrative": "你大口喝了几口水，在阴凉处坐了一会儿。好多了。"},
            {"id": "U20-3", "text": "忍着继续走",
             "probability": 0.4,
             "consequences": [],
             "failConsequences": [{"type": "add_status", "payload": {"type": "headache", "speedModifier": -1, "turnsRemaining": 2}}],
             "narrative": "头痛在走了一会儿后自己消退了。",
             "failNarrative": "头越来越痛，视线模糊，你不得不放慢脚步。"},
        ]
    },
    {
        "id": "U21", "category": "encounter", "subtype": "terrain",
        "segments": [4,5,6,7,8],
        "narrative": "一段近乎垂直的岩壁挡在面前。上面有人打了两个岩钉，挂着一截旧绳子，看起来年代久远。",
        "choices": [
            {"id": "U21-1", "text": "用自己的绳子攀登", "requiresItem": "rope",
             "consequences": [],
             "narrative": "你把绳子系在岩钉上，三点固定慢慢向上。安全抵达了上方平台。"},
            {"id": "U21-2", "text": "抓旧绳子往上爬",
             "probability": 0.3,
             "consequences": [],
             "failConsequences": [{"type": "add_status", "payload": {"type": "injury", "speedModifier": -2, "turnsRemaining": 3}}],
             "narrative": "旧绳子居然还挺结实。你手脚并用爬了上去。",
             "failNarrative": "爬到一半绳子突然崩断！你重重摔了下来，手掌和膝盖都擦伤了。"},
            {"id": "U21-3", "text": "绕路寻找其他通道",
             "consequences": [{"type": "skip_turn"}],
             "narrative": "你沿着岩壁走了好一会儿，终于找到一条可以绕上去的小路。"},
        ]
    },
    {
        "id": "U22", "category": "encounter", "subtype": "equipment",
        "segments": [1,2,3,4,5,6,7,8,9,11,12],
        "narrative": "你打开背包想拿东西时发现——水壶的盖子不知什么时候松了，水洒了一些在包里。",
        "choices": [
            {"id": "U22-1", "text": "赶紧拧紧，检查损失",
             "consequences": [{"type": "modify_water", "payload": -0.2}],
             "narrative": "损失了大约0.2升水。你暗骂一声，把盖子拧死。"},
            {"id": "U22-2", "text": "把浸湿的东西拿出来晾干",
             "consequences": [{"type": "modify_water", "payload": -0.2}, {"type": "skip_turn"}],
             "narrative": "你停下来把湿掉的东西摊开晾。水损失不大，但耽误了时间。"},
        ]
    },
    {
        "id": "U23", "category": "encounter", "subtype": "weather",
        "segments": [5,6,7,8,9,10],
        "narrative": "一阵突如其来的冷风从山脊吹过，温度骤降。你的手指开始发麻，鼻尖冻得发红。",
        "choices": [
            {"id": "U23-1", "text": "赶紧穿上保暖衣物", "requiresItem": "warm_clothes",
             "consequences": [],
             "narrative": "羽绒服裹上身的一瞬间，温暖重新包裹了你。继续走。"},
            {"id": "U23-2", "text": "加快步伐用运动产热",
             "probability": 0.5,
             "consequences": [],
             "failConsequences": [{"type": "add_status", "payload": {"type": "cold", "speedModifier": -1, "turnsRemaining": 3}}],
             "narrative": "你加快步伐，身体确实暖和了起来。",
             "failNarrative": "走了一会儿风更大了，运动产生的热量根本不够。你开始打寒颤。"},
        ]
    },
    {
        "id": "U24", "category": "encounter", "subtype": "discovery",
        "segments": [3,4,5,6,7,8,9],
        "narrative": "地上有一双被遗弃的登山鞋，鞋底已经磨穿了。旁边还有一只空的矿泉水瓶和几张压缩饼干的包装纸。有人在这里休息过——但不知道有没有走出去。",
        "choices": [
            {"id": "U24-1", "text": "检查附近有没有其他线索",
             "consequences": [],
             "narrative": "除了这些垃圾之外什么也没有。你收拾好心情继续前进。"},
            {"id": "U24-2", "text": "不看了，继续走",
             "consequences": [],
             "narrative": "你移开了目光。山上这样的痕迹太多了。"},
        ]
    },
    {
        "id": "U25", "category": "encounter", "subtype": "terrain",
        "segments": [2,3,4,5,6,7,8,9,11],
        "narrative": "脚下的泥土变得异常湿滑——昨夜的雨把这段路变成了一条泥河。每一步都可能滑倒。",
        "choices": [
            {"id": "U25-1", "text": "用登山杖保持平衡", "requiresItem": "pole",
             "consequences": [],
             "narrative": "杖尖插进泥里提供额外支撑。虽然慢，但你稳稳地走过了这段路。"},
            {"id": "U25-2", "text": "手脚并用爬过去",
             "probability": 0.5,
             "consequences": [],
             "failConsequences": [{"type": "add_status", "payload": {"type": "sprain", "speedModifier": -1, "turnsRemaining": -1}}],
             "narrative": "裤子和手套全是泥，但你安全通过了。",
             "failNarrative": "你一脚踩滑，整个人摔进了泥坑里。站起来时发现脚踝扭了。"},
        ]
    },
    {
        "id": "U26", "category": "encounter", "subtype": "body",
        "segments": [1,2,3,4,5,6,7,8,9,11,12],
        "narrative": "胃在抽搐——你已经很久没吃东西了。手开始抖，走路也开始发飘。低血糖的症状。",
        "choices": [
            {"id": "U26-1", "text": "吃东西补充能量",
             "consequences": [{"type": "consume_item", "payload": "food"}],
             "narrative": "食物下肚后，身体渐渐恢复了力气。以后不能拖这么久了。"},
            {"id": "U26-2", "text": "喝几口水顶一顶",
             "consequences": [{"type": "modify_water", "payload": -0.1}],
             "narrative": "水勉强压下了胃部的翻搅感，但身体依然虚弱。"},
            {"id": "U26-3", "text": "忍着继续走",
             "probability": 0.3,
             "consequences": [],
             "failConsequences": [{"type": "add_status", "payload": {"type": "fatigue", "speedModifier": -2, "turnsRemaining": 2}}],
             "narrative": "你咬牙撑过了这阵虚弱感。",
             "failNarrative": "眼前一黑，你差点摔倒。身体已经到了极限。"},
        ]
    },
    {
        "id": "U27", "category": "encounter", "subtype": "equipment",
        "segments": [3,4,5,6,7,8,9],
        "narrative": "你低头发现登山杖的杖尖碳钉已经磨平了，杵在石头上直打滑。继续用可能更危险。",
        "choices": [
            {"id": "U27-1", "text": "收起登山杖，用手保持平衡",
             "probability": 0.5,
             "consequences": [],
             "failConsequences": [{"type": "add_status", "payload": {"type": "slow", "speedModifier": -1, "turnsRemaining": 2}}],
             "narrative": "没有杖也能走，只是要更小心一些。",
             "failNarrative": "没有登山杖支撑，你的速度明显慢了下来。"},
            {"id": "U27-2", "text": "继续用，小心点就行",
             "probability": 0.4,
             "consequences": [],
             "failConsequences": [{"type": "damage_item", "payload": "pole"}],
             "narrative": "虽然打滑，但勉强还能用。",
             "failNarrative": "杖尖在一块岩石上猛地一滑——整根杖弹出去，杖身撞在石头上裂了。"},
        ]
    },
]

# Generate TypeScript
def gen():
    lines = []
    lines.append("")
    lines.append("// ══════════════════════════════════════════")
    lines.append("// 通用事件扩充 U13-U27 (15个新事件)")
    lines.append("// ══════════════════════════════════════════")
    lines.append("")

    for evt in EVENTS:
        var_name = f"U{evt['id'][1:]}_EVENT"
        lines.append(f"export const {var_name}: GameEvent = {{")
        lines.append(f"  id: '{evt['id']}', category: '{evt['category']}', subtype: '{evt['subtype']}',")
        lines.append(f"  segments: {evt['segments']}, seasons: ['winter', 'summer'],")
        lines.append(f"  isFixed: false,")
        lines.append(f"  narrative: {repr(evt['narrative'])},")
        lines.append(f"  choices: [")
        for ch in evt["choices"]:
            lines.append(f"    {{")
            lines.append(f"      id: '{ch['id']}', text: {repr(ch['text'])},")
            if "requiresItem" in ch:
                lines.append(f"      requiresItem: '{ch['requiresItem']}',")
            if "itemCost" in ch:
                lines.append(f"      itemCost: {{ defId: '{ch['itemCost']['defId']}', count: {ch['itemCost']['count']} }},")
            if "probability" in ch:
                lines.append(f"      probability: {ch['probability']},")
            lines.append(f"      consequences: {format_consequences(ch['consequences'])},")
            if "failConsequences" in ch:
                lines.append(f"      failConsequences: {format_consequences(ch['failConsequences'])},")
            lines.append(f"      narrative: {repr(ch['narrative'])},")
            if "failNarrative" in ch:
                lines.append(f"      failNarrative: {repr(ch['failNarrative'])},")
            lines.append(f"    }},")
        lines.append(f"  ],")
        lines.append(f"}}")
        lines.append(f"")

    return "\n".join(lines)


def format_consequences(consequences):
    if not consequences:
        return "[]"
    parts = []
    for c in consequences:
        if c["type"] in ("skip_turn", "trigger_lost"):
            parts.append(f"{{ type: '{c['type']}' }}")
        elif c["type"] in ("consume_item", "remove_status", "damage_item"):
            parts.append(f"{{ type: '{c['type']}', payload: '{c['payload']}' }}")
        elif c["type"] == "modify_water":
            parts.append(f"{{ type: '{c['type']}', payload: {c['payload']} }}")
        elif c["type"] == "add_status":
            p = c["payload"]
            parts.append(f"{{ type: 'add_status', payload: {{ type: '{p['type']}', speedModifier: {p['speedModifier']}, turnsRemaining: {p['turnsRemaining']} }} }}")
    return "[" + ", ".join(parts) + "]"


if __name__ == "__main__":
    content = gen()
    # Append to events.ts before the ALL_EVENTS array
    import os
    path = r"C:\Users\wuxijin01\PyCharmMiscProject\aotai-game\src\data\events_u13_u27.ts.txt"
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated {len(EVENTS)} events → {path}")
