# Progress

## Current Version
v0.4 — Slice 3 complete (Progress Tracking + Dashboard)

## Completed Work
- Repository governance established: docs/ai_collaboration_agreement.md,
  docs/project_constitution.md
- Slice 1 — Question Bank data foundation (v0.2, merged via PR #2):
  `data/questions.json` (12 original questions, 3 ECO domains),
  `QuestionBank`/`QuestionCard` display components
- Slice 2 — Quiz Engine (v0.3, merged via PR #2): `quizSession.js` engine,
  `Quiz`/`QuizQuestion`/`QuizResults`, localStorage session persistence,
  docs/decision_log.md created (3 entries)
- Slice 3 — Progress Tracking + Dashboard (v0.4):
  - `src/quiz/quizHistory.js`: append-only quiz history under new
    localStorage key `pmp-quiz-history-v1` (session key untouched). Each
    completed quiz appends: timestamp, score, total, per-domain
    correct/total, missed question ids. Corrupt stored history degrades to
    empty, never crashes. Aggregates: total quizzes, overall accuracy,
    per-domain accuracy — computed from summed tallies, not averaged
    per-quiz percentages.
  - `Quiz.jsx` records history exactly once, at the transition into the
    completed state (final submit) — reloading a finished session does not
    re-record; single-session persistence behavior from Slice 2 unchanged.
  - `Dashboard.jsx` (third nav view in App): quizzes taken, overall
    accuracy, per-domain accuracy table, most recent quiz result with its
    domain breakdown; clear empty state when no history exists.
  - Tests: 49 Vitest tests passing (34 prior + 10 history unit + 4
    Dashboard + 2 Quiz-history integration, minus none removed).
  - Verified in headless Chromium: empty state, two completed quizzes
    accumulate (2 quizzes / 5 questions aggregated correctly), history
    survives a real page reload, zero console errors/warnings.

## Decision #2 Revisit (Slice 3, success condition 4)
Evaluated whether quiz history is the write-heavy per-user state that
justifies moving from localStorage/JSON to SQLite (decision_log.md #2).
Conclusion: **localStorage/JSON still fits cleanly; Decision #2 stands.**
Reasoning: history is append-only (one ~300-byte entry per completed quiz;
even 10 quizzes/day for a year is ~1 MB, well within localStorage limits);
the only read pattern is a full scan to compute aggregates, trivially fast
at this scale; there are no relational queries, no concurrent writers, and
no partial updates. SQLite would require either a backend (none exists —
violates local-first MVP) or a wasm build (heavy dependency with no current
need — constitution Section 3, no premature abstraction). Real revisit
triggers remain: a scaled-up question bank, per-question answer history, or
cross-entity queries (e.g. "all quizzes containing question X").

## Files Modified
- src/quiz/quizHistory.js (added)
- src/components/Dashboard.jsx (added)
- src/__tests__/quizHistory.test.js, src/__tests__/Dashboard.test.jsx (added)
- src/components/Quiz.jsx (modified — one history append on final submit)
- src/App.jsx (modified — third nav view), src/index.css (dashboard styles)
- src/__tests__/Quiz.test.jsx (modified — history integration tests)
- package.json (version bump)
- docs/app-map.html (updated — Dashboard, quizHistory module, history
  storage key, tests)
- docs/progress.md (this file)

## Architecture Changes
- Second localStorage key `pmp-quiz-history-v1` for append-only quiz
  history, fully separate from the active-session key. Aggregate stats are
  always derived from stored entries, never stored, so they cannot drift.
- Same layering as Slice 2: components never touch localStorage directly;
  all storage goes through the pure modules (`quizSession.js`,
  `quizHistory.js`).

## Known Issues
None blocking.

## Technical Debt
- `correct_answer` stored as exact option string (decision_log.md #1 —
  revisit before Adaptive Recommendations).
- No way to clear or export quiz history from the UI yet; only browser
  storage clearing does it. Add when a real requirement appears.
- Dashboard reads history once per mount (fresh on every navigation to the
  view); fine for a single-tab local app, would need revisiting for
  multi-tab sync.

## Content Accuracy Note
Questions unchanged from Slice 1. Constitution Section 10 manual accuracy
spot-check against the PMI ECO remains pending User review.

## Current Status
Slice 3 built, tested, and documented on branch
`claude/question-bank-data-ybigll`, rebuilt from main after PR #2 merged
(Slices 1–2 are on main). Awaiting Review and User approval.

## Next Recommended Task
Lessons/curriculum foundation, or history management (clear/export) —
spec to be written by ChatGPT + User before implementation.
