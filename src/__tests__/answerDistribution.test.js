import { describe, expect, it } from 'vitest'
import questions from '../../data/questions.json'
import {
  DEFAULT_SEED,
  getCorrectPositionCounts,
  reorderQuestions,
} from '../../scripts/shuffle-question-options.mjs'

const MAX_POSITION_RATE = 0.4

describe('question answer-position distribution', () => {
  it('keeps every correct-answer position at or below 40% of the bank', () => {
    const counts = getCorrectPositionCounts(questions)

    for (const [position, count] of Object.entries(counts)) {
      expect(
        count / questions.length,
        `position ${Number(position) + 1} contains ${count}/${questions.length} correct answers`,
      ).toBeLessThanOrEqual(MAX_POSITION_RATE)
    }
  })

  it('is the reproducible, idempotent output of the committed seed', () => {
    expect(reorderQuestions(questions, DEFAULT_SEED)).toEqual(questions)
  })
})
