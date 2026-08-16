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
| People | 33% | 138 | 32.5% |
| Process | 41% | 176 | 41.5% |
| Business Environment | 26% | 110 | 25.9% |

## ECO task distribution (exact, from schema)

| ECO task | Questions |
|---|---:|
| Business Environment — Task 1: Define and establish project governance | 15 |
| Business Environment — Task 2: Plan and manage project compliance | 14 |
| Business Environment — Task 3: Manage and control changes | 12 |
| Business Environment — Task 4: Remove impediments and manage issues | 12 |
| Business Environment — Task 5: Plan and manage risk | 14 |
| Business Environment — Task 6: Continuous improvement | 16 |
| Business Environment — Task 7: Support organizational change | 13 |
| Business Environment — Task 8: Evaluate external business environment changes | 14 |
| People — Task 1: Develop a common vision | 16 |
| People — Task 2: Manage conflicts | 16 |
| People — Task 3: Lead the project team | 20 |
| People — Task 4: Engage stakeholders | 19 |
| People — Task 5: Align stakeholder expectations | 16 |
| People — Task 6: Manage stakeholder expectations | 17 |
| People — Task 7: Help ensure knowledge transfer | 16 |
| People — Task 8: Plan and manage communication | 18 |
| Process — Task 1: Develop an integrated project management plan and plan delivery | 21 |
| Process — Task 10: Manage project closure | 15 |
| Process — Task 2: Develop and manage project scope | 18 |
| Process — Task 3: Help ensure value-based delivery | 20 |
| Process — Task 4: Plan and manage resources | 17 |
| Process — Task 5: Plan and manage procurement | 16 |
| Process — Task 6: Plan and manage finance | 19 |
| Process — Task 7: Plan and optimize quality of products/deliverables | 15 |
| Process — Task 8: Plan and manage schedule | 17 |
| Process — Task 9: Evaluate project status | 18 |

## Approach distribution (exact, from `approach`)

| Approach | Questions | Share of bank |
|---|---:|---:|
| predictive | 72 | 17.0% |
| adaptive | 32 | 7.5% |
| hybrid | 2 | 0.5% |
| universal | 318 | 75.0% |

## Item-style distribution (exact, from `item_style`)

| Item style | Questions | Share of bank |
|---|---:|---:|
| scenario_judgment | 367 | 86.6% |
| definition_distinction | 22 | 5.2% |
| calculation | 8 | 1.9% |
| interpretation | 23 | 5.4% |
| process_sequence | 4 | 0.9% |

## Concept coverage (exact, from `concept_ids`)

- Concepts in the catalog: 62
- Questions tagged with more than one concept: 5 (1.2%)
- Concepts with ZERO questions: 7
- Concepts with 1–2 questions (shallow): 14

### Concepts with zero questions

| Concept | Title |
|---|---|
| c010 | Project vs. Product Management |
| c011 | What Makes Work a Project? |
| c034 | Product Scope vs. Project Scope |
| c057 | Servant Leadership and Self-Organizing Teams |
| c058 | Hybrid Integration in Practice |
| c059 | AI Foundations for Project Managers |
| c062 | AI Use Cases Across the Project Life Cycle |

### Concepts with 1–2 questions, fewest first

| Concept | Title | Questions |
|---|---|---:|
| c001 | Projects, Programs, Portfolios, and Operations | 1 |
| c005 | Project Charter, Business Case, and Benefits Plan | 1 |
| c007 | Common ITTO Patterns: EEFs, OPAs, Plans, and Documents | 1 |
| c017 | Holistic and Systems Thinking | 1 |
| c023 | Predictive Delivery | 1 |
| c026 | Hybrid Delivery | 1 |
| c027 | Tailoring the Approach | 1 |
| c033 | Requirements Elicitation and Analysis | 1 |
| c060 | Automation, Assistance, and Augmentation | 1 |
| c003 | Project Phases, Deliverables, and Phase Gates | 2 |
| c024 | Iterative and Incremental Delivery | 2 |
| c025 | Adaptive Delivery | 2 |
| c051 | Agile Values, Principles, and Mindset | 2 |
| c056 | MVP, MMF, and Early Value | 2 |

## True AI coverage (exact, via concept_ids mapped to the AI module)

AI module concepts (`data/concept_lessons.json`, module "AI in Project
Management"): c059, c060, c061, c062.

- Questions tagged to an AI-module concept: 4 (0.9%)
- IDs: q421, q422, q423, q424

## True calculation coverage (exact, via item_style = "calculation")

- Questions: 8 (1.9%)
- IDs: q394, q396, q398, q399, q400, q401, q415, q418

## Remaining heuristic signals (keyword matching — no canonical field exists for these)

| Category | Questions matched | Share of bank |
|---|---:|---:|
| Stakeholder / communication cues | 115 | 27.1% |
| Leadership / team / conflict cues | 100 | 23.6% |
| Risk cues | 98 | 23.1% |
| Governance / change-control cues | 72 | 17.0% |
| Business-environment / value cues | 84 | 19.8% |

These five categories are cross-cutting content signals, not assembly
dimensions — `docs/exam_simulator_readiness_audit.md` §1 judged that
`eco_task` already isolates most of this content well enough for exam
assembly, so no dedicated field was added. Treat every count in this
section as an estimate.

## Concept-lesson linkage coverage (legacy — superseded by `concept_ids` above)

- Questions referenced by at least one `concept_lessons.json` entry via
  `related_question_ids` (the old, lesson-authored linkage — retained for
  comparison): 239 (56.4%)
- Questions with no such link: 185 (43.6%)
