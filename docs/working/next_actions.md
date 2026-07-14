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

## Recommended next implementation pass

Create a dedicated question-bank quality remediation and metadata-readiness
slice. It should establish stable option identity and bank-quality controls,
then remediate the 371/384 option-B and 349/384 longest-answer defects with
manual correctness review. It should not generate new lessons or questions.

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
