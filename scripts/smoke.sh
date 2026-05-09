#!/usr/bin/env bash
set -euo pipefail

if [ "${SKIP_BUILD:-0}" != "1" ]; then
  npm run build
fi

PORT="${PORT:-$(node -e "const net=require('node:net');const s=net.createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close();})")}"
BASE_URL="http://127.0.0.1:${PORT}/localingo/"

node scripts/static-server.mjs "${PORT}" >/tmp/localingo-static-preview.log 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "${SERVER_PID}" >/dev/null 2>&1 || true
  wait "${SERVER_PID}" 2>/dev/null || true
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
