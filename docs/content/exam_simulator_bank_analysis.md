# Question Bank Composition Analysis (Explicit Metadata)

Generated from `data/questions.json` by
`node scripts/analyze-question-bank.mjs` (also `npm run
questions:analyze-bank`). Supports the Exam Simulator Readiness Audit
(`docs/exam_simulator_readiness_audit.md`) and its 2026-08 metadata
remediation follow-up (`docs/decision_log.md` #15). This script never
writes to `data/questions.json`.

## Schema fields present on every question

- `approach`
- `concept_ids`
- `correct_answer`
- `eco_domain`
- `eco_task`
- `explanation`
- `id`
- `item_style`
- `options`
- `question`

`approach`, `item_style`, and `concept_ids` are explicit, editorially
classified per-question metadata (not keyword-derived) — see
`docs/content/question_metadata_classification_log.md` for the
classification rules and rationale. The five categories below them
(stakeholder/leadership/risk/governance/business-environment) still have no
canonical field and remain keyword-heuristic estimates, clearly labeled.

## ECO domain distribution (exact, from schema)

| Domain | Documented exam weight | Questions | Share of bank |
|---|---:|---:|---:|
| People | 33% | 142 | 31.8% |
| Process | 41% | 192 | 43.0% |
| Business Environment | 26% | 113 | 25.3% |

## ECO task distribution (exact, from schema)

| ECO task | Questions |
|---|---:|
| Business Environment — Task 1: Define and establish project governance | 15 |
| Business Environment — Task 2: Plan and manage project compliance | 14 |
| Business Environment — Task 3: Manage and control changes | 13 |
| Business Environment — Task 4: Remove impediments and manage issues | 12 |
| Business Environment — Task 5: Plan and manage risk | 14 |
| Business Environment — Task 6: Continuous improvement | 16 |
| Business Environment — Task 7: Support organizational change | 13 |
| Business Environment — Task 8: Evaluate external business environment changes | 16 |
| People — Task 1: Develop a common vision | 16 |
| People — Task 2: Manage conflicts | 16 |
| People — Task 3: Lead the project team | 22 |
| People — Task 4: Engage stakeholders | 19 |
| People — Task 5: Align stakeholder expectations | 16 |
| People — Task 6: Manage stakeholder expectations | 17 |
| People — Task 7: Help ensure knowledge transfer | 16 |
| People — Task 8: Plan and manage communication | 20 |
| Process — Task 1: Develop an integrated project management plan and plan delivery | 21 |
| Process — Task 10: Manage project closure | 15 |
| Process — Task 2: Develop and manage project scope | 20 |
| Process — Task 3: Help ensure value-based delivery | 24 |
| Process — Task 4: Plan and manage resources | 17 |
| Process — Task 5: Plan and manage procurement | 16 |
| Process — Task 6: Plan and manage finance | 23 |
| Process — Task 7: Plan and optimize quality of products/deliverables | 15 |
| Process — Task 8: Plan and manage schedule | 19 |
| Process — Task 9: Evaluate project status | 22 |

## Approach distribution (exact, from `approach`)

| Approach | Questions | Share of bank |
|---|---:|---:|
| predictive | 80 | 17.9% |
| adaptive | 33 | 7.4% |
| hybrid | 6 | 1.3% |
| universal | 328 | 73.4% |

## Item-style distribution (exact, from `item_style`)

| Item style | Questions | Share of bank |
|---|---:|---:|
| scenario_judgment | 377 | 84.3% |
| definition_distinction | 23 | 5.1% |
| calculation | 20 | 4.5% |
| interpretation | 23 | 5.1% |
| process_sequence | 4 | 0.9% |

## Concept coverage (exact, from `concept_ids`)

- Concepts in the catalog: 62
- Questions tagged with more than one concept: 13 (2.9%)
- Concepts with ZERO questions: 2
- Concepts with 1–2 questions (shallow): 17

### Concepts with zero questions

| Concept | Title |
|---|---|
| c010 | Project vs. Product Management |
| c011 | What Makes Work a Project? |

### Concepts with 1–2 questions, fewest first

| Concept | Title | Questions |
|---|---|---:|
| c001 | Projects, Programs, Portfolios, and Operations | 1 |
| c005 | Project Charter, Business Case, and Benefits Plan | 1 |
| c007 | Common ITTO Patterns: EEFs, OPAs, Plans, and Documents | 1 |
| c017 | Holistic and Systems Thinking | 1 |
| c023 | Predictive Delivery | 1 |
| c027 | Tailoring the Approach | 1 |
| c033 | Requirements Elicitation and Analysis | 1 |
| c060 | Automation, Assistance, and Augmentation | 1 |
| c003 | Project Phases, Deliverables, and Phase Gates | 2 |
| c024 | Iterative and Incremental Delivery | 2 |
| c025 | Adaptive Delivery | 2 |
| c034 | Product Scope vs. Project Scope | 2 |
| c051 | Agile Values, Principles, and Mindset | 2 |
| c056 | MVP, MMF, and Early Value | 2 |
| c057 | Servant Leadership and Self-Organizing Teams | 2 |
| c059 | AI Foundations for Project Managers | 2 |
| c062 | AI Use Cases Across the Project Life Cycle | 2 |

## True AI coverage (exact, via concept_ids mapped to the AI module)

AI module concepts (`data/concept_lessons.json`, module "AI in Project
Management"): c059, c060, c061, c062.

- Questions tagged to an AI-module concept: 8 (1.8%)
- IDs: q421, q422, q423, q424, q441, q442, q446, q447

## True calculation coverage (exact, via item_style = "calculation")

- Questions: 20 (4.5%)
- IDs: q394, q396, q398, q399, q400, q401, q415, q418, q425, q426, q427, q428, q429, q430, q431, q432, q433, q434, q435, q436

## Remaining heuristic signals (keyword matching — no canonical field exists for these)

| Category | Questions matched | Share of bank |
|---|---:|---:|
| Stakeholder / communication cues | 120 | 26.8% |
| Leadership / team / conflict cues | 104 | 23.3% |
| Risk cues | 99 | 22.1% |
| Governance / change-control cues | 74 | 16.6% |
| Business-environment / value cues | 93 | 20.8% |

These five categories are cross-cutting content signals, not assembly
dimensions — `docs/exam_simulator_readiness_audit.md` §1 judged that
`eco_task` already isolates most of this content well enough for exam
assembly, so no dedicated field was added. Treat every count in this
section as an estimate.

## Concept-lesson linkage coverage (legacy — superseded by `concept_ids` above)

- Questions referenced by at least one `concept_lessons.json` entry via
  `related_question_ids` (the old, lesson-authored linkage — retained for
  comparison): 262 (58.6%)
- Questions with no such link: 185 (41.4%)
