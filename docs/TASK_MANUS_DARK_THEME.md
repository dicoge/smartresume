# SmartResume 黑色系 UI 主題設計任務

## 背景
- **專案**: SmartResume (dicoge.com)
- **技術**: Vue 3 + Vite + TypeScript
- **部署**: Vercel (https://dicoge.com)
- **現狀**: 目前是預設亮色主題

## 現有主要檔案（請先閱讀）
- `/mnt/c/Users/dicoge/smartresume/index.html` — 入口 HTML
- `/mnt/c/Users/dicoge/smartresume/src/App.vue` — 根元件
- `/mnt/c/Users/dicoge/smartresume/src/style.css` — 全域樣式
- `/mnt/c/Users/dicoge/smartresume/src/components/` — 所有元件

## 設計目標
將 SmartResume 全面改造為**深邃黑色系**，具有高級質感、科技感強烈的視覺風格。

## 設計方向（請全部實現）

### 1. 色彩系統 (CSS Variables)
- `bg-primary`: `#0a0a0f` (深黑，略帶藍調)
- `bg-secondary`: `#12121a` (卡片背景)
- `bg-tertiary`: `#1a1a25` (hover 狀態)
- `text-primary`: `#f0f0f5` (主文字，白色)
- `text-secondary`: `#8888a0` (次要文字，灰紫)
- `accent`: `#6366f1` (主要強調色，靛藍紫)
- `accent-glow`: `rgba(99, 102, 241, 0.3)` (發光效果)
- `border`: `#2a2a3a` (邊框)
- `gradient-hero`: linear-gradient 從 `#0a0a0f` 到 `#1a1a2e`

### 2. Hero Section
- 背景: 極深黑 `#0a0a0f`，或帶微妙的紫色漸層
- 打字效果文字: 亮白色 `#f0f0f5`
- tagline: 灰紫色 `#8888a0`
- 「View Work」按鈕: 靛藍紫漸層按鈕，hover 有 glow 效果

### 3. Navigation
- 背景: 半透明深色 `rgba(10, 10, 15, 0.9)` + backdrop-blur
- 滾動後: 明確的深色邊界線
- 連結: 灰紫色，hover 變成亮白 + 底部 accent 色底線
- 名字 logo: 亮白色粗體

### 4. Sections (About, Experience, Skills, Projects)
- 背景: `#0a0a0f` 或 `#12121a`
- 卡片: `#12121a`，1px `#2a2a3a` 邊框，圓角 12px
- 卡片 hover: 邊框變成 accent 色 + 微弱 glow
- 標題: 亮白色，英文全大寫字母間距加寬
- 次要文字: `#8888a0`

### 5. Projects Section
- 卡片背景: `#12121a`
- Hover: 整體輕微上浮 + accent 邊框 + 陰影 glow
- 按鈕 (Demo / Code): 透明背景 + accent 邊框，hover 填充 accent 色

### 6. Skills/Tools
- 晶片 (chips) 背景: `#1a1a25`
- 文字: `#8888a0`
- Hover: 背景變成 accent 色，文字變白

### 7. Contact Form
- Input/Textarea 背景: `#12121a`
- 邊框: `#2a2a3a`，focus 時邊框變成 accent 色
- 按鈕: accent 漸層，hover 有 glow
- 驗證錯誤文字: 紅色 `#ef4444`

### 8. Footer
- 深黑背景 `#0a0a0f`
- 連結: 灰紫色，hover 變白

### 9. 光效點綴
- Hero 區域底部或角落加一條淡淡的 accent gradient line
- 卡片 hover 時的 glow 效果用 box-shadow

### 10. 平滑過渡
- 所有元素的過渡: `transition: all 0.3s ease`
- 主題切換（如果有的話）要有動畫

## 輸出要求
直接修改以下檔案，不要創建新檔案：
- `/mnt/c/Users/dicoge/smartresume/src/style.css` — 全域 CSS 變數 + reset
- `/mnt/c/Users/dicoge/smartresume/src/App.vue` — 結構（可能需要調整 class）
- 各元件 (About.vue, Experience.vue, Skills.vue, Projects.vue, Contact.vue) — 只改 style 不改邏輯

## 執行原則
1. **不要改任何邏輯** — 只改 CSS/樣式
2. **不要刪除任何動畫效果** — 保留原有的 scroll reveal、typing 等
3. **響應式** — mobile 端看起來也要 ok
4. **一氣呵成** — 盡量一次完成所有修改

## 風格參考
- Vercel / Linear / Raycast 的深色主題
- 背景要夠深，不能是灰色
- 強調色統一用靛藍紫 (#6366f1)
- 質感: 啞光深黑 + 少量光澤點綴