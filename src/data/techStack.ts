import type { TechCategory } from '../types'

export const techCategories: TechCategory[] = [
  {
    id: 'languages',
    icon: '💻',
    items: ['Python (Expert)', 'TypeScript (Advanced)', 'JavaScript (Advanced)', 'MicroPython (Intermediate)', 'Shell Scripting'],
  },
  {
    id: 'frameworks',
    icon: '🎨',
    items: ['Vue.js 3', 'Flask / FastAPI', 'TailwindCSS', 'Bootstrap', 'Vite'],
  },
  {
    id: 'ai_stack',
    icon: '🧠',
    items: ['Antigravity', 'Gemini CLI', 'Claude Code', 'SDD (Spec-Driven Development)', 'AI Skills', 'Vibe Coding', 'AI Agents', 'NanoClaw Deploy', 'MCP (Model Context Protocol)', 'AI-Assisted Full-stack'],
  },
  {
    id: 'specializations',
    icon: '🎯',
    items: ['Technical Analysis', 'Embedded Systems', 'AI/LLM Integration', 'REST API Design', 'Real-time Systems'],
  },
]
