import type { TechCategory } from '../types'

export const techCategories: TechCategory[] = [
  {
    id: 'languages',
    icon: '💻',
    items: ['C#', 'JavaScript', 'TypeScript', 'Python'],
  },
  {
    id: 'frameworks',
    icon: '🎮',
    items: ['Unity', 'Unity UI (uGUI)', 'Vue.js 3', 'Nuxt', 'Node.js', 'Express', 'React', 'Expo', 'React Native'],
  },
  {
    id: 'ai_stack',
    icon: '🧠',
    items: ['Unity AI', 'Game Design Patterns', 'HTML5 Canvas', 'Puppeteer', 'Vercel', 'Render'],
  },
  {
    id: 'specializations',
    icon: '🎯',
    items: ['Game Development', 'Performance Optimization', 'Full-Stack Development', 'Cross-platform App Development', 'Vercel / Render Deployment'],
  },
]
