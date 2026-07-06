# Progress

## Current Version
v0.3 — Slice 2 complete (Quiz Engine)

## Completed Work
- Repository governance established: docs/ai_collaboration_agreement.md,
  docs/project_constitution.md
- Slice 1 — Question Bank data foundation (v0.2): `data/questions.json`
  (12 original questions, 3 ECO domains), `QuestionBank`/`QuestionCard`
  display components, 12 tests
- Slice 2 — Quiz Engine (v0.3):
  - `docs/decision_log.md` created with 3 User-approved entries (schema
    freeze for Slice 2; JSON over SQLite for MVP; localStorage persistence)
  - `src/quiz/quizSession.js`: pure engine — random no-repeat selection
    (default 5, configurable, capped at bank size), submit/advance state
    transitions, score + missed-question selectors, validated localStorage
    save/load (key `pmp-quiz-session-v1`; corrupt/stale state rejected)
  - `Quiz` / `QuizQuestion` / `QuizResults` components: start screen with
    question-count input, one question at a time, options selectable, no
    answer/explanation shown before submit, submit records and advances,
    completion screen with X/N score and missed-question review
    (your answer, correct answer, explanation), Start-new-quiz reset
  - `App` gained a minimal Quiz / Browse-questions view toggle (no router)
  - questions.json schema untouched (success condition 8, Decision #1)
  - Tests: 34 Vitest tests passing (12 from Slice 1 + 13 engine unit tests
    + 9 Quiz component tests)
  - Verified in headless Chromium: quiz flow end-to-end, real page reload
    mid-session resumes at the same question with score intact, completed
    results survive reload, browse view unaffected, zero console
    errors/warnings

## Files Modified
- docs/decision_log.md (added)
- src/quiz/quizSession.js (added)
- src/components/Quiz.jsx, QuizQuestion.jsx, QuizResults.jsx (added)
- src/__tests__/quizSession.test.js, src/__tests__/Quiz.test.jsx (added)
- src/App.jsx (modified — view toggle), src/index.css (modified — quiz styles)
- package.json (version bump)
- docs/app-map.html (updated — quiz components, engine module, localStorage
  data source, tests)
- docs/progress.md (this file)

## Architecture Changes
- Quiz session state lives in browser localStorage (decision_log.md
  Decision #3) behind `quizSession.js` — components never touch
  localStorage directly. Score is derived from stored results, never
  stored separately, so the two cannot disagree.
- Quiz logic is a pure module separated from React components for direct
  unit testing.

## Known Issues
None blocking.

## Technical Debt
- `correct_answer` stored as exact option string (see v0.2 note and
  decision_log.md Decision #1 — revisit before Adaptive Recommendations).
- On submit the quiz advances immediately (per Slice 2 success condition 3);
  per-question correct/incorrect feedback appears only in the end-of-quiz
  review. If the User wants immediate per-question feedback, that is a
  spec change for a future slice, not a bug.

## Content Accuracy Note
Questions unchanged from Slice 1. Constitution Section 10 manual accuracy
spot-check against the PMI ECO remains pending User review.

## Current Status
Slice 2 built, tested, and documented on branch
`claude/question-bank-data-ybigll` (PR #2, which also contains Slice 1 —
not yet merged). Awaiting Review and User approval.

## Next Recommended Task
Progress Tracking across quiz sessions (per-domain performance history) or
Lessons/curriculum foundation — spec to be written by ChatGPT + User before
implementation.
