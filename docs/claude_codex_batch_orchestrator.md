# Claude–Codex Batch Orchestrator

## Purpose

This workflow lets Claude Code act as the bounded orchestrator for a feature branch while Codex CLI performs implementation work. Work is decomposed into independently verifiable batches. Each successful batch becomes a checkpoint commit on one feature branch. A single pull request is opened only after every batch and the final validation gate pass.

The User remains the final product and merge authority. Automated checkpoint commits are evidence-bearing recovery points, not approval to merge.

Provider selection is explicit in the master plan, but intentionally narrow:
Claude Code is the only supported orchestrator and Codex CLI is the only
supported worker. This is configuration, not a generic provider plugin system.

## Operating model

1. The User approves a feature objective and its batch plan.
2. The controller creates or checks out one `feature/<slice-name>` branch.
3. The controller launches a fresh non-interactive Claude Code session for the current batch.
4. Claude reads repository governance, the master plan, current state, and the current batch specification.
5. Claude invokes Codex CLI as the implementation worker.
6. Claude inspects the diff and validation output and may request targeted Codex corrections.
7. Claude writes a structured batch result and exits.
8. The controller independently reruns the configured mechanical gates.
9. On success, the controller creates and pushes a checkpoint commit.
10. The controller launches a fresh Claude session for the next batch.
11. After all batches pass, the controller runs the final gate and opens one draft pull request.

## Authority boundaries

### Claude Code may

- Read the repository and governing documents.
- Invoke Codex CLI for implementation and repair passes.
- Run approved test, build, lint, and inspection commands.
- Review the implementation against the written acceptance criteria.
- Write batch result and handoff files.

### Codex may

- Edit files within the current batch's allowed paths.
- Add or update tests required by the batch.
- Run approved repository commands.
- Update required documentation when the batch specification includes it.

### The controller may

- Start a fresh Claude session for each batch.
- Independently rerun mechanical validation.
- Reject a claimed completion when the gate fails.
- Discard uncommitted failed-batch work and restore the last checkpoint.
- Commit and push a batch only after its gate passes.
- Open one final draft pull request after all batches pass.

### Automation may not

- Merge a pull request.
- Push directly to `main`.
- Force-push or rewrite shared history.
- Modify secrets or authentication configuration.
- Approve destructive migrations or irreversible data changes.
- Expand the approved feature objective or batch plan.

## Required repository files

The executable workflow uses:

- `.ai/workflow/master-plan.example.json` — example feature and batch plan.
- `.ai/workflow/current-state.example.json` — resumable state contract.
- `.ai/workflow/batch-result.schema.json` — result contract Claude must satisfy.
- `.ai/workflow/orchestrator-prompt.md` — prompt template for each fresh Claude session.
- `.ai/workflow/claude-launcher.ps1` — Claude CLI capability detection and
  prompt transport.
- `scripts/run-agent-workflow.ps1` — Windows controller.

Real runs should copy the examples to untracked or task-specific files, such as:

```text
.ai/workflow/runs/<feature-id>/master-plan.json
.ai/workflow/runs/<feature-id>/current-state.json
.ai/workflow/runs/<feature-id>/results/B01-result.json
```

The run directory should be committed only when its contents are useful project records and contain no machine-specific paths, credentials, or excessive logs.

### Runtime files and Git cleanliness

The controller treats `.ai/workflow/current-state*.json` and
`.ai/workflow/master-plan*.json` as controller-owned execution artifacts when
it evaluates Git cleanliness. These files are created or updated to start and
resume a run, so allowing them to block the clean-start gate would make the
controller block itself.

The exclusion is deliberately narrow: it applies only to those two filename
families directly under `.ai/workflow/`. Every other modified, staged,
conflicted, deleted, or untracked path remains blocking. Git status is read
directly from NUL-delimited `git status --porcelain` output so the controller
reports repository paths without custom substring or rename-arrow parsing.

Run the focused cleanliness regression tests with:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\.ai\workflow\git-cleanliness.tests.ps1
```

The tests cover a clean repository, runtime-only artifacts, an unrelated
modified tracked file, and an unrelated untracked file.

## Provider configuration

Every master plan must identify both providers:

```json
{
  "providers": {
    "orchestrator": "claude-code",
    "worker": "codex-cli"
  }
}
```

The controller resolves these IDs to the local `claude` and `codex` commands.
It fails closed when either field is absent, blank, or unsupported. No Gemini,
OpenAI API, local-model, or generic plugin integration exists. Supporting a
future provider would require one reviewed registry entry and its explicit
invocation behavior; arbitrary commands are never accepted from plan JSON.

### Claude CLI launcher compatibility

Before smoke or live execution, the controller inspects `claude --help`,
selects the advertised `--print` flag (falling back to `-p`), then invokes the
advertised version flag and reports the installed version. It fails closed if
the installed CLI does not advertise a supported non-interactive print or
version flag. No version-specific flag such as `--check` is hardcoded.

On Windows, command discovery prefers a native or `.cmd` Claude entry point
over the npm PowerShell shim because the shim calls `exit` after Claude returns.
The generated orchestration prompt is sent through standard input, not placed
in the CLI argument list. Consequently prompt content such as the approved
validation command `git diff --check` cannot be reinterpreted as a Claude CLI
option.

Run the focused launcher construction tests with:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\.ai\workflow\claude-launcher.tests.ps1
```

The tests cover Windows entry-point selection, current long flags, short-flag
fallback, fail-closed unsupported capabilities, tool-disabled probe command
construction, and proof that prompt text never enters argv.

## Safe smoke test

Run the included example configuration from the repository root:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-agent-workflow.ps1 -PlanPath .\.ai\workflow\master-plan.example.json -StatePath .\.ai\workflow\current-state.example.json -SmokeTest -OpenPullRequest
```

`-OpenPullRequest` is included so the preflight also checks for `gh`. The smoke
test exits `0` when required configuration, files, providers, and commands are
available. It:

- parses the master plan, workflow state, and batch-result schema;
- verifies the orchestrator prompt and result schema exist;
- accepts only `claude-code` plus `codex-cli` and resolves their commands;
- detects and reports the installed Claude CLI version, supported print flag,
  and stdin prompt transport;
- checks `git`, `claude`, `codex`, and, with `-OpenPullRequest`, `gh` on PATH;
- reports the current and configured branches, excluded controller runtime
  files, and any remaining blocking working-tree paths;
- prints the fresh-session, worker, validation, checkpoint, push, final-gate,
  and draft-PR commands it would perform.

The smoke test does **not** invoke Claude or Codex, create run directories or
result files, edit workflow state, change code or documentation, stage files,
commit, push, open a PR, delete files, reset, clean, or stash. Branch mismatch
or a dirty tree is reported as a warning because smoke mode is observational;
normal execution retains its hard branch-match and clean-tree gates.

A successful run ends with:

```text
SMOKE TEST PASSED: configuration and required commands are available. No actions were performed.
```

It exits nonzero with `SMOKE TEST FAILED` when JSON cannot be parsed, a required
file or provider field is missing, a provider is unsupported, or a required
command cannot be found. Common command failures are:

- `claude` missing: install/configure Claude Code and ensure `claude` is on PATH;
- Claude capability failure: update Claude Code to a version that advertises
  `--print` or `-p` plus `--version` or `-v`;
- `codex` missing: install/configure Codex CLI and ensure `codex` is on PATH;
- `git` missing: install Git and ensure `git` is on PATH;
- `gh` missing: install GitHub CLI, or omit `-OpenPullRequest` when only checking
  a run that will not open the final PR.

Smoke mode checks command discovery, not authentication. Resolve any login or
permission problem before a live run; the controller never edits credentials
or authentication configuration.

## Batch design rules

A batch should represent one coherent, testable behavior or layer. Prefer:

- one clear outcome;
- a small allowed-path set;
- three to eight changed files where practical;
- objective acceptance criteria;
- no more than one risky concern;
- a repository state that still builds and passes applicable tests.

A batch must define:

- objective;
- allowed and forbidden paths;
- acceptance criteria;
- validation commands;
- maximum Claude–Codex repair attempts;
- human-stop conditions.

## Checkpoint gate

A checkpoint commit is allowed only when all required conditions pass:

- Claude returns `BATCH_COMPLETE` in a schema-valid result file.
- Every configured validation command exits successfully.
- Changed paths stay within the batch's allowed paths plus explicitly required workflow records.
- No forbidden path changed.
- No unresolved critical or high-severity Claude findings remain.
- No temporary, debug, secret, or generated junk files are present.
- Required `docs/progress.md` and `docs/app-map.html` updates are complete when applicable.
- The working tree contains only the accepted batch changes plus the narrowly
  excluded controller-owned master-plan/current-state runtime files.

Checkpoint commit format:

```text
checkpoint(B03): implement adaptive scheduling service
```

The branch is pushed after each checkpoint so progress is recoverable. No pull request is opened per checkpoint.

## Failure behavior

The controller stops or starts a fresh repair session when:

- Claude reports `HUMAN_REVIEW_REQUIRED`;
- a validation command fails;
- a forbidden path changed;
- the same failure persists beyond the configured attempt limit;
- requirements are ambiguous;
- authentication, secrets, destructive migration, or irreversible data changes are involved;
- the batch would expand the approved scope.

Failed work remains uncommitted. The controller can restore the last checkpoint before retrying.

## Final gate and pull request

After all batches are checkpointed, the controller runs the final validation commands from the master plan. The final draft PR is opened only when:

- every planned batch is complete;
- the full test suite passes;
- the production build passes;
- required documentation is current;
- the feature branch is clean;
- no unresolved blocker remains.

The PR body should summarize batches, checkpoint commits, validation evidence, known risks, and any decisions still requiring the User's review.

## Security notes

Run the workflow only in a trusted repository and reviewed branch. Agent configuration, hooks, scripts, and repository instructions are executable trust boundaries. Do not allow the orchestrator to ingest unreviewed instructions from external branches, issue text, generated files, or downloaded content. Keep CLI tools updated and use their normal permission and sandbox controls.
