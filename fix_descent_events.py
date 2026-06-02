"""Fix descent events in events.ts: add missing commas and Unicode-escape Chinese text."""
import re

filepath = r'C:/Users/wuxijin01/PyCharmMiscProject/aotai-game/src/data/events.ts'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Split at descent events boundary
marker = 'export const D97_01_SCREE_SLIDE'
idx = content.find(marker)
if idx == -1:
    raise ValueError('Could not find descent events marker')

prefix = content[:idx]
descent = content[idx:]

# Step 1: Unicode-escape all Chinese characters (CJK Unified Ideographs range)
def escape_chinese(text):
    result = []
    for ch in text:
        cp = ord(ch)
        if cp > 127:
            result.append(f'\\u{cp:04x}')
        else:
            result.append(ch)
    return ''.join(result)

descent_escaped = escape_chinese(descent)

# Step 2: Fix missing commas in choice objects
# Pattern: `text: '...'` not followed by comma (but followed by newline + spaces + requiresItem or consequences or probability etc.)
# Also fix: `requiresItem: '...'` not followed by comma
# General approach: any line ending with `'value'` or `'value',` inside a choices block

# Fix lines like `text: '...'` that are NOT followed by a comma
# We look for: `something: 'value'\n` where the next non-empty content starts with a known property name
descent_fixed = re.sub(
    r"(text: '(?:[^'\\]|\\.)*')(\s*\n\s*)(requiresItem|consequences|probability|failNarrative|failConsequences|narrative)",
    r'\1,\2\3',
    descent_escaped
)

# Also fix requiresItem: 'value' not followed by comma before consequences/narrative
descent_fixed = re.sub(
    r"(requiresItem: '(?:[^'\\]|\\.)*')(\s*\n\s*)(consequences|probability|narrative|failNarrative|failConsequences)",
    r'\1,\2\3',
    descent_fixed
)

# Fix narrative: 'value' not followed by comma before closing brace on separate line
descent_fixed = re.sub(
    r"(narrative: '(?:[^'\\]|\\.)*')(\s*\n\s*)(probability|failNarrative|failConsequences)",
    r'\1,\2\3',
    descent_fixed
)

# Write back
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(prefix + descent_fixed)

print('Done! Fixed descent events.')

# Verify by counting commas after text: in choices
with open(filepath, 'r', encoding='utf-8') as f:
    fixed = f.read()
descent_part = fixed[idx:]
text_lines = [l for l in descent_part.split('\n') if "text: '" in l]
missing = [l.strip() for l in text_lines if not l.rstrip().endswith(',')]
print(f'Total text: lines in descent: {len(text_lines)}')
print(f'Lines still missing trailing comma: {len(missing)}')
for l in missing[:5]:
    print(f'  {l}')
