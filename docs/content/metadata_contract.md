# Curriculum Metadata Contract

## Purpose

Metadata is the bridge between content, coverage, assessment, adaptive learning, spaced repetition, and source governance. This contract defines the future target model. The current production question and lesson schemas remain unchanged until a separately approved migration.

## Design principles

1. Stable IDs outlive titles and wording changes.
2. Coverage strength is separate from implementation lifecycle.
3. ECO and PMBOK mappings are many-to-many.
4. Objectives are the atomic assessment/mastery unit.
5. Source pointers prove traceability, not correctness or licensing.
6. Difficulty labels are hypotheses until calibrated.
7. Derived counts are computed, never hand-maintained.
8. Learner state is stored separately from canonical content.

## Registries

The target architecture needs versioned registries for:

- modules and curriculum units;
- learning objectives;
- ECO editions, domains, and tasks;
- PMBOK domains, focus areas, processes, principles, approaches, and references;
- sources and source-topic scopes;
- glossary terms;
- formulas/reference sheets;
- misconception tags;
- reviewers and review events.

Free-form metadata may be used in planning only. Production migration should validate identifiers against registries.

## ID conventions

| Entity | Planning example | Requirement |
|---|---|---|
| Module | `M01` | Stable within curriculum edition |
| Concept unit | `C001` | Stable; not a production lesson ID reservation |
| Objective | `C001-O1` | Parent unit + stable ordinal/slug |
| ECO overview lesson | `l001` | Preserve current IDs |
| Question | `q001` | Preserve current IDs during migration |
| Source | `S1` | Stable even if local filename changes |
| Reference sheet | `R-FORMULAS` | Stable semantic ID |
| Glossary term | `G-RISK-APPETITE` | Stable semantic ID |

IDs are never recycled after deletion; use deprecation metadata.

## Curriculum unit metadata

Required target fields:

```json
{
  "id": "C001",
  "schema_version": 1,
  "title": "What Makes Work a Project?",
  "lesson_type": "concept",
  "module_id": "M01",
  "sequence": 1,
  "lifecycle_status": "Approved",
  "coverage_rating": "Partial",
  "objective_ids": ["C001-O1"],
  "prerequisite_unit_ids": [],
  "eco_mappings": [],
  "pmbok_mappings": [],
  "approaches": ["predictive", "adaptive", "hybrid"],
  "source_refs": [],
  "glossary_ids": [],
  "reference_ids": [],
  "version": 1,
  "last_reviewed_on": "YYYY-MM-DD",
  "review_status": "approved"
}
```

## Objective metadata

Each objective requires:

- stable ID and parent unit;
- observable statement;
- cognitive-demand target;
- ECO and PMBOK mappings (inherited only when exact);
- misconception tags;
- prerequisite objective IDs;
- mastery evidence rule;
- version/review metadata.

Objectives should not combine unrelated actions such as “define, calculate, and lead.” Split them when independent assessment is needed.

## Question metadata

Required future fields beyond the current schema:

- `schema_version`
- `primary_unit_id`
- `objective_ids[]`
- `eco_mappings[]`
- `pmbok_mappings[]`
- `approach`
- `cognitive_demand`
- `proposed_difficulty`
- `calibration_status`
- `item_type`
- `misconception_tags[]`
- `source_refs[]`
- `authoring_method`
- `version`
- `review_status`
- `last_reviewed_on`
- `reviewer_ids[]`

The eventual schema should replace exact answer-string identity with stable option IDs while preserving display text.

## Source-reference metadata

A source reference should contain:

```json
{
  "source_id": "S8",
  "topic": "Develop Schedule",
  "locator": "pages 80-98",
  "use": "concept verification",
  "verified_on": "YYYY-MM-DD"
}
```

- Locators are internal research pointers.
- Do not store copied passages.
- `verified_on` records review freshness, not publication approval.
- Current official PMI material should be a separate, licensable source record when available.

## Lifecycle and review states

Planning lifecycle:

```text
Planned → Approved → Implemented
   ↑          │
   └── revision/de-scope ──┘
```

`Existing` identifies legacy anchors during migration and is not a future workflow transition.

Recommended review states are Draft, Technical Review, Source Review, User Review, Approved, Deprecated. These should be introduced only when a UI/workflow consumes them.

## Coverage calculation

- `coverage_rating` is reviewed judgment with supporting notes.
- Question, lesson, and objective counts are derived from mappings.
- A unit cannot be Strong solely because it has many ECO-aligned questions.
- Approved objectives without adequate independent assessment remain Partial/Thin.
- Deprecated content is excluded from active coverage but retained for history.

## Difficulty and calibration

Store:

- proposed difficulty from the author/reviewer;
- cognitive demand;
- calibration status (`uncalibrated`, `provisional`, `calibrated`);
- aggregate, privacy-preserving performance statistics when sufficient;
- last calibration date and sample threshold.

Do not store personally identifiable learner data in content metadata.

## Versioning

- Increment content `version` for meaning-changing edits.
- Editorial-only changes may remain the same semantic version but still update review metadata according to policy.
- Record `eco_edition` and `pmbok_edition` so future remaps do not overwrite historical meaning silently.
- Migration scripts must be deterministic, reviewed, and tested against referential integrity.

## Duplicate and deprecation metadata

Useful optional fields:

- `supersedes_id`
- `superseded_by_id`
- `duplicate_of_id`
- `deprecated_on`
- `deprecation_reason`

Never delete an ID that appears in learner history without a documented migration strategy.

## Learner-state boundary

Spaced repetition and adaptive fields such as last review, next due date, mastery, and lapse count belong to learner state keyed by objective ID. They must not be written into seed lesson/question records.

## Validation requirements

Future validators must enforce:

- schema version support;
- registry-backed IDs;
- unique IDs and valid references;
- valid lifecycle transitions;
- canonical ECO edition/domain/task pairs;
- PMBOK namespace/registry values;
- at least one objective and mapping for concept lessons/questions;
- source traceability for production instructional content;
- reviewer and last-reviewed metadata before approval;
- no derived counts stored as authoritative fields.

## Migration compatibility

During transition, a normalization loader may translate legacy records into the target shape using the coverage catalog. It must clearly mark inferred mappings and must never present inference as reviewed metadata.
