#!/usr/bin/env bash
# Local build + rsync to VPS — alternative to the GitHub Actions workflow.
#
# Reads VPS settings from .env.local (gitignored). Required keys:
#   VPS_HOST              — VPS hostname or IP (no protocol)
#   VPS_USER              — SSH user
#   VPS_DEPLOY_PATH       — target dir on VPS (no trailing slash)
# Optional:
#   VITE_BASE             — Vite base path (default: /smartresume/)
#
# Usage:  npm run deploy   (or)   bash scripts/deploy.sh

set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env.local ]; then
  echo "✗ .env.local not found at $(pwd)/.env.local"
  echo "  Create it with: VPS_HOST, VPS_USER, VPS_DEPLOY_PATH"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env.local
set +a

: "${VPS_HOST:?VPS_HOST required in .env.local}"
: "${VPS_USER:?VPS_USER required in .env.local}"
: "${VPS_DEPLOY_PATH:?VPS_DEPLOY_PATH required in .env.local}"
VITE_BASE="${VITE_BASE:-/smartresume/}"

echo "→ Building (VITE_BASE=${VITE_BASE})"
VITE_BASE="${VITE_BASE}" npm run build

echo "→ Syncing dist/ → ${VPS_USER}@${VPS_HOST}:${VPS_DEPLOY_PATH}/"
rsync -avz --delete dist/ "${VPS_USER}@${VPS_HOST}:${VPS_DEPLOY_PATH}/"

echo "✓ Deployed → https://${VPS_HOST}${VITE_BASE}"
