# fix curly quotes in gen script
p = r'C:\Users\wuxijin01\PyCharmMiscProject\aotai-game\tools\gen_universal_events.py'
t = open(p, 'r', encoding='utf-8').read()
t = t.replace('\u201c', '\\"').replace('\u201d', '\\"')
open(p, 'w', encoding='utf-8').write(t)
print('Fixed')
