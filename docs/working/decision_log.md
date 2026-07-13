# Curriculum Architecture Audit — Decision Log

This working log records proposals made during the audit. The User remains the final authority; entries are not treated as approved architecture decisions unless explicitly approved.

## W-001 — Use one canonical curriculum catalog with multiple learning tracks

- **Decision:** Model curriculum units once, then expose them through a Comprehensive Course track, an ECO Review track, and shared reference/assessment layers.
- **Alternatives considered:** Two independent course trees; expanding each of the 26 ECO lessons until it contains the whole curriculum.
- **Reasoning:** Independent trees duplicate concepts and drift. Enlarging ECO lessons preserves navigation but prevents concept-level prerequisites, adaptive recommendations, and focused review.
- **Assumptions:** Existing ECO lessons remain useful overviews and should not be replaced.
- **Risks:** The eventual lesson loader must support richer metadata or a normalization layer.
- **Unresolved:** User approval of the proposed metadata migration sequence.

## W-002 — Keep production content schemas unchanged in this engagement

- **Decision:** Add planning data in `data/content_coverage.json`; do not change `questions.json` or `lessons.json` and do not force new metadata into current records.
- **Alternatives considered:** Immediate migration of all 410 production records; embedding planning metadata directly in lesson records.
- **Reasoning:** The mission limits implementation to planning infrastructure. A separate catalog validates the model before a high-risk content migration.
- **Risks:** Counts shown for concept units are ECO-aligned counts, not proof that every question directly tests the concept.
- **Unresolved:** When to migrate approved metadata into production content.

## W-003 — Separate coverage strength from implementation lifecycle

- **Decision:** Store `coverage_rating` (`Strong`, `Partial`, `Thin`, `Missing`) separately from `lifecycle_status` (`Existing`, `Planned`, `Approved`, `Implemented`).
- **Alternatives considered:** One combined status; numeric percentage only.
- **Reasoning:** Content depth and workflow state answer different questions. Combining them makes “implemented but thin” impossible to represent.
- **Risks:** Authors must update two fields intentionally.
- **Unresolved:** Whether review states such as Drafting and In Review are needed later.

## W-004 — Treat source references as internal traceability, not content

- **Decision:** Use stable source IDs and topic/page-range notes; never copy source wording into repository artifacts.
- **Alternatives considered:** Importing the PDFs; storing slide excerpts.
- **Reasoning:** The sources are local-only and potentially copyrighted. Traceability requires pointers and original summaries, not reproduction.
- **Risks:** Source files may be renamed locally; source IDs must remain stable.
- **Unresolved:** Whether future source records should include edition/license metadata after User verification.

## W-005 — Do not infer question difficulty from word count

- **Decision:** Report structural difficulty proxies separately and require authored/reviewed difficulty metadata in the future contract.
- **Alternatives considered:** Automatically label difficulty from prompt length or explanation length.
- **Reasoning:** Length is not psychometric difficulty. Current distractor and answer-position biases make automated labels especially unreliable.
- **Risks:** Difficulty distribution remains unknown until human review or learner-performance data exists.
- **Unresolved:** Calibration method once sufficient quiz history exists.

## W-006 — Architecture checkpoint passed

- **Decision:** Continue to the limited implementation.
- **Evidence:** The 59-unit catalog parses and validates with 13 modules, unique unit IDs, valid ratings/statuses, valid canonical ECO pairs, valid source IDs, and valid current lesson references. No production schema change is required.
- **Proposed implementation:** A pure coverage validator/derivation module, data-contract tests, and a read-only React screen with rating/status/module filters, lesson mappings, derived ECO-aligned question counts, PMBOK mappings, and source IDs.
- **Alternatives considered:** Stop for a production metadata migration; hard-code dashboard totals into the planning dataset.
- **Reasoning:** A migration would exceed the mission and raise content risk. Hard-coded counts would become stale.
- **Risks:** ECO-aligned counts may be misread as direct concept coverage, so the UI must label the distinction prominently.
- **Unresolved:** User approval of the future production metadata migration remains required.

## W-007 — Coverage validation owns planning integrity only

- **Decision:** The new validator checks the coverage catalog and its references against current data. It will not absorb all question/lesson schema validation or create a speculative general schema framework.
- **Alternatives considered:** Replace the existing data tests and Content Studio validator with a shared schema package now.
- **Reasoning:** Existing validation passes and the mission calls for limited planning infrastructure. Consolidation belongs in the future metadata migration slice.
- **Risks:** Validation remains distributed across focused modules.
- **Unresolved:** Shared registry/validator design for production schema v2.

## W-008 — Validation and handoff complete

- **Decision:** Mark the audit engagement complete in the working logs; leave all changes uncommitted for User review.
- **Evidence:** 123 tests and production build pass; catalog validation has zero errors; rendered filter/mapping/count checks pass with zero console errors; production lesson/question diffs are empty.
- **Risks carried forward:** question answer-cue bias, unverified official terminology/edition alignment, and lack of direct objective mappings.
- **Unresolved:** All decisions listed in the final report remain subject to User approval.
