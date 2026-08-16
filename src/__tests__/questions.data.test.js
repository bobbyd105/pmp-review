import { describe, it, expect } from 'vitest'
import questions from '../../data/questions.json'
import conceptLessons from '../../data/concept_lessons.json'

const REQUIRED_FIELDS = [
  'id',
  'eco_domain',
  'eco_task',
  'approach',
  'item_style',
  'concept_ids',
  'question',
  'options',
  'correct_answer',
  'explanation',
]

const ECO_DOMAINS = ['People', 'Process', 'Business Environment']

// Exam Simulator metadata (added 2026-08, docs/decision_log.md #15). See
// docs/exam_simulator_readiness_audit.md and the classification rules
// referenced there for what each value means and how it was assigned.
const APPROACHES = ['predictive', 'adaptive', 'hybrid', 'universal']
const ITEM_STYLES = [
  'scenario_judgment',
  'definition_distinction',
  'calculation',
  'interpretation',
  'process_sequence',
]
const VALID_CONCEPT_IDS = new Set(conceptLessons.map((c) => c.id))

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

  it('has a valid approach enum value on every question', () => {
    for (const q of questions) {
      expect(APPROACHES, `${q.id} has unknown approach "${q.approach}"`).toContain(
        q.approach,
      )
    }
  })

  it('has a valid item_style enum value on every question', () => {
    for (const q of questions) {
      expect(ITEM_STYLES, `${q.id} has unknown item_style "${q.item_style}"`).toContain(
        q.item_style,
      )
    }
  })

  it('has a non-empty, unique-valued concept_ids array on every question, resolving to real concept lessons', () => {
    for (const q of questions) {
      expect(Array.isArray(q.concept_ids), `${q.id} concept_ids must be an array`).toBe(
        true,
      )
      expect(q.concept_ids.length, `${q.id} concept_ids must not be empty`).toBeGreaterThan(
        0,
      )
      expect(
        new Set(q.concept_ids).size,
        `${q.id} concept_ids contains duplicate values`,
      ).toBe(q.concept_ids.length)
      for (const conceptId of q.concept_ids) {
        expect(
          VALID_CONCEPT_IDS.has(conceptId),
          `${q.id} concept_ids references "${conceptId}", which is not a real id in data/concept_lessons.json (no stale planning-namespace ids like "PL-C###" are valid here)`,
        ).toBe(true)
      }
    }
  })
})
