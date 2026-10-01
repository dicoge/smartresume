// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import zh from '../i18n/zh-TW'
import en from '../i18n/en'

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')
const resumePaths = ['ref_src/main.md', 'ref_src/resume_zh.md', 'ref_src/resume_en.md']

describe('resume content consistency', () => {
  it.each(resumePaths)('%s uses the verified identity, employer and dates', path => {
    const content = read(path)
    expect(content).toContain('SHIH SHAO-PIN')
    expect(content).toContain('kin169999@gmail.com')
    expect(content).toContain('IGS')
    expect(content).toContain('2022/06 - 2026/09')
    expect(content).not.toMatch(/Alex Chen|TechCorp|WebStudio|StartupHub|sample-user|example\.com|Sample University|範例大學|8 years|8 年|GPA|Senior Engineer|高階工程師|至今|Present|完成交接|completed handover/)
  })

  it('keeps both website bios aligned with the completed IGS employment', () => {
    expect(zh.hero.subtitle).toContain('軟體前端工程師')
    expect(en.hero.subtitle).toContain('Software Frontend Engineer')
    for (const locale of [zh, en]) {
      expect(locale.about.whatIDoContent).toContain('2022/06')
      expect(locale.about.whatIDoContent).toContain('2026/09')
      expect(locale.hero.subtitle).not.toMatch(/Senior|高階|at IGS/)
    }
  })

  it('does not tell search engines that IGS is the current employer', () => {
    const html = read('index.html')
    const jsonBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map(match => JSON.parse(match[1]))
    const person = jsonBlocks.find(block => block['@type'] === 'Person')
    expect(person.jobTitle).toBe('Software Frontend Engineer')
    expect(person).not.toHaveProperty('worksFor')
    expect(person.description).toContain('2022/06 to 2026/09')
    expect(html).not.toContain('Senior Engineer')
    expect(read('vite.config.ts')).not.toContain('4年Unity/全端工程師')
  })
})
