# Insert U13-U27 events into events.ts
import os

events_path = r'C:\Users\wuxijin01\PyCharmMiscProject\aotai-game\src\data\events.ts'
new_events_path = r'C:\Users\wuxijin01\PyCharmMiscProject\aotai-game\src\data\events_u13_u27.txt'

# Read files
events_ts = open(events_path, 'r', encoding='utf-8').read()
new_events = open(new_events_path, 'r', encoding='utf-8').read()

# 1. Insert new event constants before "export const UNIVERSAL_EVENTS"
marker = "export const UNIVERSAL_EVENTS: GameEvent[] = ["
insert_pos = events_ts.find(marker)
if insert_pos == -1:
    print("ERROR: UNIVERSAL_EVENTS not found!")
    exit(1)

events_ts = events_ts[:insert_pos] + "\n// ══ Universal Events U13-U27 (expanded pool) ══\n" + new_events + "\n\n" + events_ts[insert_pos:]

# 2. Add to UNIVERSAL_EVENTS array
old_array_end = "  U12_TAKIN,\n]"
new_array_end = """  U12_TAKIN,
  U13_EVENT,
  U14_EVENT,
  U15_EVENT,
  U16_EVENT,
  U17_EVENT,
  U18_EVENT,
  U19_EVENT,
  U20_EVENT,
  U21_EVENT,
  U22_EVENT,
  U23_EVENT,
  U24_EVENT,
  U25_EVENT,
  U26_EVENT,
  U27_EVENT,
]"""
events_ts = events_ts.replace(old_array_end, new_array_end)

# Write back
open(events_path, 'w', encoding='utf-8').write(events_ts)
print(f"Done! events.ts now {len(events_ts)} chars, {events_ts.count(chr(10))} lines")
