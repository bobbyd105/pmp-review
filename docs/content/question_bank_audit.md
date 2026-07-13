# Question Bank Audit

## Scope and method

All 384 records in `data/questions.json` were analyzed. The audit measured schema consistency, ECO distribution, prompt/explanation length, answer placement, option-length cues, exact and token-similarity duplication, repeated stem shapes, named concept/framework coverage, role diversity, and lesson linkage.

This is a structural/content-architecture audit, not a psychometric validation or official PMI accuracy review.

## Executive assessment

The bank is broad across the 2026 ECO and contains substantial scenario/explanation text, but it is **not exam-ready as a calibrated bank**. A learner can exploit answer-position and answer-length cues: 96.6% of correct answers are option B, and 90.9% are the longest option. Those defects outweigh the otherwise strong task distribution.

The bank’s primary strength is ECO-aligned situational judgment. Its primary gaps are technical concept coverage, named framework/formula depth, varied item formats, reviewed difficulty, and option-quality controls.

## Distribution

| ECO domain | Questions | Bank share | July 2026 ECO weight | Difference |
|---|---:|---:|---:|---:|
| People | 130 | 33.9% | 33% | +0.9 pp |
| Process | 155 | 40.4% | 41% | −0.6 pp |
| Business Environment | 99 | 25.8% | 26% | −0.2 pp |

Domain distribution is unusually close to the current ECO weights. Task counts are also even within domains:

- People: 16–17 per task
- Process: 15–16 per task
- Business Environment: 12–13 per task

This is strong **blueprint breadth**. It is not evidence of concept breadth inside each task.

## Item shape and length

| Measure | Result |
|---|---:|
| Options per question | 4 for all 384 |
| Prompt words | median 41; range 15–65 |
| Explanation words | median 79; range 21–126 |
| Exact duplicate prompts | 0 |
| Exact duplicate explanations | 0 |
| Near duplicates at ≥0.72 token Jaccard | 0 |

The absence of high-threshold text duplicates is positive. It does not rule out conceptual duplication; many questions repeat the same judgment pattern with different scenario details.

## Critical answer-cue defects

### Correct-answer position

| Position | Count | Share |
|---|---:|---:|
| A | 3 | 0.8% |
| B | 371 | 96.6% |
| C | 10 | 2.6% |
| D | 0 | 0% |

Every content cohort after q031 puts almost all or all correct answers in position B. The quiz randomizes question order but does not randomize option order, so this pattern is directly learnable.

### Option length

- Correct option is longest: 349/384 (90.9%).
- Correct option is shortest: 2/384.

Together, position and length provide two independent shortcuts that can inflate scores without content mastery.

### Recommendation

Do not silently shuffle options in production until records have stable option IDs and tests prove `correct_answer` remains correct. Plan a dedicated remediation slice that:

1. adds bank-quality tests/analysis thresholds;
2. reviews distractor plausibility and length balance;
3. balances correct positions across the bank;
4. validates every corrected item manually;
5. re-baselines learner history expectations if necessary.

No question was changed during this audit.

## Scenario diversity

### Stem diversity

- 212 questions end with the equivalent of “What should the project manager do?”
- 18 more ask what the project manager should do first.
- Only 110 normalized final-sentence forms exist across 384 questions.

The bank overuses a valid PMP question pattern. Future items should add “best explanation,” artifact interpretation, comparison, sequencing, calculation interpretation, and exception/diagnosis forms without relying on trick wording.

### Role diversity

Common roles/entities include stakeholders (88 items), vendors (27), sponsors (23), project teams (23), regulators (18), customers (18), and steering committees (10). Underrepresented or absent named roles include:

- Scrum Master: 0
- Business analyst: 0
- PMO: 0
- Program/portfolio context: 2 items
- Functional manager: 2 items

Product Owner appears in only 6 items. Future coverage should reflect the curriculum rather than adding roles merely to hit counts.

## Difficulty audit

The current schema has no difficulty or cognitive-level fields. Difficulty cannot be responsibly inferred from word count.

Observed proxies indicate weak calibration:

- every question has the same four-option format;
- answer-position and answer-length cues reduce effective difficulty;
- no learner-level item statistics exist;
- explanations grow substantially across later cohorts, but longer explanations do not make the questions harder;
- the bank has few direct calculations or artifact-interpretation items.

Future difficulty must be authored as a hypothesis, reviewed against a rubric, and recalibrated from aggregate learner evidence. Recommended levels are Foundation, Application, and Advanced, paired with cognitive demand (Recall, Interpret, Apply, Analyze).

## Concept and terminology coverage

### Stronger areas

- ECO task-aligned stakeholder, communication, leadership, conflict, value, procurement, change, issue, and risk scenarios.
- Predictive change-control and governance judgment.
- Schedule/status and budget decision scenarios at an introductory level.
- Explanations usually state the recommended action and the failure in distractor approaches.

### Thin or missing named coverage

| Concept/framework | Direct named items found |
|---|---:|
| PMBOK 8 domains/focus areas/process map | 0 |
| Scrum | 0 |
| Kanban | 0 |
| XP / Extreme Programming | 0 |
| Hybrid | 2 |
| PMO | 0 |
| RACI | 0 |
| Stakeholder salience/power-interest models | 0 |
| AI / responsible AI | 0 |
| PERT | 0 |
| NPV / ROI / IRR | 0 |
| EMV / decision trees / Monte Carlo | 0 |
| Earned value (named) | 4 |
| CPI | 3 |
| SPI | 2 |

The bank should preserve situational judgment while adding targeted knowledge/application items only after the corresponding concept lessons and objectives are approved.

## Terminology consistency

### Positive

- All records use one of the three valid domain names.
- All 26 task labels match a task/domain pair present in the production bank.
- Risk/issue, change-control, value, and stakeholder language is generally consistent within the broad ECO organization.

### Risks

- Tests do not enforce the canonical task registry, so a future typo would pass.
- Broad terms such as agile, adaptive, and hybrid are not backed by named framework coverage.
- The bank teaches “PMI mindset” patterns but does not tag which principle/misconception an item targets.
- Exact string answers make punctuation or editorial changes brittle.

## Relationship audit

- Every question is referenced by exactly one ECO-task lesson under the current generation rule.
- No dangling or cross-task lesson links were found.
- This proves referential integrity and task alignment only.
- It does not prove that a question assesses the lesson title’s narrower concept.

Future metadata should make question-to-objective mappings explicit and allow a question to support multiple lessons without duplicating it.

## Priority remediation backlog

1. **Blocker for score validity:** correct-answer position and length cue remediation.
2. Add canonical ECO task validation.
3. Add reviewed difficulty and cognitive-demand metadata.
4. Map every question to a primary concept unit and objective.
5. Add duplicate checks at prompt, scenario-template, correct-answer rationale, and concept levels.
6. Target missing concepts only after lessons/objectives are approved.
7. Add option-specific distractor rationales if the review UI will consume them.
8. Collect local, privacy-preserving item performance before claiming calibration.

## What not to do

- Do not generate another broad batch merely to increase counts.
- Do not equate balanced ECO totals with comprehensive coverage.
- Do not label difficulty automatically from length.
- Do not fix answer cues by changing only a few items; treat this as a bank-wide reviewed migration.
