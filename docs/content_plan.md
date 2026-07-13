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
  26 questions (q193–q218), exactly one per ECO task.

## Domain weighting (current, July 2026 ECO)

| Domain | Exam weight | Tasks | Questions | Lessons |
|---|---|---|---|---|
| People | 33% | 8 | 72 | 8 |
| Process | 41% | 10 | 90 | 10 |
| Business Environment | 26% | 8 | 56 | 8 |
| **Total** | **100%** | **26** | **218** | **26** |

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
| People | Task 1: Develop a common vision | 9 | 1 | Q+L |
| People | Task 2: Manage conflicts | 9 | 1 | Q+L |
| People | Task 3: Lead the project team | 9 | 1 | Q+L |
| People | Task 4: Engage stakeholders | 9 | 1 | Q+L |
| People | Task 5: Align stakeholder expectations | 9 | 1 | Q+L |
| People | Task 6: Manage stakeholder expectations | 9 | 1 | Q+L |
| People | Task 7: Help ensure knowledge transfer | 9 | 1 | Q+L |
| People | Task 8: Plan and manage communication | 9 | 1 | Q+L |

## Process (10 tasks, 41%)

| Domain | Task | Questions | Lessons | Status |
|---|---|---|---|---|
| Process | Task 1: Develop an integrated project management plan and plan delivery | 9 | 1 | Q+L |
| Process | Task 2: Develop and manage project scope | 9 | 1 | Q+L |
| Process | Task 3: Help ensure value-based delivery | 9 | 1 | Q+L |
| Process | Task 4: Plan and manage resources | 9 | 1 | Q+L |
| Process | Task 5: Plan and manage procurement | 9 | 1 | Q+L |
| Process | Task 6: Plan and manage finance | 9 | 1 | Q+L |
| Process | Task 7: Plan and optimize quality of products/deliverables | 9 | 1 | Q+L |
| Process | Task 8: Plan and manage schedule | 9 | 1 | Q+L |
| Process | Task 9: Evaluate project status | 9 | 1 | Q+L |
| Process | Task 10: Manage project closure | 9 | 1 | Q+L |

## Business Environment (8 tasks, 26%)

| Domain | Task | Questions | Lessons | Status |
|---|---|---|---|---|
| Business Environment | Task 1: Define and establish project governance | 7 | 1 | Q+L |
| Business Environment | Task 2: Plan and manage project compliance | 7 | 1 | Q+L |
| Business Environment | Task 3: Manage and control changes | 7 | 1 | Q+L |
| Business Environment | Task 4: Remove impediments and manage issues | 7 | 1 | Q+L |
| Business Environment | Task 5: Plan and manage risk | 7 | 1 | Q+L |
| Business Environment | Task 6: Continuous improvement | 7 | 1 | Q+L |
| Business Environment | Task 7: Support organizational change | 7 | 1 | Q+L |
| Business Environment | Task 8: Evaluate external business environment changes | 7 | 1 | Q+L |

## Open items

- **Breadth: complete.** All 26 tasks now have at least one question and at
  least one lesson. No Questions-only, Lesson-only, or No-content tasks
  remain.
- **Question depth:** every People and Process task has 9 questions. Every
  Business Environment task has 7.
- **Lesson depth:** every task has exactly one lesson except where noted;
  adding depth per task is the Phase 2 counterpart to question depth.
- **Cross-references:** at the end of every future content phase, regenerate
  every lesson's `related_question_ids` from exact `eco_domain` + `eco_task`
  matches, then validate that no lesson has an empty match set.
