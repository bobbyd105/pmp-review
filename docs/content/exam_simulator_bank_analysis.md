# Question Bank Composition Analysis (Heuristic)

Generated from `data/questions.json` by
`node scripts/analyze-question-bank.mjs` (also `npm run
questions:analyze-bank`). Supports the Exam Simulator Readiness Audit
(`docs/exam_simulator_readiness_audit.md`). This script never writes to
`data/questions.json`.

## Schema fields present on every question

- `correct_answer`
- `eco_domain`
- `eco_task`
- `explanation`
- `id`
- `options`
- `question`

No question currently carries item-style, delivery-approach, complexity,
PMBOK-8, or topic-tag metadata as explicit fields. The category counts
below are keyword-heuristic estimates over question/option/explanation
text, not derived from real metadata, and are reported as such — they are
NOT a substitute for explicit tagging.

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

## Content-category signals (HEURISTIC — keyword matching, not certified topic tags)

| Category | Questions matched | Share of bank |
|---|---:|---:|
| Scenario-style stem ("what should the PM do first/next") | 253 | 59.7% |
| Calculation / formula cues | 27 | 6.4% |
| Predictive-approach cues | 36 | 8.5% |
| Agile / adaptive cues | 46 | 10.8% |
| Hybrid cues | 4 | 0.9% |
| AI-related cues | 4 | 0.9% |
| Stakeholder / communication cues | 115 | 27.1% |
| Leadership / team / conflict cues | 100 | 23.6% |
| Risk cues | 98 | 23.1% |
| Governance / change-control cues | 72 | 17.0% |
| Business-environment / value cues | 84 | 19.8% |

Categories are not mutually exclusive; a question can match zero or several
patterns. A question matching zero calculation/agile/AI/etc. keywords is
not necessarily uncategorizable — it may simply use different phrasing.
Treat every count in this section as an estimate requiring editorial
confirmation before it drives exam assembly.

## Concept-lesson linkage coverage

- Questions referenced by at least one `concept_lessons.json` entry
  (`related_question_ids`): 239 (56.4%)
- Questions with no concept-lesson link: 185 (43.6%)

Linked questions inherit their lesson's `pmbok8_domains`, `focus_areas`,
and `approaches` tags only by association (one lesson can link many
questions, and the tag describes the lesson's topic, not a verified
per-question judgment). Unlinked questions have no topic/approach signal
beyond ECO domain/task and the heuristic keyword scan above.
