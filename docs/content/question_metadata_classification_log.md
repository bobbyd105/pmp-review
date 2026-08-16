# Question Metadata Classification Log

> **Scope note:** This log documents the editorial classification of the
> merged 424-question PR #26 baseline (`q001`-`q424`). Questions `q425`-
> `q447` were subsequently authored with the same rubric; their metadata and
> review table are recorded in
> `docs/content/exam_simulator_targeted_top_up_review.md`.

Records how `approach`, `item_style`, and `concept_ids` were assigned to
all 424 questions in `data/questions.json` (2026-08, this branch — see
`docs/decision_log.md` #15 and `docs/exam_simulator_readiness_audit.md`).
This is the "why," not the "what" — see
`docs/content/exam_simulator_bank_analysis.md` for the resulting counts.

## Method

Classification was done in 10 batches of ~42–43 questions, each read and
tagged by an independent reviewer against a shared written rubric (full
text below) rather than by keyword matching. Every batch reviewer read
each question's full stem, options, and explanation before tagging — the
explanation frequently makes the tested reasoning explicit even when the
stem is ambiguous. Reviewers were instructed to flag genuinely ambiguous
patterns and quality concerns rather than resolve them silently; those
findings are consolidated below and in the audit report's quality-review
table.

## Base rubric

### `approach`

`universal` is the default. Only tag `predictive`/`adaptive` when the
correct answer's reasoning genuinely depends on that approach's mechanics
(baselines/CCB/WBS/network-scheduling for predictive; backlog/sprint/
Product Owner/velocity/retrospective for adaptive). `hybrid` only when the
scenario genuinely requires reasoning about combining or transitioning
between predictive and adaptive elements — never merely because "hybrid"
appears as a distractor label.

### `item_style`

`scenario_judgment` is the default (situational "what should the PM do
first/next/best" items). `definition_distinction` for naming/distinguishing
terms. `calculation` only when actual arithmetic is required to reach the
answer. `interpretation` when a value/result/pattern is already given (or
trivially read, no arithmetic) and the task is explaining what it means.
`process_sequence` for ordering/precedence/input-output questions.

### `concept_ids`

1–2 IDs from `c001`–`c062`, smallest accurate set, chosen from the
question's actual content (title/objectives/key terms/eco_mappings of the
candidate concept), not copied automatically from the concept's
`related_question_ids` (existing links were treated as a hint to check,
not ground truth).

## Resolved rules for recurring ambiguous patterns

These emerged during classification and were applied consistently once
identified (some batches classified before a rule was confirmed were
reconciled afterward — see Reconciliation below):

1. **Ignore a stem's scene-setting self-label.** A stem that says "on a
   hybrid project..." or "in an agile team..." purely as narrative color,
   where the tested reasoning is approach-independent, is tagged
   `universal` — the reasoning is what's tagged, not the narrative
   wrapper.
2. **"Which life-cycle/approach fits these characteristics?" items** (explicit
   predictive-vs-adaptive-vs-hybrid selection questions) are tagged
   `approach` = the *correct answer's* approach, and `item_style` =
   `definition_distinction` (resolving requires distinguishing the
   approaches' defining characteristics, not situational judgment).
3. **Change-control/CCB items default to `predictive`**, even when the
   triggering event itself is approach-neutral, because the correct
   answer's actual mechanism (a change control board, a baseline change)
   is predictive-specific — this matches how `c030` (Change Control) is
   itself scoped (`["predictive", "hybrid"]`, no `adaptive`) in the
   concept catalog.
4. **Adaptive-anchoring nouns count as `adaptive` when load-bearing in the
   correct answer's reasoning**, even if introduced as incidental scenery
   (e.g., "backlog," "burndown chart," "sprint" in an otherwise generic
   scenario) — if the correct answer's logic depends on that mechanic, the
   approach follows the mechanic, not the surface framing.
5. **Non-numeric "what does this indicate/suggest" items**: `interpretation`
   when the answer options are explanatory statements about what a
   described pattern means; `scenario_judgment` when the options are PM
   actions to take in response. (This rule was confirmed after an initial
   cross-batch inconsistency was found in reconciliation — see below.)
6. **Concept fallback when no lesson maps cleanly to the `eco_task`**: pick
   by actual content fit, not by ECO-task label match; prefer an
   approach-neutral lesson over an approach-specific one when the scenario
   itself is approach-neutral even if the approach-specific lesson's ECO
   mapping matches more literally; default integrity/truthful-disclosure
   items (the graded distinction is honesty, not domain mechanics) to
   `c020` (Accountability and Ethical Leadership).
7. **Three-way `item_style` distinction for named-framework items**
   (power/interest grid, salience model, RACI, INVEST, Scrum/Kanban
   artifacts, EVM/financial metrics): if the stem names a framework and the
   correct answer is that framework's canonical qualitative label or rule
   (e.g., "keep satisfied," "exactly one Accountable," "Confirmation") →
   `definition_distinction`. If a quantitative metric/index is given and
   the task is explaining its implication → `interpretation`. If no
   framework is named and the correct answer is a course of action rather
   than a label → `scenario_judgment`.

## Known concept-catalog gaps surfaced during classification

Several ECO tasks have no concept lesson that fits them well, forcing a
"closest available" fallback rather than a clean match. These are content
gaps in `data/concept_lessons.json`, not metadata errors, and are flagged
here rather than fixed in this branch (out of scope — no lesson content
was authored or changed):

- **People Task 5 "Align stakeholder expectations" and Task 6 "Manage
  stakeholder expectations"** have no concept distinct from Task 4's
  "Engage stakeholders" (`c043`) — all three tasks' questions were folded
  onto `c043` (or `c044` when communication mechanics specifically
  dominate) by fallback, not because the concept is a precise fit.
- **Business Environment Task 8 "Evaluate external business environment
  changes"**, when the trigger is not AI (`c059`–`c062`) or sustainability
  (`c022`) — e.g., interest-rate/financing-cost or generic market shifts —
  has no dedicated concept; fell back to the nearest thematically adjacent
  lesson case by case.
- **Business Environment Task 6 "Continuous improvement"**, when framed as
  a generic process-feedback loop rather than a named practice, has no
  dedicated concept.
- **Business Environment Task 2 "Plan and manage project compliance"**, when
  the item is about documentation/tracking discipline rather than ethics or
  a named compliance mechanism, has no precise concept — `c020` was used as
  the nearest fallback.

These gaps do not block the metadata remediation (every question still
received a defensible `concept_ids` value), but they are worth surfacing
to whoever plans the next Comprehensive Course content batch.

## Reconciliation pass

After all 10 batches were merged, a targeted reconciliation pass checked
the one concrete cross-batch inconsistency the batches themselves flagged:
non-numeric "what does this [most likely] indicate/suggest?" stems, where
some batches defaulted to `scenario_judgment` and others to
`interpretation`. A full-bank search found exactly 14 questions matching
this stem pattern. Inspecting each one's options showed a clean
distinguishing signal: when the options are explanatory/diagnostic
statements about what the described pattern means (not actions a PM would
take), the item is testing interpretation, not situational judgment —
consistent with `q029`'s already-correct `interpretation` tag for a
numeric CPI-reading item of the same "what does this indicate" phrasing.
Applying that rule, 12 of the 14 (`q022`, `q033`, `q049`, `q052`, `q059`,
`q060`, `q078`, `q081`, `q085`, `q087`, `q096`, `q107`) were reclassified
from `scenario_judgment` to `interpretation`; `q029` and `q193` were
already correct. This was a metadata-only change (`item_style` field only)
— re-verified against the pre-branch bank that `question`/`options`/
`correct_answer`/`explanation` were untouched for all 424 questions.

No other systematic inconsistency was found; the remaining batch-flagged
patterns (rules 1–4, 6–7 above) were each isolated to their originating
batch and did not require cross-batch correction.

## Suspicious-question findings from classification

Batch reviewers were asked to flag (not fix) any question with more than
one defensible correct answer, implausible distractors, inconsistent PMP
reasoning, unclear wording, obsolete terminology, or an explanation that
doesn't support its stated answer. The consolidated table is in
`docs/content/exam_simulator_metadata_remediation.md` §6. No high-severity
issues (genuinely dual-defensible correct answers, or an explanation
contradicting its own stated answer) were found across all 424 questions;
16 low/medium-severity phrasing or distractor-strength notes were raised
and left unfixed per this branch's scope.
