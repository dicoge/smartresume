import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'holoHunter',
    emoji: '🃏',
    category: 'AI Tools',
    tags: ['React Native', 'TypeScript', 'Puppeteer', 'Vercel KV'],
    stats: ['🤖 AI 工具', '🚀 已上線'],
    github: 'https://github.com/dicoge/hunterCard',
    demo: 'https://card-hunter-mu.vercel.app',
  },
  {
    id: 'vueExcelDashboard',
    emoji: '📊',
    category: 'Full-Stack',
    tags: ['Vue 3', 'ECharts', 'XLSX', 'Vite'],
    stats: ['📈 數據視覺化', '⚡ 互動儀表板'],
    github: 'https://github.com/dicoge/vue-excel-dashboard',
  },
  {
    id: 'chatGptLineBot',
    emoji: '💬',
    category: 'Tool',
    tags: ['Python', 'LINE Bot', 'Docker', 'ChatGPT'],
    stats: ['💬 AI 對話', '🐳 容器化部署'],
    github: 'https://github.com/dicoge/ChatGPT-Line-Bot',
  },
  {
    id: 'vueManageSystem',
    emoji: '🖥️',
    category: 'Full-Stack',
    tags: ['Vue', 'Vuetify', 'Element Plus', 'Node.js'],
    stats: ['🖥️ 全端系統', '📦 管理後台'],
    github: 'https://github.com/dicoge/doorlock',
  },
]
