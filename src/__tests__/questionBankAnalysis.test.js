import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import questions from '../../data/questions.json'
import conceptLessons from '../../data/concept_lessons.json'
import {
  analyzeBank,
  categorize,
  renderAnalysisReport,
} from '../../scripts/analyze-question-bank.mjs'

describe('question bank composition analysis (audit tooling)', () => {
  it('categorizes a known fixture deterministically', () => {
    const scenarioCalc = {
      id: 'fixture-1',
      question: 'What should the project manager do first to calculate the CPI?',
      options: ['Use the sprint backlog', 'Compute EV over AC'],
      explanation: 'A hybrid team uses AI to assist with risk and governance.',
    }
    const result = categorize(scenarioCalc)
    expect(result.scenarioStyle).toBe(true)
    expect(result.calculation).toBe(true)
    expect(result.agileAdaptive).toBe(true)
    expect(result.hybrid).toBe(true)
    expect(result.aiRelated).toBe(true)
    expect(result.risk).toBe(true)
    expect(result.governanceChangeControl).toBe(true)
    expect(result.predictive).toBe(false)
  })

  it('never mutates the input questions array', () => {
    const before = JSON.stringify(questions)
    analyzeBank(questions, conceptLessons)
    expect(JSON.stringify(questions)).toBe(before)
  })

  it('domain and task counts sum to the full bank', () => {
    const analysis = analyzeBank(questions, conceptLessons)
    const domainSum = Object.values(analysis.domainCounts).reduce((a, b) => a + b, 0)
    const taskSum = Object.values(analysis.taskCounts).reduce((a, b) => a + b, 0)
    expect(domainSum).toBe(questions.length)
    expect(taskSum).toBe(questions.length)
  })

  it('linked + unlinked question counts sum to the full bank', () => {
    const analysis = analyzeBank(questions, conceptLessons)
    expect(analysis.linkedQuestionCount + analysis.unlinkedQuestionCount).toBe(
      questions.length,
    )
  })

  it('is the reproducible output committed to docs/content/exam_simulator_bank_analysis.md', () => {
    const analysis = analyzeBank(questions, conceptLessons)
    const report = fs
      .readFileSync('docs/content/exam_simulator_bank_analysis.md', 'utf8')
      .replaceAll('\r\n', '\n')
    expect(report).toBe(renderAnalysisReport(analysis))
  })
})
