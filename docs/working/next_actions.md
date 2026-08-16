# Knowledge Layer & Content Production Framework — Next Actions

## Current milestone (2026-08): Exam Simulator readiness/design

PR #24 (completion mission) and PR #25 (Exam Simulator Readiness Audit)
are both merged into `main`. The audit's recommended metadata remediation
is now also done (2026-08, `content/exam-simulator-question-metadata`):
all 424 questions carry explicit `approach`/`item_style`/`concept_ids`
fields, classified in 10 reviewed batches, not by keyword matching. See
`docs/content/exam_simulator_metadata_remediation.md` for the resulting
exact counts, the suspicious-question review, and the revised verdict
(**READY — TARGETED CONTENT TOP-UP FIRST**, superseding PR #25's READY
WITH SMALL METADATA REMEDIATION now that the remediation is complete).
`docs/progress.md`'s "Next Recommended Task" has the prioritized follow-up
sequence: (1) build the 180-question assembly algorithm against the now-
complete metadata, (2) a separate, later bounded content batch targeting
the specific gaps the real metadata surfaced (AI, calculation, and the
delivery-approach foundational concepts — sized in the remediation report,
not round numbers). This branch implemented no simulator code and
generated no new questions — metadata and tooling only. The sections below
are the earlier knowledge-layer
framework's next actions, retained for history.

## Review order

1. Review `docs/content/knowledge_layer_report.md` for outcomes, risks, and implementation order.
2. Review `docs/content/knowledge_graph.md` and `data/knowledge_graph.json` for prerequisite and relationship judgments.
3. Review `data/learning_objectives.json` for objective scope, Bloom levels, time/difficulty hypotheses, and mastery thresholds.
4. Review glossary, formula, and reference-sheet models/catalogs for schema sufficiency and representative accuracy.
5. Review adaptive, question metadata, lesson metadata, pipeline, and repository future-state models.

## Decisions needed

- Approve, revise, or reject the concept relationship graph.
- Approve the `PL-C###` planning namespace and objective ID convention.
- Approve or revise the proposed 80-percent / three-distinct-evidence mastery threshold.
- Confirm terminology/edition/source verification responsibilities.
- Approve the sidecar-first metadata migration direction.
- Confirm that question-bank quality remediation precedes adaptive evidence.

## Tracked follow-up — Length-bias remediation

**Status: COMPLETE (2026-07-16).** The editorial pass was performed in eleven
reviewed batches (~285 questions), trimming over-elaborate correct answers and
extending thin distractors with content judgment, not mechanical rewriting.
Final state: 0/384 questions over the 1.3 ratio, 71/384 (18.5%) strictly
longest correct, 72/384 (18.8%) strictly shortest correct.

`src/__tests__/lengthBias.test.js` now enforces hard gates: strict-longest
<= 40% with zero ratio flags, and strict-shortest <= 30% to prevent
over-correction. Answer-position bias remains protected by its own hard
distribution guard.

## Later sequence

1. Approve registries and sidecar metadata contracts.
2. Map legacy lessons/questions to concepts and objectives in bounded reviewed batches.
3. Approve one Priority A foundation concept and its objectives/source plan.
4. Draft and review that concept lesson under the lesson generation contract.
5. Add glossary/formula/reference assets required by the approved lesson.
6. Generate and review only the targeted objective evidence needed.
7. Implement objective diagnostics before adaptive recommendations.

## Resume constraints

- Do not treat planning objectives or representative catalog entries as Approved content.
- Do not modify production lessons/questions without a separate approved migration.
- Do not use current quiz results as mastery evidence until answer cues are fixed.
- Do not copy or transmit local source material without explicit authority.
- Keep learner state separate from canonical content.
- Preserve stable IDs and mark inferred mappings honestly.
