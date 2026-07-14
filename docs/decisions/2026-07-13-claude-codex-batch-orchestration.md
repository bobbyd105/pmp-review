# Decision — Claude Code orchestrates Codex in fresh-session batches

**Date:** 2026-07-13

**Decision:** For approved multi-batch implementation work, Claude Code may act as a bounded per-batch orchestrator while Codex CLI performs implementation. Each batch runs in a fresh Claude session, is independently reviewed and mechanically validated, and becomes a checkpoint commit on one feature branch. One draft pull request is opened only after all batches and the final feature gate pass.

**Alternatives considered:**

1. One long Claude session for the entire feature.
2. One independent or stacked pull request per batch.
3. Manual User relay between Claude and Codex after every implementation pass.
4. Codex implementing and reviewing its own work without Claude orchestration.

**Why rejected:**

1. A long session accumulates stale assumptions, failed approaches, diffs, and logs, increasing context drift and making recovery harder.
2. Batch PRs add dependency, rebasing, and review overhead for what is still one coherent feature.
3. Manual relay makes the User the transport layer and prevents useful unattended progress.
4. Self-review weakens separation between implementation and acceptance review.

**Tradeoffs:**

- The repository must carry durable plan, state, result, and governance artifacts.
- Local Claude Code, Codex CLI, Git, and optionally GitHub CLI must be installed and authenticated.
- The controller can verify command exit codes and changed paths, but human judgment remains necessary for product, architecture, migration, security, and merge decisions.
- Checkpoint commits may be created before the User's final feature review, but they are recovery records on an isolated branch and never authorize merge.

**Evidence:** The repository already requires small vertical slices, objective success conditions, test evidence, documentation before completion, and a feature-branch PR workflow. Fresh-session batches operationalize those rules while reducing context accumulation.

**Approved by:** User, in project conversation on 2026-07-13.

**Implementation:** `docs/claude_codex_batch_orchestrator.md`, `.ai/workflow/`, and `scripts/run-agent-workflow.ps1`.
