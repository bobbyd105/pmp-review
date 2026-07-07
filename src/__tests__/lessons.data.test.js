import { describe, it, expect } from 'vitest'
import lessons from '../../data/lessons.json'
import questions from '../../data/questions.json'

const REQUIRED_FIELDS = ['id', 'eco_domain', 'eco_task', 'title', 'body']

const ECO_DOMAINS = ['People', 'Process', 'Business Environment']

describe('lessons.json data contract', () => {
  it('contains at least 3 lessons', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(3)
  })

  it('covers at least 2 ECO domains', () => {
    const domains = new Set(lessons.map((l) => l.eco_domain))
    expect(domains.size).toBeGreaterThanOrEqual(2)
  })

  it('uses only valid ECO domain names', () => {
    for (const lesson of lessons) {
      expect(ECO_DOMAINS, `${lesson.id} has unknown domain "${lesson.eco_domain}"`).toContain(
        lesson.eco_domain,
      )
    }
  })

  it('has every required field populated on every lesson', () => {
    for (const lesson of lessons) {
      for (const field of REQUIRED_FIELDS) {
        expect(lesson[field], `${lesson.id} is missing "${field}"`).toBeTruthy()
        expect(typeof lesson[field]).toBe('string')
      }
    }
  })

  it('has substantive bodies, not placeholder text', () => {
    for (const lesson of lessons) {
      expect(
        lesson.body.length,
        `${lesson.id} body is too short to be real content`,
      ).toBeGreaterThan(500)
      expect(lesson.body.toLowerCase()).not.toContain('lorem ipsum')
      expect(lesson.body.toLowerCase()).not.toContain('placeholder')
      expect(lesson.body.toLowerCase()).not.toContain('todo')
    }
  })

  it('has unique lesson ids that do not collide with question ids', () => {
    const ids = lessons.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
    const questionIds = new Set(questions.map((q) => q.id))
    for (const id of ids) {
      expect(questionIds.has(id), `lesson id ${id} collides with a question id`).toBe(false)
    }
  })

  it('related_question_ids, when present, reference ids that exist in questions.json', () => {
    const questionIds = new Set(questions.map((q) => q.id))
    for (const lesson of lessons) {
      if (lesson.related_question_ids === undefined) continue
      expect(Array.isArray(lesson.related_question_ids)).toBe(true)
      for (const id of lesson.related_question_ids) {
        expect(
          questionIds.has(id),
          `${lesson.id} references question "${id}" which does not exist`,
        ).toBe(true)
      }
      expect(
        new Set(lesson.related_question_ids).size,
        `${lesson.id} has duplicate related question ids`,
      ).toBe(lesson.related_question_ids.length)
    }
  })

  it('at least one lesson exercises the related-questions linkage', () => {
    expect(
      lessons.some((l) => (l.related_question_ids ?? []).length > 0),
    ).toBe(true)
  })
})
