import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import questions from '../../data/questions.json'
import conceptLessons from '../../data/concept_lessons.json'
import {
  analyzeBank,
  categorizeHeuristic,
  renderAnalysisReport,
  APPROACHES,
  ITEM_STYLES,
} from '../../scripts/analyze-question-bank.mjs'

describe('question bank composition analysis (audit tooling)', () => {
  it('categorizes a known fixture deterministically (remaining heuristic categories only)', () => {
    const fixture = {
      id: 'fixture-1',
      question: 'A governance gap creates risk for the stakeholder engagement plan.',
      options: ['Escalate to the change control board', 'Do nothing'],
      explanation: 'Business value depends on managing this compliance risk.',
    }
    const result = categorizeHeuristic(fixture)
    expect(result.stakeholderComms).toBe(true)
    expect(result.risk).toBe(true)
    expect(result.governanceChangeControl).toBe(true)
    expect(result.businessEnvironmentValue).toBe(true)
    expect(result.leadershipTeam).toBe(false)
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

  it('approach and item_style counts sum to the full bank', () => {
    const analysis = analyzeBank(questions, conceptLessons)
    const approachSum = Object.values(analysis.approachCounts).reduce((a, b) => a + b, 0)
    const styleSum = Object.values(analysis.itemStyleCounts).reduce((a, b) => a + b, 0)
    expect(approachSum).toBe(questions.length)
    expect(styleSum).toBe(questions.length)
    expect(Object.keys(analysis.approachCounts).sort()).toEqual([...APPROACHES].sort())
    expect(Object.keys(analysis.itemStyleCounts).sort()).toEqual([...ITEM_STYLES].sort())
  })

  it('every question concept_ids entry resolves into the concept coverage counts, and counts sum consistently', () => {
    const analysis = analyzeBank(questions, conceptLessons)
    const totalTags = questions.reduce((sum, q) => sum + q.concept_ids.length, 0)
    const countedTags = Object.values(analysis.conceptQuestionCounts).reduce(
      (a, b) => a + b,
      0,
    )
    expect(countedTags).toBe(totalTags)
    expect(
      analysis.zeroQuestionConcepts.every((id) => analysis.conceptQuestionCounts[id] === 0),
    ).toBe(true)
    expect(
      analysis.shallowConcepts.every(
        (id) =>
          analysis.conceptQuestionCounts[id] >= 1 && analysis.conceptQuestionCounts[id] <= 2,
      ),
    ).toBe(true)
  })

  it('AI and calculation coverage are derived from real metadata, not keywords', () => {
    const analysis = analyzeBank(questions, conceptLessons)
    const aiConceptIds = new Set(
      conceptLessons.filter((c) => c.module === 'AI in Project Management').map((c) => c.id),
    )
    expect(new Set(analysis.aiConceptIds)).toEqual(aiConceptIds)
    for (const id of analysis.aiQuestionIds) {
      const q = questions.find((x) => x.id === id)
      expect(q.concept_ids.some((c) => aiConceptIds.has(c))).toBe(true)
    }
    for (const id of analysis.calculationQuestionIds) {
      const q = questions.find((x) => x.id === id)
      expect(q.item_style).toBe('calculation')
    }
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
    expect(report).toBe(renderAnalysisReport(analysis, conceptLessons))
  })
})
