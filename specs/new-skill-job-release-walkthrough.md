# Job Release Skill — Walkthrough

- **分支:** `feat/new-skill-job-release`
- **日期:** 2026-04-15

## 變更摘要
新增 `/job-release` skill，在 `apply/*` 分支完成客製化後，封存整套應徵資料包（PDF、JD 分析、Cover Letter、main.md 快照、網站建置）到 `output/releases/`，產出交付記錄文件並 commit 保存。

## 修改的檔案

| 檔案 | 變更 | 說明 |
|------|------|------|
| `.claude/skills/job-release/SKILL.md` | 新增 | Skill 定義檔，7 步驟 workflow（確認狀態 → build → PDF → 封存 → 交付文件 → commit → 總結） |
| `.claude/skills/job-release/assets/release-readme-template.md` | 新增 | 交付記錄模板，含職缺資訊、匹配度、改動摘要、檔案清單、還原指引 |
| `output/releases/.gitkeep` | 新增 | 封存產出目錄 |
| `specs/new-skill-job-release.md` | 新增 | 任務規格文件 |

## 技術細節

- **封存架構**: 每次封存產出獨立目錄 `output/releases/{company}-{date}/`，包含 PDF、JD 分析、Cover Letter、main.md 快照、dist/ 網站建置
- **交付文件**: README.md 記錄職缺資訊、匹配度分數、客製化改動摘要（從 master diff 歸納為人類可讀格式）、檔案清單、還原指引
- **分支限制**: 只在 `apply/*` 分支上執行，不動 master 也不動 CLAUDE.md
- **與 job-apply 串接**: job-apply 負責客製化，job-release 負責封存交付，形成完整應徵流程
