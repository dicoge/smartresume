export type ProjectCategory = 'All' | 'AI Tools' | 'Full-Stack' | 'Tool'

export interface Project {
  id: string
  emoji: string
  category: ProjectCategory
  tags: string[]
  stats: string[]
  github?: string
  demo?: string
}

export interface SkillBar {
  name: string
  percentage: number
}

export interface TechCategory {
  id: string
  icon: string
  items: string[]
}

export interface GitHubStat {
  id: string
  value: string
}

export type ThemeMode = 'light' | 'dark'

export type Locale = 'zh-TW' | 'en'

export interface ContactData {
  github: { url: string; handle: string }
  linkedin: { url: string; handle: string }
  email: { address: string }
  location: string
  portfolio: string
}
