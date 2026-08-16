// Read-only analysis of data/questions.json for the Exam Simulator Readiness
// Audit. Produces exact counts by ECO domain/task, approach, item style, and
// concept coverage — all read directly from explicit per-question metadata
// (docs/decision_log.md #15). A small set of cross-cutting content signals
// (stakeholder, leadership, risk, governance, business-environment) still
// have no canonical field and remain heuristic keyword estimates, clearly
// labeled as such. Never writes to data/questions.json.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ECO_DOMAIN_WEIGHTS = {
  People: 0.33,
  Process: 0.41,
  'Business Environment': 0.26,
}

export const APPROACHES = ['predictive', 'adaptive', 'hybrid', 'universal']
export const ITEM_STYLES = [
  'scenario_judgment',
  'definition_distinction',
  'calculation',
  'interpretation',
  'process_sequence',
]

// Heuristic cross-cutting content signals. These categories have no
// canonical per-question field (docs/exam_simulator_readiness_audit.md §1
// judged a dedicated boolean unnecessary — eco_task already isolates most
// of this content). Every match here is a SIGNAL, not a certified label.
// Patterns are matched against the lowercased question stem + options +
// explanation.
const HEURISTIC_CATEGORY_PATTERNS = {
  stakeholderComms: [
    /\bstakeholder\b/,
    /\bcommunicat/,
    /\bsalience model\b/,
    /\bengagement\b/,
  ],
  leadershipTeam: [
    /\bconflict\b/,
    /\bteam member\b/,
    /\bleadership\b/,
    /\bservant leader/,
    /\bteam lead\b/,
    /\bmotivat/,
  ],
  risk: [/\brisk\b/, /\bcontingency\b/, /\bmanagement reserve\b/, /\bthreat\b/, /\bopportunity\b/],
  governanceChangeControl: [
    /\bgovernance\b/,
    /\bchange control\b/,
    /\bchange request\b/,
    /\bcompliance\b/,
    /\bccb\b/,
  ],
  businessEnvironmentValue: [
    /\bbusiness case\b/,
    /\bvalue\b/,
    /\bbenefit/,
    /\bsustainab/,
    /\bexternal (business )?environment\b/,
    /\breturn on investment\b/,
    /\broi\b/,
  ],
}

function questionText(question) {
  return [question.question, ...question.options, question.explanation]
    .join(' \n ')
    .toLowerCase()
}

function matchesAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text))
}

export function categorizeHeuristic(question) {
  const text = questionText(question)
  const result = {}
  for (const [category, patterns] of Object.entries(HEURISTIC_CATEGORY_PATTERNS)) {
    result[category] = matchesAny(text, patterns)
  }
  return result
}

export function analyzeBank(questions, conceptLessons = []) {
  const total = questions.length

  const domainCounts = {}
  const taskCounts = {}
  for (const q of questions) {
    domainCounts[q.eco_domain] = (domainCounts[q.eco_domain] ?? 0) + 1
    const taskKey = `${q.eco_domain} — ${q.eco_task}`
    taskCounts[taskKey] = (taskCounts[taskKey] ?? 0) + 1
  }

  const approachCounts = Object.fromEntries(APPROACHES.map((a) => [a, 0]))
  const itemStyleCounts = Object.fromEntries(ITEM_STYLES.map((s) => [s, 0]))
  for (const q of questions) {
    approachCounts[q.approach] = (approachCounts[q.approach] ?? 0) + 1
    itemStyleCounts[q.item_style] = (itemStyleCounts[q.item_style] ?? 0) + 1
  }

  const heuristicCounts = {}
  const heuristicRows = questions.map((q) => ({ id: q.id, ...categorizeHeuristic(q) }))
  for (const category of Object.keys(HEURISTIC_CATEGORY_PATTERNS)) {
    heuristicCounts[category] = heuristicRows.filter((row) => row[category]).length
  }

  // Concept coverage — exact, from question.concept_ids.
  const allConceptIds = conceptLessons.map((c) => c.id)
  const conceptQuestionCounts = Object.fromEntries(allConceptIds.map((id) => [id, 0]))
  let multiConceptCount = 0
  for (const q of questions) {
    const ids = q.concept_ids ?? []
    if (ids.length > 1) multiConceptCount += 1
    for (const id of ids) {
      if (id in conceptQuestionCounts) conceptQuestionCounts[id] += 1
    }
  }
  const zeroQuestionConcepts = allConceptIds.filter((id) => conceptQuestionCounts[id] === 0)
  const shallowConcepts = allConceptIds
    .filter((id) => conceptQuestionCounts[id] >= 1 && conceptQuestionCounts[id] <= 2)
    .sort((a, b) => conceptQuestionCounts[a] - conceptQuestionCounts[b] || a.localeCompare(b))

  // True AI coverage: questions whose concept_ids intersect the AI module's
  // concept lessons (exact, from concept_lessons.json's module field) —
  // not keyword matching.
  const aiConceptIds = new Set(
    conceptLessons.filter((c) => c.module === 'AI in Project Management').map((c) => c.id),
  )
  const aiQuestionIds = questions
    .filter((q) => (q.concept_ids ?? []).some((id) => aiConceptIds.has(id)))
    .map((q) => q.id)

  const linkedQuestionIds = new Set()
  for (const lesson of conceptLessons) {
    for (const id of lesson.related_question_ids ?? []) {
      linkedQuestionIds.add(id)
    }
  }
  const linked = questions.filter((q) => linkedQuestionIds.has(q.id)).length

  const schemaFields = new Set()
  for (const q of questions) {
    for (const key of Object.keys(q)) schemaFields.add(key)
  }

  return {
    total,
    schemaFields: [...schemaFields].sort(),
    domainCounts,
    taskCounts,
    approachCounts,
    itemStyleCounts,
    heuristicCounts,
    conceptQuestionCounts,
    zeroQuestionConcepts,
    shallowConcepts,
    multiConceptCount,
    aiConceptIds: [...aiConceptIds].sort(),
    aiQuestionIds,
    calculationQuestionIds: questions.filter((q) => q.item_style === 'calculation').map((q) => q.id),
    linkedQuestionCount: linked,
    unlinkedQuestionCount: total - linked,
  }
}

function pct(count, total) {
  return total === 0 ? '0.0%' : `${((count / total) * 100).toFixed(1)}%`
}

export function renderAnalysisReport(analysis, conceptLessons = []) {
  const {
    total,
    domainCounts,
    taskCounts,
    approachCounts,
    itemStyleCounts,
    heuristicCounts,
    schemaFields,
  } = analysis

  const conceptTitleById = Object.fromEntries(conceptLessons.map((c) => [c.id, c.title]))

  const domainRows = Object.entries(ECO_DOMAIN_WEIGHTS)
    .map(([domain, weight]) => {
      const count = domainCounts[domain] ?? 0
      return `| ${domain} | ${(weight * 100).toFixed(0)}% | ${count} | ${pct(count, total)} |`
    })
    .join('\n')

  const taskRows = Object.entries(taskCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([task, count]) => `| ${task} | ${count} |`)
    .join('\n')

  const approachRows = APPROACHES.map(
    (a) => `| ${a} | ${approachCounts[a]} | ${pct(approachCounts[a], total)} |`,
  ).join('\n')

  const itemStyleRows = ITEM_STYLES.map(
    (s) => `| ${s} | ${itemStyleCounts[s]} | ${pct(itemStyleCounts[s], total)} |`,
  ).join('\n')

  const heuristicLabels = {
    stakeholderComms: 'Stakeholder / communication cues',
    leadershipTeam: 'Leadership / team / conflict cues',
    risk: 'Risk cues',
    governanceChangeControl: 'Governance / change-control cues',
    businessEnvironmentValue: 'Business-environment / value cues',
  }
  const heuristicRowsMd = Object.entries(heuristicLabels)
    .map(([key, label]) => `| ${label} | ${heuristicCounts[key]} | ${pct(heuristicCounts[key], total)} |`)
    .join('\n')

  const zeroConceptRows =
    analysis.zeroQuestionConcepts.length === 0
      ? '| None | — |'
      : analysis.zeroQuestionConcepts
          .map((id) => `| ${id} | ${conceptTitleById[id] ?? '(unknown)'} |`)
          .join('\n')

  const shallowConceptRows = analysis.shallowConcepts
    .map(
      (id) =>
        `| ${id} | ${conceptTitleById[id] ?? '(unknown)'} | ${analysis.conceptQuestionCounts[id]} |`,
    )
    .join('\n')

  return `# Question Bank Composition Analysis (Explicit Metadata)

Generated from \`data/questions.json\` by
\`node scripts/analyze-question-bank.mjs\` (also \`npm run
questions:analyze-bank\`). Supports the Exam Simulator Readiness Audit
(\`docs/exam_simulator_readiness_audit.md\`) and its 2026-08 metadata
remediation follow-up (\`docs/decision_log.md\` #15). This script never
writes to \`data/questions.json\`.

## Schema fields present on every question

${schemaFields.map((f) => `- \`${f}\``).join('\n')}

\`approach\`, \`item_style\`, and \`concept_ids\` are explicit, editorially
classified per-question metadata (not keyword-derived) — see
\`docs/content/question_metadata_classification_log.md\` for the
classification rules and rationale. The five categories below them
(stakeholder/leadership/risk/governance/business-environment) still have no
canonical field and remain keyword-heuristic estimates, clearly labeled.

## ECO domain distribution (exact, from schema)

| Domain | Documented exam weight | Questions | Share of bank |
|---|---:|---:|---:|
${domainRows}

## ECO task distribution (exact, from schema)

| ECO task | Questions |
|---|---:|
${taskRows}

## Approach distribution (exact, from \`approach\`)

| Approach | Questions | Share of bank |
|---|---:|---:|
${approachRows}

## Item-style distribution (exact, from \`item_style\`)

| Item style | Questions | Share of bank |
|---|---:|---:|
${itemStyleRows}

## Concept coverage (exact, from \`concept_ids\`)

- Concepts in the catalog: ${conceptLessons.length}
- Questions tagged with more than one concept: ${analysis.multiConceptCount} (${pct(analysis.multiConceptCount, total)})
- Concepts with ZERO questions: ${analysis.zeroQuestionConcepts.length}
- Concepts with 1–2 questions (shallow): ${analysis.shallowConcepts.length}

### Concepts with zero questions

| Concept | Title |
|---|---|
${zeroConceptRows}

### Concepts with 1–2 questions, fewest first

| Concept | Title | Questions |
|---|---|---:|
${shallowConceptRows || '| None | — | — |'}

## True AI coverage (exact, via concept_ids mapped to the AI module)

AI module concepts (\`data/concept_lessons.json\`, module "AI in Project
Management"): ${analysis.aiConceptIds.join(', ')}.

- Questions tagged to an AI-module concept: ${analysis.aiQuestionIds.length} (${pct(analysis.aiQuestionIds.length, total)})
- IDs: ${analysis.aiQuestionIds.join(', ') || 'none'}

## True calculation coverage (exact, via item_style = "calculation")

- Questions: ${analysis.calculationQuestionIds.length} (${pct(analysis.calculationQuestionIds.length, total)})
- IDs: ${analysis.calculationQuestionIds.join(', ') || 'none'}

## Remaining heuristic signals (keyword matching — no canonical field exists for these)

| Category | Questions matched | Share of bank |
|---|---:|---:|
${heuristicRowsMd}

These five categories are cross-cutting content signals, not assembly
dimensions — \`docs/exam_simulator_readiness_audit.md\` §1 judged that
\`eco_task\` already isolates most of this content well enough for exam
assembly, so no dedicated field was added. Treat every count in this
section as an estimate.

## Concept-lesson linkage coverage (legacy — superseded by \`concept_ids\` above)

- Questions referenced by at least one \`concept_lessons.json\` entry via
  \`related_question_ids\` (the old, lesson-authored linkage — retained for
  comparison): ${analysis.linkedQuestionCount} (${pct(analysis.linkedQuestionCount, total)})
- Questions with no such link: ${analysis.unlinkedQuestionCount} (${pct(analysis.unlinkedQuestionCount, total)})
`
}

function main() {
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const questions = JSON.parse(
    fs.readFileSync(path.join(repositoryRoot, 'data', 'questions.json'), 'utf8'),
  )
  const conceptLessons = JSON.parse(
    fs.readFileSync(path.join(repositoryRoot, 'data', 'concept_lessons.json'), 'utf8'),
  )
  const analysis = analyzeBank(questions, conceptLessons)
  const reportPath = path.join(
    repositoryRoot,
    'docs',
    'content',
    'exam_simulator_bank_analysis.md',
  )
  fs.writeFileSync(reportPath, renderAnalysisReport(analysis, conceptLessons))
  console.log(`Analyzed ${analysis.total} questions.`)
  console.log(`Wrote ${path.relative(repositoryRoot, reportPath)}`)
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
  main()
}
