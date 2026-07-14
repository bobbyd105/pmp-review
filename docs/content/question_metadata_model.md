# Question Metadata Model

## Purpose and migration boundary

This model defines the target metadata needed for concept-level assessment,
quality review, analytics, and adaptive learning. It does not modify
`data/questions.json` and does not authorize question generation.

A future migration should use a versioned sidecar registry or a reviewed
schema-v2 loader so existing question text and IDs remain stable. Inferred
mappings must be marked `inferred` until reviewed.

## Target record

```json
{
  "question_id": "q001",
  "schema_version": 2,
  "primary_concept_id": "C044",
  "objective_ids": ["C044-O1"],
  "lesson_ids": ["PL-C044"],
  "eco_mappings": [{ "edition": "2026-07", "domain": "People", "task": "..." }],
  "pmbok_mappings": ["domain:Resources"],
  "bloom_level": "Apply",
  "cognitive_demand": "Apply",
  "proposed_difficulty": "Application",
  "calibration_status": "uncalibrated",
  "scenario_type": "situational-best-action",
  "exam_trap_ids": ["M-PREMATURE-ESCALATION"],
  "formula_ids": [],
  "glossary_ids": [],
  "reference_sheet_ids": [],
  "estimated_completion_seconds": 90,
  "confidence_weight": 1.0,
  "adaptive_tags": ["conflict", "interests-before-positions"],
  "mapping_status": "reviewed",
  "review_status": "Technical Review",
  "reviewer_ids": [],
  "last_reviewed_on": "YYYY-MM-DD",
  "version": 1
}
```

## Required dimensions

- stable question and schema IDs;
- primary concept plus one or more atomic objectives;
- related planned/production lessons;
- canonical ECO edition/domain/task mappings;
- namespaced PMBOK mappings;
- Bloom/cognitive demand and proposed difficulty;
- scenario/item type;
- exam trap or misconception targets;
- formula, glossary, and reference links;
- expected completion time;
- confidence/evidence weight;
- adaptive tags;
- mapping provenance, review, version, and dates.

## Cognitive and difficulty model

Use `Recall`, `Interpret`, `Apply`, and `Analyze` for assessment demand while
the broader lesson registry uses Bloom levels. Proposed difficulty remains
`Foundation`, `Application`, or `Advanced`. Difficulty is uncalibrated until
adequate privacy-preserving performance evidence exists.

## Scenario and trap registries

Scenario types should be enumerated, including situational best/first action,
sequence, distinction, artifact interpretation, calculation, result
interpretation, root-cause diagnosis, and clearly worded exception. Exam traps
must reference misconception records rather than free-form labels once the
registry exists.

## Answer-option evolution

The future question schema should replace exact answer-string identity with
stable option IDs and a correct option ID. This enables safe option reordering,
option-specific rationale, and position-balance testing while preserving
display text. That migration is separate from this model.

## Adaptive evidence safeguards

- `confidence_weight` cannot overcome insufficient distinct evidence.
- Unreviewed or cue-biased items contribute no mastery evidence.
- Repeated attempts at the same item are not independent evidence.
- Objective evidence must remain explainable back to item IDs and attempts.
- Estimated time supports planning; it is not a difficulty proxy.

## Validation requirements

Validate unique question IDs, existing production IDs, known concept/objective/
lesson/formula/glossary/reference IDs, canonical ECO pairs, PMBOK namespaces,
enums, positive time, bounded confidence weight, mapping provenance, and review
metadata before approval. Bank-level checks must also enforce answer-position,
answer-length, item-type, difficulty, and objective-distribution controls.

## Migration order

1. Approve registries and metadata contract.
2. Remediate current answer-position and length cueing.
3. Add sidecar metadata with mappings marked inferred or reviewed.
4. Review concept/objective mappings in bounded batches.
5. Introduce stable option IDs and rationale metadata.
6. Only then use question evidence for adaptive recommendations.
