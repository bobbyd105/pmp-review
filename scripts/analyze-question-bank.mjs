// Read-only analysis of data/questions.json for the Exam Simulator Readiness
// Audit. Produces reproducible counts by ECO domain/task (exact, from the
// schema) and by content category (heuristic keyword matching, since the
// current schema has no style/approach/topic metadata to query directly).
// Never writes to data/questions.json.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ECO_DOMAIN_WEIGHTS = {
  People: 0.33,
  Process: 0.41,
  'Business Environment': 0.26,
}

// Heuristic keyword categories. Every match here is a SIGNAL, not a
// certified label — a question can match zero, one, or several categories,
// and matching a keyword does not mean the question is "about" that topic
// in an exam-blueprint sense. Patterns are matched against the lowercased
// question stem + options + explanation.
const CATEGORY_PATTERNS = {
  scenarioStyle: [
    /\bwhat should the project manager do\b/,
    /\bwhat is the (best|most appropriate|next) (action|thing|step)\b/,
    /\bwhat should (the|a) .*\bdo (first|next)\b/,
    /\bhow should the project manager\b/,
  ],
  calculation: [
    /\bcalculate\b/,
    /\bcpi\b/,
    /\bspi\b/,
    /\beac\b/,
    /\betc\b/,
    /\btcpi\b/,
    /\bvac\b/,
    /\bbac\b/,
    /\bpert\b/,
    /\bemv\b/,
    /\bnpv\b/,
    /\birr\b/,
    /\bpayback period\b/,
    /\bfloat\b/,
    /\bcritical path\b/,
    /\bstandard deviation\b/,
    /\$[\d,]+/,
    /\b\d+%/,
  ],
  predictive: [
    /\bpredictive\b/,
    /\bwaterfall\b/,
    /\bwbs\b/,
    /\bwork breakdown structure\b/,
    /\bgantt\b/,
    /\bbaseline\b/,
    /\bfixed-price\b/,
  ],
  agileAdaptive: [
    /\bsprint\b/,
    /\bscrum\b/,
    /\bkanban\b/,
    /\bbacklog\b/,
    /\bvelocity\b/,
    /\buser stor(y|ies)\b/,
    /\bretrospective\b/,
    /\bproduct owner\b/,
    /\biteration\b/,
    /\bincrement\b/,
    /\bagile\b/,
    /\bmvp\b/,
    /\bwip\b/,
  ],
  hybrid: [/\bhybrid\b/],
  aiRelated: [
    /\bai\b/,
    /\bartificial intelligence\b/,
    /\bmachine learning\b/,
    /\balgorithm\b/,
    /\bautomation, assistance\b/,
    /\bresponsible ai\b/,
  ],
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

export function categorize(question) {
  const text = questionText(question)
  const result = {}
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
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

  const categoryCounts = {}
  const categorized = questions.map((q) => ({ id: q.id, ...categorize(q) }))
  for (const category of Object.keys(CATEGORY_PATTERNS)) {
    categoryCounts[category] = categorized.filter((row) => row[category]).length
  }

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
    categoryCounts,
    categorized,
    linkedQuestionCount: linked,
    unlinkedQuestionCount: total - linked,
  }
}

function pct(count, total) {
  return total === 0 ? '0.0%' : `${((count / total) * 100).toFixed(1)}%`
}

export function renderAnalysisReport(analysis) {
  const { total, domainCounts, taskCounts, categoryCounts, schemaFields } = analysis

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

  const categoryLabels = {
    scenarioStyle: 'Scenario-style stem ("what should the PM do first/next")',
    calculation: 'Calculation / formula cues',
    predictive: 'Predictive-approach cues',
    agileAdaptive: 'Agile / adaptive cues',
    hybrid: 'Hybrid cues',
    aiRelated: 'AI-related cues',
    stakeholderComms: 'Stakeholder / communication cues',
    leadershipTeam: 'Leadership / team / conflict cues',
    risk: 'Risk cues',
    governanceChangeControl: 'Governance / change-control cues',
    businessEnvironmentValue: 'Business-environment / value cues',
  }

  const categoryRows = Object.entries(categoryLabels)
    .map(([key, label]) => `| ${label} | ${categoryCounts[key]} | ${pct(categoryCounts[key], total)} |`)
    .join('\n')

  return `# Question Bank Composition Analysis (Heuristic)

Generated from \`data/questions.json\` by
\`node scripts/analyze-question-bank.mjs\` (also \`npm run
questions:analyze-bank\`). Supports the Exam Simulator Readiness Audit
(\`docs/exam_simulator_readiness_audit.md\`). This script never writes to
\`data/questions.json\`.

## Schema fields present on every question

${schemaFields.map((f) => `- \`${f}\``).join('\n')}

No question currently carries item-style, delivery-approach, complexity,
PMBOK-8, or topic-tag metadata as explicit fields. The category counts
below are keyword-heuristic estimates over question/option/explanation
text, not derived from real metadata, and are reported as such — they are
NOT a substitute for explicit tagging.

## ECO domain distribution (exact, from schema)

| Domain | Documented exam weight | Questions | Share of bank |
|---|---:|---:|---:|
${domainRows}

## ECO task distribution (exact, from schema)

| ECO task | Questions |
|---|---:|
${taskRows}

## Content-category signals (HEURISTIC — keyword matching, not certified topic tags)

| Category | Questions matched | Share of bank |
|---|---:|---:|
${categoryRows}

Categories are not mutually exclusive; a question can match zero or several
patterns. A question matching zero calculation/agile/AI/etc. keywords is
not necessarily uncategorizable — it may simply use different phrasing.
Treat every count in this section as an estimate requiring editorial
confirmation before it drives exam assembly.

## Concept-lesson linkage coverage

- Questions referenced by at least one \`concept_lessons.json\` entry
  (\`related_question_ids\`): ${analysis.linkedQuestionCount} (${pct(analysis.linkedQuestionCount, total)})
- Questions with no concept-lesson link: ${analysis.unlinkedQuestionCount} (${pct(analysis.unlinkedQuestionCount, total)})

Linked questions inherit their lesson's \`pmbok8_domains\`, \`focus_areas\`,
and \`approaches\` tags only by association (one lesson can link many
questions, and the tag describes the lesson's topic, not a verified
per-question judgment). Unlinked questions have no topic/approach signal
beyond ECO domain/task and the heuristic keyword scan above.
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
  fs.writeFileSync(reportPath, renderAnalysisReport(analysis))
  console.log(`Analyzed ${analysis.total} questions.`)
  console.log(`Wrote ${path.relative(repositoryRoot, reportPath)}`)
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
  main()
}
