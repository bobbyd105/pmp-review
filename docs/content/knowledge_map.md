# Knowledge Map

## Concept topology

The full node and edge set is canonical in `data/knowledge_graph.json`. This
document highlights major prerequisite clusters and transfer relationships for
human review.

## Foundation and integration cluster

```mermaid
flowchart LR
  C001[Project work] --> C002[Value and success]
  C001 --> C003[Program/portfolio/operations]
  C001 --> C008[Leadership vs management]
  C001 --> C017[Life cycles]
  C002 --> C010[PMP decision mindset]
  C010 --> C011[Systems thinking]
  C010 --> C014[Accountability]
  C017 --> C022[Tailoring]
  C022 --> C023[PMBOK structure]
  C023 --> C024[Charter/business case/benefits]
  C024 --> C025[Integrated plan]
  C025 --> C026[Execution and knowledge]
  C026 --> C027[Performance and change]
  C027 --> C028[Closure]
```

## Delivery mechanics cluster

```mermaid
flowchart TD
  C023 --> C030[Requirements]
  C030 --> C031[Product vs project scope]
  C031 --> C032[WBS and scope baseline]
  C032 --> C033[Validate and control scope]
  C032 --> C034[Quality planning and control]
  C032 --> C035[Build schedule]
  C035 --> C036[Critical path and compression]
  C023 --> C037[Estimate and budget]
  C037 --> C038[EVM]
  C038 --> C039[Financial decisions]
  C023 --> C040[Stakeholder analysis]
  C040 --> C041[Engagement and communications]
  C023 --> C042[Resource planning]
  C042 --> C043[Team leadership]
  C043 --> C044[Conflict and negotiation]
  C023 --> C045[Risk planning]
  C045 --> C046[Risk analysis and response]
  C046 --> C047[Risk and issue monitoring]
```

## Agile, hybrid, and AI cluster

```mermaid
flowchart TD
  C010 --> C048[Agile values and mindset]
  C017 --> C048
  C020[Adaptive delivery] --> C048
  C048 --> C049[Scrum]
  C048 --> C050[Kanban and flow]
  C030 --> C051[Vision, backlog, stories]
  C048 --> C051
  C035 --> C052[Agile forecasting]
  C050 --> C052
  C051 --> C053[MVP and MMF]
  C048 --> C054[Servant leadership]
  C018[Predictive delivery] --> C055[Hybrid integration]
  C020 --> C055
  C048 --> C055

  C010 --> C056[AI foundations]
  C017 --> C056
  C056 --> C057[Automation/assistance/augmentation]
  C056 --> C058[Responsible AI]
  C058 --> C059[AI use cases]
  C027 --> C059
```

## Shared asset map

```mermaid
flowchart LR
  C036[Critical path] --> FF[F-TOTAL-FLOAT]
  C038[EVM] --> CPI[F-CPI]
  C038 --> SPI[F-SPI]
  C038 --> EAC[F-EAC]
  C046[Risk analysis] --> EMV[F-EMV]
  C050[Flow] --> LL[F-LITTLES-LAW]
  C049[Scrum] --> SCRUM[R-SCRUM-QUICK-REFERENCE]
  C040[Stakeholders] --> STK[R-STAKEHOLDER-MODELS]
  C058[Responsible AI] --> AI[R-RESPONSIBLE-AI-CHECKLIST]
  CPI --> FS[R-FORMULA-SHEET]
  SPI --> FS
  EAC --> FS
  EMV --> FS
  LL --> FS
```

## Review questions

Human architecture review should confirm that prerequisite edges reflect
instructional necessity rather than mere topical association; that related
links are reciprocal and useful; that no concept has become an unbounded
catch-all; and that shared assets reinforce rather than duplicate lesson
content.
