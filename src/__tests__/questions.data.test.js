import { describe, it, expect } from 'vitest'
import questions from '../../data/questions.json'

const REQUIRED_FIELDS = [
  'id',
  'eco_domain',
  'eco_task',
  'question',
  'options',
  'correct_answer',
  'explanation',
]

const ECO_DOMAINS = ['People', 'Process', 'Business Environment']

describe('questions.json data contract', () => {
  it('contains at least 10 questions', () => {
    expect(questions.length).toBeGreaterThanOrEqual(10)
  })

  it('covers at least 3 ECO domains', () => {
    const domains = new Set(questions.map((q) => q.eco_domain))
    expect(domains.size).toBeGreaterThanOrEqual(3)
  })

  it('uses only valid ECO domain names', () => {
    for (const q of questions) {
      expect(ECO_DOMAINS, `${q.id} has unknown domain "${q.eco_domain}"`).toContain(
        q.eco_domain,
      )
    }
  })

  it('has every required field populated on every question', () => {
    for (const q of questions) {
      for (const field of REQUIRED_FIELDS) {
        expect(q[field], `${q.id} is missing "${field}"`).toBeTruthy()
      }
      expect(typeof q.question).toBe('string')
      expect(typeof q.explanation).toBe('string')
    }
  })

  it('has unique question ids', () => {
    const ids = questions.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives each question at least 2 unique options', () => {
    for (const q of questions) {
      expect(Array.isArray(q.options), `${q.id} options must be an array`).toBe(true)
      expect(q.options.length, `${q.id} needs at least 2 options`).toBeGreaterThanOrEqual(2)
      expect(new Set(q.options).size, `${q.id} has duplicate options`).toBe(
        q.options.length,
      )
    }
  })

  it('has a correct_answer that exactly matches one of the options', () => {
    for (const q of questions) {
      expect(q.options, `${q.id} correct_answer not found in options`).toContain(
        q.correct_answer,
      )
    }
  })
})
