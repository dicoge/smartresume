# resume-single-source-of-truth — 開發進度

**分支:** `master`（尚未建立任務分支）
**日期:** 2026-04-09
**狀態:** 進行中（brainstorming 階段）

---

## 規格摘要

建立 `ref_src/main.md` 作為履歷與 Portfolio 的單一資料源（Single Source of Truth），涵蓋完整個人檔案（工作經歷、技能、專案、Hero、About、Contact 等）。搭配 `/resume` Claude Code skill，透過 guided Q&A 更新 `main.md`，並互動式同步變更至網站檔案（`src/data/*.ts`、`src/i18n/*.ts`）。PDF 為半手動更新。

## 已完成

- [x] 探索專案現況，盤點資料分散在哪些檔案（src/data, i18n, ref_src）
- [x] 釐清需求：完整個人檔案範圍、guided Q&A 互動模式、互動式 web sync、半手動 PDF
- [x] 選定方案：純 Markdown + convention-based sections（Approach B）
- [x] 設計 `main.md` 完整結構（Hero, About, Professional Summary, Core Skills, Work Experience, Side Projects, GitHub Stats, Contact, Online Resources）
- [x] 設計 `/resume` skill 流程（觸發詞、Q&A flow、web sync、PDF 提醒）
- [x] 設計 web sync 對應表（main.md section → 目標檔案 + key mapping）
- [x] 撰寫設計規格文件 `docs/superpowers/specs/2026-04-09-resume-single-source-of-truth-design.md`
- [x] Spec self-review（修正 skill 檔名為 SKILL.md）
- [x] 更新 CLAUDE.md（修正色盤、字體、專案數、deploy:ps）

## 待完成

- [ ] 使用者 review spec 文件
- [ ] 進入 writing-plans 產出實作計畫
- [ ] 實作 `ref_src/main.md`（從 resume_new.md 為基底，合併網站資料）
- [ ] 實作 `~/.claude/skills/resume/SKILL.md`
- [ ] 測試 skill 流程（新增專案、更新技能、web sync）
- [ ] Commit 所有變更

---

## 檔案變更清單

```
修改：
  CLAUDE.md — 更新色盤、字體、專案數量、deploy:ps 指令

新增：
  docs/superpowers/specs/2026-04-09-resume-single-source-of-truth-design.md — 設計規格文件
```
