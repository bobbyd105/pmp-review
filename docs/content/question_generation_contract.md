# Question Generation Contract

## Purpose

This contract governs future question drafts. It is designed to prevent more generic volume and to correct the quality failures identified in the current bank. It does not authorize question generation until the target lesson/objectives are Approved.

## Preconditions

1. The target concept unit and objective IDs are approved.
2. The coverage gap specifies the required cognitive demand and item purpose.
3. Existing questions mapped to the same objectives have been reviewed for overlap.
4. Correct-answer position targets for the batch are predetermined and balanced.
5. The author has the current metadata, terminology, and source contracts.

## Required question metadata

- stable question ID;
- schema version;
- primary concept unit ID;
- one or more objective IDs;
- ECO mappings;
- PMBOK mappings;
- delivery approach;
- cognitive demand;
- proposed difficulty plus calibration state;
- scenario/item type;
- misconception/distractor tags;
- source traceability;
- author/generator, reviewer, review status, version, and dates.

## Item types

Use a planned mix rather than one repeated stem:

- situational next/best action;
- sequence or prerequisite decision;
- artifact/document interpretation;
- concept distinction/comparison;
- formula/result interpretation;
- calculation where justified;
- diagnosis/root cause;
- exception or least-appropriate action, used sparingly and clearly;
- multi-source scenario only after the UI/schema supports it.

The current UI supports single-best-answer multiple choice only. Do not author multi-select or drag/drop records until a separate implementation supports and tests them.

## Cognitive demand and difficulty

### Cognitive demand

- **Recall** — recognize a definition, role, artifact, or formula.
- **Interpret** — explain a metric, document, model, or scenario signal.
- **Apply** — select/use a method in context.
- **Analyze** — compare plausible actions, dependencies, tradeoffs, or root causes.

### Proposed difficulty

- **Foundation** — one concept, clear context, plausible but distinguishable distractors.
- **Application** — multiple relevant signals and a best answer that requires applying a principle/process.
- **Advanced** — competing priorities, approach nuance, or multi-step interpretation without ambiguity.

Difficulty is a reviewed hypothesis until learner-performance evidence supports calibration. Never infer it from word count.

## Stem standard

- Test one primary decision or objective.
- Include only details that affect the answer or realistic context.
- State the question unambiguously.
- Avoid copying or closely paraphrasing PMI/source questions.
- Avoid overusing “What should the project manager do?”; vary valid item purposes.
- Avoid absolute/trick wording unless the objective specifically tests a boundary.
- Do not make the right answer detectable from grammar, length, detail, or tone.

## Option and distractor standard

Every item has four distinct options under the current UI.

- Exactly one option is defensibly best.
- Distractors represent specific misconceptions or sequencing errors.
- Options use parallel grammar and comparable specificity.
- Correct-answer length should not be systematically longest.
- Correct positions must be balanced across a batch and the cumulative bank.
- Do not use “all/none of the above.”
- Do not create obviously unethical, reckless, or irrelevant distractors merely to fill space.
- If a distractor could be correct under a reasonable reading, revise the stem or options.

## Explanation standard

An explanation must:

- identify the tested objective and governing reasoning;
- explain why the correct option is best now, not only why it is generally good;
- explain each distractor’s misconception or timing problem;
- distinguish “good later” from “best first” when applicable;
- avoid unsupported appeals to “PMI mindset”;
- link to the concept lesson/reference asset rather than re-teaching an entire topic.

The current production schema has one explanation string. Until option-specific rationale fields are approved, use concise labeled rationale within that string only if the renderer supports it clearly.

## Quantitative item standard

- Use original values and scenarios.
- State units and required rounding.
- Ensure options correspond to plausible calculation/interpretation errors.
- Validate the calculation independently.
- Prefer interpretation over arithmetic volume where that matches exam intent.
- Tag formula/reference IDs.

## Duplicate prevention

Run checks before review and again before merge:

1. exact normalized stem match;
2. token/shingle similarity against the full bank;
3. scenario-template similarity (role + event + decision + correct rationale);
4. correct-answer rationale similarity;
5. objective/item-type saturation;
6. source-overlap check to prevent close paraphrase.

Automated similarity is a flag, not an adjudicator. A reviewer decides whether two items test meaningfully independent evidence.

## Batch controls

For every batch report:

- count by objective, ECO domain/task, PMBOK mapping, approach, cognitive demand, and proposed difficulty;
- correct-answer position distribution before and after the batch;
- correct-option length distribution;
- item-type distribution;
- duplicate flags and resolutions;
- source/reviewer coverage.

Reject a batch that worsens answer-position or length bias, even if each item is individually correct.

## AI generation rules

- Request only the approved gap count and item types.
- Provide objective definitions and exclusions, not copyrighted source text.
- Require original scenarios and explicit distractor misconceptions.
- Predetermine correct positions; never accept the model’s default ordering.
- Require machine-readable output that validates against the approved schema.
- Treat every answer, explanation, and citation as unverified until reviewed.
- Do not let AI compare drafts against local copyrighted sources unless the User explicitly authorizes transmitting them.

## Review workflow

1. Schema and metadata validation.
2. Objective alignment review.
3. Independent answer correctness review.
4. Distractor plausibility and ambiguity review.
5. Duplicate/source originality review.
6. Batch-balance analysis.
7. Terminology/current-edition review.
8. User approval.
9. Production implementation, full tests, docs/map updates, and post-merge calibration monitoring.

## Rejection criteria

Reject an item if:

- its objective is absent or unapproved;
- more than one answer is reasonable;
- the correct answer is cued by length/position/grammar;
- distractors are implausible or unrelated;
- it repeats an existing scenario/rationale without new evidence;
- it relies on source wording or invented authority;
- calculation or terminology cannot be independently verified;
- explanation does not address distractors;
- metadata is incomplete.
