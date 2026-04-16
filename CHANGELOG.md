# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [1.1.0] - 2026-04-16

### Added
- **Job application pipeline** — 3 new skills forming end-to-end workflow:
  - `/jd-match` — JD match analysis + Cover Letter generation
  - `/job-apply` — create `apply/*` branch, customize resume for target job
  - `/job-release` — archive complete application package to `output/releases/`
- **Theme extractor** — `/theme-extractor` skill to extract color palette from any URL or screenshot
- **AGENTS.md** — agent instruction file for non-Claude AI agents (mirrors CLAUDE.md)
- **Bilingual README** — comprehensive zh-TW + English README with prerequisites, use cases, mermaid flowcharts
- **Skill dual-directory sync** — all skills available in both `.claude/skills/` and `.agent/skills/`

### Changed
- Converted project from personal portfolio to reusable template
- Theme switched from Forest Green to Slate Minimal, then to Autumn Sunset
- Moved `jd-match` skill from global `~/.claude/skills/` to project-level `.claude/skills/`
- Updated CLAUDE.md skill path references
- Skills list in README reduced to 5 project-specific skills (utility skills noted separately)

### Removed
- Legacy `.agent/skills/` content (deploy, skill-creator, webapp-testing, agent-browser, Git Commit Helper, project-info-manager, repo-sync)
- GitHub Actions auto-deploy references from README

## [1.0.0] - 2026-04-08

### Added
- Initial release: Vue 3 + Tailwind CSS portfolio website
- Dark/light mode, i18n (zh-TW/EN), typing animation
- `/update-resume` skill for SSOT resume management
- Resume PDF generation (zh/en)
