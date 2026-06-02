# -*- coding: utf-8 -*-
"""Fix curly quotes in SeasonSelectView.vue"""
path = r'C:\Users\wuxijin01\PyCharmMiscProject\aotai-game\src\views\SeasonSelectView.vue'
text = open(path, 'r', encoding='utf-8').read()
count = text.count('\u201c') + text.count('\u201d') + text.count('\u2018') + text.count('\u2019')
fixed = text.replace('\u201c', '"').replace('\u201d', '"').replace('\u2018', "'").replace('\u2019', "'")
open(path, 'w', encoding='utf-8').write(fixed)
print(f'Fixed {count} curly quotes')
