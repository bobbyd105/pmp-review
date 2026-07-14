# Reference Sheet Model

## Purpose

Reference sheets provide rapid retrieval after a concept has been taught.
They support comparison, recognition, calculation, and review; they do not
replace concept lessons or establish mastery by themselves.

The planned inventory is canonical in `data/reference_sheet_catalog.json`.

## Supported types

| Type | Primary use | Planned example |
|---|---|---|
| Process map | Structural orientation | PMBOK domain/focus/process map |
| Pattern guide | Reusable mechanics | Common ITTO patterns |
| Comparison | Distinctions and selection | Contracts, structures, agile, leadership |
| Strategy matrix | Response selection | Threat/opportunity responses |
| Model guide | Analysis and communication | Stakeholder and communication models |
| Quick reference | Framework retrieval | Scrum accountabilities/events/artifacts |
| Formula sheet | Equations plus interpretation | PMP formula and interpretation sheet |
| Checklist | Governed decisions | Responsible AI checklist |

The catalog includes the mission-requested PMBOK process map, ITTO patterns,
organizational structures, contracts, risk responses, stakeholder models,
agile comparison, Scrum, leadership styles, communication methods, and formula
sheet, plus a responsible-AI checklist required by the curriculum architecture.

## Asset contract

Every reference sheet defines:

- stable semantic ID;
- title and type;
- retrieval purpose;
- planned sections;
- related concept, glossary, and formula IDs;
- source IDs;
- lifecycle status;
- review metadata required before approval.

Production versions should add audience, edition scope, reading order, display
format, accessibility/alt-text requirements, print behavior, version,
reviewers, reviewed date, and deprecation fields.

## Relationship rules

- A sheet must link to one or more canonical concepts.
- Formula links resolve to the formula catalog; definitions resolve to the
  glossary catalog.
- Lessons link to reference IDs rather than copying whole comparison tables.
- Questions may cite a sheet for remediation but must still map to objectives.
- Reference sheets never become prerequisite nodes by themselves; the linked
  concepts carry prerequisite semantics.

## Authoring rules

- Optimize for retrieval, not exhaustive prose.
- Use parallel comparison dimensions and explicit labels.
- Include interpretation and selection cautions, not just names.
- Identify approach/edition boundaries.
- Use original language and original diagrams.
- Do not copy source tables, charts, slide sequences, or exam items.
- Link outward to deeper lessons for explanation.

## Lifecycle and validation

Sheets progress from Planned through Draft, Technical Review, Source Review,
User Review, and Approved. Validation enforces unique IDs, supported types,
non-empty sections, known source and asset relationships, and review metadata
before approval. Rendering and print/accessibility tests begin only when a
production UI consumes the assets.
