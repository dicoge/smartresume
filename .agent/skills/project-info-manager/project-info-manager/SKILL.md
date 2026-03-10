---
name: project-info-manager
description: Interactive conversational tool to update individual project details (emoji, category, tags, stats, demo) in 'src/data/projects.ts' and log changes in 'ref_src/projects.md'. Use when the user wants to refine project information or record updates.
---

# Project Info Manager Skill

This skill allows for the precise, conversational update of project metadata.

## Workflow

1. **Identification**: List available project IDs from `src/data/projects.ts`.
2. **Review**: Present current data for the chosen project.
3. **Interview**: Ask the user for specific field updates (e.g., "Would you like to change the category?", "What new tags should we add?").
4. **Execution**: Run the Python script to patch the TypeScript file and append to the Markdown log.
5. **Confirmation**: Show the updated data and confirm success.

## Usage Guide

When a user wants to "edit a project" or "update project info":

1. Use `read_file` on `src/data/projects.ts` to see current projects.
2. Ask the user: "Which project would you like to update? (ID: ...)"
3. After selection, ask: "Which fields would you like to update? You can change emoji, category, tags, stats, or demo URL."
4. Format the updates into a JSON object.
5. Execute:
   ```bash
   python3 .agent/skills/project-info-manager/project-info-manager/scripts/patch_project.py <project_id> '<json_string>'
   ```
6. Verify the changes in both files.

## Resources

- **`scripts/patch_project.py`**: Handles atomic updates to both code and documentation.
