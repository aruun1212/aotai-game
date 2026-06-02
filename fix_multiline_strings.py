"""Fix multiline strings in descent events of events.ts - convert to single-line."""
import re

filepath = r'C:/Users/wuxijin01/PyCharmMiscProject/aotai-game/src/data/events.ts'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all multiline single-quoted strings (string starts with ' but doesn't end with ' on same line)
# Strategy: find lines that have an odd number of unescaped single quotes (meaning an open string)

lines = content.split('\n')
fixed_lines = []
in_multiline = False
multiline_buffer = ''

for i, line in enumerate(lines):
    if in_multiline:
        # We're inside a multiline string - append to buffer
        # Check if this line closes the string
        stripped = line.strip()
        if "'" in stripped:
            # This line closes the string - join with \\n escape
            multiline_buffer += '\\n' + line.rstrip()
            fixed_lines.append(multiline_buffer)
            multiline_buffer = ''
            in_multiline = False
        else:
            # Still inside, blank line probably
            multiline_buffer += '\\n' + line.rstrip()
    else:
        # Check if this line starts a multiline string
        # Count unescaped single quotes
        temp = line.replace("\\'", '')  # remove escaped quotes
        quote_count = temp.count("'")
        if quote_count % 2 == 1:
            # Odd number of quotes - unclosed string
            in_multiline = True
            multiline_buffer = line.rstrip()
        else:
            fixed_lines.append(line)

if in_multiline:
    # Shouldn't happen but just in case
    fixed_lines.append(multiline_buffer)

result = '\n'.join(fixed_lines)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(result)

print(f'Fixed. Original lines: {len(lines)}, New lines: {len(fixed_lines)}')
# Verify no more multiline strings
with open(filepath, 'r', encoding='utf-8') as f:
    check = f.read()
check_lines = check.split('\n')
for i, line in enumerate(check_lines):
    temp = line.replace("\\'", '')
    if temp.count("'") % 2 == 1:
        print(f'WARNING: Still unclosed string at line {i+1}: {line[:80]}...')
print('Verification done.')
