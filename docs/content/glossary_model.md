# Glossary Model

## Purpose

The glossary is a shared knowledge asset, not a list copied into every
lesson. A canonical entry defines a term once, records likely confusions and
exam traps, and connects the term to concepts, planned lessons, assessments,
formulas, reference sheets, and source-review evidence.

`data/glossary_catalog.json` contains representative records to validate this
architecture. It is deliberately incomplete and is not production content.

## Entry contract

```json
{
  "id": "G-EARNED-VALUE",
  "term": "Earned value (EV)",
  "definition": "Original reviewed definition",
  "common_confusion": "How it differs from a nearby term",
  "exam_trap": "A common reasoning or interpretation error",
  "related_concept_ids": ["C038"],
  "related_lesson_ids": ["PL-C038"],
  "related_question_ids": [],
  "related_formula_ids": ["F-CPI"],
  "related_reference_sheet_ids": ["R-FORMULA-SHEET"],
  "source_references": [
    { "source_id": "S8", "topic": "earned value management" }
  ]
}
```

Production entries should later add schema version, status, edition scope,
synonyms, acronym expansion, pronunciation only when useful, author/reviewer,
last-reviewed date, version, and deprecation metadata.

## Definition rules

- Use original language and the smallest definition that preserves meaning.
- Distinguish the term from its nearest confusable neighbors.
- Do not turn the definition into a full lesson.
- State approach or edition boundaries when a term changes by context.
- Never use “PMI always says” as a substitute for sourced reasoning.
- Source references are internal research pointers, not copied excerpts.

## Relationship rules

- Every entry links to at least one canonical concept.
- Planned lesson IDs use `PL-C###`; production `l###` IDs are added only after
  an approved migration.
- Question arrays may remain empty until objective-level mappings are reviewed.
- Formula terms link to formula records instead of duplicating formulas.
- Comparison-heavy clusters should link to a reference sheet.
- All relationship IDs must resolve and must not be inferred silently in a
  learner-facing UI.

## Confusion and exam-trap model

`common_confusion` describes a conceptual boundary, such as earned value
versus actual cost. `exam_trap` describes a likely decision error, such as
reversing an index or escalating without checking authority. They must not
attempt to recreate copyrighted exam questions.

Future schema versions may normalize these into misconception IDs so one
misconception can connect glossary entries, objectives, distractors, review
cards, and remediation paths.

## Lifecycle

```text
Candidate → Draft → Technical Review → Source Review → User Review → Approved
                                                               └→ Deprecated
```

Representative records in the current catalog have no Approved status.
Population should proceed in concept-priority batches, beginning with terms
needed by approved lessons and reference sheets.

## Validation

Validators should enforce unique semantic IDs, non-empty required text,
resolved relationships, known source IDs, no duplicate relationship values,
and required review metadata before approval. Definition accuracy, originality,
and usefulness remain human review responsibilities.

## Future consumers

- inline lesson term links and hover definitions;
- glossary browse/search;
- misconception-based remediation;
- formula-variable definitions;
- reference-sheet cross-links;
- review cards and spaced repetition;
- AI authoring prompts that use approved definitions without source text.
