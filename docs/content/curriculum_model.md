# Curriculum Model

## Decision summary

The proposed two-layer idea is directionally correct but should be implemented as **two learning tracks over one canonical curriculum catalog**, not as two independent content trees.

1. **Comprehensive Course** — sequenced concept units that teach foundations, mechanics, and application.
2. **ECO Review** — the existing 26 task-level overview lessons for rapid exam review and mindset reinforcement.
3. **Shared Reference Layer** — glossary, formulas, process maps, comparisons, and checklists used by both tracks.
4. **Shared Assessment Layer** — questions mapped to atomic objectives, concepts, ECO tasks, PMBOK structures, approach, and difficulty.

This arrangement avoids duplicate lessons and lets one concept unit support several ECO tasks. The existing lessons remain intact in purpose.

## Conceptual structure

```text
Canonical curriculum catalog
├── Comprehensive Course track (ordered concept units)
├── ECO Review track (26 existing overview lessons)
├── Reference layer (glossary, formulas, maps, comparisons)
└── Assessment layer (question ↔ objective mappings)
```

## Why the canonical catalog matters

ECO tasks describe exam responsibilities, not an ideal teaching order. PMBOK domains/processes describe a professional system, not a learner’s prerequisite graph. The catalog bridges both:

- learners start with vocabulary and mental models;
- concept units build technical depth;
- ECO reviews compress that knowledge into task-based exam decisions;
- questions test one or more atomic objectives;
- adaptive logic can recommend the smallest missing prerequisite rather than an entire ECO task.

## Thirteen-module comprehensive course

| ID | Module | Units | Primary purpose | Prerequisites | Primary sources |
|---|---|---:|---|---|---|
| M01 | Project Management Foundations | C001–C009 | Vocabulary, value system, roles, boundaries | None | S2, S4, S5 |
| M02 | Principles and PMP Mindset | C010–C016 | Decision principles and behavioral defaults | M01 | S3, S2, S9 |
| M03 | Life Cycles, Approaches, and Tailoring | C017–C022 | Predictive/adaptive/hybrid selection | M01–M02 | S4, S9, S10 |
| M04 | PMBOK 8 Structural Model | C023 | Domains, focus areas, process relationships | M01–M03 | S1, S5, S8 |
| M05 | Governance and Integration | C024–C029 | Authorization, plans, execution, change, closure, sourcing | M04 | S8, S5, S6 |
| M06 | Scope and Quality | C030–C034 | Requirements through acceptance and quality | M04–M05 | S8, S3, S6 |
| M07 | Schedule Management | C035–C036 | Schedule development, critical path, optimization | M04, C032 | S8, S10 |
| M08 | Finance and Value Measurement | C037–C039 | Estimating, budgets, EVM, selection metrics | M01, M04, M07 | S8, S10 |
| M09 | Stakeholder and Communications | C040–C041 | Identification, analysis, engagement, communication | M01–M05 | S8, S5, S9 |
| M10 | Resources, Teams, Leadership, Conflict | C042–C044 | Resource mechanics and people leadership | M02, M04, M09 | S8, S9, S3 |
| M11 | Risk and Uncertainty | C045–C047 | Identification, analysis, response, issues | M03–M05, M08 | S8, S5, S10 |
| M12 | Agile and Hybrid Delivery | C048–C055 | Agile mindset through hybrid integration | M02–M03, M09–M11 | S9, S10, S4 |
| M13 | AI in Project Management | C056–C059 | AI foundations, adoption, responsibility, use cases | M01–M03 | S11, S2 |

The unit IDs and full mappings are defined in `data/content_coverage.json`. They are planning IDs and do not reserve production lesson IDs.

## Lesson taxonomy

### Concept lesson

Teaches one coherent capability in the Comprehensive Course. It owns explicit learning objectives, prerequisites, misconceptions, examples, and assessment mappings.

### ECO overview lesson

Summarizes how several concepts appear within one ECO task and reinforces exam judgment. The current `l001`–`l026` assets belong here.

### Worked example

Applies concepts through a calculation, artifact, or decision sequence. Worked examples should be children of concept lessons, not independent navigation roots unless their scope grows.

### Reference sheet

Provides retrieval support rather than instruction: formulas, process map, comparisons, response strategies, or checklists.

### Glossary entry

Defines one term, lists common confusions, and links to concept lessons and questions.

### Review card

Future spaced-repetition unit derived from an approved objective, misconception, formula, or distinction. It is not the canonical source of instructional truth.

## Learning sequence and dependencies

### Stage 1 — Orientation

M01 → M02 → M03 → M04. Learners establish vocabulary, judgment principles, delivery approaches, and the structural map before detailed processes.

### Stage 2 — Core delivery mechanics

M05 provides the integration spine. M06–M11 then deepen scope/quality, schedule, finance, stakeholders, resources, and risk. These modules may be interleaved after their prerequisites.

### Stage 3 — Adaptive and hybrid delivery

M12 follows life-cycle, people, value, and risk foundations. It should not be a disconnected glossary of agile terms.

### Stage 4 — AI-enabled practice

M13 follows professional responsibility and approach selection. AI use cases then link back into processes without implying autonomous authority.

### Stage 5 — ECO compression

After concept units, ECO Review assembles the relevant overviews for exam-focused rehearsal. Learners may also enter ECO Review directly for rapid revision, with prerequisite gaps surfaced as recommendations.

## Mapping model

### ECO mapping

- A concept unit may map to multiple ECO tasks.
- One mapping can be marked `primary` in the future production schema; planning data currently stores all relevant mappings without rank.
- ECO mappings support blueprint reporting, not teaching order.

### PMBOK mapping

Mappings use namespaced strings in planning data:

- `domain:<name>`
- `focus:<name>`
- `process:<name>`
- `principle:<name>`
- `approach:<name>`
- `reference:<name>`

This avoids prematurely locking a nested schema while keeping values machine-checkable. A future registry should replace free-form suffixes when production metadata is migrated.

### Source mapping

Every planned concept unit has one or more stable source IDs (`S1`–`S11`). Source IDs prove research coverage, not permission to reproduce text. Publication requires original writing and a current official-source verification.

### Assessment mapping

The future question contract should map each question to:

- one or more learning objective IDs;
- one primary concept unit;
- relevant ECO and PMBOK mappings;
- delivery approach;
- cognitive level and reviewed difficulty;
- misconception/distractor tags;
- source/reviewer traceability.

Current `eco_aligned_question_count` values in the coverage catalog are deliberately coarse. They count questions in mapped ECO tasks and must not be represented as direct concept validation.

## Reference layer

### Priority reference sheets

1. PMBOK 8 domain × focus-area process map
2. Common ITTO patterns and critical distinctions
3. Formula and interpretation sheet
4. Risk response strategy comparison
5. Contract type and risk-allocation comparison
6. Organizational structure/authority comparison
7. Agile framework comparison
8. Scrum quick reference
9. Stakeholder analysis models
10. Responsible-AI checklist

### Formula sheet scope

- EVM: BAC, PV, EV, AC, CV, CPI, SV, SPI, EAC variants, ETC, VAC, TCPI
- PERT beta and triangular estimates
- Communication channels
- Float and critical-path relationships
- ROI, PV, NPV, IRR interpretation
- EMV and decision-tree roll-up
- Flow metrics: lead time, cycle time, throughput, WIP, Little’s Law where appropriate

Each formula requires variables, interpretation, decision implications, common traps, and at least one reviewed worked example.

### Glossary scope

Glossary entries should cover core roles, artifacts, plans/documents/logs/registers, process terms, agile events/artifacts, formulas/metrics, and AI terms. Each entry links to a canonical concept unit; lessons link to glossary IDs rather than re-defining terms inconsistently.

## Adaptive learning design

The catalog enables future adaptive behavior without adding AI runtime dependencies:

1. Record performance at objective/concept level, not only ECO domain.
2. Weight evidence by difficulty, recency, and number of independent questions.
3. Recommend missing prerequisites before repeating the failed topic.
4. Separate knowledge gaps from decision-pattern gaps and careless errors.
5. Require a minimum evidence threshold before declaring mastery.

Rules can be deterministic and local. AI may help author content offline but is not required to select the next activity.

## Spaced repetition design

Future review state belongs in browser-local or database-backed learner data, not in seed content. Suggested per-objective state:

- `last_reviewed_at`
- `next_review_at`
- `stability`
- `difficulty_estimate`
- `lapse_count`
- `evidence_question_ids`

Review items should be generated from approved objectives and distinctions. The scheduling algorithm must be independently testable and must not change canonical content.

## AI architecture

### Runtime

No AI API is needed or permitted in the MVP. The app continues to operate offline.

### Authoring

External AI may draft against approved contracts. Drafts must include traceability metadata, undergo structural validation, duplicate checks, content review, and User approval before production inclusion.

### Responsible use

- Never send local copyrighted source files or sensitive learner data to an external service without explicit authority.
- Never accept AI output as factual evidence.
- Preserve human accountability for correctness, fairness, safety, privacy, and licensing.

## Future expansion

The catalog can later support:

- multiple course sequences (beginner, accelerated, formula intensive);
- localized content while sharing objective IDs;
- alternative examples without duplicating objectives;
- exam-edition/version boundaries;
- additional certifications through separate catalogs;
- richer lesson rendering;
- local SQLite learner state when write volume justifies it;
- objective-level analytics and calibration.

These are extension points in the data model, not implementation commitments.

## Migration strategy

1. Validate planning catalog and dashboard (this engagement).
2. Obtain User approval for metadata contracts.
3. Add a versioned metadata registry and normalization loader.
4. Migrate existing lessons/questions in a dedicated reviewed slice without changing content text.
5. Author concept lessons only after their catalog rows are Approved.
6. Generate targeted questions only after lesson objectives are approved.
7. Add learner-state features only after objective mappings are reliable.

## Architectural guardrails

- One canonical objective/concept record; multiple tracks may reference it.
- Coverage strength and lifecycle status remain separate.
- Source traceability is mandatory but source wording is never copied.
- ECO and PMBOK mappings are many-to-many.
- Existing ECO lessons remain overview assets.
- Question counts never substitute for content-quality review.
- Adaptive/spaced-repetition features do not begin until objective mappings and difficulty metadata are trustworthy.
