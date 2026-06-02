"""
Fix Unicode escapes in Vue files.
Convert literal \\uXXXX sequences back to actual Unicode characters.
"""
import re
import glob
import os

vue_dir = r'C:/Users/wuxijin01/PyCharmMiscProject/aotai-game/src'

def decode_unicode_escapes(text):
    """Replace \\uXXXX with actual Unicode characters, skipping surrogates."""
    def replacer(m):
        code_point = int(m.group(1), 16)
        # Skip surrogate code points (D800-DFFF) — they can't be encoded in UTF-8
        if 0xD800 <= code_point <= 0xDFFF:
            return m.group(0)  # leave as-is
        return chr(code_point)
    return re.sub(r'\\u([0-9a-fA-F]{4})', replacer, text)

# Process all .vue files
vue_files = glob.glob(os.path.join(vue_dir, '**', '*.vue'), recursive=True)
fixed_count = 0

for filepath in vue_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '\\u' not in content:
        continue
    
    new_content = decode_unicode_escapes(content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        fixed_count += 1
        # Count how many replacements
        count = len(re.findall(r'\\u[0-9a-fA-F]{4}', content))
        print(f'Fixed {filepath} ({count} unicode escapes)')

print(f'\nDone! Fixed {fixed_count} Vue files.')
