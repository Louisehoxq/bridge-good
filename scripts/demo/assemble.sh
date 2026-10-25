#!/usr/bin/env bash
# Join the scene clips (docs/demo/clips/NN-*.mp4, in name order) into docs/demo/bridgegoodx-demo.mp4 and .srt.
# Usage: scripts/demo/assemble.sh
set -euo pipefail
cd "$(dirname "$0")/../../docs/demo"
shopt -s nullglob
clips=(clips/[0-9][0-9]-*.mp4)
[ ${#clips[@]} -gt 0 ] || { echo "no clips in docs/demo/clips"; exit 1; }

list=$(mktemp)
: > "$list"
offset=0
: > bridgegoodx-demo.srt
n=0
for c in "${clips[@]}"; do
  echo "file '$PWD/$c'" >> "$list"
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$c")
  base="${c%.mp4}"
  if [ -s "$base.srt" ]; then
    python3 - "$base.srt" "$offset" "$n" >> bridgegoodx-demo.srt <<'PY'
import re, sys
path, offset, n = sys.argv[1], float(sys.argv[2]), int(sys.argv[3])
def parse(t):
    h, m, rest = t.split(":"); s, ms = rest.split(","); return int(h)*3600+int(m)*60+int(s)+int(ms)/1000
def fmt(x):
    ms = round(x*1000); return "%02d:%02d:%02d,%03d" % (ms//3600000, ms//60000%60, ms//1000%60, ms%1000)
for block in open(path).read().strip().split("\n\n"):
    lines = block.split("\n")
    a, b = lines[1].split(" --> ")
    n += 1
    print(n); print(fmt(parse(a)+offset), "-->", fmt(parse(b)+offset)); print("\n".join(lines[2:])); print()
PY
    n=$(grep -c -E '^[0-9]+$' bridgegoodx-demo.srt || true)
  fi
  offset=$(python3 -c "print($offset + $dur)")
done

ffmpeg -y -loglevel error -f concat -safe 0 -i "$list" -c copy bridgegoodx-demo.mp4
rm -f "$list"
total=$(ffprobe -v error -show_entries format=duration -of csv=p=0 bridgegoodx-demo.mp4)
echo "bridgegoodx-demo.mp4: ${#clips[@]} clips, ${total}s"
