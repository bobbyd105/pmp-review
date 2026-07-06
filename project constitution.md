# PMP Study Platform — Project Constitution

**Version:** 1.0
**Last Updated:** 2026-06-30
**Canonical path:** `docs/project_constitution.md`
**Changes only via:** explicit User decision, logged in Section 12. Never updated as a side
effect of a task — unlike `progress.md`.

---

## 1. Core Product Philosophy

This is a local-first PMP exam prep platform. Three things are true at once and must stay
true:

- **Local-first, no AI API dependency in MVP.** The product must work fully offline with no
  paid service calls. AI integration is a deliberate *future* layer, not something that
  quietly creeps into MVP scope because it's convenient to add.
- **Small vertical slices over large feature branches.** If a task can't be described with a
  verifiable success condition in a sentence or two, it's too big — break it down before
  building it.
- **Content accuracy is the actual product.** This is exam prep software. A beautifully built
  quiz engine serving wrong or outdated PMI content is a failed product. Content correctness
  is held to the same non-negotiable standard as working code.

---

## 2. What This App Will Never Do

- Never call a paid AI API or require an API key during MVP, regardless of how small or
  tempting the use case seems.
- Never reproduce PMI's copyrighted exam content verbatim. Lessons and questions must be
  original or properly licensed — paraphrasing PMI material closely enough to reconstruct it
  is treated the same as copying it.
- Never collect user accounts, personal data, or telemetry without it being an explicit,
  separately-approved feature — not a default of building a "dashboard" or "progress tracker."
- Never ship a feature whose success condition is aesthetic ("looks done") rather than
  verifiable ("10/10 sample questions render, score persists across reload").
- Never let `docs/app-map.html` or `docs/progress.md` go stale relative to the actual
  codebase — see Section 5, Definition of Done.

---

## 3. Coding Standards

- React + Vite, as specified in the product brief. No framework changes without a logged
  decision in `docs/decision_log.md` and User approval.
- Local JSON seed files for MVP data. SQLite is the planned next step *if and when* the data
  shape genuinely outgrows JSON (write-heavy per-user state is the likely trigger — see
  `docs/decision_log.md` once that decision is made, don't pre-decide it here).
- No premature abstraction. Don't build a plugin architecture, provider interface, or config
  system for a feature that has exactly one implementation. Build the future-features hooks
  (AI plugin architecture, cloud sync) only when a real feature needs them, not speculatively.
- Components should be small enough that `app-map.html` can describe their purpose in one
  line. If a component needs a paragraph to explain what it does, it's doing too much.
- Favor explicit code over clever code. An implementation a future session (human or AI) can
  understand from the diff alone beats one that's 20% shorter but requires re-deriving intent.

---

## 4. Documentation Standards

- Documentation is a first-class artifact, not an afterthought. A task is not complete until
  its documentation is — see Section 5.
- `progress.md` answers "where are we right now." `decision_log.md` answers "why did we do it
  this way." Never conflate the two — this is the gap that caused re-litigated decisions on
  prior projects.
- `app-map.html` is the navigation system, not just a diagram. Every component entry should
  include purpose, dependencies, parent/children, data it reads or writes, and related docs —
  enough that an AI or human can understand the system without reading source files first.
- Decision log entries (architecture- and data-model-level decisions only, not every minor
  choice) follow this format: **Decision → Alternatives considered → Why rejected →
  Tradeoffs → Evidence → Approved by.**
- Repo hygiene (the Librarian function — broken links, stale or duplicate docs, keeping
  `app-map.html` synced) is Codex's responsibility after every completed slice, per
  `docs/ai_collaboration_agreement.md`.

---

## 5. Definition of Done

A task is **not done** at "code finished." The fixed order is:

**Code → Tests → Docs → Map → Commit**

Specifically, before a task can move to Review:

- [ ] Code implements exactly the agreed vertical slice — no unrequested scope added
- [ ] Success conditions were stated *before* implementation and are independently verifiable
      (not "looks right")
- [ ] Tests exist and pass, with evidence shown (test output, not "should work")
- [ ] `progress.md` updated
- [ ] `app-map.html` updated if architecture changed
- [ ] `decision_log.md` updated if an architecture/data-model decision was made
- [ ] No undocumented deviation from `project_constitution.md` or
      `ai_collaboration_agreement.md`

---

## 6. Review Checklist

Before approving any implementation (ChatGPT's architecture/scope pass, Claude's code &
UI-approach audit — see `ai_collaboration_agreement.md` Section 4 for the split):

- [ ] Does this match the stated success conditions, not just "seem right"?
- [ ] Is the scope exactly what was planned — no silent expansion or shrinkage?
- [ ] Does it introduce complexity not justified by a current, real requirement?
- [ ] Is the implementation approach (and UI, where relevant) consistent with Section 3 and
      Section 8 below?
- [ ] Does the documentation accurately describe what was actually built?
- [ ] Would a new contributor (human or AI) understand this from `app-map.html` and
      `progress.md` alone, without reading the diff?

---

## 7. Git Workflow

- One branch per vertical slice. No branch should span multiple unrelated features.
- Commit messages describe the *slice*, not the mechanics ("Add quiz score persistence," not
  "update files").
- No commit until Review (ChatGPT/Claude) and Approve (User) steps in the dev loop are
  complete, per `ai_collaboration_agreement.md`.
- Squash or clean up exploratory commits before merge where practical — history should be
  readable as a sequence of completed slices, not a log of trial and error.

---

## 8. Branch Strategy

- `main` is always deployable (locally — there's no hosting yet, but the standard still
  applies: `main` should always run without errors).
- Feature branches: `feature/<slice-name>`, short-lived, merged after Approve.
- No long-running parallel feature branches during MVP — the "small vertical slices"
  principle means there's rarely a reason for two big branches to coexist for long.

---

## 9. UI/UX Principles

- Clarity over cleverness. This is study software used under exam-prep stress — confusing UI
  has a real cost to the user beyond annoyance.
- Every interactive element needs an obvious, immediate state (answered/unanswered,
  correct/incorrect, progress saved) — no silent state changes.
- Consistency before novelty. Reuse existing patterns (e.g. how a question is presented)
  rather than introducing a new pattern per feature unless there's a real reason.
- Claude leads UI implementation review per `ai_collaboration_agreement.md` Section 4 —
  raised inconsistencies here should be treated as Review-blocking, not nice-to-have polish.

---

## 10. Testing Requirements

- Every feature ships with tests that produce *evidence* — actual output, not an assertion
  that it was tested.
- Quiz/scoring logic specifically requires test cases covering: correct answer, incorrect
  answer, partial/multi-select if applicable, and persistence across reload.
- Content-facing features (lessons, question bank) require a manual accuracy spot-check
  against the current PMI Exam Content Outline — this is not optional and is not satisfied by
  code tests alone, since the risk here is content correctness, not just code correctness.

---

## 11. Release Checklist

(MVP is local-only — this section governs "ready to consider a slice/version complete," not
a production deploy, until hosting becomes a real feature.)

- [ ] All Definition of Done items satisfied for every slice in this version
- [ ] `progress.md` reflects current state accurately
- [ ] `decision_log.md` has no pending/unresolved entries
- [ ] No known issues marked "blocking" in `progress.md`
- [ ] User has done a final manual pass through the feature as an end user, not just reviewed
      code

---

## 12. Amendment Log

This constitution changes only via explicit User decision.

| Date | Change | Reason |
|---|---|---|
| 2026-06-30 | Initial draft (v1.0) | Establish non-negotiable rules before first vertical slice begins |
