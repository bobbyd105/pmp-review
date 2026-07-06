import { describe, it, expect, beforeEach } from 'vitest'
import questions from '../../data/questions.json'
import {
  STORAGE_KEY,
  DEFAULT_QUESTION_COUNT,
  selectQuestionIds,
  createSession,
  currentQuestion,
  isComplete,
  submitAnswer,
  getScore,
  getMissed,
  saveSession,
  loadSession,
  clearSession,
} from '../quiz/quizSession.js'

beforeEach(() => {
  localStorage.clear()
})

describe('question selection', () => {
  it('selects the requested number of questions with no repeats', () => {
    for (let n = 1; n <= questions.length; n++) {
      const ids = selectQuestionIds(questions, n)
      expect(ids).toHaveLength(n)
      expect(new Set(ids).size).toBe(n)
    }
  })

  it('defaults to 5 questions', () => {
    expect(DEFAULT_QUESTION_COUNT).toBe(5)
    expect(createSession(questions).questionIds).toHaveLength(5)
  })

  it('caps the count at the size of the question bank', () => {
    const ids = selectQuestionIds(questions, questions.length + 50)
    expect(ids).toHaveLength(questions.length)
    expect(new Set(ids).size).toBe(questions.length)
  })

  it('only selects ids that exist in the bank', () => {
    const known = new Set(questions.map((q) => q.id))
    for (const id of selectQuestionIds(questions, questions.length)) {
      expect(known.has(id)).toBe(true)
    }
  })
})

describe('scoring', () => {
  it('counts correct and incorrect answers accurately', () => {
    let session = createSession(questions, 3)

    // Answer q1 correctly, q2 incorrectly, q3 correctly.
    const q1 = currentQuestion(session, questions)
    session = submitAnswer(session, questions, q1.correct_answer)

    const q2 = currentQuestion(session, questions)
    const wrong = q2.options.find((o) => o !== q2.correct_answer)
    session = submitAnswer(session, questions, wrong)

    const q3 = currentQuestion(session, questions)
    session = submitAnswer(session, questions, q3.correct_answer)

    expect(isComplete(session)).toBe(true)
    expect(getScore(session)).toBe(2)

    const missed = getMissed(session, questions)
    expect(missed).toHaveLength(1)
    expect(missed[0].question.id).toBe(q2.id)
    expect(missed[0].selected).toBe(wrong)
  })

  it('scores 0 when every answer is wrong and N when every answer is right', () => {
    let allWrong = createSession(questions, 4)
    let allRight = createSession(questions, 4)
    for (let i = 0; i < 4; i++) {
      const qw = currentQuestion(allWrong, questions)
      allWrong = submitAnswer(allWrong, questions, qw.options.find((o) => o !== qw.correct_answer))
      const qr = currentQuestion(allRight, questions)
      allRight = submitAnswer(allRight, questions, qr.correct_answer)
    }
    expect(getScore(allWrong)).toBe(0)
    expect(getMissed(allWrong, questions)).toHaveLength(4)
    expect(getScore(allRight)).toBe(4)
    expect(getMissed(allRight, questions)).toHaveLength(0)
  })

  it('ignores submissions after the session is complete', () => {
    let session = createSession(questions, 1)
    const q = currentQuestion(session, questions)
    session = submitAnswer(session, questions, q.correct_answer)
    const after = submitAnswer(session, questions, 'anything')
    expect(after).toBe(session)
  })
})

describe('persistence', () => {
  it('round-trips a mid-session state through localStorage', () => {
    let session = createSession(questions, 3)
    const q1 = currentQuestion(session, questions)
    session = submitAnswer(session, questions, q1.correct_answer)
    saveSession(session)

    const restored = loadSession(questions)
    expect(restored).toEqual(session)
    expect(restored.currentIndex).toBe(1)
    expect(getScore(restored)).toBe(1)
  })

  it('returns null when nothing is stored', () => {
    expect(loadSession(questions)).toBeNull()
  })

  it('rejects and clears corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not json{{{')
    expect(loadSession(questions)).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('rejects a session referencing question ids not in the bank', () => {
    const stale = {
      questionIds: ['deleted-question-id'],
      currentIndex: 0,
      results: [],
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stale))
    expect(loadSession(questions)).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('rejects a session whose results are inconsistent with its index', () => {
    const broken = {
      questionIds: questions.slice(0, 3).map((q) => q.id),
      currentIndex: 2,
      results: [],
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(broken))
    expect(loadSession(questions)).toBeNull()
  })

  it('clearSession removes the stored state', () => {
    saveSession(createSession(questions, 2))
    clearSession()
    expect(loadSession(questions)).toBeNull()
  })
})
