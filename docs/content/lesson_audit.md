# Lesson Audit

## Scope and method

All 26 production lessons were reviewed for technical depth, concept coverage, clarity, relationships, learning objectives, prerequisites, and question linkage. Lesson text was not rewritten.

## Executive assessment

The lesson set is a coherent **ECO Review track**. It is not a comprehensive course. Every current ECO task has one readable overview and 12–17 linked questions, but the lessons average only 180 words and have no explicit objectives, prerequisites, modules, source traceability, or concept-level question mappings.

The correct architectural response is to preserve these overviews and add concept units—not to stretch each overview into a large unsequenced chapter.

## Portfolio measurements

| Measure | Result |
|---|---:|
| Lessons | 26 |
| ECO tasks represented | 26/26 |
| Body words | median 163; range 133–303 |
| Related questions | median 15; range 12–17 |
| Lessons with explicit learning objectives | 0 |
| Lessons with prerequisite metadata | 0 |
| Dangling/cross-task question links | 0 |
| Questions not linked from a lesson | 0 |

## Lesson-by-lesson findings

| ID | Lesson | Technical depth | Coverage/clarity | Relationships and structural gap |
|---|---|---|---|---|
| l001 | Managing Team Conflict | Strong for overview | Clear conflict modes and direct-resolution mindset | 16 valid links; needs objective/prerequisite tags and deeper situational criteria |
| l002 | Schedule Compression | Strong but narrow | Clear crashing vs. fast tracking distinction | 15 links; requires preceding schedule-network/critical-path units |
| l003 | Benefits Realization | Strong for overview | Clear value-before-output framing | 16 links; needs business case, benefits plan, metrics, and financial selection depth |
| l004 | Negotiation | Strong but narrow | Clear interests vs. positions | 17 links; needs relationship to conflict, stakeholder, and procurement contexts |
| l005 | Choosing a Methodology | Partial | Clear predictive/adaptive/hybrid comparison | 16 links; too broad to carry life cycles, iterative/incremental, tailoring, and hybrid mechanics alone |
| l006 | Closing a Project | Strong for overview | Clear formal-closure mindset | 15 links; needs phase closure, procurement closure, transition, and records depth |
| l007 | Shared Vision | Partial | Concise and actionable | 16 links; needs product vision/roadmap and measurable outcome connections |
| l008 | Aligning Expectations | Partial | Clear proactive alignment distinction | 16 links; should connect to stakeholder analysis and engagement planning |
| l009 | Knowledge Transfer | Partial | Practical mechanisms are clear | 16 links; needs knowledge-management process, tacit/explicit, and OPA relationships |
| l010 | Resources | Partial | Clear leveling/availability mindset | 16 links; missing acquisition, RBS, calendars, RACI, smoothing, and physical resources |
| l011 | Budgeting and EVM | Partial | Good introductory interpretation | 15 links; incomplete formula set, reserves, estimates, budget development, and forecasting |
| l012 | Evaluating Status | Partial | Clear trend/forecast orientation | 15 links; needs work-performance flow, thresholds, EVM forecasting, and adaptive metrics |
| l013 | Governance | Partial | Clear decision-rights framing | 12 links; missing charter, PMO, organizational structures, boards, metrics, and process map |
| l014 | Compliance | Partial | Clear proactive compliance mindset | 12 links; needs compliance planning, evidence, audit, privacy, and responsible-AI applications |
| l015 | Change Control | Strong for predictive overview | Clear impact/approval discipline | 12 links; needs adaptive change contrast and full integrated-change-control flow |
| l016 | Impediments and Issues | Strong for overview | Clear active ownership and risk-to-issue distinction | 12 links; needs issue-log workflow, escalation thresholds, and blocker metrics |
| l017 | Risk Fundamentals | Partial | Clear basic threat/opportunity response framing | 12 links; missing qualitative/quantitative analysis, EMV, residual/secondary risk, and risk report |
| l018 | Continuous Improvement | Partial | Clear root-cause/retrospective mindset | 13 links; needs Lean/Kanban flow, quality tools, Kaizen, and measurement depth |
| l019 | Organizational Change | Partial | Clear adoption/resistance framing | 13 links; needs change strategy, readiness, benefits adoption, and organizational systems context |
| l020 | External Environment | Partial | Clear impact-assessment mindset | 13 links; needs structured environmental analysis, sustainability, and AI/technology change |
| l021 | Leading a Team | Strong for ECO review | Clear servant leadership, empowerment, and team formation | 16 links; carries too many people concepts and needs leadership/style/motivation sub-units |
| l022 | Engaging Stakeholders | Partial | Clear engagement-over-broadcast message | 16 links; missing identification and analysis models, assessment matrix, and salience |
| l023 | Communication Method | Partial | Clear channel-to-problem matching | 17 links; missing communication plan mechanics, channels formula, models, and cultural complexity |
| l024 | Scope | Partial | Clear scope/change/backlog discipline | 16 links; missing requirements taxonomy, RTM, scope statement, WBS, baseline, validate/control distinctions |
| l025 | Procurement | Strong at high level | Clear contract risk allocation | 16 links; needs sourcing sequence, make/buy, procurement documents, source selection, and administration |
| l026 | Quality | Strong for overview | Clear conformance/fitness/prevention distinctions | 15 links; needs quality planning/assurance/control, cost of quality, tools, and acceptance relationships |

## Learning objective audit

No lesson declares measurable objectives. Future concept lessons should use two to five objectives with observable verbs such as distinguish, interpret, select, calculate, diagnose, or justify. ECO overviews may instead link to the objectives they summarize.

Objectives must not be hidden as prose headings because adaptive learning and assessment mapping require stable IDs.

## Prerequisite audit

No prerequisite graph exists. Several current lessons assume knowledge they do not teach:

- l002 assumes activity sequencing and critical path.
- l011/l012 assume baseline and EVM vocabulary.
- l015 assumes predictive governance and change authority.
- l017 assumes risk vocabulary and process flow.
- l024 assumes requirement/scope artifacts.
- l025 assumes sourcing and contract fundamentals.

The sequence in `docs/content/curriculum_model.md` addresses these gaps without changing current lesson order.

## Relationship audit

Current linkage is mechanically excellent but semantically coarse:

- every question appears in a related-question list;
- all links match the lesson’s exact ECO domain/task;
- no link is dangling or cross-task;
- each task has exactly one lesson, so each question effectively maps to exactly one overview.

Future concept mapping must be many-to-many and objective-based. Existing `related_question_ids` can remain for backward compatibility until a normalized loader is approved.

## Clarity and rendering

- Bodies are generally readable, concise, and appropriate for rapid review.
- The minimal paragraph/bold/bullet renderer is safe.
- The schema cannot express callouts, worked calculations, tables, figures, objective lists, glossary links, or reference links cleanly.
- Renderer expansion should follow approved content needs; it should not precede them.

## Recommendations

1. Preserve all 26 lessons as ECO overview assets.
2. Do not mark them as comprehensive concept lessons.
3. Add stable objective/prerequisite metadata through a separate approved migration.
4. Build new concept units in the sequence and status order in the coverage catalog.
5. Require source traceability and last-reviewed metadata for every new unit.
6. Link questions to objectives, then derive lesson question lists instead of hand-maintaining them.
7. Add worked examples and reference sheets as linked asset types rather than bloating lesson bodies.
