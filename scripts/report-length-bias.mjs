import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const LENGTH_RATIO_THRESHOLD = 1.3
export const STRICT_LONGEST_TARGET = 0.4

function characterLength(value) {
  return [...value].length
}

export function analyzeLengthBias(questions) {
  const rows = questions.map((question) => {
    const correctLength = characterLength(question.correct_answer)
    const distractorLengths = question.options
      .filter((option) => option !== question.correct_answer)
      .map(characterLength)

    if (distractorLengths.length === 0) {
      throw new Error(`${question.id} has no distractors to analyze.`)
    }

    const averageDistractorLength =
      distractorLengths.reduce((total, length) => total + length, 0) /
      distractorLengths.length
    const ratio = correctLength / averageDistractorLength
    const strictLongest = correctLength > Math.max(...distractorLengths)

    return {
      id: question.id,
      correctLength,
      averageDistractorLength,
      ratio,
      strictLongest,
      flagged: ratio > LENGTH_RATIO_THRESHOLD,
    }
  })

  const flagged = rows
    .filter((row) => row.flagged)
    .sort((left, right) => right.ratio - left.ratio || left.id.localeCompare(right.id))
  const strictLongestCount = rows.filter((row) => row.strictLongest).length
  const strictLongestRate = rows.length === 0 ? 0 : strictLongestCount / rows.length

  return {
    total: rows.length,
    rows,
    flagged,
    strictLongestCount,
    strictLongestRate,
    remediationRequired: strictLongestRate > STRICT_LONGEST_TARGET,
  }
}

function percentage(value) {
  return `${(value * 100).toFixed(1)}%`
}

export function renderLengthBiasReport(analysis) {
  const status = analysis.remediationRequired
    ? 'REMEDIATION REQUIRED'
    : 'WITHIN TARGET'
  const tableRows = analysis.flagged.map(
    (row) =>
      `| ${row.id} | ${row.correctLength} | ${row.averageDistractorLength.toFixed(1)} | ${row.ratio.toFixed(2)} | ${row.strictLongest ? 'Yes' : 'No'} |`,
  )

  return `# Question Length-Bias Report

This report is generated from \`data/questions.json\` by
\`npm run questions:report-length-bias\`. It measures answer length only;
it does not change question wording.

## Summary

| Metric | Result |
|---|---:|
| Questions analyzed | ${analysis.total} |
| Correct answer / average distractor ratio threshold | > ${LENGTH_RATIO_THRESHOLD.toFixed(1)} |
| Questions above ratio threshold | ${analysis.flagged.length} |
| Correct answer is strictly longest | ${analysis.strictLongestCount} (${percentage(analysis.strictLongestRate)}) |
| Strict-longest target | <= ${percentage(STRICT_LONGEST_TARGET)} |
| Status | **${status}** |

The strict-longest target is enforced as a hard regression gate by
\`src/__tests__/lengthBias.test.js\` following the 2026-07 editorial
remediation pass: no future content batch may push the bank back above it,
and no question may exceed the correct/average-distractor ratio threshold.

## Flagged questions, worst first

| Question ID | Correct length | Average distractor length | Ratio | Correct is strictly longest |
|---|---:|---:|---:|---|
${tableRows.join('\n') || '| None | - | - | - | - |'}
`
}

function main() {
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const questionsPath = path.join(repositoryRoot, 'data', 'questions.json')
  const reportPath = path.join(
    repositoryRoot,
    'docs',
    'content',
    'length_bias_report.md',
  )
  const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'))
  const analysis = analyzeLengthBias(questions)

  fs.writeFileSync(reportPath, renderLengthBiasReport(analysis))
  console.log(
    `Analyzed ${analysis.total} questions; ${analysis.flagged.length} exceed the ${LENGTH_RATIO_THRESHOLD.toFixed(1)} ratio threshold.`,
  )
  console.log(
    `Strict-longest: ${analysis.strictLongestCount}/${analysis.total} (${percentage(analysis.strictLongestRate)}).`,
  )
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
  main()
}
