# Exam Simulator Metadata Remediation — 2026-08 Follow-Up

**Branch:** `content/exam-simulator-question-metadata`
**Supersedes (for the sections below):** the heuristic composition estimates
in `docs/exam_simulator_readiness_audit.md` §2–§3 and its
`docs/content/exam_simulator_bank_analysis.md` companion, both from the
2026-08-16 PR #25 audit. That audit's metadata-schema findings (§1),
sampled quality review (§5), and general framing remain accurate and are
not restated here. See `docs/decision_log.md` #15 for the decision record
and `docs/content/question_metadata_classification_log.md` for the full
classification rubric and rationale.

**What changed:** all 424 questions now carry explicit, editorially
classified `approach`, `item_style`, and `concept_ids` fields (added by 10
independent batch reviews against a shared rubric, then reconciled for one
identified cross-batch inconsistency — see the classification log). No
question wording, options, correct answers, or explanations changed. The
answer-position and answer-length hard gates are unchanged and still pass.

## 1. Real approach distribution

| Approach | Questions | Share |
|---|---:|---:|
| universal | 318 | 75.0% |
| predictive | 72 | 17.0% |
| adaptive | 32 | 7.5% |
| hybrid | 2 | 0.5% |

**Is the hybrid pool actually shallow? Yes — more clearly than the PR #25
heuristic scan could show.** Only 2 questions (`q026`, `q183`) genuinely
require reasoning about combining/transitioning predictive and adaptive
elements. This is corroborated at the concept level: the four foundational
"what is this delivery approach" concepts have almost no dedicated
questions — `c023` Predictive Delivery (1), `c024` Iterative and
Incremental Delivery (2), `c025` Adaptive Delivery (2), `c026` Hybrid
Delivery (1) — and `c058` Hybrid Integration in Practice, the course's
dedicated hybrid-integration lesson, has **zero**. The shallowness isn't
just "few hybrid-labeled questions" — the concept cluster that would
support writing more of them is itself thin.

## 2. Real item-style distribution

| Item style | Questions | Share |
|---|---:|---:|
| scenario_judgment | 367 | 86.6% |
| interpretation | 23 | 5.4% |
| definition_distinction | 22 | 5.2% |
| calculation | 8 | 1.9% |
| process_sequence | 4 | 0.9% |

**Is the bank sufficiently scenario-oriented for a realistic PMP mock?
Yes.** 86.6% scenario-judgment matches the real exam's situational-judgment
character well — PR #25's sampled review (§5) found no evidence this is
padded with disguised memorization. The much smaller styles
(calculation, process_sequence) are real but narrow slices, not
underlying data problems — see §4 below for calculation specifically.

## 3. Concept coverage

- Concepts in the catalog: 62
- Concepts with **zero** questions: 7
- Concepts with 1–2 questions ("shallow"): 14
- Questions tagged to more than one concept: 5 (1.2%)

### Zero-question concepts, classified by urgency

| Concept | Title | Classification |
|---|---|---|
| `c057` | Servant Leadership and Self-Organizing Teams | **Exam-critical weakness** — a heavily-tested People/agile-leadership topic with no dedicated item. |
| `c058` | Hybrid Integration in Practice | **Exam-critical weakness** — directly explains the 2-question hybrid-approach shallowness above. |
| `c034` | Product Scope vs. Project Scope | **Exam-critical weakness** — a classic PMP definition/distinction pairing; the bank has no item built around it specifically. |
| `c059` | AI Foundations for Project Managers | **Exam-critical weakness** — see §5 (AI coverage). |
| `c062` | AI Use Cases Across the Project Life Cycle | **Exam-critical weakness** — see §5. |
| `c010` | Project vs. Product Management | Acceptable low-frequency concept — foundational/definitional; likely adequately reinforced by surrounding questions even without a dedicated item. |
| `c011` | What Makes Work a Project? | Acceptable low-frequency concept — a long-standing, previously-documented gap (`docs/progress.md` history: "c011 remains intentionally unlinked pending a suitable bank item"), foundational-review-level content. |

### Shallow (1–2 question) concepts, classified by urgency

| Concept | Title | Questions | Classification |
|---|---|---:|---|
| `c023` | Predictive Delivery | 1 | Important improvement — part of the delivery-approach cluster described in §1. |
| `c024` | Iterative and Incremental Delivery | 2 | Important improvement — same cluster. |
| `c025` | Adaptive Delivery | 2 | Important improvement — same cluster. |
| `c026` | Hybrid Delivery | 1 | Important improvement — same cluster. |
| `c051` | Agile Values, Principles, and Mindset | 2 | Important improvement. |
| `c056` | MVP, MMF, and Early Value | 2 | Important improvement. |
| `c033` | Requirements Elicitation and Analysis | 1 | Important improvement — real Scope-domain topic. |
| `c034`-adjacent items already covered above | | | |
| `c060` | Automation, Assistance, and Augmentation | 1 | Exam-critical weakness — AI, see §5. |
| `c001` | Projects, Programs, Portfolios, and Operations | 1 | Supplemental/course-only — basic recall, reinforced elsewhere. |
| `c003` | Project Phases, Deliverables, and Phase Gates | 2 | Supplemental/course-only. |
| `c005` | Project Charter, Business Case, and Benefits Plan | 1 | Supplemental/course-only. |
| `c007` | Common ITTO Patterns | 1 | Supplemental/course-only — broad umbrella, implicitly reinforced by many other questions' mechanics. |
| `c017` | Holistic and Systems Thinking | 1 | Supplemental/course-only — a mindset topic reinforced across many scenario items. |
| `c027` | Tailoring the Approach | 1 | Supplemental/course-only — much of its testable content is already carried by `c023`–`c026`'s (thin) items. |

**Not every shallow concept needs expansion.** Per task guidance, the
table above deliberately separates concepts whose thinness is a real exam
risk (delivery-approach fundamentals, hybrid integration, servant
leadership, product/project scope, AI) from ones where a single item is
plausibly sufficient because the concept is foundational/definitional and
reinforced elsewhere in the bank's scenario content.

## 4. True calculation coverage

**8 questions** have `item_style = "calculation"`: `q394`, `q396`, `q398`,
`q399`, `q400`, `q401`, `q415`, `q418`. This is the exact, verified count —
not the ~27 the PR #25 heuristic scan estimated (that scan matched
formula-name keywords like "CPI"/"SPI" even in items that only ask the
learner to *interpret* an already-given index, which turned out to be the
majority of EVM-flavored questions — 23 of them are correctly `interpretation`,
not `calculation`).

Of the 18 taught formulas (`data/formula_catalog.json`), the 8 calculation
items exercise roughly 7: cost variance, EAC-via-CPI, PERT three-point,
communication channels, EMV (twice — a risk-mitigation EMV and a
decision-tree EMV), Little's Law, and agile velocity forecasting. The
other ~11 taught formulas — including schedule variance, ROI, NPV, total
float, ETC, VAC, TCPI as its own explicit item, standalone triangular
estimating, payback period, and benefit-cost ratio — have **zero**
calculation items exercising them directly.

**Revisiting the PR #25 recommendation (calculation: ~45–55):** the real
metadata **changes** this recommendation, not just confirms or weakens it.
The true gap is deeper than the heuristic estimate implied (8 real items
vs. an assumed ~27), but the earlier ~45–55 target was not derived from
anything — it was a round-number guess. A better-grounded floor, avoiding
an arbitrary number: bringing each of the 18 taught formulas to at least 2
dedicated calculation items would require a pool of ~36, i.e. **roughly
+28 targeted calculation questions** — smaller than PR #25's guess, and
tied to an actual unit (formula coverage) rather than a round total. This
is still a future-branch decision, not something this branch implements.

## 5. True AI coverage

**4 questions** are tagged to an AI-module concept (`c059`–`c062`):
`q421`, `q422`, `q423`, `q424` — via real `concept_ids`, not keyword
matching. This exactly matches the PR #25 heuristic count (4), which is a
useful cross-check: the earlier keyword-based estimate happened to be
exactly right for this category, because AI vocabulary is distinctive
enough that keyword matching worked here even though it doesn't generalize
to the other categories (as calculation demonstrates in §4).

Per-concept breakdown: `c059` AI Foundations — 0; `c060` Automation/
Assistance/Augmentation — 1; `c061` Responsible AI and Human
Accountability — 3; `c062` AI Use Cases Across the Life Cycle — 0. Half
the AI module's own concepts have no dedicated question at all.

**Revisiting the PR #25 recommendation (AI: ~15–20):** the real metadata
**supports** this recommendation, now on firmer ground than a keyword
guess. A pool of 4, concentrated in one concept (`c061`), cannot support
even minimal AI representation across repeated mock exams without
immediate, visible repetition. A defensible floor tied to an actual
target — supporting at least 3 non-overlapping mock exams at a token 1–2
AI questions per exam, distributed across all 4 AI concepts rather than
concentrated in one — is **+6 to +10 questions**, landing the pool around
10–14. This is smaller and more precisely justified than PR #25's ~15–20,
and, like calculation, remains a future-branch decision.

## 6. Suspicious-question review (from classification)

All 424 questions were read in full (stem, options, explanation) during
classification. Reviewers were asked to flag — not fix — anything with
more than one defensible correct answer, implausible distractors,
inconsistent PMP reasoning, unclear wording, obsolete terminology, or an
explanation that doesn't support its stated answer.

**No high-severity issues were found** (no question with a genuinely
defensible alternate correct answer, and no explanation that contradicts
its own stated answer). The following low/medium-severity notes were
raised; none were fixed in this branch:

| Question ID | Concern | Severity | Recommended future action |
|---|---|---|---|
| q008 | Stem uses "mid-iteration" (adaptive vocabulary) to describe a "predictive project" — internally inconsistent framing, though the correct answer (CCB-based change control) still resolves correctly | Medium | Light copy-edit to remove the vocabulary mismatch in a future editorial pass |
| q097 | `eco_task` is labeled "Align stakeholder expectations," but the scenario is really an internal team ownership/role-clarity problem | Low | Re-tag `eco_task` in a future editorial pass, or leave as-is (question content itself is sound) |
| q004 | Correct answer assumes real ML proficiency is achievable via 3 months of training on a constrained budget — optimistic relative to practice, though correct on PMP-exam logic | Low | No action needed; PMP-logic answer is defensible |
| q019 | One distractor ("no formal methodology, self-organize entirely") is a strawman, not a realistic taught category | Low | Consider a more plausible distractor in a future revision pass |
| q025 / q042 | Near-duplicate scenario framing and identical correct-answer logic on the same concept (`c004`) | Low | Content-diversity note for a future authoring batch, not an error |
| q131 | "Significantly under budget" used without specifying against which EVM baseline | Low | Minor phrasing tightening in a future pass |
| q142 | Distractor ("the team should have approved the change collectively") is weak/non-competitive | Low | Consider strengthening in a future revision pass |
| q203 | Correct answer is defensible but more judgment-heavy/subjective than most items in its batch | Low | No action needed |
| q212 | No concept lesson fits this compliance-documentation item well (concept-catalog gap, not a question defect) | Low (informational) | Track as a content-catalog gap for a future lesson batch |
| q245 | A test-taker could reasonably argue the sponsor's formal authority should simply govern; explanation defends the given answer but the alternate reading is plausible | Low | No action needed |
| q270 | Distractor ("switch immediately since open source is generally preferable") is a strawman | Low | Consider a stronger distractor in a future pass |
| q287 | Weakest distractor ("colors are inherently subjective") is easy to eliminate, reducing item difficulty | Low | Consider strengthening in a future pass |
| q326 | Premise ("regardless of overall delivery approach") does some of the work of ruling out the "push back" distractor | Low | No action needed |
| q334 | "Throughput" (a Kanban/flow term) appears in an otherwise approach-neutral item and could read as an accidental adaptive signal | Low | Minor phrasing tightening in a future pass |
| q355 | Correct answer is defensible but the explanation doesn't fully address why a schedule slip (vs. a scope/cost change) specifically requires board re-approval | Low | Strengthen the explanation in a future editorial pass |
| q417 | Justification for "Small and Valuable fail" over the more literal "Estimable fails" reading is somewhat indirect | Low | Consider clarifying the explanation in a future pass |

None of these rise to the "clearly documented blocker" bar that would
justify editing question wording in this metadata-only branch, so none
were changed.

## 7. Simulator assembly recommendations (design only — not implemented)

Building on the blueprint in `docs/exam_simulator_readiness_audit.md` §4,
now that real per-question metadata exists, the assembly engine can
control four dimensions. They should not all be treated with equal
strictness — an over-constrained algorithm (four simultaneous hard
constraints) risks making a valid 180-question exam mathematically
impossible to assemble, especially given how shallow some categories are
(§1, §4, §5).

**Hard constraint: ECO domain weighting.** People 59 / Process 74 /
Business Environment 47 (from the documented 33/41/26% weights). This is
the one dimension the exam's validity actually depends on, the bank
comfortably supports it (§3 of the original audit), and it should never
silently drift.

**Soft targets with tolerances: approach and item-style balance.** Given
`universal` is 75% of the bank and `hybrid` is 0.5%, a *hard* requirement
like "each exam must contain N hybrid questions" would frequently be
infeasible once a few mock exams have been taken and the 2-question hybrid
pool is exhausted. Instead: express these as target *ranges* per exam
(e.g., "aim for the exam's approach mix to roughly track the bank's own
approach mix, within a documented tolerance") and let the fallback rule
(next paragraph) absorb shortfalls rather than fail exam generation.

**Fallback rule when a soft target can't be met:** widen the eligible pool
in this order — (1) relax the *style/approach* target first, keeping the
*domain/task* target exact; (2) if a specific concept's pool is fully
exhausted, allow reuse from that concept weighted by recency (oldest-used
first), never a hard failure. Domain weighting (the hard constraint) is
the only dimension that should ever cause exam generation to abort with an
explicit error rather than degrade gracefully.

**Concept coverage: track and report, don't hard-constrain per exam.**
With 7 zero-question concepts and 14 shallow ones, requiring every concept
to appear in every exam is not achievable today. Instead, track concept
coverage *across* a learner's exam history (which concepts have and
haven't appeared) as a reporting/diagnostic feature, not a per-exam
assembly constraint.

This four-dimension, hard/soft split is unchanged in spirit from the
original blueprint — what real metadata adds is the specific evidence
(§1–§5 above) for exactly where hard constraints would break and where
soft targets are the honest choice.

## 8. Revised recommendation

**READY — TARGETED CONTENT TOP-UP FIRST.**

This is a real change from PR #25's "READY WITH SMALL METADATA
REMEDIATION" — that remediation is now done (all 424 questions carry
verified `approach`/`item_style`/`concept_ids`), and the real metadata
confirms the assembly algorithm can be built today against ECO domain/task
(hard constraint) plus approach/item-style/concept soft targets (§7). What
the real data adds is precision: the two shallow categories PR #25
suspected are now exactly measured (AI: 4 questions; calculation: 8, not
27), and a third shallow cluster was newly surfaced (the delivery-approach
foundational concepts, `c023`–`c026`/`c058`/`c057`/`c034`). None of these
block building the assembly engine itself — they block a learner from
taking more than a couple of mock exams before seeing visible repetition
in AI, calculation, and hybrid-flavored questions specifically.

**Recommended order for the next branch(es):**
1. Build the assembly engine (§7 / original blueprint §4) against the now-
   complete metadata — this does not need to wait for new content.
2. In parallel or shortly after, run one bounded, targeted content batch
   covering the gaps identified here (not a large batch): roughly +6 to
   +10 AI questions across all 4 AI concepts, +28 calculation questions
   sized to bring each of the 18 taught formulas to at least 2 items, and
   a small number of items for the delivery-approach cluster
   (`c023`–`c026`, `c057`, `c058`, `c034`) — on the order of a dozen
   questions total for that cluster, not derived from a round number but
   from bringing each of those 6 concepts to at least 2–3 items.
