# AGENTS.md

Before any implementation task, read in this order:
1. docs/ai_collaboration_agreement.md
2. docs/project_constitution.md
3. docs/progress.md
4. docs/app-map.html
5. The relevant .agent-skills/ file for this task (if one exists)

Steps 1-4 are lightweight orientation. Do not read the full codebase by
default — use docs/app-map.html to identify which specific files are
relevant to the current task, then read only those.

Before making any code changes, state:
- The current project state
- The slice being changed
- Files expected to be touched
- Risks or ambiguities
- Validation plan

No code changes may begin until this context load is complete.

Definition of Done order: Code -> Tests -> Docs -> Map -> Commit. Do not
commit until docs/progress.md and docs/app-map.html are updated to reflect
the change.
