# count coords per segment
import re

lines = open('src/data/geodata.ts', encoding='utf-8').readlines()
seg = None
counts = {}

for l in lines:
    m = re.search(r'segmentId:\s*(\d+)', l)
    if m:
        seg = int(m.group(1))
        counts[seg] = 0
    if seg and re.match(r'\s+\[107\.', l):
        counts[seg] += 1

for k in sorted(counts.keys()):
    print(f"Seg {k}: {counts[k]} pts (gridCount should be {counts[k]-1})")

print(f"\nTotal points: {sum(counts.values())}")
