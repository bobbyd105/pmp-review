# Exam Simulator Readiness Audit

**Date:** 2026-08-16
**Branch:** `claude/exam-simulator-readiness-audit-6xg18g`
**Baseline audited:** `main` at the PR #24 merge commit (the completion-mission
branch — 424 questions, 62 concept lessons, 186 knowledge checks, 18
formulas, 38 glossary entries, Course/Question Bank/ECO Review/Reference
views, answer-position and answer-length bias gates, CI).

**Scope of this branch:** audit, reproducible metadata analysis, and the
smallest documentation correction needed to reflect that PR #24 is merged.
**Nothing simulator-related was implemented.** No question wording changed.
No new questions were generated. The answer-position and answer-length
protections were re-verified and are unchanged.

---

## How to read this report

Every quantitative claim below is one of three kinds, and is labeled as
such:

- **Exact** — computed directly from a schema field that exists today
  (`eco_domain`, `eco_task`, question/lesson counts, test results).
- **Heuristic** — produced by keyword pattern-matching over question text
  by `scripts/analyze-question-bank.mjs` (output:
  `docs/content/exam_simulator_bank_analysis.md`). Heuristic counts are
  estimates, not certified topic tags, and are called out inline.
- **Assumption / design judgment** — a choice this audit made (e.g., what
  counts as "excessive repetition") that is not itself sourced from the
  repository or from any verified external document.

See **Source discipline** (end of this report) for the specific items that
need external verification this environment cannot perform.

---

## 1. Question-bank metadata

`data/questions.json` (424 entries) uses exactly seven fields on every
question, with no variation across the bank:

```
id, eco_domain, eco_task, question, options, correct_answer, explanation
```

This is confirmed exactly (not sampled) by `scripts/analyze-question-bank.mjs`
and enforced by `src/__tests__/questions.data.test.js`. Compare against the
16 requested selection dimensions:

| Dimension | Selectable today? | Source | Recommendation |
|---|---|---|---|
| ECO domain | **Yes — exact** | `eco_domain` field | Already sufficient. |
| ECO task | **Yes — exact** | `eco_task` field | Already sufficient. |
| Topic/concept | **Partial (56.4%)** | `concept_lessons.json.related_question_ids`, inverted; lesson-level granularity, not question-verified | **(2) Add explicitly**: a narrow `concept_ids` array per question, reusing the existing 62 lesson IDs as controlled vocabulary — do not invent a new taxonomy. |
| Delivery approach (predictive/adaptive/hybrid) | **No** | Only lessons carry `approaches`; no per-question field | **(2) Add explicitly**: a 4-value `approach` enum (`predictive`/`adaptive`/`hybrid`/`universal`), defaulting most items to `universal` since most PM judgment scenarios don't depend on delivery model. |
| Item style (scenario/definition/calculation/interpretation/process-sequence) | **No** | Heuristic wording match only | **(2) Add explicitly**: a required `item_style` enum. Needed to guarantee a style mix per exam — cannot be reliably inferred from text alone (see §2 caveats). |
| Complexity/difficulty | **No** | Not present anywhere in production schema; `learning_objectives.json` has a *planning-only* difficulty hypothesis for planned lessons, never applied to questions | **(3) Do not add yet.** There is no calibrated rubric or evidence base (real quiz-attempt data) to ground a difficulty label. A guessed label would be worse than none and would need to be re-validated later anyway — defer until attempt-based calibration is possible. |
| PMBOK 8 performance domain | **Partial (56.4%, lesson-inherited)** | `concept_lessons.json.pmbok8_domains` (7 values: Governance, Scope, Schedule, Finance, Stakeholders, Resources, Risk) | **(2) Add explicitly** once the taxonomy itself is externally verified (see Source discipline — this in-repo taxonomy reads like PMBOK 6 knowledge areas, not PMBOK 7's 8 performance domains, and no "PMBOK 8" publication was verified in this environment). |
| PMBOK 8 focus area | **Partial (56.4%, lesson-inherited)** | `concept_lessons.json.focus_areas` (5 process-group-style values) | Same as above — bundle with the PMBOK-domain field once verified. |
| AI-related content | **No field; 4/424 exact matches** | Manual + heuristic scan (`q421`–`q424`) | **(2) Add explicitly**: trivial given how few questions qualify (a boolean or inclusion in `concept_ids`), but the real issue is the pool is too shallow — see §3. |
| Leadership/team content | **Derivable (no new field needed)** | `eco_task` already isolates it (People Task 2 "Manage conflicts": 16Q; Task 3 "Lead the project team": 20Q) | **(1) Derive from `eco_task`.** A dedicated boolean would only help cross-cutting QA reporting, not assembly. |
| Stakeholder content | **Derivable** | People Tasks 4/5/6/8 (19/16/17/18Q) already isolate this | **(1) Derive from `eco_task`.** |
| Risk content | **Partially derivable** | Business Environment Task 5 "Plan and manage risk" is only 14Q, but risk appears as a cross-cutting heuristic signal in 98/424 (23.1%) questions well beyond that one task | **(2) Add explicitly** as a lightweight cross-cutting tag if the simulator needs to guarantee risk exposure beyond the one dedicated task; otherwise **(1)** task-derivation is a defensible floor. |
| Change-management/change-control content | **Partially derivable** | Business Environment Task 3 "Manage and control changes" (12Q) plus governance heuristic hits in 72/424 (17.0%) | Same treatment as risk: **(1)** as a floor, **(2)** as an improvement if cross-cutting exposure must be guaranteed. |
| Business-environment content | **Yes — exact** | `eco_domain == "Business Environment"` (110Q, 25.9%) | Already sufficient; **(1) do not add** anything new. |

**Do not add:** a numeric difficulty/complexity score (no evidence base yet);
a duplicate business-environment tag (the domain field already is one);
separate leadership/stakeholder/risk/change-control booleans as *required*
fields — task-derivation is good enough for a first assembler, and adding
mandatory tags the content team must maintain by hand for 424 items,
without a proven assembly need, is metadata for its own sake.

---

## 2. Current 424-question composition

Full counts: `docs/content/exam_simulator_bank_analysis.md`, generated by
`node scripts/analyze-question-bank.mjs` (also `npm run
questions:analyze-bank`). Re-running it reproduces byte-identical output
(`src/__tests__/questionBankAnalysis.test.js` asserts this).

### Exact counts (from `eco_domain` / `eco_task`)

| Domain | Documented exam weight | Questions | Share of bank |
|---|---:|---:|---:|
| People | 33% | 138 | 32.5% |
| Process | 41% | 176 | 41.5% |
| Business Environment | 26% | 110 | 25.9% |

Task-level counts range from 12 (Business Environment Task 3 "Manage and
control changes"; Task 4 "Remove impediments and manage issues") to 21
(Process Task 1 "Develop an integrated project management plan and plan
delivery"). Full 26-row table is in the generated report. The domain split
matches the documented weights within 0.5 points on every domain — the
bank was built to this target and it shows.

### Heuristic counts (keyword pattern-matching — NOT certified tags)

| Category | Questions matched | Share |
|---|---:|---:|
| Scenario-style stem ("what should the PM do first/next") | 253 | 59.7% |
| Calculation / formula cues | 27 | 6.4% |
| Predictive-approach cues | 36 | 8.5% |
| Agile / adaptive cues | 46 | 10.8% |
| Hybrid cues | 4 | 0.9% |
| AI-related cues | 4 | 0.9% |
| Stakeholder / communication cues | 115 | 27.1% |
| Leadership / team / conflict cues | 100 | 23.6% |
| Risk cues | 98 | 23.1% |
| Governance / change-control cues | 72 | 17.0% |
| Business-environment / value cues | 84 | 19.8% |

These are keyword hits, not topic certifications: a question with none of
the matched keywords may still be about that topic in different words, and
a keyword hit doesn't mean the topic is central to the item. The AI count
(4) was independently confirmed by direct inspection: it is exactly
`q421`–`q424`, the final four items of the 2026-07-16 named-concept batch —
not a keyword-matching artifact.

**Categories that cannot be measured reliably today, and what they'd need:**
Item style (scenario vs. definition vs. calculation vs. interpretation vs.
process-sequence) cannot be measured beyond the "scenario stem" heuristic
above — the "scenario-style" pattern only catches a specific phrasing
("what should the PM do first/next"), not every situational-judgment item,
and it says nothing about whether a non-scenario item is a definition,
interpretation, or process-sequence question. This needs the explicit
`item_style` field from §1, assigned by a human reviewer per item — it
cannot be safely automated from wording alone (a false-negative here would
misclassify a well-written scenario question as a memorization item, or
vice versa).

Predictive/adaptive/hybrid *balance* similarly cannot be measured beyond
raw keyword presence: a question with zero approach keywords is not
provably approach-neutral, it may just avoid naming its methodology while
still assuming one. This needs the explicit `approach` field from §1.

---

## 3. Simulator viability

### A single 180-question mock exam: buildable today

Applying the documented domain weights (largest-remainder rounding) to 180
questions: **People 59, Process 74, Business Environment 47** (sums to
exactly 180). Per domain, this exam consumes:

| Domain | Pool | Draw for 1 exam | % of pool used |
|---|---:|---:|---:|
| People | 138 | 59 | 42.8% |
| Process | 176 | 74 | 42.0% |
| Business Environment | 110 | 47 | 42.7% |

Every domain has more than double its single-exam requirement. **A single,
correctly domain-weighted 180-question exam is fully supported by the
existing 424 questions using only the `eco_domain` field that exists
today.** Task-level distribution (spreading each domain's draw across its
own ECO tasks) is similarly workable: the shallowest tasks (12 questions
each) still exceed a single exam's proportional task-level draw
(~5 questions) by more than 2×.

### Repeated mock exams: bounded, and unevenly so

`floor(pool ÷ per-exam draw)` gives the number of **fully non-overlapping**
180-question exams the bank supports before any repetition is
mathematically forced, at both domain and task granularity (the ratio is
consistent because task draws are proportional to domain draws):

- People: 138 ÷ 59 = 2.34 → **2 disjoint exams**
- Process: 176 ÷ 74 = 2.38 → **2 disjoint exams**
- Business Environment: 110 ÷ 47 = 2.34 → **2 disjoint exams**

**The bank supports exactly 2 completely non-repeating full mock exams.**
From the 3rd exam on, some reuse is mathematically required regardless of
algorithm quality — this is a property of bank size, not assembly logic,
and no assembly algorithm can avoid it. A well-designed algorithm (§4) can
make that reuse *graceful* (spread thin, oldest-used-first) rather than
*visible* (the same handful of questions every time), but it cannot make
it disappear.

Two content-category pools are much shallower than the domain/task
headroom above suggests, and would force *visible* repetition far sooner
than "2 exams":

- **AI-related: 4 questions total.** Any exam that includes AI content at
  all (arguably required, given AI is an explicit audit dimension and an
  explicit 2026-batch content target) draws from a pool of 4. Even at a
  minimal 1-question-per-exam rate, only 4 exams can avoid repeating an AI
  question, and at any heavier weight the *same* 1–2 AI questions would
  reappear starting with the very next exam. This is the shallowest
  category in the bank by a wide margin.
- **Calculation/formula: ~27 questions (heuristic).** A domain-proportional
  draw would pull roughly 27 ÷ 424 × 180 ≈ 11–12 calculation items per
  exam, giving the same "~2 disjoint exams" ceiling as the domain pools —
  but that aggregate number hides per-formula depth: with only 18 taught
  formulas (`data/formula_catalog.json`) behind ~27 questions, several
  individual formulas (e.g., EAC method selection, TCPI) likely have only
  1–2 questions each, which would repeat on nearly every exam that draws a
  calculation item on that formula. This needs the `item_style` field from
  §1 to confirm the real count and per-formula depth before it can be
  trusted as an assembly input.

### Findings, classified by urgency

**Blocking** (prevents building a simulator that actually delivers what
was asked — repeatable mocks with balanced predictive/agile/hybrid and
style exposure):

1. No per-question `approach` field exists — predictive/agile/hybrid
   balance cannot be enforced or even measured, only guessed at via
   keywords.
2. The AI-related pool (4 questions) is too shallow for repeated weighted
   exposure without near-immediate, visible repetition.
3. The calculation/formula pool's *true* size and per-formula depth are
   unverified (heuristic-only); this must be confirmed with real `item_style`
   tagging before committing to any calculation-weight target.

**Important** (should happen before or shortly after a v1 simulator; does
not block a first correctly-assembled single exam):

4. No `item_style` field — cannot guarantee a scenario/definition/
   calculation/interpretation/process-sequence mix per exam or section,
   only infer it approximately from wording.
5. Concept/topic linkage covers only 56.4% of the bank — limits
   topic-level diagnostics and duplicate-avoidance granularity for the
   other 43.6%.
6. The in-repo "PMBOK 8" domain/focus-area taxonomy needs external
   verification (see Source discipline) before it is treated as
   authoritative selection metadata.
7. Task-level pool depth is uneven (12–21 per task); the assembler's
   fallback behavior (§4) needs to handle the shallowest tasks explicitly,
   not assume uniform depth.

**Nice-to-have** (do later; doesn't block or meaningfully limit v1):

8. Difficulty/complexity metadata — no rubric or evidence base yet.
9. Formal cross-cutting booleans for leadership/stakeholder/risk/
   change-control/business-environment beyond what `eco_task` already
   gives — helps QA reporting, not assembly.

---

## 4. Exam assembly design (blueprint only — not implemented)

The goal is a transparent, testable, pure-function algorithm in the style
already established by `src/quiz/quizSession.js` and
`scripts/shuffle-question-options.mjs` (pure logic, injectable RNG, no
React), not an adaptive or opaque system.

**Inputs:** the question bank, an optional per-question usage ledger
(last-used exam timestamp/index, persisted the way `quizHistory.js`
persists history today), and an optional seed.

**Step 1 — Domain targets.** Compute the 180-question domain split from
the documented weights using largest-remainder rounding (People 59 /
Process 74 / Business Environment 47), so the three targets always sum to
exactly 180. This computation is small enough to unit-test exhaustively
(it has exactly one correct output for the current weights).

**Step 2 — Task targets within each domain.** Distribute each domain's
target across its own ECO tasks proportional to that task's share of the
domain's question pool, again with largest-remainder rounding and a
documented per-task floor of 1. This keeps task representation
proportional to actual content depth rather than forcing artificial
equality across tasks of very different sizes (12 vs. 21 questions).

**Step 3 — Selection within each task bucket.** Select without replacement
from that task's eligible pool. "Eligible" is usage-weighted, not a hard
recently-used exclusion: give every question a weight that increases the
longer it's been since last use (unused ever = highest weight; used in the
immediately previous exam = lowest weight, but never zero). This degrades
gracefully — a shallow pool (like the AI category) still produces a valid
exam, it just reuses its least-recently-used items instead of failing or
silently duplicating within the same exam. **No duplicates within one
exam** falls out of "select without replacement" directly and needs no
separate mechanism.

**Step 4 — Style and approach balancing (depends on §1 metadata).** Once
`item_style` and `approach` exist, apply the same proportional-with-floor
technique within Step 3's buckets: e.g., a task bucket contributing 6
questions should draw a documented minimum scenario-style share and not
let calculation items cluster disproportionately. **Until that metadata
exists, this step must be a visible no-op that says so** — never silently
claim to balance a dimension the data can't support.

**Step 5 — Difficulty.** Not controlled in v1; no trustworthy signal
exists (§1). Explicitly deferred rather than faked with a guessed value.

**Step 6 — Fallback behavior**, in strict precedence order:
1. Fill a task's target from that task's own usage-weighted pool.
2. If a task's pool genuinely can't supply its share (only plausible in
   the shallowest tasks under heavy repeated use), redistribute the
   shortfall to other tasks **within the same domain only** — domain
   weighting is the one constraint that must never silently drift, since
   it's the one directly tied to the documented exam weights.
3. If an entire domain's pool can't supply its target — not reachable
   today given current pool sizes, but must still be handled — fail loudly
   in a test/assertion rather than silently shipping a mis-weighted exam.

**Step 7 — Determinism.** Selection takes an injectable RNG exactly like
`quizSession.js`'s `shuffle()`. Default UI behavior uses `Math.random()`
for a fresh exam each time (matching current product behavior); a fixed
seed produces a byte-identical exam for QA, regression tests, and any
future "review this specific past exam" feature, mirroring the committed
`pmp-options-v1` seed pattern already used for option ordering.

**Step 8 — Sectioning into 3×60.** Assemble the full domain/task-weighted
180-question set first (Steps 1–6), shuffle it under the chosen seed, then
slice into three contiguous 60-question sections. Do **not** assign whole
ECO domains to specific sections — the real exam interleaves domains
throughout, and section-per-domain would make the last section
homogeneous. After slicing, check each section's domain mix against the
overall 33/41/26 target within a documented tolerance (e.g., ±5 points);
if the naive slice drifts beyond tolerance, reshuffle deterministically
(bounded retry count) rather than hand-adjusting the slice.

**Everything above is a pure function of `(questions, usageLedger, seed) →
{ section1, section2, section3 }`**, testable without rendering anything —
consistent with how `quizSession.js` and the two existing `scripts/*.mjs`
analysis modules are already tested.

---

## 5. Question quality and authenticity (sampled review)

**Method:** stratified systematic sampling — questions were grouped by
`eco_domain` (preserving the bank's existing append order within each
group), then every 12th question was taken from each group. This produced
**37 of 424 questions (8.7%)**, spread across all three domains in
proportion to their pool sizes, without cherry-picking. Sampled IDs: q001,
q005, q006, q033, q043, q052, q060, q073, q082, q088, q111, q130, q144,
q156, q164, q179, q185, q205, q211, q219, q233, q241, q249, q261, q289,
q297, q309, q321, q326, q338, q350, q355, q380, q386, q405, q406, q423.
This is a sample, not a census — the full manual accuracy pass flagged as
outstanding in `docs/progress.md` (Constitution Section 10) remains
unaddressed and is out of scope here.

**Findings:**

- **Realism:** scenarios are specific and varied (architecture disputes,
  vendor renewals, compliance workarounds, governance bypass, backlog
  reprioritization from usage data, AI adoption levels) with no
  template-repetition observed in the sample.
- **Distractors:** consistently plausible, domain-relevant near-misses
  (premature escalation, unilateral decision, passive avoidance, informal
  workaround) rather than absurd filler — the correct exam-writing
  pattern.
- **"First/next" reasoning:** the dominant framing in the sample (roughly
  30 of 37 items ask what the PM should do first/next/best), matching real
  PMP-style situational judgment.
- **Keyword giveaways:** none observed in the sample — correct answers do
  not echo the stem's exact wording more than distractors do.
- **Answer-length cues:** protected bank-wide by the hard regression gate
  in `lengthBias.test.js` (0 questions over the 1.3 ratio threshold, 18.4%
  strictly-longest correct); nothing in the sample contradicts this.
- **Memorization-only questions:** a small minority (q386 PMBOK-8 process
  count, q405 salience-model definition, q406 RACI rule, q423 AI
  adoption-level definitions) lean toward applied-definition recall rather
  than judgment; this is an acceptable minority share, not a dominant
  pattern, in the sample.
- **Explanations:** every sampled explanation states why each distractor
  is wrong, not just why the correct answer is right — this teaches the
  PMI reasoning process as intended, not just the answer key.

**Assessment: the sampled content is appropriate for mock-exam use.** No
sampled item raised an authenticity or fairness concern serious enough to
warrant fixing under this audit's "only fix a clearly documented blocker"
constraint.

---

## 6. Current tests and proposed guardrails

### Already in place (verified passing — see Validation below)

| Test file | Protects |
|---|---|
| `questions.data.test.js` | Required fields, valid `eco_domain` values, unique ids, ≥2 unique options, `correct_answer` ∈ options |
| `lengthBias.test.js` | **Hard gate:** 0 questions over the 1.3 correct/average-distractor length ratio; strict-longest ≤ 40%; strict-shortest ≤ 30% |
| `answerDistribution.test.js` | **Hard gate:** no correct-answer position exceeds 40%; reproducible/idempotent under the committed seed |
| `conceptLessons.data.test.js` | Lesson schema, enum validity (`pmbok8_domains`, `focus_areas`, `approaches`), bidirectional question-link resolution |
| `contentCoverage.test.js`, `knowledgeLayer.data.test.js` | Planning-catalog and knowledge-graph integrity (not simulator-specific) |
| `quizSession.test.js`, `quizHistory.test.js` | Existing simple-quiz selection/scoring/persistence (no domain weighting — confirms today's Quiz is unweighted random draw, not simulator logic) |
| `QuestionBank.test.jsx` | Full-bank render — **currently timeout-fragile in this environment** (see Validation; confirmed pre-existing on the unmodified baseline, not introduced by this audit) |
| `questionBankAnalysis.test.js` *(new, this audit)* | Validates the audit's own analysis tooling: deterministic categorization, no input mutation, count totals reconcile, and the committed report file is byte-reproducible from the source data |

### Proposed minimum additions for the implementation phase (not built here)

- **Domain-weighted assembly test:** assert an assembled 180-set matches
  the People/Process/Business Environment targets exactly (or within the
  documented rounding rule).
- **No-duplicates-within-exam test.**
- **Valid-length tests:** exactly 180 total; exactly 3×60 sections.
- **Section domain-drift test:** each section's domain mix stays within
  the documented tolerance of the overall target.
- **Pool-sufficiency test per weighted dimension:** before any new
  weighting dimension (approach, style) goes live, assert every category
  it depends on has enough tagged content to hit its target — fail loudly,
  don't silently under-fill.
- **Deterministic-seed test:** same seed ⇒ identical exam; different seed
  ⇒ different exam — mirrors the existing `reorderQuestions` idempotence
  test.
- **Schema validity for new metadata:** extend `questions.data.test.js`
  with required-field and enum checks for `approach`, `item_style`, and
  `concept_ids`, the same way `ECO_DOMAINS` is checked today.
- **Cross-exam repetition test:** simulate N consecutive assemblies against
  a shared usage ledger and assert the usage-weighted algorithm produces
  measurably less overlap than pure random selection would.
- **Continued protection (no new test needed, just discipline):**
  `lengthBias.test.js` and `answerDistribution.test.js` must keep passing
  unmodified through every future content or metadata batch — this audit
  did not touch either gate.

---

## 7. Documentation state

`docs/progress.md`'s "Current Status" section still described the
completion-mission branch's PR as "awaiting User review" — stale now that
PR #24 is merged into `main`. This audit updates `docs/progress.md`,
`docs/working/next_actions.md`, and `docs/app-map.html` to state plainly:
PR #24 is merged, `main` is the current baseline, the completion mission is
complete, the next milestone is Exam Simulator readiness/design, and this
audit branch does not implement the simulator. No historical entries were
rewritten.

---

## Source discipline

**Facts already documented in the repository** (used as given): the July
2026 ECO's 26-task structure and People 33% / Process 41% / Business
Environment 26% domain weights (`docs/content_plan.md`, `decision_log.md`
Decision #10); the 424/62/186/18/38 content counts; the existing
answer-position and answer-length hard gates and their current
measurements.

**Assumptions made in this audit** (design judgments, not sourced facts):
the "≥2 fully disjoint exams before graceful reuse begins" framing in §3 is
this audit's own way of stating what the bank size implies — no
requirements document specifies an acceptable repetition rate. The
Step 6 fallback precedence and the ±5-point section-drift tolerance in §4
are proposed design defaults, not requirements.

**External items flagged for separate verification — not guessed at:**

1. **The repo's internal "PMBOK 8" taxonomy.** `concept_lessons.json`
   tags lessons with 7 `pmbok8_domains` (Governance, Scope, Schedule,
   Finance, Stakeholders, Resources, Risk) and 5 `focus_areas` (Initiating,
   Planning, Executing, Monitoring and Controlling, Closing) — a
   structure that reads like PMBOK 6's knowledge areas and process groups,
   not PMBOK 7's 8 performance domains (Stakeholders, Team, Development
   Approach and Life Cycle, Planning, Project Work, Delivery, Measurement,
   Uncertainty). This audit could not verify in this environment whether
   PMI has published a "PMBOK 8" standard, or whether its actual structure
   matches what this repository calls "PMBOK 8." Verify against PMI's
   official current publication before treating this taxonomy as
   authoritative selection metadata.
2. **The "current 2026 ECO" domain-weight change itself.** This audit
   treated the People 33% / Process 41% / Business Environment 26% split
   as a repository-documented fact (it is, per Decision #10) but did not
   independently re-verify the underlying claim about PMI's actual current
   Exam Content Outline against PMI's official published ECO document.
   Verify before using this weighting to certify learners as exam-ready.
3. No specific numeric claim about the real PMP exam's typical share of
   calculation-style items was asserted anywhere in this report — none was
   found documented in-repo, and none was assumed.

---

## Recommendation

**READY WITH SMALL METADATA REMEDIATION.**

A single, correctly domain-weighted 180-question mock exam is buildable
today using only the `eco_domain`/`eco_task` fields that already exist —
the bank is not too small, and no content rewrite is required to reach
that first milestone. What blocks going further than one honestly-labeled
mock exam is metadata, not volume:

**Smallest viable remediation slice, in order:**

1. Add three narrow fields to every question — `approach`
   (predictive/adaptive/hybrid/universal), `item_style`
   (scenario_judgment/definition_distinction/calculation/interpretation/
   process_sequence), and `concept_ids` (reusing the existing 62
   concept-lesson IDs). This is metadata-only: no question wording
   changes, so the answer-length and answer-position gates are
   automatically unaffected. Tag the 239 already-lesson-linked questions
   first (mechanical, from existing `related_question_ids`), then batch-tag
   the remaining 185 by domain/task.
2. Extend `questions.data.test.js` with required-field and enum checks for
   the three new fields, mirroring the existing `ECO_DOMAINS` check.
3. Build the assembly algorithm from §4 against `eco_domain`/`eco_task`
   first (fully ready now); wire in `approach`/`item_style` balancing as
   soon as step 1 lands.
4. **Flagged, not executed here:** a small, targeted content top-up in the
   two demonstrably shallow categories — AI-related (4 → roughly 15–20
   questions) and calculation/formula (≈27 → roughly 45–55 questions,
   after `item_style` tagging confirms the real count and per-formula
   depth). This is sized to let each category survive several
   non-overlapping mock exams at a realistic weight, not a "large new
   batch" — but it is content work, so it belongs in a separate,
   dedicated batch under the existing content-review process, not this
   audit.

None of this requires touching existing question wording, and none of it
weakens the answer-position or answer-length protections, which remain
exactly as they were at the PR #24 merge.
