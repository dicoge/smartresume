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
    items: ['Unity', 'Unity UI (uGUI)', 'Vue.js 3', 'Nuxt', 'Node.js', 'Express', 'React', 'Expo'],
  },
  {
    id: 'ai_stack',
    icon: '🧠',
    items: ['Unity AI', 'Game Design Patterns', 'HTML5 Canvas', 'Puppeteer'],
  },
  {
    id: 'specializations',
    icon: '🎯',
    items: ['Game Development', 'Performance Optimization', 'Full-Stack Development', 'Cross-platform Deployment', 'Vercel'],
  },
]
