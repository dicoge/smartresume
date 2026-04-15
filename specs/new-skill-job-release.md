# Job Release Skill — 應徵資料包封存與交付

- **分支:** `feat/new-skill-job-release`
- **日期:** 2026-04-15

## 描述
建立 `/job-release` skill，在 `apply/*` 分支完成客製化後，封存整套應徵資料包（PDF、JD 分析、Cover Letter、main.md 快照、網站建置），產出交付記錄文件，並在分支上 commit 保存。

## 功能流程

1. **確認狀態** — 確認在 `apply/*` 分支，檢查變更是否完成
2. **Build 網站** — `npm run build` 產出 `dist/`
3. **產出 PDF** — 確認中英文 PDF 已產出
4. **封存資料包** — 複製到 `output/releases/{company}-{date}/`
5. **撰寫交付文件** — README.md 記錄職缺資訊、改動摘要、檔案清單
6. **Commit 封存** — 在 apply 分支上 commit

## 檔案結構

```
.claude/skills/job-release/
├── SKILL.md                          # Skill 定義檔
└── assets/
    └── release-readme-template.md    # 交付文件模板

output/releases/{company}-{date}/     # 封存產出
├── README.md                         # 交付記錄
├── resume_zh.pdf                     # 中文 PDF
├── resume_en.pdf                     # 英文 PDF
├── main-snapshot.md                  # 客製化 main.md 快照
├── jd-analysis.md                    # JD 分析報告
├── cover-letter.md                   # Cover Letter（若有）
└── dist/                             # 網站建置產出
```

## 任務清單
- [x] 建立 `.claude/skills/job-release/` 目錄結構
- [x] 撰寫 `SKILL.md` skill 定義檔
- [x] 建立 `assets/release-readme-template.md` 交付文件模板
- [x] 建立 `output/releases/.gitkeep`
- [x] 測試 skill 完整流程
