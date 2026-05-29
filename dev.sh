#!/usr/bin/env bash
# Start a local static server for the Langla PWA (Bangla learning app).
# Usage: ./dev.sh [port]   (default 8000)

set -euo pipefail

PORT="${1:-8090}"
ROOT="$(cd "$(dirname "$0")" && pwd)"

cd "$ROOT"

# Figure out the LAN IP so the user can open it on their phone (same Wi-Fi)
LAN_IP="$(
  { ip -4 -o addr show scope global 2>/dev/null | awk '{print $4}' | cut -d/ -f1 | head -n1; } \
  || { ifconfig 2>/dev/null | awk '/inet / && $2 != "127.0.0.1" {print $2; exit}'; } \
  || echo ""
)"

echo "Langla dev server"
echo "  root:    $ROOT"
echo "  local:   http://localhost:$PORT"
if [[ -n "${LAN_IP:-}" ]]; then
  echo "  phone:   http://$LAN_IP:$PORT  (same Wi-Fi)"
fi
echo "  Ctrl-C to stop."
echo

# Prefer python3, fall back to python
if command -v python3 >/dev/null 2>&1; then
  exec python3 -m http.server "$PORT"
elif command -v python >/dev/null 2>&1; then
  exec python -m SimpleHTTPServer "$PORT"
else
  echo "Need python3 (or python) on PATH." >&2
  exit 1
fi
