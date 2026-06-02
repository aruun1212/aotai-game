"""
Compress all event probabilities to 0.2-0.3 range.
Events that were originally low (0.1-0.3) stay as-is.
Events that were 0.4+ get compressed to 0.2-0.3.
"""
import re

filepath = r'C:/Users/wuxijin01/PyCharmMiscProject/aotai-game/src/data/events.ts'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def compress_prob(match):
    original = float(match.group(1))
    if original <= 0.3:
        # Already low, keep as-is
        new_val = original
    elif original <= 0.5:
        new_val = 0.2
    elif original <= 0.7:
        new_val = 0.25
    else:
        # 0.7+ (was easy) → 0.3
        new_val = 0.3
    return f'probability: {new_val},'

result = re.sub(r'probability: (0\.\d+),', compress_prob, content)

# Count changes
original_matches = re.findall(r'probability: (0\.\d+),', content)
new_matches = re.findall(r'probability: (0\.\d+),', result)
changed = sum(1 for a, b in zip(original_matches, new_matches) if a != b)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(result)

print(f'Total probability fields: {len(original_matches)}')
print(f'Changed: {changed}')
print(f'Distribution after:')
from collections import Counter
print(Counter(new_matches))
