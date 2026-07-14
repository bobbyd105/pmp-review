import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import questions from '../../data/questions.json'
import {
  analyzeLengthBias,
  LENGTH_RATIO_THRESHOLD,
  renderLengthBiasReport,
  STRICT_LONGEST_TARGET,
} from '../../scripts/report-length-bias.mjs'

describe('question answer-length bias measurement', () => {
  it('flags banks whose correct answer is strictly longest more than 40% of the time', () => {
    const sample = [
      {
        id: 'long',
        correct_answer: 'a much longer correct answer',
        options: ['a much longer correct answer', 'short', 'brief', 'tiny'],
      },
      {
        id: 'balanced',
        correct_answer: 'brief',
        options: ['brief', 'a much longer distractor', 'medium answer', 'tiny'],
      },
    ]

    const analysis = analyzeLengthBias(sample)

    expect(analysis.strictLongestRate).toBe(0.5)
    expect(analysis.strictLongestRate).toBeGreaterThan(STRICT_LONGEST_TARGET)
    expect(analysis.remediationRequired).toBe(true)
  })

  it('sorts ratio flags worst-first and keeps the generated report current', () => {
    const analysis = analyzeLengthBias(questions)
    const ratios = analysis.flagged.map((row) => row.ratio)
    const report = fs
      .readFileSync('docs/content/length_bias_report.md', 'utf8')
      .replaceAll('\r\n', '\n')

    expect(analysis.flagged.every((row) => row.ratio > LENGTH_RATIO_THRESHOLD)).toBe(
      true,
    )
    expect(ratios).toEqual([...ratios].sort((left, right) => right - left))
    expect(report).toBe(renderLengthBiasReport(analysis))
  })
})
