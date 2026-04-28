# SmartResume 維護手冊

> 本文件提供接手此專案所需的所有資訊。

---

## 📌 專案概述

**SmartResume** 是一套 AI 驅動的個人品牌工具包，包含：
- **Portfolio 網站**（Vue 3 + Tailwind CSS + Vite）
- **履歷管理系統**（SSOT 單一資料源）
- **求職流程自動化**（AI Skills 驅動）

**網站網址：** https://smartresume-eta.vercel.app

---

## 🛠 技術棧

| 層級 | 技術 |
|------|------|
| 前端框架 | Vue 3 + Composition API + `<script setup>` |
| 樣式 | Tailwind CSS（dark mode class 策略） |
| 語系 | vue-i18n（繁中 / 英） |
| 建構工具 | Vite + TypeScript |
| AI Skills | Claude Code / 通用 Agent |
| 部署 | Vercel |
| 原始碼託管 | GitHub |

---

## 📁 專案結構

```
SmartResume/
├── src/                         # Vue 3 前端原始碼
│   ├── components/
│   │   ├── layout/              # 版面元件（Header、Footer、ThemeToggle、LanguageSwitcher）
│   │   ├── sections/            # 頁面區塊（Hero、About、Projects、TechStack、Stats、Contact）
│   │   └── ui/                  # UI 元件（ProjectCard）
│   ├── composables/             # useTheme、useLocale、useTyping
│   ├── i18n/
│   │   ├── zh-TW.ts             # 中文翻譯
│   │   └── en.ts                # 英文翻譯
│   ├── data/                    # 靜態資料
│   │   ├── contact.ts           # 聯絡資訊
│   │   ├── projects.ts          # 作品專案
│   │   ├── skills.ts            # 技能條
│   │   ├── techStack.ts         # 技術分類
│   │   └── stats.ts             # GitHub 統計
│   └── types/                   # TypeScript 型別定義
│
├── ref_src/                     # 履歷資料（⭐ 最重要的 SSOT）
│   └── main.md                  # 單一資料源，所有履歷內容從此同步
│
├── public/                      # 靜態資源
│   ├── resume_zh.pdf            # 中文履歷 PDF
│   └── resume_en.pdf            # 英文履歷 PDF
│
├── output/                      # AI Skills 輸出
│   ├── jd-analysis/             # JD 比對分析報告
│   ├── cover-letters/           # 客製化求職信
│   └── releases/                # 封存的應徵資料包
│
├── .claude/skills/              # Skill 定義（Claude Code 專用）
├── .agent/skills/               # Skill 定義（通用 Agent 專用，與 .claude/ 同步）
│
├── docs/                        # 設計規格文件
├── specs/                       # 開發任務 walkthrough
│
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── AGENTS.md                    # AI Agent 開發指引
```

---

## 🔄 更新內容的方式

### 方式一：直接修改檔案（推薦）

所有內容都分散在多個檔案，修改對應檔案即可：

| 要修改的內容 | 對應檔案 |
|-------------|---------|
| 基本資料（姓名、職稱） | `src/i18n/zh-TW.ts`、`src/i18n/en.ts` |
| 聯絡資訊（Email、GitHub） | `src/data/contact.ts` |
| 技能條 | `src/data/skills.ts` |
| 技術分類 | `src/data/techStack.ts` |
| 作品專案 | `src/data/projects.ts` |
| GitHub 統計 | `src/data/stats.ts` |
| **完整履歷（最重要）** | `ref_src/main.md` |

### 方式二：用 AI Skills（推薦給 AI Agent 操作）

需要先安裝 Claude Code，然後在專案目錄執行：

```bash
cd SmartResume
npx claude
```

常用的 AI 指令：

| 指令 | 功能 |
|------|------|
| `/update-resume` | 互動式更新履歷，自動同步所有檔案 |
| `/jd-match` | 分析職缺 JD，輸出匹配度報告 |
| `/job-apply` | 針對特定公司建立分支，客製化履歷 |
| `/theme-extractor` | 從截圖萃取配色並套用到網站 |

### 方式三：修改 SSOT（最完整）

`ref_src/main.md` 是所有資料的**單一來源**。修改這個檔案後，再同步到其他檔案。

**資料流向：**
```
ref_src/main.md (SSOT)
    ├── src/i18n/zh-TW.ts, en.ts
    ├── src/data/*.ts
    └── public/resume_*.pdf
```

---

## 🚀 部署

### 目前的部署方式

本專案部署在 **Vercel**：
- **網址：** https://smartresume-eta.vercel.app
- **Vercel 後台：** https://vercel.com/dicoges-projects/smartresume

### 更新部署（新功能上線）

修改程式碼後，推送到 GitHub 就會自動觸發 Vercel 部署：

```bash
cd SmartResume
git add -A
git commit -m "your commit message"
git push origin master
```

Vercel 會自動偵測到 push 並開始建置，大約 1~2 分鐘後上線。

### 手動觸發 Vercel 部署

如果需要手動部署（不在 GitHub push），需要有 Vercel token：

```bash
npx vercel --prod --token <VERCEL_TOKEN>
```

> **Token 取得：** 請向 current maintainer 取得 Vercel Personal Access Token

### 本地預覽

```bash
cd SmartResume
npm install
npm run dev
# 開啟 http://localhost:5173
```

### 建構 production 版本

```bash
npm run build
# 產出在 dist/ 目錄
```

### 部署到 subpath

如果部署到子路徑（例如 `/smartresume/`）：

```bash
VITE_BASE=/smartresume/ npm run build
```

---

## 🔧 常見維護任務

### 1. 更新個人基本資料

修改 `src/i18n/zh-TW.ts` 和 `src/i18n/en.ts` 中的 `hero` 區塊：

```typescript
// src/i18n/zh-TW.ts
hero: {
  name: '石少斌',           // 姓名
  initials: 'SP',           // 姓名縮寫（頭像用）
  subtitle: '...',          // 副標題
  typingText1: '...',       // 打字動畫文字
  // ...
}
```

### 2. 更新聯絡資訊

修改 `src/data/contact.ts`：

```typescript
export const contact = {
  github: {
    url: 'https://github.com/dicoge',
    handle: '@dicoge',
  },
  email: {
    address: 'kin169999@gmail.com',
  },
  location: 'Taiwan',
}
```

### 3. 新增 / 修改作品專案

修改 `src/data/projects.ts` 和 `src/i18n/` 中對應的翻譯：

```typescript
// src/data/projects.ts
export const projects: Project[] = [
  {
    id: 'myProject',           // 唯一 ID
    emoji: '🎮',               // emoji 圖示
    category: 'Full-Stack',    // 分類：AI Tools / Full-Stack / Tool
    tags: ['Unity', 'C#'],     // 技術標籤
    stats: ['📊 Feature 1'],   // 專案特色
    github: 'https://github.com/dicoge/myProject',
    demo: 'https://myproject.demo.com',  // 選填，有 demo 就加
  },
]
```

**同時更新 i18n 翻譯（兩個檔案都要）：**

```typescript
// src/i18n/zh-TW.ts
projects: {
  myProject: {
    title: '專案名稱',
    subtitle: '副標題',
    description: '專案描述',
  },
}

// src/i18n/en.ts
projects: {
  myProject: {
    title: 'Project Name',
    subtitle: 'Subtitle',
    description: 'Project description',
  },
}
```

### 4. 更新技能

修改 `src/data/skills.ts`（技能條）和 `src/data/techStack.ts`（技術分類）：

```typescript
// 技能條（首頁 About 區塊）
export const skillBars: SkillBar[] = [
  { name: 'Unity', percentage: 85 },
  { name: 'C#', percentage: 80 },
  { name: 'Node.js', percentage: 75 },
  { name: 'Vue.js', percentage: 70 },
]

// 技術分類
export const techCategories: TechCategory[] = [
  {
    id: 'languages',
    icon: '💻',
    items: ['C#', 'JavaScript', 'TypeScript', 'Python'],
  },
  {
    id: 'frameworks',
    icon: '🎨',
    items: ['Unity', 'Vue.js 3', 'Node.js', 'Express'],
  },
  {
    id: 'ai_stack',
    icon: '🧠',
    items: ['Unity AI', 'Game Design Patterns'],
  },
  {
    id: 'specializations',
    icon: '🎯',
    items: ['Game Development', 'Full-Stack Development'],
  },
]
```

### 5. 更新履歷 PDF

目前需要用 AI Skill `/update-resume` 來產生 PDF，或者手動更新 `ref_src/resume_zh.md` 和 `ref_src/resume_en.md` 並執行 PDF 產生流程。

### 6. 更換網站配色

手動修改 `tailwind.config.js` 中的顏色變數：

```javascript
// tailwind.config.js
colors: {
  primary: '#f4a261',     // 主色（按鈕、連結等）
  secondary: '#c1666b',   // 次要色
  accent: '#e9c46a',       // 點綴色
  'dark-bg': '#264653',   // 深色背景
}
```

---

## 🔐 環境變數

`.env.local`（不在 Git 中）用於設定選用功能：

```bash
# Google Analytics（選用）
VITE_GA_ID=G-XXXXXXXXXX

# Contact 表單（選用，Formspree ID）
VITE_FORMSPREE_ID=xxxxxxxx

# 部署 subpath（build 時使用）
VITE_BASE=/smartresume/
```

---

## 🔑 金鑰管理

| 用途 | 取得方式 |
|------|---------|
| GitHub 存取 | 向 current maintainer 取得 GitHub PAT |
| Vercel 部署 | 向 current maintainer 取得 Vercel token |

> **重要：** 所有金鑰均已保存在 Hermes Agent 記憶區塊，接手前請先確認已取得完整權限。

---

## 🐛 疑難排解

### 建構失敗

```bash
npm run build
```

檢查 TypeScript 錯誤，修復後再推送。

### Vercel 部署失敗

1. 檢查 `vercel.com/dicoges-projects/smartresume` 的建構日誌
2. 常見原因：依賴安裝失敗、TypeScript 錯誤

### 本地預覽一片空白

```bash
npm install
npm run dev
```

確認 Node.js 版本為 v18+：`node -v`

### 語系切換無效

檢查瀏覽器 localStorage 中的 `locale` 值，刪除後重新整理即可恢復預設（繁中）。

---

## 📋 維護檢查清單

每次更新內容後確認：

- [ ] `npm run build` 建構成功
- [ ] `git push origin master` 推送成功
- [ ] Vercel 自動部署完成
- [ ] 網站顯示正確（刷新後確認）
- [ ] 中英文切換正常

---

## 📞 聯絡資訊

- **Email：** kin169999@gmail.com
- **GitHub：** https://github.com/dicoge
- **Vercel 專案：** https://vercel.com/dicoges-projects/smartresume
- **原始 repo：** https://github.com/dicoge/smartresume

---

*最後更新：2026-04-28*
