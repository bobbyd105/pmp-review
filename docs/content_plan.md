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
  adds 26 questions (q083–q108), exactly one per ECO task. The bank now has
  at least 4 questions per task.

## Domain weighting (current, July 2026 ECO)

| Domain | Exam weight | Tasks | Questions | Lessons |
|---|---|---|---|---|
| People | 33% | 8 | 34 | 8 |
| Process | 41% | 10 | 41 | 10 |
| Business Environment | 26% | 8 | 33 | 8 |
| **Total** | **100%** | **26** | **108** | **26** |

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
| People | Task 1: Develop a common vision | 4 | 1 | Q+L |
| People | Task 2: Manage conflicts | 4 | 1 | Q+L |
| People | Task 3: Lead the project team | 6 | 1 | Q+L |
| People | Task 4: Engage stakeholders | 4 | 1 | Q+L |
| People | Task 5: Align stakeholder expectations | 4 | 1 | Q+L |
| People | Task 6: Manage stakeholder expectations | 4 | 1 | Q+L |
| People | Task 7: Help ensure knowledge transfer | 4 | 1 | Q+L |
| People | Task 8: Plan and manage communication | 4 | 1 | Q+L |

## Process (10 tasks, 41%)

| Domain | Task | Questions | Lessons | Status |
|---|---|---|---|---|
| Process | Task 1: Develop an integrated project management plan and plan delivery | 4 | 1 | Q+L |
| Process | Task 2: Develop and manage project scope | 4 | 1 | Q+L |
| Process | Task 3: Help ensure value-based delivery | 5 | 1 | Q+L |
| Process | Task 4: Plan and manage resources | 4 | 1 | Q+L |
| Process | Task 5: Plan and manage procurement | 4 | 1 | Q+L |
| Process | Task 6: Plan and manage finance | 4 | 1 | Q+L |
| Process | Task 7: Plan and optimize quality of products/deliverables | 4 | 1 | Q+L |
| Process | Task 8: Plan and manage schedule | 4 | 1 | Q+L |
| Process | Task 9: Evaluate project status | 4 | 1 | Q+L |
| Process | Task 10: Manage project closure | 4 | 1 | Q+L |

## Business Environment (8 tasks, 26%)

| Domain | Task | Questions | Lessons | Status |
|---|---|---|---|---|
| Business Environment | Task 1: Define and establish project governance | 4 | 1 | Q+L |
| Business Environment | Task 2: Plan and manage project compliance | 4 | 1 | Q+L |
| Business Environment | Task 3: Manage and control changes | 4 | 1 | Q+L |
| Business Environment | Task 4: Remove impediments and manage issues | 5 | 1 | Q+L |
| Business Environment | Task 5: Plan and manage risk | 4 | 1 | Q+L |
| Business Environment | Task 6: Continuous improvement | 4 | 1 | Q+L |
| Business Environment | Task 7: Support organizational change | 4 | 1 | Q+L |
| Business Environment | Task 8: Evaluate external business environment changes | 4 | 1 | Q+L |

## Open items

- **Breadth: complete.** All 26 tasks now have at least one question and at
  least one lesson. No Questions-only, Lesson-only, or No-content tasks
  remain.
- **Question depth:** every task now has at least 4 questions. People Task
  3 has 6; Process Task 3 and Business Environment Task 4 have 5; all other
  tasks have 4.
- **Lesson depth:** every task has exactly one lesson except where noted;
  adding depth per task is the Phase 2 counterpart to question depth.
- **Cross-references:** at the end of every future content phase, regenerate
  every lesson's `related_question_ids` from exact `eco_domain` + `eco_task`
  matches, then validate that no lesson has an empty match set.
