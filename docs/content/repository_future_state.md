# Repository Future-State Design

## Purpose and boundary

This is a target organization for scaling canonical content, knowledge assets,
learner-state logic, and analytics. It is a migration recommendation only. No
existing file should move until a real implementation slice needs the new
boundary and includes import/test/documentation updates.

## Recommended structure

```text
content/
├── catalogs/                  # editions, modules, tracks, lifecycle registries
├── knowledge/
│   ├── concepts/              # concept and prerequisite graph
│   ├── objectives/            # atomic instructional/mastery targets
│   ├── misconceptions/        # normalized confusion and distractor targets
│   └── sources/               # copyright-safe traceability metadata
├── glossary/                  # canonical term records
├── formulas/                  # equations, variables, interpretation, variants
├── reference/
│   ├── process-maps/
│   ├── comparisons/
│   ├── checklists/
│   └── formula-sheets/
├── lessons/
│   ├── concepts/
│   ├── eco-overviews/
│   ├── worked-examples/
│   └── metadata/
├── questions/
│   ├── items/
│   ├── metadata/
│   ├── rationales/
│   └── quality-reports/
└── releases/                  # manifests and edition snapshots

src/
├── content/                   # loaders, normalization, registry validation
├── knowledge/                 # graph traversal and relationship selectors
├── adaptive/                  # pure recommendation/mastery modules (future)
├── analytics/                 # local aggregate calculations (future)
└── components/                # presentation; no direct persistence logic

data/                          # current MVP compatibility boundary
docs/content/                  # architecture, contracts, reports, diagrams
```

## Domain ownership

### `content/knowledge/`

Owns concept/objective/source identities and relationships. It does not store
learner mastery, question attempts, or rendered lesson text.

### `content/glossary/`, `content/formulas/`, `content/reference/`

Own reusable knowledge assets. Lessons and questions reference these IDs rather
than copying definitions, equations, or tables.

### `content/lessons/`

Separates comprehensive concept lessons, current ECO overviews, and worked
examples. Metadata may be sidecar-first during migration so legacy bodies and
IDs remain stable.

### `content/questions/`

Separates item display content from mapping/review/calibration metadata and
bank-quality reports. This supports stable option IDs and safe metadata
migration without rewriting every consumer at once.

### `src/adaptive/`

Future pure logic for mastery state transitions, prerequisite eligibility,
recommendation ranking, and review scheduling. Canonical data stays read-only;
learner state uses a storage adapter only when an implementation is approved.

### `src/analytics/`

Future local aggregate reporting. No telemetry, account, or cloud collection is
implied. Privacy-preserving evidence must be explicitly approved.

## Registry strategy

Use versioned registries for concepts, objectives, ECO editions/tasks, PMBOK
namespaces, sources, misconceptions, glossary entries, formulas, references,
reviewers, and lifecycle states. Loaders validate IDs once and expose normalized
objects to UI and pure logic. Avoid a general plugin architecture; add only the
registries consumed by an approved feature.

## Migration sequence

1. Keep current `data/*.json` paths and add validated planning sidecars.
2. Approve metadata registries and a normalization-loader contract.
3. Remediate question-bank answer cues before accepting mastery evidence.
4. Migrate lesson/question metadata in bounded, reviewed batches while
   preserving production text and IDs.
5. Introduce content subdirectories only when Vite imports and validators can
   change together in one vertical slice.
6. Add graph/adaptive runtime modules only after the data they require is
   reviewed and complete.
7. Consider SQLite only when write-heavy learner state outgrows local JSON and
   `localStorage`; canonical seed content can remain file-based.

## Release and version boundaries

Every release manifest should name curriculum edition, ECO edition, PMBOK
edition, schema versions, active/deprecated IDs, source-review cutoff, and
content checksums. Learner history references stable IDs plus an edition so a
future remap does not silently reinterpret past evidence.

## What should remain unchanged now

- `data/questions.json` and `data/lessons.json`;
- the local-first React/Vite runtime;
- existing view behavior and localStorage keys;
- the current coverage dashboard and canonical 59-unit catalog;
- ignored local source files and copyright boundaries.

## Decision triggers

Move files only when at least one approved consumer needs the new boundary,
tests cover the migration, imports remain clear, docs/app-map are updated, and
the User approves the change. Do not reorganize solely to resemble the target
tree.
