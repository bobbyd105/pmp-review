# Content Plan — Coverage Against the July 2026 ECO

Tracks how the existing question/lesson bank maps onto the current PMP
Exam Content Outline (effective July 9, 2026), which consolidated the
retired 2021 ECO from 35 tasks to 26 (8 People, 10 Process, 8 Business
Environment). See `decision_log.md` Decision #10 for the remap rationale
and the domain/task moves.

Counts below are taken from the actual entries in `data/questions.json`
and `data/lessons.json` after the remap — not estimated.

## Domain weighting (current, July 2026 ECO)

| Domain | Exam weight | Tasks | Questions | Lessons |
|---|---|---|---|---|
| People | 33% | 8 | 7 | 2 |
| Process | 41% | 10 | 8 | 4 |
| Business Environment | 26% | 8 | 9 | 0 |
| **Total** | **100%** | **26** | **24** | **6** |

**Business Environment now carries roughly a quarter of the exam (26%),
not one-twelfth (8%) as under the 2021 ECO.** It is no longer a rounding
error — question and lesson coverage there needs to grow accordingly. Our
current bank happens to be heaviest in Business Environment questions (9)
but has zero Business Environment lessons, which is the most visible gap.

## Status legend

- **Q+L** — has at least one question and one lesson
- **Questions only** — questions but no lesson
- **Lesson only** — a lesson but no question
- **No content** — nothing yet
- **Name pending** — task exists in the ECO but is not yet referenced by
  any content; its official ECO label still needs to be filled in (not
  guessed) before this row is authoritative

## People (8 tasks, 33%)

| Domain | Task | Questions | Lessons | Status |
|---|---|---|---|---|
| People | Task 1: *(name pending)* | 0 | 0 | Name pending |
| People | Task 2: Manage conflicts | 1 | 1 | Q+L |
| People | Task 3: Lead the project team | 4 | 0 | Questions only |
| People | Task 4: Engage stakeholders | 1 | 0 | Questions only |
| People | Task 5: *(name pending)* | 0 | 0 | Name pending |
| People | Task 6: Manage stakeholder expectations | 0 | 1 | Lesson only |
| People | Task 7: *(name pending)* | 0 | 0 | Name pending |
| People | Task 8: Plan and manage communication | 1 | 0 | Questions only |

## Process (10 tasks, 41%)

| Domain | Task | Questions | Lessons | Status |
|---|---|---|---|---|
| Process | Task 1: Develop an integrated project management plan and plan delivery | 1 | 1 | Q+L |
| Process | Task 2: Develop and manage project scope | 1 | 0 | Questions only |
| Process | Task 3: Help ensure value-based delivery | 2 | 1 | Q+L |
| Process | Task 4: *(name pending)* | 0 | 0 | Name pending |
| Process | Task 5: Plan and manage procurement | 1 | 0 | Questions only |
| Process | Task 6: *(name pending)* | 0 | 0 | Name pending |
| Process | Task 7: Plan and optimize quality of products/deliverables | 1 | 0 | Questions only |
| Process | Task 8: Plan and manage schedule | 1 | 1 | Q+L |
| Process | Task 9: *(name pending)* | 0 | 0 | Name pending |
| Process | Task 10: Manage project closure | 1 | 1 | Q+L |

## Business Environment (8 tasks, 26%)

| Domain | Task | Questions | Lessons | Status |
|---|---|---|---|---|
| Business Environment | Task 1: Define and establish project governance | 1 | 0 | Questions only |
| Business Environment | Task 2: Plan and manage project compliance | 1 | 0 | Questions only |
| Business Environment | Task 3: Manage and control changes | 1 | 0 | Questions only |
| Business Environment | Task 4: Remove impediments and manage issues | 2 | 0 | Questions only |
| Business Environment | Task 5: Plan and manage risk | 1 | 0 | Questions only |
| Business Environment | Task 6: Continuous improvement | 1 | 0 | Questions only |
| Business Environment | Task 7: Support organizational change | 1 | 0 | Questions only |
| Business Environment | Task 8: Evaluate external business environment changes | 1 | 0 | Questions only |

## Open items

- **6 task names are placeholders** (People 1, 5, 7; Process 4, 6, 9).
  These tasks carry no content yet, and their official July 2026 ECO
  labels were not part of the remap mapping. They are marked *(name
  pending)* rather than guessed, consistent with Decision #10's rule that
  ECO labels come from the official PDF, not training-data memory. Fill
  these in from the ECO before treating this plan as complete.
- **Business Environment has zero lessons** despite now being ~26% of the
  exam — the highest-priority authoring gap.
- **People and Process lean on questions over lessons**; several tasks are
  Questions-only.
