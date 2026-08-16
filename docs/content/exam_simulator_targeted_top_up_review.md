# Exam Simulator Targeted Content Top-Up Review

## Verified baseline

The merged PR #26 baseline was counted directly from `data/questions.json`,
not copied from the earlier audit narrative:

| Measure | Verified count |
|---|---:|
| Questions | 424 |
| People / Process / Business Environment | 138 / 176 / 110 |
| Universal / Predictive / Adaptive / Hybrid | 318 / 72 / 32 / 2 |
| Scenario / Interpretation / Definition / Calculation / Sequence | 367 / 23 / 22 / 8 / 4 |
| AI-module questions | 4 |
| Correct-answer positions A / B / C / D | 106 / 106 / 106 / 106 |

The concept audit also reproduced 7 zero-question concepts and 14 concepts
with only 1-2 questions. Formula inspection found that only 6 of the 18
catalog formulas had a true arithmetic item; the eighth calculation item is
velocity forecasting, which is taught in the course but is not one of the 18
formula-catalog entries.

## Shallow-pool decisions

### 1. Exam-critical and expanded

| Gap | Evidence-based action |
|---|---|
| `c026` Hybrid Delivery (1) and `c058` Hybrid Integration (0) | Add 4 genuine cross-mode scenarios. A pool of 6 supports three mocks at a modest 2 hybrid items per mock before forced reuse. |
| `c057` Servant Leadership and Self-Organizing Teams (0) | Cover once inside a real hybrid boundary scenario and once in a standalone adaptive scenario, reaching a minimum depth of 2 without a separate larger batch. |
| `c034` Product Scope vs. Project Scope (0) | Add one scenario and one distinction item, reaching a minimum depth of 2. |
| `c059` AI Foundations (0) and `c062` AI Use Cases (0) | Add 2 questions for each concept. The AI pool rises from 4 to 8, enough for four mocks at 2 AI items per mock before forced reuse, while all four AI concepts become represented. |
| 12 taught formulas with no arithmetic item | Add exactly one genuine calculation for each uncovered formula. This raises the calculation pool from 8 to 20 and gives every taught formula at least one arithmetic item without imposing an arbitrary two-per-formula target. |

The 12 newly exercised formula entries are total float, CPI, SPI, SV, ETC,
VAC, TCPI, triangular three-point estimating, ROI, NPV, payback period, and
benefit-cost ratio. Existing calculations already exercise communication
channels, PERT beta, CV, EAC, EMV, Little's Law, and velocity forecasting.

### 2. Adequately represented indirectly or acceptable at low frequency

`c023` Predictive Delivery, `c024` Iterative and Incremental Delivery, and
`c025` Adaptive Delivery remain numerically shallow as dedicated concepts,
but the bank already has 80 predictive and 33 adaptive questions whose
reasoning depends on those delivery mechanics. Adding definitional approach
items would not deepen simulator variety as efficiently as fixing the actual
6-question hybrid pool.

`c033` Requirements Elicitation, `c051` Agile Values, and `c056` MVP/MMF
remain at 1-2 direct tags but are reinforced by broader scope, agile, and
value-delivery scenarios. `c060` has one dedicated adoption-level item and is
also reinforced by the responsible-use reasoning in the expanded AI pool.

### 3. Supplemental/course-only; no simulator expansion

`c001` Projects/Programs/Portfolios/Operations, `c003` Phases and Gates,
`c005` Charter/Business Case/Benefits Plan, `c007` Common ITTO Patterns,
`c010` Project vs. Product Management, `c011` What Makes Work a Project,
`c017` Systems Thinking, and `c027` Tailoring are foundational review or
umbrella concepts. Their mechanics are reinforced elsewhere, and forcing each
to a numeric floor would add low-value recall items rather than address an
exam-simulator pool constraint. The only zero-question concepts remaining are
therefore the intentionally accepted `c010` and `c011`.

## Smallest useful batch

The approved batch is 23 questions:

- 12 calculations, one per uncovered taught formula;
- 4 hybrid-integration scenarios;
- 4 AI scenarios, two each for the former zero concepts `c059` and `c062`;
- 2 product-scope/project-scope items; and
- 1 additional servant-leadership item (the first is supplied by a hybrid
  scenario).

This is smaller than the prior rough `+28 calculation / +6-10 AI / about a
dozen delivery` suggestion because those numbers were not all tied to the
same simulator-use floor. The batch above closes every exam-critical zero,
exercises every taught formula, and gives the two visibly repeating category
pools enough depth for several mocks without padding the bank.

## Newly added questions

| ID | ECO Domain | ECO Task | Approach | Item Style | Concept IDs |
|---|---|---|---|---|---|
| q425 | Process | Task 8: Plan and manage schedule | predictive | calculation | c039 |
| q426 | Process | Task 6: Plan and manage finance | predictive | calculation | c041 |
| q427 | Process | Task 9: Evaluate project status | predictive | calculation | c041 |
| q428 | Process | Task 9: Evaluate project status | predictive | calculation | c041 |
| q429 | Process | Task 6: Plan and manage finance | predictive | calculation | c041 |
| q430 | Process | Task 6: Plan and manage finance | predictive | calculation | c041 |
| q431 | Process | Task 6: Plan and manage finance | predictive | calculation | c041 |
| q432 | Process | Task 8: Plan and manage schedule | predictive | calculation | c038 |
| q433 | Process | Task 3: Help ensure value-based delivery | universal | calculation | c042 |
| q434 | Process | Task 3: Help ensure value-based delivery | universal | calculation | c042 |
| q435 | Process | Task 3: Help ensure value-based delivery | universal | calculation | c042 |
| q436 | Process | Task 3: Help ensure value-based delivery | universal | calculation | c042 |
| q437 | People | Task 8: Plan and manage communication | hybrid | scenario_judgment | c026, c058 |
| q438 | People | Task 3: Lead the project team | hybrid | scenario_judgment | c057, c058 |
| q439 | People | Task 8: Plan and manage communication | hybrid | scenario_judgment | c026, c058 |
| q440 | Business Environment | Task 3: Manage and control changes | hybrid | scenario_judgment | c026, c058 |
| q441 | Business Environment | Task 8: Evaluate external business environment changes | universal | scenario_judgment | c059, c061 |
| q442 | Process | Task 9: Evaluate project status | universal | scenario_judgment | c061, c062 |
| q443 | Process | Task 2: Develop and manage project scope | universal | scenario_judgment | c034 |
| q444 | Process | Task 2: Develop and manage project scope | universal | definition_distinction | c034 |
| q445 | People | Task 3: Lead the project team | adaptive | scenario_judgment | c057 |
| q446 | Business Environment | Task 8: Evaluate external business environment changes | universal | scenario_judgment | c059, c061 |
| q447 | Process | Task 9: Evaluate project status | universal | scenario_judgment | c061, c062 |

## ECO impact and resulting depth

| Domain | Baseline | Final | Baseline share | Final share | Change |
|---|---:|---:|---:|---:|---:|
| People | 138 | 142 | 32.5% | 31.8% | -0.8 pp |
| Process | 176 | 192 | 41.5% | 43.0% | +1.4 pp |
| Business Environment | 110 | 113 | 25.9% | 25.3% | -0.7 pp |
| **Total** | **424** | **447** | **100%** | **100%** | — |

The largest deviation from the documented 33/41/26 blueprint is Process at
about +2.0 percentage points. That is the least-distorting honest outcome:
all 12 uncovered formulas map to Process finance, schedule, status, or value
tasks. Adding unrelated People filler solely to restore the prior percentages
would make the batch larger without addressing an exam-critical gap.

Final category counts are 328 universal / 80 predictive / 33 adaptive / 6
hybrid; 377 scenario judgment / 23 interpretation / 23 definition-distinction
/ 20 calculation / 4 process sequence; and 8 AI-module questions. Correct
answer positions are 112 / 112 / 112 / 111 after the repository's deterministic
option-position script.

Because that script assigns positions from the seeded order of the complete
bank, increasing the bank size deterministically reorders the option arrays on
169 existing questions. A field-by-field comparison against `main` confirms
zero changes to the existing 424 questions' stems, option text, correct-answer
text, explanations, ECO labels, or metadata; only option position changed.
