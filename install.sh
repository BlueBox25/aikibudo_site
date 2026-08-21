#!/usr/bin/env bash
#
# AikiBudo — site static.
#
#   ./install.sh           instalează ce lipsește, apoi pornește serverul de dezvoltare
#   ./install.sh --setup   doar instalează
#   ./install.sh --build   construiește versiunea de producție în frontend/dist
#
# Nu există backend: conținutul se citește din frontend/public/content.json.

set -euo pipefail
cd "$(dirname "$0")"

PORT="${PORT:-5173}"

MODE=dev
for arg in "$@"; do
  case "$arg" in
    --setup|--setup-only) MODE=setup ;;
    --build)              MODE=build ;;
    -h|--help)            sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Argument necunoscut: $arg (încearcă --help)" >&2; exit 1 ;;
  esac
done

bold() { printf '\033[1m%s\033[0m\n' "$*"; }
info() { printf '  \033[2m%s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
die()  { printf '\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

bold "1/3  Verific programele necesare"
command -v node >/dev/null || die "node nu este instalat. Vezi https://nodejs.org (versiunea 20 sau mai nouă)"
command -v npm  >/dev/null || die "npm nu este instalat (vine împreună cu node)"
NODE_MAJOR=$(node -v | sed 's/^v\([0-9]*\).*/\1/')
[ "$NODE_MAJOR" -ge 20 ] || die "Ai nevoie de Node 20 sau mai nou (ai $(node -v))"
ok "node $(node -v), npm $(npm -v)"

bold "2/3  Instalez dependențele"
if [ -d frontend/node_modules ]; then
  ok "node_modules există"
else
  info "durează un minut…"
  if [ -f frontend/package-lock.json ]; then
    ( cd frontend && npm ci --no-audit --no-fund )
  else
    ( cd frontend && npm install --no-audit --no-fund )
  fi
  ok "gata"
fi

[ -f frontend/public/content.json ] || die "Lipsește frontend/public/content.json — fără el site-ul nu are ce afișa."

case "$MODE" in
  setup)
    bold "3/3  Gata"
    echo
    echo "  Pornește cu:  ./install.sh"
    ;;
  build)
    bold "3/3  Construiesc pentru producție"
    ( cd frontend && npm run build )
    echo
    ok "rezultatul e în frontend/dist"
    info "Vercel face asta singur la fiecare push"
    ;;
  dev)
    bold "3/3  Pornesc serverul de dezvoltare"
    echo
    echo "  Site:       http://localhost:$PORT"
    echo "  Oprești cu: Ctrl+C"
    echo
    ( cd frontend && exec npm run dev -- --port "$PORT" )
    ;;
esac
