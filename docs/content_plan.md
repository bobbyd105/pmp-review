# Content Plan — Coverage Against the July 2026 ECO

Tracks how the existing question/lesson bank maps onto the current PMP
Exam Content Outline (effective July 9, 2026), which consolidated the
retired 2021 ECO from 35 tasks to 26 (8 People, 10 Process, 8 Business
Environment). See `decision_log.md` Decision #10 for the remap rationale
and the domain/task moves.

Counts below are taken from the actual entries in `data/questions.json`
and `data/lessons.json` — not estimated.

## Coverage status

- **Every one of the 26 ECO tasks has at least one question AND at least one
  lesson.** Breadth is complete on both sides — all 26 of 26 tasks are Q+L.
- Phase 2 depth round 1 added 10 Process questions and 7 People questions;
  round 2 added 34 questions (q049–q082) across all three domains. Phase 3
  added 26 questions (q083–q108), exactly one per ECO task. Phase 4 adds 32
  questions (q109–q140) across People and Process, bringing every People
  task and nine Process tasks to 6 questions. Phase 5 adds 15 questions
  (q141–q155), bringing every Process task and seven Business Environment
  tasks to 6 questions. Phase 6 adds 19 questions (q156–q174): one per
  People and Process task, plus Business Environment Task 4. Phase 7 adds
  18 questions (q175–q192), one per People and Process task. Phase 8 adds
  26 questions (q193–q218), exactly one per ECO task. Phase 9 adds another
  26 questions (q219–q244), exactly one per ECO task. Phase 10 adds another
  26 questions (q245–q270), exactly one per ECO task. Phase 11 adds another
  26 questions (q271–q296), exactly one per ECO task. Phase 12 adds 88
  questions (q297–q384) across all three domains.
- Named-concept gap batches (2026-07-16) add 40 questions (q385–q424)
  targeting concepts the audits found at zero named coverage: the PMBOK 8
  domain/focus-area model and process tailorability, phase gates and sunk
  cost, program/portfolio/PMO/matrix structures, EEF vs. OPA, work
  performance data/information, EVM calculations (CV, SPI/CPI reading,
  EAC selection, TCPI), PERT, communication channels, EMV and decision
  trees, NPV/payback/ROI-vs-NPV, power/interest and salience models, the
  engagement assessment matrix, RACI, Scrum (roles, events, pillars),
  Kanban/flow (WIP, lead vs. cycle time, Little's Law), user stories/
  INVEST, velocity forecasting, MVP vs. MMF, agile values, and responsible
  AI (data leakage, accountability, bias, adoption levels).

## Concept-level curriculum architecture

ECO breadth is not the same as comprehensive instructional coverage. The
architecture audit adds a 59-unit, 13-module Comprehensive Course plan in
`data/content_coverage.json` while preserving the 26 current lessons as an
ECO Review track.

Current concept-unit assessment:

| Coverage strength | Units |
|---|---:|
| Strong | 9 |
| Partial | 29 |
| Thin | 11 |
| Missing | 10 |
| **Total** | **59** |

Lifecycle state is tracked separately: 30 units have an Existing lesson
anchor and 29 require a dedicated Planned unit. None is marked Approved or
Implemented because architecture work does not self-approve curriculum.
See `docs/content/coverage_matrix.md` and
`docs/content/curriculum_model.md` for mappings, dependencies, and the
build sequence.

## Domain weighting (current, July 2026 ECO)

| Domain | Exam weight | Tasks | Questions | Lessons |
|---|---|---|---|---|
| People | 33% | 8 | 138 | 8 |
| Process | 41% | 10 | 176 | 10 |
| Business Environment | 26% | 8 | 110 | 8 |
| **Total** | **100%** | **26** | **424** | **26** |

Business Environment carries roughly a quarter of the exam (26%), not
one-twelfth (8%) as under the 2021 ECO. Its earlier zero-lesson gap is now
closed.

## Status legend

- **Q+L** — has at least one question and one lesson
- **Questions only** — questions but no lesson
- **Lesson only** — a lesson but no question (none remain)
- **No content** — nothing yet (none remain)

## People (8 tasks, 33%)

| Domain | Task | Questions | Lessons | Status |
|---|---|---|---|---|
| People | Task 1: Develop a common vision | 16 | 1 | Q+L |
| People | Task 2: Manage conflicts | 16 | 1 | Q+L |
| People | Task 3: Lead the project team | 20 | 1 | Q+L |
| People | Task 4: Engage stakeholders | 19 | 1 | Q+L |
| People | Task 5: Align stakeholder expectations | 16 | 1 | Q+L |
| People | Task 6: Manage stakeholder expectations | 17 | 1 | Q+L |
| People | Task 7: Help ensure knowledge transfer | 16 | 1 | Q+L |
| People | Task 8: Plan and manage communication | 18 | 1 | Q+L |

## Process (10 tasks, 41%)

| Domain | Task | Questions | Lessons | Status |
|---|---|---|---|---|
| Process | Task 1: Develop an integrated project management plan and plan delivery | 21 | 1 | Q+L |
| Process | Task 2: Develop and manage project scope | 18 | 1 | Q+L |
| Process | Task 3: Help ensure value-based delivery | 20 | 1 | Q+L |
| Process | Task 4: Plan and manage resources | 17 | 1 | Q+L |
| Process | Task 5: Plan and manage procurement | 16 | 1 | Q+L |
| Process | Task 6: Plan and manage finance | 19 | 1 | Q+L |
| Process | Task 7: Plan and optimize quality of products/deliverables | 15 | 1 | Q+L |
| Process | Task 8: Plan and manage schedule | 17 | 1 | Q+L |
| Process | Task 9: Evaluate project status | 18 | 1 | Q+L |
| Process | Task 10: Manage project closure | 15 | 1 | Q+L |

## Business Environment (8 tasks, 26%)

| Domain | Task | Questions | Lessons | Status |
|---|---|---|---|---|
| Business Environment | Task 1: Define and establish project governance | 15 | 1 | Q+L |
| Business Environment | Task 2: Plan and manage project compliance | 14 | 1 | Q+L |
| Business Environment | Task 3: Manage and control changes | 12 | 1 | Q+L |
| Business Environment | Task 4: Remove impediments and manage issues | 12 | 1 | Q+L |
| Business Environment | Task 5: Plan and manage risk | 14 | 1 | Q+L |
| Business Environment | Task 6: Continuous improvement | 16 | 1 | Q+L |
| Business Environment | Task 7: Support organizational change | 13 | 1 | Q+L |
| Business Environment | Task 8: Evaluate external business environment changes | 14 | 1 | Q+L |

## Open items

- **Breadth: complete.** All 26 tasks now have at least one question and at
  least one lesson. No Questions-only, Lesson-only, or No-content tasks
  remain.
- **Question depth:** People tasks have 16–20 questions, Process tasks
  15–21, and Business Environment tasks 12–16 (per-task tables above are
  generated from the live bank).
- **Lesson depth:** each ECO task keeps its one overview lesson (ECO Review
  track); instructional depth now lives in the 62-lesson Comprehensive
  Course in `data/concept_lessons.json`, rendered by the Course view.
- **Cross-references:** at the end of every future content phase, regenerate
  every lesson's `related_question_ids` from exact `eco_domain` + `eco_task`
  matches, then validate that no lesson has an empty match set. Concept
  lessons carry additional hand-curated question links.
- **Concept depth:** the previously Missing structural units (foundations,
  PMBOK 8 map, Scrum, sustainability, AI) now have authored concept lessons
  and targeted questions; see `docs/content/coverage_matrix.md`'s 2026-07-16
  production update. User review at the mission draft PR is the approval
  gate.
- **Question quality:** answer-position cues (remediated 2026-07-13, hard
  40% position gate) and answer-length cues (remediated 2026-07-16, hard
  strict-longest/ratio/strict-shortest gates — see decision_log.md #12) are
  both resolved. Quiz scores are no longer inflatable through answer-form
  heuristics; psychometric difficulty calibration remains future work.
