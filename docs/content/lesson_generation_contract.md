# Lesson Generation Contract

## Purpose

This contract governs future human- or AI-drafted curriculum lessons. It does not authorize content generation by itself. A lesson may be drafted only when its coverage-catalog unit is Approved by the User.

## Preconditions

Before drafting:

1. The curriculum unit exists in `data/content_coverage.json`.
2. Its objectives, prerequisites, ECO/PMBOK mappings, and source plan are approved.
3. The author has the current metadata contract and relevant source summaries.
4. A duplicate/overlap check identifies existing lessons that must be referenced rather than repeated.
5. The requested artifact type is explicit: concept lesson, ECO overview, worked example, reference sheet, glossary entry, or review card.

## Required authoring input

- unit ID and approved title;
- lesson type;
- module and sequence position;
- two to five objective IDs;
- prerequisite unit/objective IDs;
- target learner and assumed knowledge;
- ECO and PMBOK mappings;
- allowed source IDs and topics;
- required examples/formulas/distinctions;
- explicit exclusions and overlap notes;
- desired length range;
- current terminology/edition boundary.

## Required lesson output

A draft must include:

1. **Metadata block** compliant with `metadata_contract.md`.
2. **Purpose/orientation** explaining why the concept matters.
3. **Learning objectives** using observable verbs.
4. **Core explanation** in original language.
5. **Decision/application guidance** showing when and why the concept is used.
6. **Common confusions or exam traps** without imitating copyrighted exam content.
7. **At least one original example** appropriate to the lesson type.
8. **Summary/retrieval cues** linked to glossary/reference assets when available.
9. **Assessment plan** listing objective coverage and required question types; production question IDs are added only after approval.
10. **Source traceability notes** using source IDs and topic/page scopes, never copied excerpts.

## Technical depth standard

A concept lesson must be deep enough for its objectives but narrow enough to remain one coherent capability. It must:

- define required terms;
- distinguish common look-alikes;
- explain inputs/decisions/outcomes where applicable;
- cover predictive/adaptive/hybrid differences only when relevant;
- interpret formulas instead of listing them alone;
- connect behavior to value, quality, risk, ethics, or stakeholder outcomes;
- avoid presenting heuristics as universal rules.

## Style standard

- Clear, direct, and original language.
- Teach reasoning, not memorized slogans.
- Use current approved terminology consistently.
- Avoid claims such as “PMI always says” unless a reviewed official source supports them.
- Do not copy, closely paraphrase, or recreate source slide sequences.
- Do not include production-ready HTML or unsafe markup.
- Use examples that are original and not derived from known exam items.

## Formula/worked-example standard

When formulas are in scope, include:

- variable definitions and units;
- the formula and alternative forms that are actually required;
- a worked example with original numbers;
- result interpretation and decision implication;
- common sign/index traps;
- calculator precision/rounding guidance if relevant.

## AI drafting rules

An AI drafting prompt must:

- include only approved source summaries/metadata unless the User explicitly authorizes source transmission;
- state that output is a draft, not verified truth;
- forbid source copying and invented citations;
- require uncertainty flags for terminology or edition conflicts;
- require structured metadata and objective coverage;
- forbid generating additional lessons or questions beyond the requested unit;
- require a self-check against scope, overlaps, and exclusions.

AI output is never Approved or Implemented automatically.

## Review workflow

1. **Structural validation** — schema, IDs, mappings, objectives, prerequisites.
2. **Overlap review** — compare against existing lessons, glossary, and reference assets.
3. **Technical review** — verify concepts, formulas, terminology, and approach distinctions.
4. **Source review** — confirm traceability and original wording; verify against current official material where required.
5. **Instructional review** — confirm objectives, sequence, examples, misconceptions, and accessibility.
6. **Assessment review** — confirm the question plan can validly test every objective.
7. **User approval** — only the User changes lifecycle to Approved.
8. **Implementation** — add production content in a dedicated slice, then tests, docs, map, and review.

## Rejection criteria

Reject a draft if it:

- lacks an approved unit/objective;
- duplicates an existing lesson’s purpose;
- uses source wording too closely;
- contains unverifiable or conflicting terminology without flags;
- lists facts without decision/application context;
- includes formulas without interpretation;
- claims comprehensiveness while objectives remain uncovered;
- links questions only by broad ECO task when concept mapping is expected;
- omits prerequisites or source traceability.

## Definition of ready for production

- All objectives are explicitly covered.
- Every objective has a planned assessment strategy.
- Technical and source reviews are complete.
- Duplicate/overlap review is documented.
- Metadata validates.
- User approval is recorded.
- No local source text or files are introduced into Git.
