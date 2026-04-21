# 新增部署建議文件並移除 deployment.md 個人資料

- **分支:** `docs/write-a-new-deploy-suggestion-doc-and-remove-my-personal-data-in-deployment`
- **日期:** 2026-04-21

## 描述

目前 `docs/deployment.md` 為作者自用的 VPS + GitHub Actions 部署筆記，含有個人 domain（`lewsi.ddns.net`）、VPS 使用者名稱（`lewsi`）與主目錄路徑，不利於 fork 使用者直接參考。

本任務做兩件事：
1. 將 `docs/deployment.md` 的個人資料替換為 placeholder，使其成為通用範本
2. 新增 `docs/deploy-options.md` 提供 fork 使用者更簡易的部署方案概覽（Vercel / Netlify / GitHub Pages / Cloudflare Pages），不涵蓋 self-hosted VPS（太複雜，讓有需要的人自行參考 deployment.md）

## 任務清單

- [x] Sanitize `docs/deployment.md`：將 `lewsi.ddns.net`、`lewsi`、`/home/lewsi/workspace/SmartResumeBuild/smartresume` 替換為 placeholder（例如 `your-domain.example.com`、`<vps-user>`、`/var/www/smartresume`）
- [x] 檢查並同步更新 workflow 註解或 README 內若引用相同個人資料的段落
- [x] 新增 `docs/deploy-options.md`：
  - [x] Vercel 部署步驟（Git 觸發，推薦給 fork 使用者）
  - [x] Netlify 部署步驟
  - [x] GitHub Pages 部署步驟（含 `VITE_BASE` 說明）
  - [x] Cloudflare Pages 部署步驟
  - [x] 結尾指向 `deployment.md` 給需要 self-hosted VPS 的進階使用者
- [x] README 部署章節加上 `docs/deploy-options.md` 連結（中英兩版）
- [x] `npm run build` 確認無影響（docs-only 理論上無風險，但仍驗證）
