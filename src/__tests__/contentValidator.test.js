import { describe, it, expect } from 'vitest'
import questions from '../../data/questions.json'
import lessons from '../../data/lessons.json'
import {
  parseEntry,
  validateNewQuestion,
  validateNewLesson,
  toSnippet,
  QUESTION_FIELDS,
} from '../studio/contentValidator.js'

const bank = { questions, lessons }

const validQuestion = {
  id: 'q900',
  eco_domain: 'People',
  eco_task: 'Task 1: Manage conflict',
  question: 'A stakeholder disagrees with the team about acceptance criteria. What first?',
  options: ['Escalate to the sponsor', 'Facilitate a working session', 'Update the register'],
  correct_answer: 'Facilitate a working session',
  explanation: 'Collaborative resolution against documented requirements comes first.',
}

const validLesson = {
  id: 'l900',
  eco_domain: 'Process',
  eco_task: 'Task 5: Plan and manage budget and resources',
  title: 'Reserves: contingency vs. management',
  body:
    'Contingency reserves cover identified risks that were analyzed and accepted ' +
    'during planning; they belong to the cost baseline and the project manager can ' +
    'draw on them when a planned-for risk occurs. Management reserves cover unknown ' +
    'unknowns — work that was never identified — and sit above the baseline, requiring ' +
    'a change to release. On the exam, ask whether the money responds to a risk in the ' +
    'register (contingency) or to genuinely unforeseen work (management). The budget ' +
    'equals the baseline plus management reserves, and burning either without the ' +
    'matching justification is a control failure worth flagging.',
  related_question_ids: [questions[0].id],
}

describe('parseEntry', () => {
  it('accepts a single JSON object', () => {
    expect(parseEntry('{"id": "x"}')).toEqual({ entry: { id: 'x' } })
  })

  it('rejects empty input with a message', () => {
    expect(parseEntry('   ').parseError).toMatch(/paste a JSON object/i)
  })

  it('rejects malformed JSON with the parser message', () => {
    expect(parseEntry('{"id": }').parseError).toMatch(/not valid json/i)
  })

  it('rejects arrays — entries go in one at a time', () => {
    expect(parseEntry('[{"id": "x"}]').parseError).toMatch(/single JSON object, not an array/i)
  })

  it('rejects non-object JSON scalars', () => {
    expect(parseEntry('"just a string"').parseError).toMatch(/single JSON object/i)
  })
})

describe('validateNewQuestion', () => {
  it('accepts a fully valid new question', () => {
    expect(validateNewQuestion(validQuestion, bank)).toEqual([])
  })

  it('names every missing required field', () => {
    const { explanation, correct_answer, ...partial } = validQuestion
    const errors = validateNewQuestion(partial, bank)
    expect(errors).toContain('Missing required field "explanation".')
    expect(errors).toContain('Missing required field "correct_answer".')
  })

  it('rejects unexpected fields by name', () => {
    const errors = validateNewQuestion({ ...validQuestion, explaination: 'typo' }, bank)
    expect(errors.some((e) => e.includes('Unexpected field "explaination"'))).toBe(true)
  })

  it('rejects empty or non-string field values', () => {
    const errors = validateNewQuestion({ ...validQuestion, question: '   ' }, bank)
    expect(errors).toContain('Field "question" must be a non-empty string.')
  })

  it('rejects an unknown eco_domain, naming the valid ones', () => {
    const errors = validateNewQuestion({ ...validQuestion, eco_domain: 'Persons' }, bank)
    expect(
      errors.some((e) =>
        e.includes('eco_domain "Persons"') && e.includes('People, Process, Business Environment'),
      ),
    ).toBe(true)
  })

  it('rejects an id that duplicates an existing question', () => {
    const errors = validateNewQuestion({ ...validQuestion, id: questions[0].id }, bank)
    expect(errors).toContain(
      `Duplicate id "${questions[0].id}" — an existing question already uses it.`,
    )
  })

  it('rejects an id that collides with an existing lesson', () => {
    const errors = validateNewQuestion({ ...validQuestion, id: lessons[0].id }, bank)
    expect(errors).toContain(
      `Duplicate id "${lessons[0].id}" — an existing lesson already uses it.`,
    )
  })

  it('rejects non-array options', () => {
    const errors = validateNewQuestion({ ...validQuestion, options: 'a, b' }, bank)
    expect(errors).toContain('Field "options" must be an array of answer strings.')
  })

  it('rejects fewer than 2 options', () => {
    const errors = validateNewQuestion(
      { ...validQuestion, options: ['Only one'], correct_answer: 'Only one' },
      bank,
    )
    expect(errors.some((e) => e.includes('at least 2 are required'))).toBe(true)
  })

  it('rejects duplicate options, naming the duplicate', () => {
    const errors = validateNewQuestion(
      { ...validQuestion, options: [...validQuestion.options, validQuestion.options[0]] },
      bank,
    )
    expect(errors).toContain(
      `options contains a duplicate entry: "${validQuestion.options[0]}".`,
    )
  })

  it('rejects non-string option entries', () => {
    const errors = validateNewQuestion({ ...validQuestion, options: ['One', 2, 'Three'] }, bank)
    expect(errors).toContain('Every entry in "options" must be a non-empty string.')
  })

  it('rejects a correct_answer that does not exactly match an option', () => {
    const errors = validateNewQuestion(
      { ...validQuestion, correct_answer: 'facilitate a working session' },
      bank,
    )
    expect(
      errors.some((e) => e.includes('does not exactly match any entry in options')),
    ).toBe(true)
  })
})

describe('validateNewLesson', () => {
  it('accepts a fully valid new lesson', () => {
    expect(validateNewLesson(validLesson, bank)).toEqual([])
  })

  it('accepts a lesson without related_question_ids (optional field)', () => {
    const { related_question_ids, ...noRelated } = validLesson
    expect(validateNewLesson(noRelated, bank)).toEqual([])
  })

  it('names every missing required field', () => {
    const { title, body, ...partial } = validLesson
    const errors = validateNewLesson(partial, bank)
    expect(errors).toContain('Missing required field "title".')
    expect(errors).toContain('Missing required field "body".')
  })

  it('rejects unexpected fields by name', () => {
    const errors = validateNewLesson({ ...validLesson, summary: 'nope' }, bank)
    expect(errors.some((e) => e.includes('Unexpected field "summary"'))).toBe(true)
  })

  it('rejects an unknown eco_domain', () => {
    const errors = validateNewLesson({ ...validLesson, eco_domain: 'Prosess' }, bank)
    expect(errors.some((e) => e.includes('eco_domain "Prosess"'))).toBe(true)
  })

  it('rejects a body at or under 500 characters, reporting its length', () => {
    const errors = validateNewLesson({ ...validLesson, body: 'Short but real text.' }, bank)
    expect(errors.some((e) => e.includes('body is 20 characters'))).toBe(true)
  })

  it('rejects placeholder markers in the body', () => {
    const longBody = validLesson.body + ' TODO: finish this section.'
    const errors = validateNewLesson({ ...validLesson, body: longBody }, bank)
    expect(errors.some((e) => e.includes('placeholder text ("todo")'))).toBe(true)
  })

  it('rejects an id that duplicates an existing lesson', () => {
    const errors = validateNewLesson({ ...validLesson, id: lessons[0].id }, bank)
    expect(errors).toContain(
      `Duplicate id "${lessons[0].id}" — an existing lesson already uses it.`,
    )
  })

  it('rejects an id that collides with an existing question', () => {
    const errors = validateNewLesson({ ...validLesson, id: questions[0].id }, bank)
    expect(errors).toContain(
      `Duplicate id "${questions[0].id}" — an existing question already uses it.`,
    )
  })

  it('rejects non-array related_question_ids', () => {
    const errors = validateNewLesson({ ...validLesson, related_question_ids: 'q001' }, bank)
    expect(errors).toContain(
      'Field "related_question_ids" must be an array of question id strings.',
    )
  })

  it('rejects dangling related_question_ids, naming the missing id', () => {
    const errors = validateNewLesson(
      { ...validLesson, related_question_ids: ['q999'] },
      bank,
    )
    expect(errors).toContain(
      'related_question_ids references "q999", which does not exist in data/questions.json.',
    )
  })

  it('rejects duplicate related_question_ids', () => {
    const id = questions[0].id
    const errors = validateNewLesson(
      { ...validLesson, related_question_ids: [id, id] },
      bank,
    )
    expect(errors).toContain(`related_question_ids contains a duplicate entry: "${id}".`)
  })
})

describe('toSnippet', () => {
  it('re-serializes with fields in canonical order, values untouched', () => {
    const shuffled = {
      explanation: validQuestion.explanation,
      options: validQuestion.options,
      id: validQuestion.id,
      correct_answer: validQuestion.correct_answer,
      question: validQuestion.question,
      eco_task: validQuestion.eco_task,
      eco_domain: validQuestion.eco_domain,
    }
    const snippet = toSnippet(shuffled, QUESTION_FIELDS)
    expect(JSON.parse(snippet)).toEqual(validQuestion)
    expect(Object.keys(JSON.parse(snippet))).toEqual(QUESTION_FIELDS)
  })
})

describe('additive-only guarantee', () => {
  it('validation never mutates the existing data it checks against', () => {
    const questionsBefore = JSON.stringify(questions)
    const lessonsBefore = JSON.stringify(lessons)
    validateNewQuestion(validQuestion, bank)
    validateNewLesson(validLesson, bank)
    validateNewQuestion({ id: questions[0].id }, bank)
    expect(JSON.stringify(questions)).toBe(questionsBefore)
    expect(JSON.stringify(lessons)).toBe(lessonsBefore)
  })
})
