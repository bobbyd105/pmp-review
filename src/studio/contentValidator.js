// Content Studio validation (no React). Mirrors the data-contract rules in
// src/__tests__/questions.data.test.js and src/__tests__/lessons.data.test.js:
// an entry this module accepts must also pass those tests once added to its
// JSON file. Validation is additive-only — existing entries are read for
// duplicate/reference checks and never modified.

export const ECO_DOMAINS = ['People', 'Process', 'Business Environment']

export const QUESTION_FIELDS = [
  'id',
  'eco_domain',
  'eco_task',
  'question',
  'options',
  'correct_answer',
  'explanation',
]

export const LESSON_REQUIRED_FIELDS = ['id', 'eco_domain', 'eco_task', 'title', 'body']
export const LESSON_FIELDS = [...LESSON_REQUIRED_FIELDS, 'related_question_ids']

const LESSON_MIN_BODY_LENGTH = 500
const LESSON_PLACEHOLDER_MARKERS = ['lorem ipsum', 'placeholder', 'todo']

// Parses pasted text into a single JSON object. Returns
// { entry } on success or { parseError } with a specific message.
export function parseEntry(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    return { parseError: 'Nothing to validate — paste a JSON object first.' }
  }
  let value
  try {
    value = JSON.parse(text)
  } catch (err) {
    return { parseError: `Not valid JSON: ${err.message}` }
  }
  if (Array.isArray(value)) {
    return {
      parseError:
        'Paste a single JSON object, not an array — entries are added one at a time.',
    }
  }
  if (value === null || typeof value !== 'object') {
    return { parseError: 'Paste a single JSON object (starting with { and ending with }).' }
  }
  return { entry: value }
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== ''
}

function checkFields(entry, requiredFields, allowedFields, errors) {
  for (const field of requiredFields) {
    if (!(field in entry)) {
      errors.push(`Missing required field "${field}".`)
    }
  }
  for (const field of Object.keys(entry)) {
    if (!allowedFields.includes(field)) {
      errors.push(
        `Unexpected field "${field}" — allowed fields are: ${allowedFields.join(', ')}.`,
      )
    }
  }
}

function checkStringField(entry, field, errors) {
  if (field in entry && !isNonEmptyString(entry[field])) {
    errors.push(`Field "${field}" must be a non-empty string.`)
  }
}

function checkDomain(entry, errors) {
  if (isNonEmptyString(entry.eco_domain) && !ECO_DOMAINS.includes(entry.eco_domain)) {
    errors.push(
      `eco_domain "${entry.eco_domain}" is not one of: ${ECO_DOMAINS.join(', ')}.`,
    )
  }
}

function checkIdUnique(id, questions, lessons, errors) {
  if (!isNonEmptyString(id)) return
  if (questions.some((q) => q.id === id)) {
    errors.push(`Duplicate id "${id}" — an existing question already uses it.`)
  }
  if (lessons.some((l) => l.id === id)) {
    errors.push(`Duplicate id "${id}" — an existing lesson already uses it.`)
  }
}

// Validates one new question against the questions.json contract plus
// cross-file id uniqueness (lessons.data.test.js forbids lesson/question id
// collisions, so a new question id must avoid lesson ids too).
// Returns an array of specific error messages; empty means valid.
export function validateNewQuestion(entry, { questions, lessons }) {
  const errors = []
  checkFields(entry, QUESTION_FIELDS, QUESTION_FIELDS, errors)
  for (const field of ['id', 'eco_domain', 'eco_task', 'question', 'correct_answer', 'explanation']) {
    checkStringField(entry, field, errors)
  }
  checkDomain(entry, errors)
  checkIdUnique(entry.id, questions, lessons, errors)

  if ('options' in entry) {
    if (!Array.isArray(entry.options)) {
      errors.push('Field "options" must be an array of answer strings.')
    } else {
      if (entry.options.length < 2) {
        errors.push(
          `options has ${entry.options.length} ${entry.options.length === 1 ? 'entry' : 'entries'} — at least 2 are required.`,
        )
      }
      const nonStrings = entry.options.filter((o) => !isNonEmptyString(o))
      if (nonStrings.length > 0) {
        errors.push('Every entry in "options" must be a non-empty string.')
      }
      const seen = new Set()
      for (const option of entry.options) {
        if (typeof option !== 'string') continue
        if (seen.has(option)) {
          errors.push(`options contains a duplicate entry: "${option}".`)
        }
        seen.add(option)
      }
      if (
        isNonEmptyString(entry.correct_answer) &&
        !entry.options.includes(entry.correct_answer)
      ) {
        errors.push(
          `correct_answer "${entry.correct_answer}" does not exactly match any entry in options.`,
        )
      }
    }
  }
  return errors
}

// Validates one new lesson against the lessons.json contract, including
// referential integrity of related_question_ids against questions.json.
// Returns an array of specific error messages; empty means valid.
export function validateNewLesson(entry, { questions, lessons }) {
  const errors = []
  checkFields(entry, LESSON_REQUIRED_FIELDS, LESSON_FIELDS, errors)
  for (const field of LESSON_REQUIRED_FIELDS) {
    checkStringField(entry, field, errors)
  }
  checkDomain(entry, errors)
  checkIdUnique(entry.id, questions, lessons, errors)

  if (isNonEmptyString(entry.body)) {
    if (entry.body.length <= LESSON_MIN_BODY_LENGTH) {
      errors.push(
        `body is ${entry.body.length} characters — lessons need more than ${LESSON_MIN_BODY_LENGTH} characters of real content.`,
      )
    }
    for (const marker of LESSON_PLACEHOLDER_MARKERS) {
      if (entry.body.toLowerCase().includes(marker)) {
        errors.push(`body contains placeholder text ("${marker}") — write the real content.`)
      }
    }
  }

  if ('related_question_ids' in entry) {
    const related = entry.related_question_ids
    if (!Array.isArray(related)) {
      errors.push('Field "related_question_ids" must be an array of question id strings.')
    } else {
      const questionIds = new Set(questions.map((q) => q.id))
      const seen = new Set()
      for (const id of related) {
        if (!isNonEmptyString(id)) {
          errors.push('Every entry in "related_question_ids" must be a non-empty string.')
          continue
        }
        if (!questionIds.has(id)) {
          errors.push(
            `related_question_ids references "${id}", which does not exist in data/questions.json.`,
          )
        }
        if (seen.has(id)) {
          errors.push(`related_question_ids contains a duplicate entry: "${id}".`)
        }
        seen.add(id)
      }
    }
  }
  return errors
}

// Re-serializes a valid entry with fields in the canonical schema order so
// the pasted snippet reads like the existing file entries. Values are
// untouched.
export function toSnippet(entry, fieldOrder) {
  const ordered = {}
  for (const field of fieldOrder) {
    if (field in entry) ordered[field] = entry[field]
  }
  return JSON.stringify(ordered, null, 2)
}
