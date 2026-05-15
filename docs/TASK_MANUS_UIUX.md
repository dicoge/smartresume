# Manus UI/UX 美化任務

## 背景
這是石少斌的個人履歷網站 **SmartResume**（https://dicoge.com）。
技術棧：Vue 3 + Vite + TypeScript + Tailwind CSS
專案路徑：/mnt/c/Users/dicoge/smartresume/

現有色彩主題（Autumn Sunset）：
- primary: #f4a261 (coral), #e76f51 (burnt orange)
- secondary: #c1666b (terracotta)
- accent: #e9c46a (warm sand)
- dark-bg: #264653 (deep teal)
- light-bg: #fef9f4 (ivory warm white)

## 需先閱讀的檔案
請先閱讀以下檔案了解目前程式碼結構：
- /mnt/c/Users/dicoge/smartresume/src/components/ui/ProjectCard.vue
- /mnt/c/Users/dicoge/smartresume/src/components/layout/TheHeader.vue
- /mnt/c/Users/dicoge/smartresume/src/components/sections/HeroSection.vue
- /mnt/c/Users/dicoge/smartresume/src/components/sections/AboutSection.vue
- /mnt/c/Users/dicoge/smartresume/src/components/sections/ProjectsSection.vue
- /mnt/c/Users/dicoge/smartresume/src/components/sections/ContactSection.vue
- /mnt/c/Users/dicoge/smartresume/src/components/sections/StatsSection.vue
- /mnt/c/Users/dicoge/smartresume/src/components/sections/TechStackSection.vue
- /mnt/c/Users/dicoge/smartresume/src/components/layout/TheFooter.vue
- /mnt/c/Users/dicoge/smartresume/src/style.css
- /mnt/c/Users/dicoge/smartresume/tailwind.config.js
- /mnt/c/Users/dicoge/smartresume/src/composables/useScrollReveal.ts
- /mnt/c/Users/dicoge/smartresume/src/App.vue

## 需完成的美化任務

### 任務 1：ProjectCard 懸浮效果（/mnt/c/Users/dicoge/smartresume/src/components/ui/ProjectCard.vue）
- 滑鼠懸浮時卡片上升並有陰影
- 在頂層 div 加上 data-testid="project-card" 屬性
- Tag 標籤懸浮時背景色變成 primary-500

### 任務 2：導航列活躍區塊高亮（/mnt/c/Users/dicoge/smartresume/src/components/layout/TheHeader.vue）
- 建立一個 useActiveSection composable（/mnt/c/Users/dicoge/smartresume/src/composables/useActiveSection.ts），用 IntersectionObserver 偵測目前畫面上是哪個 section
- 在 TheHeader 中，目前區塊對應的 nav link 要顯示為 active（文字變 primary-500 或底線）
- Section ID 對應：about → #about, projects → #projects, tech → #tech, contact → #contact

### 任務 3：載入骨架動畫（/mnt/c/Users/dicoge/smartresume/src/App.vue）
- 目前 App.vue 已經有 defineAsyncComponent 和 loadingComponent
- 確認 loadingComponent 的樣式是美觀的骨架（不只是 animate-pulse，加 rounded 和柔和顏色）
- 可以參考主流網站的 skeleton loading 風格

### 任務 4：Scroll reveal 動畫優化（/mnt/c/Users/dicoge/smartresume/src/style.css）
- .sr-hidden 的 transition 改用 cubic-bezier 曲線讓動畫更滑順
- 加上 will-change 提示 GPU 加速
- 現有內容不要破壞，只需更新 .sr-hidden 的 transition 屬性

### 任務 5：按鈕微互動（可在各個 section 檔案中調整）
- 所有按鈕 hover 時加上輕微的 scale 效果（transform: scale(1.02)）
- 確保 transition 平滑（0.2s~0.3s）

## 注意事項
1. 每個檔案修改後請先用 npm run build 確認 build 成功
2. 不要修改 i18n 翻譯檔案
3. 不要修改 data 資料檔案
4. 不要移除任何現有功能
5. 保持 dark mode / light mode 皆正常
6. 保持 RWD 響應式設計
7. 所有修改請在 /mnt/c/Users/dicoge/smartresume/ 目錄下進行
