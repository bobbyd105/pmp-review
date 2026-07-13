# PMP Study Platform

A local-first React/Vite study app for PMP review. It includes a random quiz, browsable question bank, quiz-history dashboard, ECO overview lessons, copy/paste study prompts, local content validation, and a read-only curriculum coverage planner. The app uses local JSON and browser storage; it does not call an AI API.

## Run locally

```sh
npm install
npm run dev
```

Validation:

```sh
npm test
npm run build
```

## Content and curriculum

- `data/questions.json` — 384 scenario questions
- `data/lessons.json` — 26 ECO-task overview lessons
- `data/prompts.json` — 8 static copy/paste prompts
- `data/content_coverage.json` — 59-unit comprehensive-course planning catalog
- `docs/content/curriculum_model.md` — canonical multi-track curriculum architecture
- `docs/content/coverage_matrix.md` — concept-level coverage assessment
- `docs/content/curriculum_audit_report.md` — audit findings and roadmap

The local reference PDFs and source-planning files are research inputs only and are excluded from Git.

## Repository orientation

Read `docs/progress.md` for current state and `docs/app-map.html` for the component/data/test map before implementation work. Project rules are in `AGENTS.md`, `docs/ai_collaboration_agreement.md`, and `docs/project_constitution.md`.
