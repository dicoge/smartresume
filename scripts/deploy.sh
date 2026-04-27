#!/usr/bin/env bash
# Local build + rsync to VPS — alternative to the GitHub Actions workflow.
#
# Reads VPS settings from .env and/or .env.local (both gitignored).
# Loading order matches Vite convention: .env first, .env.local overrides.
# Required keys:
#   VPS_HOST              — VPS hostname or IP (no protocol)
#   VPS_USER              — SSH user
#   VPS_DEPLOY_PATH       — target dir on VPS (no trailing slash)
# Optional:
#   VITE_BASE             — Vite base path (default: /smartresume/)
#
# Usage:  npm run deploy   (or)   bash scripts/deploy.sh

set -euo pipefail

cd "$(dirname "$0")/.."

loaded=0
for env_file in .env .env.local; do
  if [ -f "$env_file" ]; then
    set -a
    # shellcheck disable=SC1090
    source "$env_file"
    set +a
    loaded=1
  fi
done

if [ "$loaded" -eq 0 ]; then
  echo "✗ Neither .env nor .env.local found at $(pwd)"
  echo "  Create one with: VPS_HOST, VPS_USER, VPS_DEPLOY_PATH"
  exit 1
fi

: "${VPS_HOST:?VPS_HOST required in .env.local}"
: "${VPS_USER:?VPS_USER required in .env.local}"
: "${VPS_DEPLOY_PATH:?VPS_DEPLOY_PATH required in .env.local}"
VITE_BASE="${VITE_BASE:-/smartresume/}"

echo "→ Building (VITE_BASE=${VITE_BASE})"
VITE_BASE="${VITE_BASE}" npm run build

echo "→ Syncing dist/ → ${VPS_USER}@${VPS_HOST}:${VPS_DEPLOY_PATH}/"
rsync -avz --delete dist/ "${VPS_USER}@${VPS_HOST}:${VPS_DEPLOY_PATH}/"

echo "✓ Deployed → https://${VPS_HOST}${VITE_BASE}"
