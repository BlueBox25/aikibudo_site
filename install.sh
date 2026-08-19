#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

# venv doar prima dată
if [ ! -d .venv ]; then
  python3 -m venv .venv
  ./.venv/bin/pip install -r backend/requirements.txt
fi
source .venv/bin/activate

# la Ctrl+C sau exit, omoară tot grupul de procese
trap 'trap - EXIT; kill 0' EXIT INT TERM

# backend, din propriul director, output prefixat
( cd backend && python3 -u app.py 2>&1 | sed -u 's/^/[api] /' ) &

# frontend
cd frontend
[ -d node_modules ] || npm install
npm run dev 2>&1 | sed -u 's/^/[web] /'

wait