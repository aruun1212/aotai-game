#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Meta-script: generates gen_events_descent_final.py which in turn produces
the actual TypeScript descent events.
This avoids encoding corruption by keeping Chinese only in u() calls.
"""
import os

OUTPUT_SCRIPT = 'gen_events_descent_final.py'

def u(text):
    """Convert Chinese text to \\uXXXX for embedding in generated TS."""
    return ''.join(f'\\u{ord(c):04x}' if ord(c) > 127 else c for c in text)

# All the descent events data
events_data = [
    # D97
    {
        'const': 'D97_01_SCREE_SLIDE',
        'id': 'D97-01', 'cat': 'encounter', 'sub': 'terrain',
        'fixed': False,
        'narrative': u('下撤的碎石坡比你想象的滑。每走一步，脚下的碎石就带着你往下溜半米。像在走一个永远到不了底的沙丘。'),
        'choices': [
            {
                'id': 'D97-01-1',
                'text': u('用登山杖控制速度'),
                'requiresItem': 'pole',
                'consequences': '[]',
                'narrative': u('杖尖戳进碎石缝里，你一步一步稳稳地下降。'),
            },
            {
                'id': 'D97-01-2',
                'text': u('坐下来滑'),
                'consequences': "[{ type: 'modify_speed_temp', payload: { delta: 1, turns: 1 } }]",
                'probability': 0.8,
                'narrative': u('你一屁股坐在碎石上往下滑。裤子完了，但确实快。'),
                'failNarrative': u('你一屁股坐在碎石上往下滑——碎石里藏着尖锐的岩角，裤子刮破了，大腿外侧一道血口。'),
                'failConsequences': "[{ type: 'add_status', payload: { type: 'sprain', speedModifier: -1, turnsRemaining: 2 } }]",
            },
            {
                'id': 'D97-01-3',
                'text': u('小心翼翼走'),
                'consequences': "[{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }]",
                'narrative': u('你蹲着重心，一步一步挪。慢得令人抓狂，但安全。'),
            },
        ],
    },
    # D96-01
    {
        'const': 'D96_01_CLIFF_DESCENT',
        'id': 'D96-01', 'cat': 'encounter', 'sub': 'terrain',
        'fixed': True,
        'narrative': u('这不是下山——这是攀岩。只不过方向是反的。你面朝岩壁，脚在下面悬空摸索支点。身后就是几十米的垂直落差。往下看一眼，胃就翻上来了。'),
        'choices': [
            {
                'id': 'D96-01-1',
                'text': u('用绳索固定下降'),
                'requiresItem': 'rope',
                'consequences': '[]',
                'narrative': u('你把绳索系在突出的岩石上，背对悬崖一米一米地放下去。手臂在抖，但绳索不会骗你。'),
            },
            {
                'id': 'D96-01-2',
                'text': u('徒手攀降'),
                'consequences': '[]',
                'probability': 0.65,
                'narrative': u('你抓住岩壁上每一个能抓的东西。手指关节泛白，指甲断了两根。但你下来了。'),
                'failNarrative': u('你的手指从岩壁上滑脱。坠落的那一秒，世界安静了。'),
                'failConsequences': "[{ type: 'trigger_death' }]",
            },
            {
                'id': 'D96-01-3',
                'text': u('寻找绕行路线'),
                'consequences': "[{ type: 'modify_speed_temp', payload: { delta: -2, turns: 1 } }]",
                'probability': 0.7,
                'narrative': u('你沿着崖边走了半小时，找到了一条勉强能走的斜坡。'),
                'failNarrative': u('绕了一大圈，哪里都是悬崖。你不得不回到原来的位置。'),
                'failConsequences': "[{ type: 'skip_turn' }]",
            },
        ],
    },
    # D96-02
    {
        'const': 'D96_02_RIVER_CROSSING',
        'id': 'D96-02', 'cat': 'encounter', 'sub': 'terrain',
        'fixed': True,
        'narrative': u('山谷底部是一条湍急的河流。河水浑浊冰冷，水面宽约五六米。没有桥，没有浅滩。对岸的路就在那里，但你得先活着过去。'),
        'choices': [
            {
                'id': 'D96-02-1',
                'text': u('用绳索做辅助过河'),
                'requiresItem': 'rope',
                'consequences': '[]',
                'narrative': u('你把绳索一端系在岸边的树上，另一端绑在腰上。冰冷的河水没过大腿，但绳索让你不至于被冲走。'),
            },
            {
                'id': 'D96-02-2',
                'text': u('找最窄处跳过去'),
                'consequences': '[]',
                'probability': 0.6,
                'narrative': u('你助跑、起跳——脚尖堪堪踩到对岸的石头上。你趴在地上喘了很久。'),
                'failNarrative': u('你差了半步。冰冷的河水瞬间包裹了你。'),
                'failConsequences': "[{ type: 'add_status', payload: { type: 'hypothermia', speedModifier: -2, turnsRemaining: 3, deathCountdown: 5 } }, { type: 'modify_water', payload: -0.5 }]",
            },
            {
                'id': 'D96-02-3',
                'text': u('沿河岸走找浅滩'),
                'consequences': "[{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }]",
                'narrative': u('你沿着河走了很久，终于找到一处水只到膝盖的浅滩。'),
            },
        ],
    },
    # D96-03
    {
        'const': 'D96_03_VALLEY_LOST',
        'id': 'D96-03', 'cat': 'encounter', 'sub': 'terrain',
        'fixed': False,
        'narrative': u('这条路太久没人走了。灌木封路，树枝打在脸上，脚下的小径时有时无。GPS上显示你应该在路上，但你的脚下只有杂草和烂泥。'),
        'choices': [
            {
                'id': 'D96-03-1',
                'text': u('严格按GPS方向砍路前进'),
                'requiresItem': 'gps',
                'consequences': "[{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }]",
                'narrative': u('你用登山杖拨开灌木，一米一米地推进。脸上、手上全是划痕。'),
            },
            {
                'id': 'D96-03-2',
                'text': u('凭直觉找路'),
                'consequences': '[]',
                'probability': 0.5,
                'narrative': u('你选了看起来稀疏一点的方向——运气不错，走对了。'),
                'failNarrative': u('你选了看起来稀疏一点的方向——走了一个小时才发现是死路。只能原路返回。'),
                'failConsequences': "[{ type: 'modify_speed_temp', payload: { delta: -2, turns: 1 } }]",
            },
        ],
    },
    # D93-01
    {
        'const': 'D93_01_LONG_FOREST',
        'id': 'D93-01', 'cat': 'encounter', 'sub': 'atmosphere',
        'fixed': False,
        'narrative': u('核桃坪的下撤路温柔得不像鳌太。松树林、溪流、偶尔的鸟叫。如果不是腿已经废了，这甚至算是一次愉快的散步。\n\n你走了很久很久。二十公里在山里的感觉，和城市里完全不同。但每走一步，你都在远离危险。'),
        'choices': [
            {
                'id': 'D93-01-1',
                'text': u('享受这段安全的路'),
                'consequences': "[{ type: 'narrative_only' }]",
                'narrative': u('你第一次放松了紧绷的神经。呼吸顺畅了，肩膀松下来了。你还活着。'),
            },
        ],
    },
    # D95-01
    {
        'const': 'D95_01_CLIFF_TRAVERSE',
        'id': 'D95-01', 'cat': 'encounter', 'sub': 'terrain',
        'fixed': True,
        'narrative': u('下撤路上横切过一段悬崖。路面只有半米宽，内侧是岩壁，外侧是看不到底的深渊。脚下的石头松动得像随时会塌。'),
        'choices': [
            {
                'id': 'D95-01-1',
                'text': u('用绳索做安全绳通过'),
                'requiresItem': 'rope',
                'consequences': '[]',
                'narrative': u('你把绳索系在岩壁上方的突出物上，贴着岩壁一步一步横移。绳索在手里，心就定了。'),
            },
            {
                'id': 'D95-01-2',
                'text': u('贴壁慢行'),
                'consequences': '[]',
                'probability': 0.85,
                'narrative': u('你面朝岩壁，双手抓着石头缝，脚尖横着挪。每一步都在和重力赌博。但你赢了。'),
                'failNarrative': u('脚下的石头突然碎裂。你的身体向外倾斜——'),
                'failConsequences': "[{ type: 'trigger_death' }]",
            },
            {
                'id': 'D95-01-3',
                'text': u('找其他路'),
                'consequences': "[{ type: 'modify_speed_temp', payload: { delta: -2, turns: 1 } }]",
                'probability': 0.5,
                'narrative': u('你沿着崖边来回找了半小时，终于发现一条绕行的小路。虽然多走了一大截，但至少不用在悬崖上走钢丝。'),
                'failNarrative': u('这条路只有一条线。没有别的选择。你不得不回来面对那段悬崖。'),
                'failConsequences': "[{ type: 'skip_turn' }]",
            },
        ],
    },
    # D95-02
    {
        'const': 'D95_02_RIVER_FORD',
        'id': 'D95-02', 'cat': 'encounter', 'sub': 'terrain',
        'fixed': False,
        'narrative': u('接近老县城时要穿过一片河谷。水不深，但石头上长满了青苔，滑得像抹了油。'),
        'choices': [
            {
                'id': 'D95-02-1',
                'text': u('用登山杖探路涉水'),
                'requiresItem': 'pole',
                'consequences': '[]',
                'narrative': u('杖尖在水下试探每一块石头。你踩着稳当的石头，一步步过了河。'),
            },
            {
                'id': 'D95-02-2',
                'text': u('小心翼翼走'),
                'consequences': '[]',
                'probability': 0.7,
                'narrative': u('你扶着旁边的石头走。脚底滑了几次，但每次都抓住了。有惊无险。'),
                'failNarrative': u('脚底突然一滑——你整个人摔进了河里。冰冷的河水浸透了全身。'),
                'failConsequences': "[{ type: 'add_status', payload: { type: 'hypothermia', speedModifier: -1, turnsRemaining: 2, deathCountdown: 6 } }]",
            },
        ],
    },
    # D88-01
    {
        'const': 'D88_01_DENSE_FOREST',
        'id': 'D88-01', 'cat': 'encounter', 'sub': 'terrain',
        'fixed': True,
        'narrative': u('从大爷海往南下撤，很快就进入了密不透风的原始森林。树冠遮蔽了天空，GPS信号在树林里断断续续。路面被落叶和枯枝覆盖，根本分不清哪里是路哪里不是路。\n\n你想起了那个在这片森林里迷失了八天的人。他最后靠吃竹叶和树皮活了下来。'),
        'choices': [
            {
                'id': 'D88-01-1',
                'text': u('频繁检查GPS，每走50米确认一次方向'),
                'requiresItem': 'gps',
                'consequences': "[{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }]",
                'narrative': u('你像偏执狂一样每走一小段就掏出GPS。慢，但你知道自己在哪。'),
            },
            {
                'id': 'D88-01-2',
                'text': u('沿着溪流方向走'),
                'consequences': '[]',
                'probability': 0.8,
                'narrative': u('水总是往下流的。你跟着溪流走，溪流带你穿过了密林。'),
                'failNarrative': u('你跟着溪流走——但这条溪流拐进了一条越来越窄的山沟。你不得不原路返回。'),
                'failConsequences': "[{ type: 'modify_speed_temp', payload: { delta: -2, turns: 1 } }]",
            },
            {
                'id': 'D88-01-3',
                'text': u('凭感觉往下走'),
                'consequences': '[]',
                'probability': 0.6,
                'narrative': u('下就对了。你选了一个看起来向下的方向，运气不错。'),
                'failNarrative': u('你在密林里转了两个小时。每棵树看起来都一样。你开始理解那个人的绝望了。'),
                'failConsequences': "[{ type: 'trigger_lost' }, { type: 'modify_speed_temp', payload: { delta: -3, turns: 1 } }]",
            },
        ],
    },
    # D88-02
    {
        'const': 'D88_02_LOG_BRIDGE',
        'id': 'D88-02', 'cat': 'encounter', 'sub': 'terrain',
        'fixed': False,
        'narrative': u('又一条河拦在面前。这次河上倒了一棵枯树，勉强搭了个天然独木桥。树干湿滑，直径不到三十厘米。河水在下面轰鸣。'),
        'choices': [
            {
                'id': 'D88-02-1',
                'text': u('骑在树干上挪过去'),
                'consequences': '[]',
                'probability': 0.9,
                'narrative': u('你坐在树干上，双手抓着树皮，一点一点往对岸挪。裤子湿了，但过去了。'),
                'failNarrative': u('树干突然转动了一下——你死死抱住树干，花了五分钟才稳住。裤子湿透了。'),
                'failConsequences': "[{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }]",
            },
            {
                'id': 'D88-02-2',
                'text': u('站着走过去'),
                'consequences': '[]',
                'probability': 0.6,
                'narrative': u('你张开双臂保持平衡。一步，两步……三步——你到了对岸。'),
                'failNarrative': u('你张开双臂保持平衡。一步，两步——脚底突然打滑。冰冷的河水吞没了你。'),
                'failConsequences': "[{ type: 'add_status', payload: { type: 'hypothermia', speedModifier: -1, turnsRemaining: 2, deathCountdown: 6 } }]",
            },
            {
                'id': 'D88-02-3',
                'text': u('不走独木桥，涉水过河'),
                'consequences': "[{ type: 'modify_speed_temp', payload: { delta: -1, turns: 1 } }]",
                'narrative': u('你放弃了那根看起来随时会断的树干，直接蹚进了冰冷的河水里。安全，但冷得要命。'),
            },
        ],
    },
]

# Build choice TS string
def build_choice(c):
    parts = [f"      id: '{c['id']}', text: '{c['text']}'"]
    if 'requiresItem' in c:
        parts.append(f"      requiresItem: '{c['requiresItem']}'")
    parts.append(f"      consequences: {c['consequences']},")
    parts.append(f"      narrative: '{c['narrative']}',")
    if 'probability' in c:
        parts.append(f"      probability: {c['probability']},")
    if 'failNarrative' in c:
        parts.append(f"      failNarrative: '{c['failNarrative']}',")
    if 'failConsequences' in c:
        parts.append(f"      failConsequences: {c['failConsequences']},")
    return '    {\n' + '\n'.join(parts) + '\n    }'

# Build event TS string
def build_event(e):
    choices_str = ',\n'.join(build_choice(c) for c in e['choices'])
    return f"""export const {e['const']}: GameEvent = {{
  id: '{e['id']}', category: '{e['cat']}', subtype: '{e['sub']}',
  segments: [], seasons: ['winter', 'summer'],
  isFixed: {'true' if e['fixed'] else 'false'},
  narrative: '{e['narrative']}',
  choices: [
{choices_str}
  ],
}}"""

# Build the TS block
ts_block = '\n\n// ==========================================================\n'
ts_block += '// Descent Route Events D97 / D96 / D93 / D95 / D88\n'
ts_block += '// ==========================================================\n\n'

section_comments = {
    'D97_01_SCREE_SLIDE': f"// -- D97 {u('导航塔')}->23km {u('处')} --",
    'D96_01_CLIFF_DESCENT': f"// -- D96 {u('飞机梁')}->{{u('宝河沟')}} --",
    'D93_01_LONG_FOREST': f"// -- D93 2800->{u('核桃坪')} --",
    'D95_01_CLIFF_TRAVERSE': f"// -- D95 {u('万仙阵')}->{{u('老县城')}} --",
    'D88_01_DENSE_FOREST': f"// -- D88 {u('大爷海')}->{{u('铁甲树')}} --",
}

for e in events_data:
    if e['const'] in section_comments:
        ts_block += '\n' + section_comments[e['const']] + '\n\n'
    ts_block += build_event(e) + '\n\n'

# Now write the actual generation script
script_content = f'''#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Auto-generated descent event writer. Run: python gen_events_descent_final.py"""
import os

EVENTS_FILE = os.path.join('src', 'data', 'events.ts')
DESCENTS_FILE = os.path.join('src', 'data', 'descents.ts')

TS_BLOCK = """{ts_block}"""

# Append to events.ts
with open(EVENTS_FILE, 'r', encoding='utf-8') as f:
    content = f.read()
content = content.rstrip() + '\\n' + TS_BLOCK
with open(EVENTS_FILE, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Descent events appended: {{len(content)}} bytes")
'''

with open(OUTPUT_SCRIPT, 'w', encoding='utf-8') as f:
    f.write(script_content)

print(f"Generated {OUTPUT_SCRIPT}")
