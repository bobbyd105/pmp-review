# Lesson Metadata Model

## Purpose and migration boundary

This model defines metadata for future concept lessons and for classifying the
26 existing lessons as ECO overviews. It does not modify `data/lessons.json`,
write lesson content, or reserve future production `l###` IDs.

Planned concept lessons use `PL-C###` IDs. A future approved migration may map
them to production IDs while preserving the planning relationship.

## Target record

```json
{
  "lesson_id": "PL-C038",
  "schema_version": 2,
  "curriculum_unit_id": "C038",
  "module_id": "M08",
  "sequence": 2,
  "lesson_type": "concept",
  "concept_ids": ["C038"],
  "learning_objective_ids": ["C038-O1", "C038-O2"],
  "prerequisite_concept_ids": ["C037"],
  "related_glossary_ids": ["G-EARNED-VALUE"],
  "related_formula_ids": ["F-CPI", "F-SPI", "F-EAC"],
  "related_reference_sheet_ids": ["R-FORMULA-SHEET"],
  "estimated_duration_minutes": 40,
  "mastery_threshold": {
    "minimum_score_percent": 80,
    "minimum_distinct_evidence_items": 3,
    "objective_requirement": "all"
  },
  "adaptive_unlock_requirements": ["C037"],
  "completion_criteria": ["all objectives mastered"],
  "lifecycle_status": "Planned",
  "review_status": "Draft",
  "version": 1
}
```

## Lesson types

- **Concept lesson** — teaches one coherent capability and owns objectives.
- **ECO overview** — compresses several concepts for task-level review.
- **Worked example** — applies a formula, artifact, or decision sequence.
- **Reference orientation** — teaches how to use a reusable reference asset.
- **Remediation lesson** — narrowly addresses an approved misconception;
  created only when evidence justifies it.

Glossary entries, formula records, reference sheets, and review cards remain
separate asset types rather than being disguised as lessons.

## Sequence and prerequisites

Module and sequence provide a default course order. Prerequisite concepts from
`data/knowledge_graph.json` govern unlock logic. A production lesson cannot
silently weaken or override those dependencies; an exception requires an
explicit reviewed waiver or diagnostic rule.

## Objective and competency alignment

Every concept lesson links to all objectives it teaches. Objective statements,
Bloom level, expected competency, planned time, difficulty, and mastery
threshold remain canonical in `data/learning_objectives.json`. Lesson metadata
references them rather than copying editable statements.

## Completion criteria

Completion is evidence-based, not scroll-based. A concept lesson is complete
when all required objectives meet the approved mastery threshold and required
activities are complete. An ECO overview may use exposure/review completion but
must not be presented as comprehensive concept mastery.

## Adaptive fields

- unlock requirements reference concept/objective IDs;
- remediation relationships identify the concept or misconception addressed;
- recommended review assets reference glossary, formula, and sheet IDs;
- learner completion/mastery state is stored separately from metadata;
- metadata never stores user-specific dates or scores.

## Validation requirements

Validate stable IDs, known unit/module/concept/objective relationships,
sequence uniqueness within a track, prerequisite integrity and acyclicity,
known asset IDs, positive duration, mastery-threshold bounds, lifecycle/review
states, source/reviewer metadata before approval, and explicit edition scope.

## Existing ECO lessons

The 26 current `l###` records should eventually receive sidecar metadata with
`lesson_type: "eco-overview"`, mapped concepts, edition scope, and review data.
Their body text and broad task-level question links remain unchanged until a
separately approved migration.
