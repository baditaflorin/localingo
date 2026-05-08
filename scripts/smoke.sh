#!/usr/bin/env bash
set -euo pipefail

npm run build

PORT="${PORT:-4173}"
BASE_URL="http://127.0.0.1:${PORT}/localingo/"

npx vite preview --host 127.0.0.1 --port "${PORT}" >/tmp/localingo-vite-preview.log 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "${SERVER_PID}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in $(seq 1 40); do
  if curl -fsS "${BASE_URL}" >/dev/null; then
    break
  fi
  sleep 0.25
done

curl -fsS "${BASE_URL}" >/dev/null
PLAYWRIGHT_BASE_URL="${BASE_URL}" npx playwright test
