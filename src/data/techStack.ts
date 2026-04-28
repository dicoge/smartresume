import type { TechCategory } from '../types'

export const techCategories: TechCategory[] = [
  {
    id: 'languages',
    icon: '💻',
    items: ['C#', 'JavaScript', 'TypeScript', 'Python'],
  },
  {
    id: 'frameworks',
    icon: '🎨',
    items: ['Unity', 'Unity UI (uGUI)', 'Vue.js 3', 'Node.js', 'Express'],
  },
  {
    id: 'ai_stack',
    icon: '🧠',
    items: ['Unity AI', 'Game Design Patterns', 'Cross-platform Development'],
  },
  {
    id: 'specializations',
    icon: '🎯',
    items: ['Game Development', 'Performance Optimization', 'Full-Stack Development', 'Cross-platform Deployment'],
  },
]
