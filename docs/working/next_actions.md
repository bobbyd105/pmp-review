# Curriculum Architecture Audit — Next Actions

1. Add `src/coverage/contentCoverage.js` with pure validation and derived-count/filter helpers.
2. Add a data-contract test that rejects invalid modules, statuses, ratings, ECO mappings, source IDs, lesson IDs, duplicate IDs, and missing required mappings.
3. Add `src/components/CurriculumCoverage.jsx` as a read-only view with summary counts and module/rating/status filters.
4. Render unit title/status/strength, ECO mappings, PMBOK mappings, existing lesson IDs/titles, source IDs, and a clearly labeled ECO-aligned question count.
5. Add focused component/helper tests and connect the view in `src/App.jsx`.
6. Add only the CSS needed for readable filters, cards, badges, and mappings.
7. Run the coverage checks, full tests, build, and browser verification.
8. Update canonical progress, content plan, app map, and final report. Do not update README unless the new architecture requires onboarding detail beyond those artifacts.

## Resume constraints

- Do not modify `data/questions.json` or `data/lessons.json`.
- Do not copy source slide text or commit anything under `docs/Source/` or the two local planning maps.
- Do not commit or push.
- Record source-based conclusions in original language and label inference as inference.

## Checkpoint summary

- **Completed:** source inventory/index, repository audit, curriculum model, coverage matrix/catalog, question audit, lesson audit, and three authoring/metadata contracts.
- **Schema decisions:** keep production schemas unchanged; separate strength from lifecycle; store traceability in planning data; derive counts; use objective metadata only in a later approved migration.
- **Remaining:** limited planning implementation, tests/build/UI validation, canonical docs/map updates, and final report.
- **Architecture status:** viable; no stop condition triggered.

## Handoff — what should happen next

1. Review `docs/content/curriculum_audit_report.md` for the executive findings and decisions needed.
2. Approve, revise, or reject the canonical catalog/track architecture and metadata contracts.
3. Before new question generation, scope a dedicated remediation for the 371/384 option-B and 349/384 longest-answer biases.
4. Verify PMBOK/ECO terminology against current official/licensed material and record edition/source metadata.
5. Approve objectives for a small Priority A foundation batch; only then begin lesson drafting under the generation contract.
6. Keep this working tree uncommitted until the normal Review/Approve workflow occurs.

All implementation and validation work requested by this mission is complete. No repository reread is required to begin the review: start with the final report, then the curriculum model, coverage matrix, and contracts.
