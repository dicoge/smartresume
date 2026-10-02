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
  it('should show all 11 projects when filter is "All"', () => {
    const activeFilter = ref<ProjectCategory>('All')
    const filteredProjects = createFilteredProjects(activeFilter.value)
    expect(filteredProjects.value).toHaveLength(11)
  })

  it('should show 3 projects for "AI Tools" filter (holoHunter, pixelOffice, partSmart)', () => {
    const activeFilter = ref<ProjectCategory>('AI Tools')
    const filteredProjects = createFilteredProjects(activeFilter.value)
    expect(filteredProjects.value).toHaveLength(3)
    const ids = filteredProjects.value.map(p => p.id)
    expect(ids).toContain('holoHunter')
    expect(ids).toContain('pixelOffice')
    expect(ids).toContain('partSmart')
  })

  it('should show 2 projects for "Full-Stack" filter (vueExcelDashboard, vueManageSystem)', () => {
    const activeFilter = ref<ProjectCategory>('Full-Stack')
    const filteredProjects = createFilteredProjects(activeFilter.value)
    expect(filteredProjects.value).toHaveLength(2)
    const ids = filteredProjects.value.map(p => p.id)
    expect(ids).toContain('vueExcelDashboard')
    expect(ids).toContain('vueManageSystem')
  })

  it('should show 2 projects for "Tool" filter (dcbotSeries, webPageSlip)', () => {
    const activeFilter = ref<ProjectCategory>('Tool')
    const filteredProjects = createFilteredProjects(activeFilter.value)
    expect(filteredProjects.value).toHaveLength(2)
    const ids = filteredProjects.value.map(p => p.id)
    expect(ids).toContain('dcbotSeries')
    expect(ids).toContain('webPageSlip')
  })

  it('should show 4 Larch projects for "Game" filter', () => {
    const activeFilter = ref<ProjectCategory>('Game')
    const filteredProjects = createFilteredProjects(activeFilter.value)
    expect(filteredProjects.value).toHaveLength(4)
    expect(filteredProjects.value.map(project => project.id)).toEqual(['midnightPassport', 'tenLivesCity', 'neonSpins', 'emberMoon'])
  })
})