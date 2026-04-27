# Deployment — VPS + GitHub Actions

> English version: [deployment.en.md](./deployment.en.md).

本文件說明如何透過 GitHub Actions 手動觸發 `Deploy to VPS` workflow，將 Portfolio 靜態網站部署到自有 VPS（Nginx 架設）。

## 架構

```
GitHub master → (manual) workflow_dispatch → GitHub Actions runner
    ↓ npm ci → npm run build (VITE_BASE=/smartresume/)
    ↓ rsync dist/ → VPS
VPS: /var/www/smartresume/  ← Nginx root
    ↓
https://your-domain.example.com/smartresume/
```

## 一次性設定（僅需做一次）

### 1. 在 VPS 上產生 deploy key

SSH 登入 VPS 後執行：

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -C "github-actions-deploy" -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

> `-N ""` 代表 passphrase 為空，GitHub Actions 無法互動輸入密碼。此 key 僅供部署用途，請勿與個人 SSH key 混用。

### 2. 將 deploy key 私鑰複製下來

```bash
cat ~/.ssh/github_deploy
```

整段（包含 `-----BEGIN OPENSSH PRIVATE KEY-----` 和 `-----END OPENSSH PRIVATE KEY-----`）都要複製。

### 3. 在 GitHub 設定 Repository Secrets

GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**，依序新增：

| Name | Value | 說明 |
|------|-------|------|
| `VPS_HOST` | `your-domain.example.com` | VPS 連線位址（domain 或 IP） |
| `VPS_USER` | `deploy` | SSH 使用者名稱 |
| `VPS_SSH_KEY` | 步驟 2 複製的整段私鑰 | Deploy key 私鑰 |
| `VPS_DEPLOY_PATH` | `/var/www/smartresume` | 部署目標目錄（不要加結尾斜線） |

### 4. 在 VPS 建立目標目錄並設定 Nginx

建立目錄：

```bash
sudo mkdir -p /var/www/smartresume
sudo chown -R $USER:$USER /var/www/smartresume
```

Nginx server block 範例（請依實際站台調整，並記得 `nginx -t && systemctl reload nginx`）：

```nginx
server {
    listen 80;
    server_name your-domain.example.com;

    location /smartresume/ {
        alias /var/www/smartresume/;
        try_files $uri $uri/ /smartresume/index.html;
        index index.html;
    }
}
```

> 後續若要啟用 HTTPS，可用 `certbot --nginx -d your-domain.example.com` 自動設定 Let's Encrypt 憑證。

## 觸發部署

1. 進入 GitHub repo → **Actions** 頁
2. 左側選 `Deploy to VPS`
3. 右上角 `Run workflow`
4. `base_path` 預設 `/smartresume/`，如不需要調整直接按綠色按鈕
5. 約 1-2 分鐘後 workflow 綠勾，網站更新完成

## 本機驗證 build（非部署）

```bash
# 模擬 CI build，產出與 CI 相同的 subpath 資源路徑
VITE_BASE=/smartresume/ npm run build

# 本機預覽（走 preview 模式）
npm run preview -- --base /smartresume/
```

打開 `dist/index.html` 可看到 `<script src="/smartresume/assets/xxx.js">` 前綴已加上。

## 替代方式：本機 build + rsync 部署

如果你不想用 GitHub Actions（例如：私人專案、不想把 SSH key 放 GitHub Secrets、想立即部署不等 CI），可改用本機腳本 `scripts/deploy.sh`，直接從本機 `npm run build` 後 rsync 到 VPS。

### 1. 設定環境變數檔

在專案根目錄建立 `.env` 或 `.env.local`（兩者都已被 `.gitignore`，不會 commit；若兩個都存在，`.env.local` 會覆蓋 `.env`，比照 Vite 慣例）：

```bash
VPS_HOST=your-domain.example.com
VPS_USER=deploy
VPS_DEPLOY_PATH=/home/deploy/smartresume
# VITE_BASE=/smartresume/   # 選填，預設 /smartresume/
```

### 2. 確保 SSH 金鑰可用

本機需能直接 `ssh ${VPS_USER}@${VPS_HOST}` 登入（建議透過 `~/.ssh/config` 設定 alias 與 IdentityFile）。

### 3. 部署

```bash
npm run deploy
```

腳本會：
1. 從 `.env.local` 讀設定
2. `VITE_BASE=${VITE_BASE} npm run build`
3. `rsync -avz --delete dist/ ${VPS_USER}@${VPS_HOST}:${VPS_DEPLOY_PATH}/`

### 4. 一次性 symlink 設定（將 Nginx root 指向 deploy 目錄）

如果你希望檔案實際存放在 user-space（例如 `/home/<user>/<path>/smartresume`，方便不用 sudo 寫入），但 Nginx 設定指向 `/var/www/smartresume`，可建立 symlink。在 VPS 上執行**一次**：

```bash
# 一次性指令：在 VPS 上執行
sudo ln -s /home/<user>/<path>/smartresume /var/www/smartresume

# 驗證
ls -la /var/www/smartresume
# lrwxrwxrwx ... /var/www/smartresume -> /home/<user>/<path>/smartresume
```

> 若 `/var/www/smartresume` 已是非 symlink 的目錄／檔案，先 `sudo rm -rf /var/www/smartresume` 再建立 symlink，**並確保你想要的內容已備份**。

如此 Nginx 設定中的 `alias /var/www/smartresume/` 不需更動，新部署會被透明地導向 user-space 的真實目錄。

### 與 GitHub Actions 並用？

兩種方式都會 rsync 到同一個 `VPS_DEPLOY_PATH`，**選一種用即可**。混用會讓 `--delete` 互相覆蓋，造成 race condition。

## 疑難排解

| 症狀 | 可能原因 |
|------|---------|
| Workflow 在 `Configure SSH` 步失敗 | `VPS_SSH_KEY` 格式錯誤（可能複製時遺漏頭尾、或換行被刪除）|
| `rsync` 連不上，`Connection refused` | SSH port 非 22；請在 `-e "ssh -p xxxx ..."` 加 port，或在 VPS 的 `~/.ssh/config` 設定 |
| `rsync` 連上但 `Permission denied` | VPS 目標路徑權限不足；`chown -R $USER:$USER /path` |
| 部署後網站 404 | Nginx `alias` 路徑錯誤或 `try_files` 未導 SPA fallback |
| 資源（JS/CSS）404 | `VITE_BASE` 未正確傳入，或 Nginx location 未對齊 subpath |

## 替換預設部署位址

如果日後要改部署到別處（例如換到 `example.com/app/`）：

- 更新 GitHub secrets 的 `VPS_HOST` / `VPS_USER` / `VPS_DEPLOY_PATH`
- 觸發 workflow 時於 `base_path` 輸入新 subpath（例如 `/app/`）
- 更新 README 的 Live Demo URL

**不需要**改 workflow 檔案本身。
