import { describe, it, expect } from 'vitest'
import { ref, computed } from 'vue'
import { projects } from '../../data/projects'
import type { ProjectCategory } from '../../types'

// Replicate the filtering logic from ProjectsSection
function createFilteredProjects(activeFilter: ProjectCategory) {
  return computed(() => {
    if (activeFilter === 'All') return projects
    return projects.filter(p => p.category === activeFilter)
  })
}

describe('ProjectsSection filtering', () => {
  it('should show all 8 projects when filter is "All"', () => {
    const activeFilter = ref<ProjectCategory>('All')
    const filteredProjects = createFilteredProjects(activeFilter.value)
    expect(filteredProjects.value).toHaveLength(8)
  })

  it('should show 1 project for "AI Tools" filter (holoHunter)', () => {
    const activeFilter = ref<ProjectCategory>('AI Tools')
    const filteredProjects = createFilteredProjects(activeFilter.value)
    expect(filteredProjects.value).toHaveLength(1)
    expect(filteredProjects.value[0].id).toBe('holoHunter')
  })

  it('should show 2 projects for "Full-Stack" filter (vueExcelDashboard, vueManageSystem)', () => {
    const activeFilter = ref<ProjectCategory>('Full-Stack')
    const filteredProjects = createFilteredProjects(activeFilter.value)
    expect(filteredProjects.value).toHaveLength(2)
    const ids = filteredProjects.value.map(p => p.id)
    expect(ids).toContain('vueExcelDashboard')
    expect(ids).toContain('vueManageSystem')
  })

  it('should show 5 projects for "Tool" filter', () => {
    const activeFilter = ref<ProjectCategory>('Tool')
    const filteredProjects = createFilteredProjects(activeFilter.value)
    expect(filteredProjects.value).toHaveLength(5)
    const ids = filteredProjects.value.map(p => p.id)
    expect(ids).toContain('chatGptLineBot')
    expect(ids).toContain('dcbotCash')
    expect(ids).toContain('dcbotAdmin')
    expect(ids).toContain('dcbotAnswerbook')
    expect(ids).toContain('webPageSlip')
  })
})