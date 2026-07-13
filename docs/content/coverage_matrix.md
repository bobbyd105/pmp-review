# Curriculum Coverage Matrix

## How to read this matrix

Coverage is measured at the **concept-unit level**, not by ECO task counts alone. The repository has complete ECO breadth, but it does not have complete instructional depth.

### Coverage strength

- **Strong** — an existing lesson directly teaches the core concept and has substantial ECO-aligned question support.
- **Partial** — meaningful coverage exists, but important mechanics or distinctions are absent.
- **Thin** — only introductory, indirect, or narrowly scoped coverage exists.
- **Missing** — no dedicated instructional treatment exists, even if isolated terms appear.

### Lifecycle

- **Existing** — a current production lesson is a usable anchor for the concept; this does not imply the full planned concept unit exists.
- **Planned** — a dedicated concept unit is needed.
- **Approved** — reserved for a unit whose scope and contract the User has approved.
- **Implemented** — reserved for a completed production concept lesson that passed review and validation.

No unit is marked Approved or Implemented in this audit because architecture work cannot self-approve production curriculum.

### Question-count caveat

The count shown is derived from unique questions matching the unit’s ECO mappings. It is **ECO-aligned support**, not proof that every question directly assesses the concept. Direct objective/question mappings require a future reviewed metadata migration.

The complete many-to-many ECO and PMBOK mappings, source references, and lesson IDs are canonical in `data/content_coverage.json`.

## Portfolio summary

| Metric | Result |
|---|---:|
| Modules | 13 |
| Planned concept units | 59 |
| Strong | 9 |
| Partial | 29 |
| Thin | 11 |
| Missing | 10 |
| Existing anchors | 30 |
| Dedicated planned units | 29 |
| Approved | 0 |
| Implemented comprehensive units | 0 |

## Module summary

Strength column order is Strong / Partial / Thin / Missing.

| Module | Title | Units | Strength | Unique ECO-aligned questions |
|---|---|---:|---:|---:|
| M01 | Project Management Foundations | 9 | 1 / 4 / 1 / 3 | 112 |
| M02 | Principles and PMP Mindset | 7 | 2 / 3 / 1 / 1 | 76 |
| M03 | Life Cycles, Approaches, and Tailoring | 6 | 0 / 4 / 2 / 0 | 16 |
| M04 | PMBOK 8 Structural Model | 1 | 0 / 0 / 0 / 1 | 16 |
| M05 | Governance and Integration | 6 | 2 / 3 / 1 / 0 | 118 |
| M06 | Scope and Quality | 5 | 0 / 3 / 2 / 0 | 31 |
| M07 | Schedule Management | 2 | 0 / 2 / 0 / 0 | 15 |
| M08 | Finance and Value Measurement | 3 | 0 / 2 / 1 / 0 | 46 |
| M09 | Stakeholder and Communications | 2 | 1 / 1 / 0 / 0 | 33 |
| M10 | Resources, Teams, Leadership, Conflict | 3 | 2 / 1 / 0 / 0 | 65 |
| M11 | Risk and Uncertainty | 3 | 1 / 2 / 0 / 0 | 24 |
| M12 | Agile and Hybrid Delivery | 8 | 0 / 4 / 3 / 1 | 108 |
| M13 | AI in Project Management | 4 | 0 / 0 / 0 / 4 | 53 |

Module question totals must not be added together: units intentionally overlap ECO tasks.

## Unit matrix

| ID | Concept unit | Rating | Lifecycle | Primary mapping | Sources | Existing lesson anchors | ECO-aligned Q |
|---|---|---|---|---|---|---|---:|
| C001 | What Makes Work a Project? | Partial | Planned | Process T1; Governance/Initiating | S2, S4 | l005 | 16 |
| C002 | Value, Benefits, and Project Success | Strong | Existing | Process T3; Focus on Value | S2, S3, S8, S10 | l003 | 16 |
| C003 | Project vs. Program vs. Portfolio vs. Operations | Missing | Planned | BE T1; Governance | S2 | l013 | 12 |
| C004 | Projects as Vehicles for Change | Partial | Planned | BE T7; Governance | S2, S3 | l019 | 13 |
| C005 | Phases, Deliverables, and Acceptance | Thin | Planned | Process T10; Closing/Validate Scope | S2, S4, S8 | l006 | 15 |
| C006 | Project vs. Product Management | Missing | Planned | Process T3; Governance | S2, S10 | l003 | 16 |
| C007 | Risks, Issues, Assumptions, and Constraints | Partial | Existing | BE T4/T5; Risk | S2, S5, S8 | l016, l017 | 24 |
| C008 | Leadership vs. Management | Partial | Existing | People T3; Resources | S2, S3, S9 | l021 | 16 |
| C009 | PMOs and Organizational Structures | Missing | Planned | BE T1; Governance | S2, S8 | l013 | 12 |
| C010 | The PMP Decision-Making Mindset | Partial | Planned | People T3; accountable/value principles | S3, S9, S10 | l021 | 16 |
| C011 | Holistic and Systems Thinking | Thin | Planned | Process T1; holistic principle | S3, S5 | l005 | 16 |
| C012 | Value-Driven Delivery | Strong | Existing | Process T3; Focus on Value | S3, S8, S10 | l003 | 16 |
| C013 | Building Quality In | Strong | Existing | Process T7; quality principle | S3, S8, S10 | l026 | 15 |
| C014 | Accountability and Ethical Leadership | Partial | Existing | People T3; accountable leadership | S3, S9, S11 | l021 | 16 |
| C015 | Empowered Teams and Culture | Partial | Existing | People T3; empowered culture | S3, S9 | l021 | 16 |
| C016 | Sustainability Across the Project | Missing | Planned | BE T8; sustainability principle | S3, S11 | l020 | 13 |
| C017 | Project Life Cycles and Phase Gates | Partial | Planned | Process T1; life cycle | S2, S4, S8 | l005 | 16 |
| C018 | Predictive Delivery | Partial | Existing | Process T1; Predictive | S4, S8 | l005, l015 | 16 |
| C019 | Iterative and Incremental Delivery | Thin | Planned | Process T1; Iterative/Incremental | S4, S9, S10 | l005 | 16 |
| C020 | Adaptive Delivery | Partial | Existing | Process T1; Adaptive | S4, S9, S10 | l005 | 16 |
| C021 | Hybrid Delivery | Thin | Existing | Process T1; Hybrid | S4, S10 | l005 | 16 |
| C022 | Tailoring the Approach | Partial | Existing | Process T1; Tailoring | S4, S8, S10 | l005 | 16 |
| C023 | PMBOK 8 Domains and Focus Areas | Missing | Planned | Process T1; PMBOK process map | S1, S5, S8 | l005 | 16 |
| C024 | Charter, Business Case, and Benefits Plan | Partial | Planned | BE T1/Process T3; Initiating | S2, S6, S8 | l003, l013 | 28 |
| C025 | Integrated Project Management Plan | Thin | Existing | Process T1; Integrate Plans | S6, S8 | l005 | 16 |
| C026 | Project Execution and Knowledge | Partial | Existing | People T7; Execution/Knowledge | S6, S8 | l009 | 16 |
| C027 | Monitoring Performance and Managing Change | Partial | Existing | Process T9/BE T3; Monitor/Change | S6, S8 | l012, l015 | 27 |
| C028 | Project and Phase Closure | Strong | Existing | Process T10; Close Project/Phase | S6, S8 | l006 | 15 |
| C029 | Procurement, Contracts, and Sourcing | Strong | Existing | Process T5; Plan Sourcing | S6, S8 | l025 | 16 |
| C030 | Requirements Elicitation and Analysis | Thin | Planned | Process T2; Elicit Requirements | S6, S8 | l024 | 16 |
| C031 | Product Scope vs. Project Scope | Partial | Existing | Process T2; Define Scope | S5, S8 | l024 | 16 |
| C032 | Scope Statements, WBS, and Baselines | Thin | Planned | Process T2; Scope Structure | S6, S8 | l024 | 16 |
| C033 | Scope Validation and Control | Partial | Existing | Process T2; Validate/Control Scope | S6, S8 | l024, l026 | 16 |
| C034 | Quality Planning, Assurance, and Control | Partial | Existing | Process T7; Quality Assurance | S3, S8, S10 | l026 | 15 |
| C035 | Building the Project Schedule | Partial | Planned | Process T8; Develop Schedule | S8, S10 | l002 | 15 |
| C036 | Critical Path, Float, and Compression | Partial | Existing | Process T8; Critical Path | S8, S10 | l002 | 15 |
| C037 | Cost Estimating and Budgeting | Partial | Existing | Process T6; Estimate/Develop Budget | S8, S10 | l011 | 15 |
| C038 | Earned Value Interpretation | Partial | Existing | Process T6/T9; EVM | S8, S10 | l011, l012 | 30 |
| C039 | Financial Selection Metrics and Forecasting | Thin | Planned | Process T3/T6; Finance | S8, S10 | l003, l011, l012 | 31 |
| C040 | Identifying and Analyzing Stakeholders | Partial | Planned | People T4; Identify Stakeholders | S5, S8 | l022 | 16 |
| C041 | Engagement and Communications | Strong | Existing | People T4/T8; Stakeholders | S8, S9 | l008, l022, l023 | 33 |
| C042 | Resource Planning and Acquisition | Partial | Existing | Process T4; Resources | S5, S8 | l010 | 16 |
| C043 | Team Leadership and Development | Strong | Existing | People T3; Lead Team | S3, S8, S9 | l021 | 16 |
| C044 | Conflict Resolution and Negotiation | Strong | Existing | People T2/T6; Conflict | S2, S8, S9 | l001, l004 | 33 |
| C045 | Risk Planning and Identification | Partial | Existing | BE T5; Plan/Identify Risk | S5, S8 | l017 | 12 |
| C046 | Risk Analysis and Response Strategies | Partial | Existing | BE T5; Analyze/Respond | S8, S10 | l017 | 12 |
| C047 | Monitoring Risks and Managing Issues | Strong | Existing | BE T4/T5; Monitor Risk/Issue Log | S2, S8, S10 | l016, l017 | 24 |
| C048 | Agile Values, Principles, and Mindset | Partial | Planned | People T3; Adaptive | S4, S9, S10 | l005, l021 | 16 |
| C049 | Scrum Roles, Events, and Artifacts | Missing | Planned | People T3; Scrum | S9, S10 | l021 | 16 |
| C050 | Kanban, Lean, and Flow | Thin | Planned | BE T6; Kanban/Lean | S9, S10 | l018 | 13 |
| C051 | Product Vision, Backlogs, and User Stories | Partial | Planned | People T1/Process T2; Adaptive Scope | S8, S9, S10 | l007, l024 | 32 |
| C052 | Agile Estimation and Forecasting | Thin | Planned | Process T9; Adaptive Schedule | S9, S10 | l012 | 15 |
| C053 | MVP, MMF, and Early Value | Partial | Planned | Process T3; Adaptive Value | S9, S10 | l003 | 16 |
| C054 | Servant Leadership and Self-Organizing Teams | Partial | Existing | People T3; Adaptive Resources | S3, S9 | l021 | 16 |
| C055 | Hybrid Integration | Thin | Planned | Process T1; Hybrid Governance | S4, S8, S10 | l005 | 16 |
| C056 | AI Foundations for Project Managers | Missing | Planned | BE T8; AI reference | S2, S11 | l020 | 13 |
| C057 | Automation, Assistance, and Augmentation | Missing | Planned | BE T6; AI adoption | S11 | l018 | 13 |
| C058 | Responsible AI and Human Accountability | Missing | Planned | BE T2; responsible AI | S3, S11 | l014 | 12 |
| C059 | AI Use Cases Across the Project Life Cycle | Missing | Planned | Process T9; AI use cases | S11 | l012 | 15 |

## Priority gaps

### Priority A — foundational structure

C003, C006, C009, C016, and C023 are Missing. These gaps prevent the repository from functioning as a comprehensive beginner course.

### Priority B — predictive mechanics

C025, C030, C032, C039, and portions of C035–C038 are Thin/Partial. These are important for technical PMP questions and formula interpretation.

### Priority C — agile depth

C049 is Missing; C050, C052, and C055 are Thin. Current questions emphasize general team judgment more than named framework mechanics.

### Priority D — AI

C056–C059 are all Missing as dedicated instruction. Isolated AI mentions do not satisfy the planned responsible-AI module.

## Status governance

1. A unit moves from Planned to Approved only after the User approves its objectives, scope, mappings, and source plan.
2. A unit moves to Implemented only after lesson text, objective/question mappings, tests, accuracy review, docs, and map updates are complete.
3. Coverage strength can remain Thin or Partial after implementation; lifecycle must never be used to conceal quality gaps.
4. Any mapping change updates `data/content_coverage.json` first, then this matrix and the app dashboard.
