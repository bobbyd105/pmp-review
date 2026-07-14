# Knowledge Layer & Content Production Framework Report

## Executive summary

The repository now contains the instructional infrastructure needed to evolve
from ECO-level lessons and questions into a concept/objective knowledge system.
No production lesson or question was modified or generated.

The completed layer adds:

- a validated graph for all 59 curriculum concepts;
- 59 planned concept-lesson records with 118 measurable objectives;
- representative glossary and formula catalogs;
- a complete 12-sheet reusable reference backlog;
- future lesson and question metadata models;
- a deterministic, local-first adaptive-learning design;
- a governed production pipeline;
- curriculum, knowledge, and repository future-state maps.

All artifacts remain planning infrastructure. They do not change the lifecycle
of any concept to Approved or authorize content generation.

## Knowledge architecture

`data/knowledge_graph.json` creates one graph node for every canonical
`C001`–`C059` unit. Each node contains broader/narrower relationships,
prerequisites, reciprocal related concepts, ECO and PMBOK mappings, planned and
existing lesson links, and glossary/formula/reference relationships.

The graph deliberately distinguishes taxonomy from dependency. Parent/child
links organize knowledge; prerequisite links control learning order; related
links support comparison and transfer. The prerequisite graph is acyclic and
validated.

## Instructional architecture

`data/learning_objectives.json` establishes one planning lesson ID (`PL-C###`)
per concept without reserving a production `l###` ID. Every planned lesson has:

- two observable objectives (118 total);
- prerequisite knowledge aligned to the graph;
- expected competencies;
- Bloom level;
- 80-percent / three-distinct-evidence planning threshold;
- estimated learning time;
- expected difficulty.

Threshold and difficulty values are design hypotheses. They require User
approval and later evidence; they are not psychometric calibration.

## Metadata architecture

Question and lesson target models define stable concept/objective mappings,
ECO/PMBOK editions, Bloom/cognitive demand, difficulty, scenario type,
misconceptions, knowledge-asset links, duration, mastery, adaptive, review, and
version metadata.

The recommended migration is sidecar/normalization-first. Existing
`questions.json` and `lessons.json` stay unchanged. Any inferred mapping must
be labeled and reviewed before it contributes mastery evidence.

## Glossary architecture

`data/glossary_catalog.json` contains 14 representative entries. Each supports
definition, common confusion, exam trap, concept/lesson/question/formula/
reference relationships, and source pointers. The model defines lifecycle,
originality, validation, and future misconception normalization.

This is a schema validation set, not a complete PMP glossary.

## Formula architecture

`data/formula_catalog.json` contains 10 representative records covering
communications, PERT, float, EVM, financial selection, risk, and flow. Each
formula includes variables, interpretation, greater/less-than guidance, memory
tips, common mistakes, lesson/question/glossary links, and source pointers.

The model requires independent technical review, explicit variant assumptions,
units/rounding, and separate worked examples before production use.

## Reference-sheet architecture

`data/reference_sheet_catalog.json` defines 12 planned assets:

1. PMBOK process map;
2. common ITTO patterns;
3. organizational structures and PMO authority;
4. contract comparison;
5. risk responses;
6. stakeholder models;
7. agile/Lean framework comparison;
8. Scrum quick reference;
9. leadership/team/conflict styles;
10. communication methods/models;
11. formula and interpretation sheet;
12. responsible-AI checklist.

Sheets are retrieval aids linked to canonical concepts; they do not replace
instruction or become mastery prerequisites by themselves.

## Adaptive-learning architecture

The adaptive model operates on objective evidence, not broad ECO totals. It
defines mastery states, prerequisite eligibility, weak-area categories,
confidence safeguards, lesson/quiz/reference/review recommendations, spaced-
repetition compatibility, remediation paths, and objective/lesson/module/course
completion logic.

Learner state is separate from canonical content and remains local-first. No
adaptive algorithm was implemented. Adaptive implementation is explicitly
gated on reliable objective mappings, reviewed metadata, and remediation of
the current question bank's answer cues.

## Content production architecture

`docs/content/content_pipeline.md` establishes this flow:

```text
Source → Knowledge graph → Concept/objectives → Lesson draft/review
→ Question draft/review → Reference/glossary assets → Adaptive mapping
→ Tests/docs/map/User approval → Release
```

Each transition has structural, technical, source, originality, relationship,
quality, and approval checkpoints. AI output remains an unverified draft and
cannot self-approve.

## Repository recommendation

The future-state design groups canonical assets under `content/knowledge`,
`glossary`, `formulas`, `reference`, `lessons`, and `questions`, with pure
runtime logic under future `src/knowledge`, `src/adaptive`, and `src/analytics`
boundaries.

No file was moved. Migration occurs only when an approved consumer needs the
boundary and tests/imports/docs can change together.

## Validation evidence

- `data/knowledge_graph.json`: 59 unique concepts; reciprocal hierarchy and
  related links; acyclic prerequisites; mappings match the coverage catalog.
- `data/learning_objectives.json`: 59 planned lessons; 118 unique objectives;
  prerequisite and lesson namespaces resolve.
- 14 glossary, 10 formula, and 12 reference-sheet records validate.
- All graph and catalog source, concept, lesson, question, glossary, formula,
  and reference IDs resolve.
- Focused knowledge-layer contract: 7 tests passed.
- Full suite: 15 test files / 130 tests passed.
- Production build passed with the existing non-blocking large-chunk warning.
- `data/questions.json` and `data/lessons.json`: zero diff.
- No AI API, backend, adaptive algorithm, production lesson, or production
  question was added.

## Future implementation order

1. User and architecture review of graph edges, objectives, thresholds, and
   representative asset schemas.
2. Verify terminology/edition/source authority and record approval decisions.
3. Remediate the 371/384 option-B and 349/384 longest-answer quality defects.
4. Approve versioned registries and a sidecar metadata migration contract.
5. Review existing lesson/question concept-objective mappings in bounded batches.
6. Approve Priority A concept objectives and source plans.
7. Draft/review the first concept lesson and its shared assets.
8. Draft/review targeted assessment only after the lesson is approved.
9. Implement objective-level diagnostics and adaptive behavior only after
   evidence quality is trustworthy.

## Unresolved risks

- Current quiz scores are vulnerable to answer-position and length cues.
- Objective statements and graph relationships have not received User/content
  architecture approval.
- PMBOK/ECO terminology and local source licensing remain subject to current
  official/licensed verification.
- Difficulty and mastery thresholds are uncalibrated hypotheses.
- Representative glossary/formula entries require technical/source review.
- The static application bundle remains large because the full local bank is
  bundled; this is non-blocking for the local MVP.
- Future metadata migration must preserve learner-history meaning and mark
  inferred mappings honestly.

## Next recommended Codex task

After User/architecture review of this framework, scope a dedicated
**question-bank quality remediation and metadata-readiness slice**. It should
add stable option identity/bank-quality controls and correct the answer-position
and answer-length cues before any objective evidence is used for adaptive
learning. It must remain separate from lesson or question generation.

## Final state

The knowledge layer and production framework are complete in the local working
tree. Production lessons and questions remain untouched. No commit or push was
performed for this mission.
