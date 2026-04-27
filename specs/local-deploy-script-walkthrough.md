# Local deploy script + build marker — Walkthrough

- **分支:** `feat/local-deploy-script`
- **日期:** 2026-04-27

## 變更摘要

新增 `npm run deploy`：本機 build + rsync 到 VPS 的部署腳本，作為現有 GitHub Actions workflow 的替代方案。同時在頁面 footer + console 注入 build SHA + 時間戳，部署完打開網站就能看到「現在跑的是哪個 commit、什麼時候 build 的」，不用 SSH 上 VPS 比對 mtime。腳本支援 `.env` 與 `.env.local` 雙檔（後者覆蓋前者，比照 Vite 慣例），個人 VPS 設定全部走 gitignored 檔案，不會漏 commit。文件同步更新（CLAUDE.md / README × 2 / deployment × 2），含一次性 symlink 設定指令。

## 修改的檔案

| 檔案 | 變更 |
|---|---|
| `scripts/deploy.sh`（新增） | bash 腳本：source `.env` 然後 `.env.local`（後者覆寫），驗證 `VPS_HOST` / `VPS_USER` / `VPS_DEPLOY_PATH` 三個必填，跑 `VITE_BASE=… npm run build`，再 `rsync -avz --delete dist/ → VPS`。失敗時清楚提示要建立哪個 env 檔 |
| `package.json` | 新增 `"deploy": "bash scripts/deploy.sh"` |
| `vite.config.ts` | 加 `define: { __BUILD_SHA__, __BUILD_TIME__ }`，build 時用 `git rev-parse --short HEAD` 抓 SHA（fallback `dev`），`new Date().toISOString()` 抓時間並格式化為 `YYYY-MM-DD HH:mm UTC` |
| `src/vite-env.d.ts` | 宣告 `__BUILD_SHA__` 與 `__BUILD_TIME__` 為 global string，TS 編譯時不抱怨 |
| `src/components/layout/TheFooter.vue` | 在現有 footer 文字下加一行 `text-[10px] opacity-60 font-mono` 的 `build {sha} · {time}` 標記。位置在「Made with」之後、「Back to Top」之前，對訪客幾乎不可見 |
| `src/main.ts` | App boot 時 `console.info('[SmartResume] build {sha} · {time}')`，DevTools 雙保險 |
| `docs/deployment.md`、`docs/deployment.en.md` | 新增「替代方式：本機 build + rsync 部署 / Alternative: local build + rsync deploy」章節，涵蓋 env 檔設定、SSH 前置條件、`npm run deploy` 流程、一次性 symlink 指令（`sudo ln -s /home/<user>/<path>/smartresume /var/www/smartresume`）、以及與 GitHub Actions 互斥的提醒 |
| `CLAUDE.md` | Deployment 區段擴充，列出兩種 VPS 部署方式並指向同一份 deployment doc |
| `README.md`、`README.en.md` | 兩種部署方式並列 |

## 技術細節

### 為什麼支援 `.env` 又 `.env.local`

最初的 v1 腳本只認 `.env.local`，使用者偏好 `.env`（兩者都已 gitignored）。改成 source 順序 `.env` → `.env.local`，後者可覆寫前者，跟 Vite 自家 dotenv 載入順序一致，使用者可以選自己慣用的命名。

### Symlink 設計（user-space + Nginx 透明導向）

Nginx 設定 `alias /var/www/smartresume/`，但檔案實際放在 `/home/<user>/<path>/smartresume`（rsync 不需要 sudo）。建立一次性 symlink 後，Nginx 設定不需動，新部署透明地反映到網站。文件中強調：若 `/var/www/smartresume` 已是真實目錄，使用者要自己決定備份／清空，腳本不會幫忙做這個 destructive 動作。

### Build marker 為何走 `define` 而非 `import.meta.env`

Vite 的 `define` 在 build time 把字面量直接 inline 進 bundle，TypeScript 用 `declare const` 看到型別，沒有 runtime overhead。如果走 `import.meta.env.VITE_*` 路線需要在 `vite.config.ts` 設 `process.env.VITE_BUILD_SHA` 並由 Vite 的 dotenv loader 處理，一層多繞。define 直接、簡潔，bundle 也只多 ~240 bytes 兩個字串常數。

### Footer 顯示策略

選 `text-[10px] opacity-60 font-mono` 而非完整正常字級，原因是這是「給維運看的識別」，不是給訪客的內容。訪客掃過會幾乎無感，但有需要時（檢查部署、debug）馬上看得到。Console.info 是備援：F12 打開 DevTools 任何時候都能拿到同樣的 SHA / 時間。

### 與 GitHub Actions 互斥

兩種部署都會 rsync 到同一個 `VPS_DEPLOY_PATH` 並帶 `--delete`，混用會造成兩邊互相覆蓋。文件中明確要求使用者**選一種**，不要交替使用。

## 驗證

- `bash -n scripts/deploy.sh` → 語法 OK
- `npm run build` → 成功，bundle 從 151.50 kB → 151.74 kB（+240 bytes）
- 抽 bundle 檢查：`grep -oE "build [a-f0-9]{7}"` 與時間戳兩者都能在 minified JS 中找到字面量
- 使用者實機跑 `npm run deploy` → rsync 成功送到 VPS → 開網站清 cache 後看到 v1.3.2 的 Education 段落、footer 顯示新 SHA。整個 pipeline 端對端驗證通過

## 任務清單

- [x] `scripts/deploy.sh` — build + rsync 主腳本
- [x] `package.json` 加 `npm run deploy`
- [x] env 檔支援 `.env` + `.env.local` 雙載（Vite 慣例）
- [x] `vite.config.ts` 注入 build SHA + 時間
- [x] `src/vite-env.d.ts` 宣告全域常數型別
- [x] Footer 顯示 build marker（`text-[10px]` 低調）
- [x] `console.info` 備援
- [x] `docs/deployment.md` + `.en.md` 新增替代部署章節 + symlink 一次性指令
- [x] CLAUDE.md / README.md / README.en.md 並列兩種部署方式
- [x] 使用者實測 `npm run deploy` 成功（清 cache 後驗證 Education 區段已上線）
