# 新增部署建議文件並移除 deployment.md 個人資料 — Walkthrough

- **分支:** `docs/write-a-new-deploy-suggestion-doc-and-remove-my-personal-data-in-deployment`
- **日期:** 2026-04-21

## 變更摘要

`docs/deployment.md` 的個人資料（自家 domain、VPS 使用者、主目錄路徑）已替換為通用 placeholder，使其成為 fork 使用者可直接參考的範本。新增 `docs/deploy-options.md` 提供 Vercel / Netlify / Cloudflare Pages / GitHub Pages 四種零門檻部署方案（刻意排除 self-hosted VPS，讓有需要的人自行看 deployment.md）。兩份 docs 同時產出繁中與英文版（沿用 README 的 `.md` / `.en.md` 命名慣例），並在 README 兩語版加上 `deploy-options` 連結。

## 修改的檔案

- `docs/deployment.md` — Sanitize：`lewsi.ddns.net` → `your-domain.example.com`、`lewsi` user → `deploy`、`/home/lewsi/workspace/SmartResumeBuild/smartresume` → `/var/www/smartresume`；加上英文版連結
- `docs/deployment.en.md` — 新增，deployment.md 的完整英譯
- `docs/deploy-options.md` — 新增，涵蓋 Vercel / Netlify / Cloudflare Pages / GitHub Pages 四種部署方案，含快速比較表與逐步操作
- `docs/deploy-options.en.md` — 新增，deploy-options.md 的完整英譯
- `README.md` — 部署章節加上 `docs/deploy-options.md` 連結
- `README.en.md` — 部署章節改寫為指向 `docs/deploy-options.en.md` 與 `docs/deployment.en.md`
- `specs/write-a-new-deploy-suggestion-doc-and-remove-my-personal-data-in-deployment.md` — 任務 spec

## 技術細節

- `.github/workflows/deploy.yml` 本就全部走 GitHub Secrets（`VPS_HOST` / `VPS_USER` / `VPS_DEPLOY_PATH` / `VPS_SSH_KEY`），不含任何硬編個人資料，因此本次未動 workflow 檔
- README 的 Live Demo URL（`https://lewsi.ddns.net/smartresume/`）屬於作者公開展示的正式連結，不算 "個人資料需清除" 範圍，保留
- Placeholder 命名貼合社群慣例：domain 用 RFC 2606 的 `example.com`；VPS 使用者用通用 `deploy`；部署路徑用 `/var/www/smartresume`（Nginx 預設根目錄位置）
- `deploy-options.md` 刻意不寫 self-hosted VPS，結尾以連結指向 `deployment.md`，分層避免單一文件過長
- 雙語交叉連結：每份 zh 版頂部有 "English version" 一行指向 `.en.md`，每份 en 版頂部有 "中文版請見" 指向 `.md`
- `npm run build` 驗證通過（docs-only 變更本無風險，但仍跑一次以防萬一）
