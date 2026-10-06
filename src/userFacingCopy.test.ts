import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import i18n from './i18n'
import en from './i18n/en'
import zhTW from './i18n/zh-TW'
import ProjectsSection from './components/sections/ProjectsSection.vue'
import StatsSection from './components/sections/StatsSection.vue'
import ProjectCard from './components/ui/ProjectCard.vue'
import { projects } from './data/projects'

const root = resolve(__dirname, '..')
const portfolioWord = /portfolio|作品集/i

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings)
  return []
}

describe('user-facing copy never calls the site a portfolio', () => {
  it.each([['en', en], ['zh-TW', zhTW]])('%s translations', (_, messages) => {
    expect(strings(messages).filter(s => portfolioWord.test(s))).toEqual([])
  })

  it('index.html apple title and PWA manifest name', () => {
    const html = readFileSync(resolve(root, 'index.html'), 'utf8')
    const apple = html.match(/apple-mobile-web-app-title" content="([^"]*)"/)?.[1]
    expect(apple).toBe('石少斌')
    expect(html.match(/<title>[^<]*<\/title>/)?.[0]).not.toMatch(portfolioWord)
    const viteConfig = readFileSync(resolve(root, 'vite.config.ts'), 'utf8')
    for (const name of viteConfig.matchAll(/(?:short_name|name):\s*'([^']*)'/g)) expect(name[1]).not.toMatch(portfolioWord)
  })

  it('homepage eyebrow uses self-introduction wording', () => {
    expect(en.editorial.eyebrow).toMatch(/^SELF-INTRODUCTION/)
    expect(zhTW.editorial.eyebrow).toMatch(/^自我介紹/)
  })
})

describe('game explanation', () => {
  beforeEach(() => { i18n.global.locale.value = 'en' })

  it('states games are built with Larch and unfinished entries stay labelled, in both locales', () => {
    for (const messages of [en, zhTW]) {
      expect(messages.projects.gameNote).toContain('Larch')
      expect(messages.projects.gameNote).toContain(messages.projects.inDevelopment)
      expect(messages.projects.gameNote).toContain(messages.projects.prototype)
      expect(messages.projects.gameNote).not.toMatch(/https?:|completed|已完成|全部完成/)
    }
  })

  it('every Game entry is tagged Larch and unfinished ones keep their status label', () => {
    const games = projects.filter(p => p.category === 'Game')
    expect(games).toHaveLength(8)
    expect(games.every(p => p.tags.includes('Larch'))).toBe(true)
    expect(Object.fromEntries(games.filter(p => p.status).map(p => [p.id, p.status]))).toEqual({
      tenLivesCity: 'inDevelopment', neonSpins: 'prototype', emberMoon: 'inDevelopment',
    })
  })

  it('shows the note for All and Game filters only', async () => {
    const wrapper = mount(ProjectsSection, { global: { plugins: [i18n] } })
    const note = () => wrapper.find('[data-testid="game-note"]')
    expect(note().text()).toContain('Larch')
    const button = (label: string) => wrapper.findAll('.project-filters button').find(b => b.text() === label)!
    await button('Game').trigger('click')
    expect(note().exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="project-card"]')).toHaveLength(8)
    await button('Tool').trigger('click')
    expect(note().exists()).toBe(false)
  })
})

describe('narrow-screen stats cards', () => {
  it('keep value text small until lg so "Active" fits 2-col phones and 4-col 768–1023px tablets', () => {
    const wrapper = mount(StatsSection, { global: { plugins: [i18n] } })
    const grid = wrapper.find('.grid')
    expect(grid.classes()).toEqual(expect.arrayContaining(['gap-3', 'sm:gap-6']))
    const card = grid.find('div')
    expect(card.classes()).toEqual(expect.arrayContaining(['px-2.5', 'py-4', 'sm:p-6']))
    const value = card.find('.gradient-text')
    expect(value.classes()).toEqual(expect.arrayContaining(['text-[1.625rem]', 'lg:text-4xl']))
    expect(value.classes()).not.toContain('text-4xl')
    expect(value.classes()).not.toContain('sm:text-4xl')
    expect(value.classes()).not.toContain('md:text-4xl')
  })
})

describe('HoloHunter brand mark', () => {
  it('renders a decorative mark beside the title and keeps the actual app screenshot', () => {
    const holo = projects.find(p => p.id === 'holoHunter')!
    const wrapper = mount(ProjectCard, { props: { project: holo, index: 0 }, global: { plugins: [i18n] } })
    const mark = wrapper.find('.project-title-row img.project-logo')
    expect(mark.attributes('src')).toMatch(/projects\/holoHunter-mark\.png$/)
    expect(mark.attributes('alt')).toBe('')
    expect(wrapper.find('.project-shot img').attributes('src')).toMatch(/projects\/holoHunter\.webp$/)
    expect(projects.filter(p => p.logo).map(p => p.id)).toEqual(['holoHunter'])
  })
})
