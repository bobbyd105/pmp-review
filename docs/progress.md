# Progress

## Current Version
v0.2 — Slice 1 complete (Question Bank data foundation)

## Completed Work
- Repository governance established: docs/ai_collaboration_agreement.md,
  docs/project_constitution.md
- Slice 1 — Question Bank data foundation:
  - `data/questions.json`: 12 original PMP-style questions across all 3 ECO
    domains (People ×4, Process ×5, Business Environment ×3), schema:
    id, eco_domain, eco_task, question, options[], correct_answer, explanation
  - Minimal Vite + React scaffold (constitution Section 3) — no router, no
    state library, no backend
  - `QuestionBank` component renders all questions; `QuestionCard` shows
    prompt, options, and a toggleable correct answer + explanation
  - Tests: 12 Vitest tests passing (7 data-contract, 5 component/behavior)
  - Verified in headless Chromium: 12 cards render, toggle works both
    directions, zero console errors/warnings

## Files Modified
- data/questions.json (added)
- package.json, package-lock.json, vite.config.js, index.html, .gitignore (added)
- src/main.jsx, src/App.jsx, src/index.css (added)
- src/components/QuestionBank.jsx, src/components/QuestionCard.jsx (added)
- src/__tests__/setup.js, src/__tests__/questions.data.test.js,
  src/__tests__/QuestionBank.test.jsx (added)
- docs/app-map.html (updated — components, data source, tests)
- docs/progress.md (this file)

## Architecture Changes
- App scaffolded as Vite + React with local JSON seed data, per constitution
  Section 3. Questions are statically imported at build time from
  `data/questions.json` — no fetch layer, no persistence.

## Known Issues
None blocking.

## Technical Debt
- `correct_answer` is stored as the exact option string (not an index); the
  data-contract test enforces that it matches an entry in `options[]`. If
  option text editing becomes frequent, revisit whether an index or option id
  is more robust — decision-log-worthy only if the schema changes.

## Content Accuracy Note
Questions are original, situational, ECO-aligned items (no PMI verbatim
content, per constitution Section 2). Constitution Section 10 requires a
manual accuracy spot-check against the current PMI Exam Content Outline by
the User — code tests alone do not satisfy this; pending User review.

## Current Status
Slice 1 built, tested, and documented on branch
`claude/question-bank-data-ybigll`. Awaiting Review (ChatGPT/Claude audit)
and User approval/manual content spot-check.

## Next Recommended Task
Slice 2 — Quiz Engine (answer selection + scoring), spec to be written by
ChatGPT + User before implementation. Explicitly not started in Slice 1.
