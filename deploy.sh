#!/bin/bash

# 部署腳本 - 將專案部署到生產環境 VPS

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 取得腳本所在目錄（專案根目錄）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# VPS 設定
VPS_USER="lewsi"
VPS_HOST="lewsi.ddns.net"
VPS_PATH="/home/lewsi/workspace/landingPage"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  開始部署到生產環境${NC}"
echo -e "${YELLOW}  目標: ${VPS_USER}@${VPS_HOST}${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# 切換到專案根目錄
cd "$SCRIPT_DIR"

# Step 1: Build
echo -e "${GREEN}[1/3] 建置專案...${NC}"
npm run build

if [ ! -d "$SCRIPT_DIR/dist" ]; then
    echo -e "${RED}錯誤: 建置失敗，找不到 dist 目錄${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 建置完成${NC}"
echo ""

# Step 2: 建立遠端目錄 (如果不存在)
echo -e "${GREEN}[2/3] 準備遠端目錄...${NC}"
ssh "${VPS_USER}@${VPS_HOST}" "mkdir -p ${VPS_PATH}"
echo -e "${GREEN}✓ 遠端目錄已準備${NC}"
echo ""

# Step 3: 使用 rsync 同步檔案
echo -e "${GREEN}[3/3] 上傳檔案到 VPS...${NC}"
rsync -avz --delete \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude '.claude' \
    "$SCRIPT_DIR/dist/" "${VPS_USER}@${VPS_HOST}:${VPS_PATH}/"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "檔案已部署至: ${VPS_USER}@${VPS_HOST}:${VPS_PATH}"
echo ""
