# Knowledge Layer & Content Production Framework — Next Actions

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
