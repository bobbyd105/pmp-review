# Curriculum Architecture Audit Report

## Executive Summary

The repository now has a complete, validated planning framework for expanding from ECO-task review into a comprehensive PMP curriculum without changing production lesson or question content.

The core architectural decision is to maintain **one canonical curriculum catalog** and expose it through:

- a 59-unit Comprehensive Course;
- the existing 26-lesson ECO Review track;
- shared reference/glossary/formula assets;
- a shared objective-based assessment layer.

The new `data/content_coverage.json` catalog contains 13 modules and 59 concept units. Every unit maps to at least one ECO task, PMBOK concept/process/domain reference, local source ID, and zero or more current lesson anchors. Coverage strength is tracked separately from implementation lifecycle.

The architecture checkpoint passed: validation and the read-only dashboard required no changes to `data/questions.json` or `data/lessons.json`.

The most important repository risk discovered is the question bank’s answer cueing: 371 of 384 correct answers are option B, and 349 correct answers are the longest option. The bank is broad across ECO tasks but cannot be treated as calibrated mastery evidence until that bias is remediated in a dedicated reviewed slice.

## Repository Assessment

The app is a local-first React/Vite hybrid study platform with a lightweight exam-simulation quiz mode. It has strong simplicity and data ownership:

- local static JSON content;
- browser-local quiz session/history;
- no backend or AI API;
- pure quiz/history/validation modules;
- explicit read-only/clipboard-only authoring tools;
- 14 passing test files after this slice.

It is not a full exam simulator because it lacks timed/full-length modes, blueprint-balanced quiz assembly, flag/review navigation, and calibration. It is not a comprehensive course because current lessons are concise ECO overviews without objectives, prerequisites, concept metadata, or source traceability.

Documentation was uneven: the app map was strong, content counts were accurate, and README was effectively empty. The audit adds durable architecture and improves onboarding while leaving unrelated governance unchanged.

## Source Assessment

All 11 local PDFs were inventoried. Together they cover:

- foundations and vocabulary;
- principles/mindset;
- life cycles and delivery approaches;
- seven performance domains and the 40-process model;
- common ITTO patterns;
- predictive process mechanics;
- agile frameworks, leadership, product delivery, estimation, and flow;
- formulas and quantitative interpretation;
- responsible AI and project-management use cases.

The library is sufficient as a research base for the planned architecture. It is not a publication license or substitute for current official PMI verification. Source files and the two local planning maps remain ignored/uncommitted. Repository documents use original summaries and stable source IDs, not copied text.

## Curriculum Assessment

Current content is strongest as an ECO Review track:

- 26/26 ECO tasks have a lesson;
- all 384 questions are linked from the matching task lesson;
- domain distribution closely matches current documented ECO weights;
- lessons consistently reinforce common PMP decision patterns.

The comprehensive catalog assesses current concept coverage as:

| Rating | Units |
|---|---:|
| Strong | 9 |
| Partial | 29 |
| Thin | 11 |
| Missing | 10 |

Lifecycle assessment:

| Status | Units |
|---|---:|
| Existing lesson anchor | 30 |
| Planned dedicated unit | 29 |
| Approved | 0 |
| Implemented comprehensive unit | 0 |

The learning sequence begins with foundations, principles, approaches, and the PMBOK structural model; then deepens integration and delivery domains; then covers agile/hybrid and AI. ECO Review becomes a compression/revision track rather than the teaching spine.

## Coverage Gaps

### Structural/foundation

- project/program/portfolio/operations distinctions;
- project versus product management;
- PMO and organizational structures;
- sustainability;
- PMBOK 8 domains/focus areas/process orientation.

### Predictive mechanics

- requirements elicitation and traceability;
- scope statement/WBS/baseline depth;
- full schedule development and network logic;
- full EVM/forecasting and financial selection metrics;
- stakeholder-analysis models;
- quantitative risk and residual/secondary risk treatment;
- common ITTO distinctions as a reusable layer.

### Agile/hybrid

- Scrum roles/events/artifacts;
- Kanban/Lean flow mechanics;
- agile estimation and forecasting;
- hybrid governance/delivery integration.

### AI

All four planned AI units are Missing as dedicated instruction: foundations, adoption levels, responsible use, and process/life-cycle use cases.

## Architecture Decisions

1. One canonical catalog, multiple learning tracks.
2. Preserve current lessons as ECO overview assets.
3. Separate coverage strength from lifecycle status.
4. Keep production content schemas unchanged in this engagement.
5. Derive counts from mappings instead of storing stale totals.
6. Treat objectives as the future atomic mastery/assessment unit.
7. Store learner/adaptive/spaced-repetition state separately from seed content.
8. Keep source references internal and copyright-safe.
9. Require User approval before Planned content becomes Approved or Implemented.

These are working architecture proposals subject to User final authority under the collaboration agreement.

## Metadata Decisions

The future target metadata includes:

- stable unit/objective IDs;
- module/sequence/prerequisites;
- canonical ECO edition/domain/task mappings;
- PMBOK domain/focus/process/principle/approach/reference mappings;
- learning objectives and misconception tags;
- cognitive demand and proposed/calibrated difficulty;
- item/lesson type;
- source traceability and review dates;
- version, lifecycle, review, and deprecation metadata.

The current `content_coverage.json` is planning infrastructure, not a silent production migration. A future normalization loader may infer legacy mappings, but inferred metadata must be marked and reviewed.

## Question Recommendations

Priority order:

1. Remediate answer-position and answer-length bias across the full bank.
2. Add canonical ECO task validation.
3. Add objective/concept mappings.
4. Add reviewed cognitive-demand/difficulty metadata.
5. Add scenario/item-type and distractor-misconception diversity.
6. Add targeted questions only for approved concept objectives.
7. Collect privacy-preserving item performance before claiming calibration.

Do not generate additional broad ECO volume merely to raise counts.

## Lesson Recommendations

- Preserve all 26 current overviews.
- Approve concept units and objectives in small batches.
- Build Priority A foundations before isolated technical lessons.
- Add prerequisite and source metadata through a dedicated migration.
- Use worked examples/reference sheets for formulas and comparisons.
- Derive question lists from objective mappings once reliable.
- Expand the renderer only when approved lesson formats require it.

## Future Roadmap

### Stage 1 — Review and remediation

- User reviews/approves curriculum model and contracts.
- Dedicated bank-quality slice fixes answer cues and adds quality controls.
- Official terminology/edition verification is completed.

### Stage 2 — Metadata foundation

- Approve registries and schema migration.
- Normalize legacy lesson/question mappings with inference flags.
- Add canonical objective IDs and validation.

### Stage 3 — Comprehensive content

- Author approved foundation units in sequence.
- Review and implement targeted assessments after each unit.
- Add reference sheets and glossary assets as shared dependencies.

### Stage 4 — Learning intelligence

- Add objective-level diagnostics.
- Add deterministic local adaptive recommendations.
- Add spaced-repetition learner state and independently tested scheduling.
- Calibrate difficulty only after adequate performance evidence.

### Stage 5 — Exam simulation

- Blueprint-balanced assembly;
- timed/full-length modes;
- flag/review navigation;
- quality-controlled item pools and reporting.

## Files Changed

### Planning data

- `data/content_coverage.json`

### Architecture/audit/contracts

- `docs/content/source_inventory.md`
- `docs/content/source_topic_index.json`
- `docs/content/current_content_audit.md`
- `docs/content/curriculum_model.md`
- `docs/content/coverage_matrix.md`
- `docs/content/question_bank_audit.md`
- `docs/content/lesson_audit.md`
- `docs/content/lesson_generation_contract.md`
- `docs/content/question_generation_contract.md`
- `docs/content/metadata_contract.md`
- `docs/content/curriculum_audit_report.md`

### Resumability

- `docs/working/progress.md`
- `docs/working/decision_log.md`
- `docs/working/next_actions.md`

### Planning UI and validation

- `src/coverage/contentCoverage.js`
- `src/components/CurriculumCoverage.jsx`
- `src/__tests__/contentCoverage.test.js`
- `src/__tests__/CurriculumCoverage.test.jsx`
- `src/App.jsx`
- `src/index.css`

### Canonical documentation

- `README.md`
- `docs/content_plan.md`
- `docs/progress.md`
- `docs/app-map.html`

`data/questions.json` and `data/lessons.json` were not modified.

## Tests Run

- Baseline before changes: 12 test files, 114 tests passed.
- Focused coverage tests: 2 files, 9 tests passed.
- Final full suite after implementation: 14 files, 123 tests passed.
- Production build: passed with Vite 8.1.3.
- Build warning: the statically bundled content chunk exceeds 500 kB; non-blocking for the current local MVP.
- Independent catalog check: 13 modules, 59 units, zero invalid module/ECO/source/lesson/status/rating references.
- Rendered headless-browser verification: 59 cards rendered; module/strength/status filters returned the expected four AI Missing/Planned units; mappings/counts displayed; zero console errors.
- Visual review: narrow-layout navigation, filters, badges, and cards remained readable.
- Git checks: no diff in production question/lesson files; no local source files included; no whitespace errors beyond Git line-ending notices.

## Remaining Decisions

1. User approval of the canonical catalog and track architecture.
2. User approval of metadata contracts and migration timing.
3. Scope/order for the bank-wide answer-cue remediation.
4. Official PMI terminology/edition verification and source licensing records.
5. Whether navigation should be grouped before more views are added.
6. The initial objective registry and mastery-evidence rules.
7. Difficulty calibration thresholds and privacy-preserving learner analytics.
8. Which Priority A units are approved for the first content batch.

## Final State

The repository is left with architecture, planning data, validation, tests, documentation, and a read-only coverage screen. Production lessons/questions remain untouched. No commit or push was performed.
