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

  it('HARD GATE: keeps the real bank within the strict-longest target with no ratio flags', () => {
    const analysis = analyzeLengthBias(questions)

    expect(
      analysis.strictLongestRate,
      `strictly-longest correct answers are at ${(analysis.strictLongestRate * 100).toFixed(1)}% of the bank (target <= ${STRICT_LONGEST_TARGET * 100}%)`,
    ).toBeLessThanOrEqual(STRICT_LONGEST_TARGET)
    expect(
      analysis.flagged.map((row) => row.id),
      `questions exceeding the ${LENGTH_RATIO_THRESHOLD} correct/average-distractor length ratio`,
    ).toEqual([])
    expect(analysis.remediationRequired).toBe(false)
  })

  it('HARD GATE: the correct answer must not be strictly shortest more often than random chance', () => {
    // Guards against over-correcting the longest-answer tell into a shortest-answer tell.
    const strictShortest = questions.filter((question) => {
      const correctLength = [...question.correct_answer].length
      const distractorLengths = question.options
        .filter((option) => option !== question.correct_answer)
        .map((option) => [...option].length)
      return correctLength < Math.min(...distractorLengths)
    }).length

    expect(
      strictShortest / questions.length,
      `strictly-shortest correct answers are at ${((strictShortest / questions.length) * 100).toFixed(1)}% of the bank`,
    ).toBeLessThanOrEqual(0.3)
  })
})
