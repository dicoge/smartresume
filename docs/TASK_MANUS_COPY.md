# SmartResume 文案更新任務

## 背景
- **網站**: dicoge.com (SmartResume，Vue 3 + Vite + TypeScript)
- **部署**: https://dicoge.com
- **技術**: Tailwind CSS + CSS Variables (黑色系主題)

## GitHub 帳號分析 (dicoge)
12 個 public repos，主要專案：

| 專案 | 語言 | 描述 | 部署 |
|---|---|---|---|
| **PartSmart** | TypeScript | 電腦零件查價工具（PC Parts Price Checker）Expo + React Native + Vercel | 未部署 |
| **hunterCard** | HTML | 虛擬卡牌獵人（hololive 卡牌查價）| card-hunter-mu.vercel.app |
| **vue-excel-dashboard** | Vue | Excel 上傳轉互動圖表，ECharts + XLSX | vue-excel-dashboard.vercel.app |
| **DungeonD3** | TypeScript | 地城骰子爬塔遊戲，D20 回合制 Roguelike，5層地城程序生成 | dungeon-d3.vercel.app |
| **ChatGPT-Line-Bot** | Python | LINE Bot 整合 ChatGPT | — |
| **smartresume** | Python | 這個網站本體（forked） | dicoge.com |
| **doorlock** | Vue | 管理系統 | — |
| **DCBOT-cash/admin/answerbook** | JavaScript | Discord 機器人系列 | — |
| **webPageSlip** | Vue | 網頁滑動效果 | — |

## 任務要求

### 1. 更新 Hero Section 文案（src/i18n/zh-TW.ts）

現有 typing texts 太普通，需要更有個性的描述：

現有：
- '打造優質的 Unity 遊戲體驗...'
- '探索 Web 前後端整合開發...'
- '持續學習與成長中...'
- '歡迎交流與合作...'

要求：根據真實技能（Unity 遊戲開發、Node.js、Vue.js、Expo/React Native）重新設計打字稿文案，要具體、有畫面感、有熱情。

### 2. 更新 projects.ts 專案列表

**要新增的專案：**

```typescript
{
  id: 'dungeonD3',
  emoji: '⚔️',
  category: 'Game',
  tags: ['TypeScript', 'HTML5 Canvas', 'Game AI', 'Vercel'],
  stats: ['🎲 D20 系統', '🏰 Roguelike 地城'],
  github: 'https://github.com/dicoge/DungeonD3',
  demo: 'https://dungeon-d3.vercel.app',
},
{
  id: 'partSmart',
  emoji: '💻',
  category: 'AI Tools',
  tags: ['Expo', 'React Native', 'TypeScript', 'Puppeteer', 'Vercel Edge'],
  stats: ['🖥️ PC 零件查價', '⚡ 即時價格'],
  github: 'https://github.com/dicoge/PartSmart',
},
```

### 3. 重新撰寫專案描述（src/i18n/zh-TW.ts）

每個專案描述要：
- 一句話說清楚「這個東西做什麼」
- 提及技術棧（但不要變成規格表）
- 有畫面感，不要制式

**HoloHunter (hunterCard)** — 優化描述：
- 產品：hololive 官方卡牌遊戲（hOCG）查價 App
- 技術：Expo + React Native Web + TypeScript + Puppeteer 爬蟲 + Vercel Edge Functions
- 亮點：支援卡號/成員搜尋、遊々亭即時價格、PWA 可安裝
- 重新寫一個有感的描述

**Vue Excel Dashboard (vueExcelDashboard)** — 優化描述：
- 產品：上傳 Excel 轉互動式數據儀表板
- 技術：Vue 3 + ECharts + XLSX + Vite
- 亮點：支援長條/折線/圓餅圖，熱更新開發體驗

**DungeonD3**（新）：
- 產品：D20 回合制 Roguelike 地城爬塔遊戲
- 技術：原生 HTML5 Canvas + TypeScript，5層程序生成地城
- 亮點：D20 骰子運氣系統、技能升級、Boss 戰鬥、裝備系統
- 描述要用中文，遊戲感強烈

**PartSmart**（新）：
- 產品：PC 零件實時查價工具
- 技術：Expo + React Native + Puppeteer + Vercel Edge
- 亮點：一站式查詢多家通路價格

### 4. About Section 更新

現有專注項目（需更新為更真實的描述）：
- Unity 遊戲開發與引擎優化
- Node.js 後端服務與 API 開發
- Vue.js 前端介面與使用者體驗

可考慮加一項：Expo / React Native 跨平台 App 開發

### 5. Tech Stack 更新

確認並更新技術棧，根據真實使用：
- Unity + C#
- Node.js / Express
- Vue.js / Nuxt
- React / Expo / React Native
- TypeScript
- Vercel / 部署
- HTML5 Canvas（遊戲）
- Python（LINE Bot, SmartResume backend）

## 執行方式
1. 先閱讀 `/mnt/c/Users/dicoge/smartresume/src/i18n/zh-TW.ts` 完整內容
2. 修改 `/mnt/c/Users/dicoge/smartresume/src/i18n/zh-TW.ts` 更新文案
3. 修改 `/mnt/c/Users/dicoge/smartresume/src/data/projects.ts` 新增 DungeonD3 和 PartSmart
4. 修改 `/mnt/c/Users/dicoge/smartresume/src/data/skills.ts`（如果需要）
5. 修改 `/mnt/c/Users/dicoge/smartresume/src/data/techStack.ts`（如果需要）
6. 全部只改資料/文案，不改任何邏輯或樣式
7. 最後用 `cd /mnt/c/Users/dicoge/smartresume && npm run build` 驗證編譯成功