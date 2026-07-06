import { describe, it, expect, beforeEach } from 'vitest'
import questions from '../../data/questions.json'
import {
  createSession,
  currentQuestion,
  submitAnswer,
  saveSession,
  loadSession,
  STORAGE_KEY,
} from '../quiz/quizSession.js'
import {
  HISTORY_KEY,
  buildHistoryEntry,
  loadHistory,
  appendHistoryEntry,
  recordCompletedQuiz,
  getAggregateStats,
} from '../quiz/quizHistory.js'

beforeEach(() => {
  localStorage.clear()
})

// Completes a fresh session; answersByIndex[i] = true → answer correctly.
function completeSession(answersByIndex) {
  let session = createSession(questions, answersByIndex.length)
  for (const correctly of answersByIndex) {
    const q = currentQuestion(session, questions)
    const choice = correctly
      ? q.correct_answer
      : q.options.find((o) => o !== q.correct_answer)
    session = submitAnswer(session, questions, choice)
  }
  return session
}

describe('buildHistoryEntry', () => {
  it('records timestamp, score, total, per-domain breakdown, and missed ids', () => {
    const session = completeSession([true, false, true, false])
    const fixedNow = () => new Date('2026-07-06T12:00:00Z')
    const entry = buildHistoryEntry(session, questions, fixedNow)

    expect(entry.completedAt).toBe('2026-07-06T12:00:00.000Z')
    expect(entry.score).toBe(2)
    expect(entry.total).toBe(4)

    const missed = session.results.filter((r) => !r.correct).map((r) => r.questionId)
    expect(entry.missedQuestionIds).toEqual(missed)

    // Domain tallies must sum back to the totals.
    const domainTotals = Object.values(entry.domains)
    expect(domainTotals.reduce((sum, d) => sum + d.total, 0)).toBe(4)
    expect(domainTotals.reduce((sum, d) => sum + d.correct, 0)).toBe(2)

    // And each tally must match the questions actually answered.
    const byId = new Map(questions.map((q) => [q.id, q]))
    for (const r of session.results) {
      const domain = byId.get(r.questionId).eco_domain
      expect(entry.domains[domain].total).toBeGreaterThanOrEqual(1)
    }
  })
})

describe('history accumulation and persistence', () => {
  it('accumulates entries across multiple completed quizzes without overwriting', () => {
    recordCompletedQuiz(completeSession([true, true]), questions)
    recordCompletedQuiz(completeSession([false, false]), questions)
    recordCompletedQuiz(completeSession([true, false]), questions)

    const history = loadHistory()
    expect(history).toHaveLength(3)
    expect(history.map((e) => e.score)).toEqual([2, 0, 1])
  })

  it('persists across a reload (fresh read from localStorage)', () => {
    recordCompletedQuiz(completeSession([true, false, true]), questions)
    // Simulate reload: nothing cached, read storage from scratch.
    const raw = localStorage.getItem(HISTORY_KEY)
    expect(raw).toBeTruthy()
    const reloaded = loadHistory()
    expect(reloaded).toHaveLength(1)
    expect(reloaded[0].score).toBe(2)
    expect(reloaded[0].total).toBe(3)
  })

  it('uses its own storage key and leaves the active-session key untouched', () => {
    const session = completeSession([true])
    saveSession(session)
    const sessionRaw = localStorage.getItem(STORAGE_KEY)

    recordCompletedQuiz(session, questions)

    expect(HISTORY_KEY).not.toBe(STORAGE_KEY)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(sessionRaw)
    expect(loadSession(questions)).toEqual(session)
  })

  it('degrades to an empty list on corrupt or malformed stored history', () => {
    localStorage.setItem(HISTORY_KEY, 'not json{{{')
    expect(loadHistory()).toEqual([])

    localStorage.setItem(HISTORY_KEY, JSON.stringify({ not: 'an array' }))
    expect(loadHistory()).toEqual([])

    localStorage.setItem(HISTORY_KEY, JSON.stringify([{ score: 'NaN' }]))
    expect(loadHistory()).toEqual([])
  })
})

describe('getAggregateStats', () => {
  it('returns zeroed stats for empty history', () => {
    const stats = getAggregateStats([])
    expect(stats.totalQuizzes).toBe(0)
    expect(stats.overallAccuracy).toBe(0)
    expect(stats.domainAccuracy).toEqual({})
  })

  it('computes totals and overall accuracy across all history', () => {
    const history = [
      appendHistoryEntry(buildHistoryEntry(completeSession([true, true, false]), questions)),
      appendHistoryEntry(buildHistoryEntry(completeSession([false, false]), questions)),
    ].pop()

    const stats = getAggregateStats(history)
    expect(stats.totalQuizzes).toBe(2)
    expect(stats.total).toBe(5)
    expect(stats.correct).toBe(2)
    expect(stats.overallAccuracy).toBeCloseTo(40)
  })

  it('computes per-domain accuracy from summed tallies, not averaged percentages', () => {
    // Hand-built history where averaging per-quiz percentages would give a
    // different (wrong) answer than summing: 1/1 (100%) and 1/3 (33%) →
    // summed 2/4 = 50%, averaged would be 66.5%.
    const history = [
      {
        completedAt: '2026-07-01T00:00:00.000Z',
        score: 1,
        total: 1,
        domains: { People: { correct: 1, total: 1 } },
        missedQuestionIds: [],
      },
      {
        completedAt: '2026-07-02T00:00:00.000Z',
        score: 1,
        total: 3,
        domains: { People: { correct: 1, total: 3 } },
        missedQuestionIds: ['q001', 'q002'],
      },
    ]
    const stats = getAggregateStats(history)
    expect(stats.domainAccuracy.People.correct).toBe(2)
    expect(stats.domainAccuracy.People.total).toBe(4)
    expect(stats.domainAccuracy.People.accuracy).toBeCloseTo(50)
    expect(stats.overallAccuracy).toBeCloseTo(50)
  })

  it('keeps domains separate in the aggregate', () => {
    const history = [
      {
        completedAt: '2026-07-01T00:00:00.000Z',
        score: 2,
        total: 3,
        domains: {
          People: { correct: 2, total: 2 },
          Process: { correct: 0, total: 1 },
        },
        missedQuestionIds: ['q005'],
      },
    ]
    const stats = getAggregateStats(history)
    expect(stats.domainAccuracy.People.accuracy).toBeCloseTo(100)
    expect(stats.domainAccuracy.Process.accuracy).toBeCloseTo(0)
  })
})
