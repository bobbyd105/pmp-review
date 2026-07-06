# Progress

## Current Version
v0.5 — Slice 4 complete (Lessons data foundation)

## Completed Work
- Repository governance established: docs/ai_collaboration_agreement.md,
  docs/project_constitution.md
- Slice 1 — Question Bank data foundation (v0.2, merged via PR #2)
- Slice 2 — Quiz Engine (v0.3, merged via PR #2)
- Slice 3 — Progress Tracking + Dashboard (v0.4, merged via PR #3)
- Slice 4 — Lessons data foundation (v0.5):
  - decision_log.md Decision #4: Lessons schema — flat JSON records with
    markdown-text body and by-id question cross-references; markdown
    rendered as a minimal built-in subset (paragraphs, bold, bullet lists),
    no markdown library, no HTML injection
  - `data/lessons.json`: 3 original, substantive seed lessons across all
    3 ECO domains (conflict management, schedule compression, benefits
    realization), each linking to real question ids. Schema: id,
    eco_domain, eco_task, title, body, optional related_question_ids[].
    Full curriculum content is deliberately NOT in this slice — it will be
    authored separately (Claude-chat's lane per the RACI) and added later.
  - `Lessons` / `LessonCard` components: title, domain/task tags, rendered
    body, related questions shown as the actual prompt text resolved from
    questions.json at render time (dangling ids skipped, never crash)
  - `App` gained "Lessons" as the fourth nav view
  - questions.json and all Quiz/Dashboard behavior untouched (condition 8)
  - Tests: 62 Vitest tests passing (49 prior + 8 lesson data-contract +
    5 Lessons rendering)
  - Verified in headless Chromium: 3 lesson cards render with bold/list
    markdown and 5 related-question links, no raw markdown markers leak,
    Quiz/Browse/Dashboard views regression-checked, zero console
    errors/warnings

## Files Modified
- docs/decision_log.md (Decision #4 added)
- data/lessons.json (added)
- src/components/Lessons.jsx, src/components/LessonCard.jsx (added)
- src/__tests__/lessons.data.test.js, src/__tests__/Lessons.test.jsx (added)
- src/App.jsx (modified — fourth nav view), src/index.css (lesson styles)
- package.json (version bump)
- docs/app-map.html (updated — Lessons components, lessons.json data
  source and its relationship to Question Bank, tests)
- docs/progress.md (this file)

## Architecture Changes
- Second JSON seed file (`data/lessons.json`) following the questions.json
  pattern. Cross-references go one direction: lessons reference question
  ids; questions.json remains the single source of truth for question
  content and knows nothing about lessons.
- Markdown-capable lesson bodies rendered via a minimal inline subset
  (decision_log.md #4) — upgrading to a full markdown renderer is a future
  logged decision, not a schema change.

## Known Issues
None blocking.

## Technical Debt
- `correct_answer` stored as exact option string (decision_log.md #1).
- No clear/export for quiz history (carried from v0.4).
- Lesson body markdown beyond paragraphs/bold/bullets renders as literal
  text until a fuller renderer is adopted (decision_log.md #4 revisit
  trigger: when full curriculum content is authored).

## Content Accuracy Note
The 3 seed lessons are original teaching content aligned to the ECO, but
per the User's note they are schema-proving seeds — full curriculum will be
authored separately. Constitution Section 10 manual accuracy spot-check
(questions AND lessons) remains pending User review.

## Current Status
Slice 4 built, tested, and documented on branch
`claude/question-bank-data-ybigll`, rebuilt from main after PR #3 merged
(Slices 1–3 are on main). Pushed for review — no PR opened for this slice
per instruction. Awaiting Review and User approval.

## Next Recommended Task
Full curriculum content authoring (Claude-chat lane, added via a later
step per the User), or history management (clear/export) — spec to be
written by ChatGPT + User before implementation.
