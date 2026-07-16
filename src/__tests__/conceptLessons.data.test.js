import { describe, expect, it } from 'vitest'
import conceptLessons from '../../data/concept_lessons.json'
import questions from '../../data/questions.json'
import sourceTopicIndex from '../../docs/content/source_topic_index.json'

const REQUIRED_FIELDS = [
  'id',
  'lesson_type',
  'title',
  'module',
  'production_group',
  'pmbok8_domains',
  'focus_areas',
  'eco_mappings',
  'approaches',
  'learning_objectives',
  'sections',
  'key_terms',
  'exam_traps',
  'glossary_refs',
  'reference_sheet_refs',
  'formula_refs',
  'flashcards',
  'knowledge_checks',
  'related_question_ids',
  'source_refs',
]

const MODULES = [
  'PM Foundations',
  'PMBOK 8 Structural Model',
  'Life Cycles and Tailoring',
  'Principles and PMP Mindset',
  'Governance and Integration',
  'Common ITTO Layer',
]
const PMBOK_8_DOMAINS = [
  'Governance',
  'Scope',
  'Schedule',
  'Finance',
  'Stakeholders',
  'Resources',
  'Risk',
]
const FOCUS_AREAS = [
  'Initiating',
  'Planning',
  'Executing',
  'Monitoring and Controlling',
  'Closing',
]
const APPROACHES = ['predictive', 'adaptive', 'hybrid']

describe('concept_lessons.json data contract', () => {
  it('contains the complete Foundation Block with unique sequential ids', () => {
    const ids = conceptLessons.map((lesson) => lesson.id)

    expect(ids).toEqual(
      Array.from({ length: 10 }, (_, index) => `c${String(index + 1).padStart(3, '0')}`),
    )
    expect(new Set(ids).size).toBe(ids.length)
    expect(conceptLessons.every((lesson) => lesson.production_group === 'Foundation Block')).toBe(
      true,
    )
  })

  it('has every required field and the expected authored-content shapes', () => {
    for (const lesson of conceptLessons) {
      for (const field of REQUIRED_FIELDS) {
        expect(
          Object.hasOwn(lesson, field),
          `${lesson.id} is missing required field "${field}"`,
        ).toBe(true)
      }

      expect(lesson.lesson_type).toBe('concept')
      expect(lesson.title.trim()).not.toBe('')
      expect(lesson.learning_objectives.length).toBeGreaterThan(0)
      expect(lesson.sections.length).toBeGreaterThan(0)
      expect(lesson.key_terms.length).toBeGreaterThan(0)
      expect(lesson.exam_traps.length).toBeGreaterThan(0)
      expect(lesson.flashcards.length).toBeGreaterThan(0)
      expect(lesson.source_refs.length).toBeGreaterThan(0)

      for (const section of lesson.sections) {
        expect(section.title.trim(), `${lesson.id} has a blank section title`).not.toBe('')
        expect(section.content.trim(), `${lesson.id} has blank section content`).not.toBe('')
      }

      for (const flashcard of lesson.flashcards) {
        expect(flashcard.term.trim(), `${lesson.id} has a blank flashcard term`).not.toBe('')
        expect(
          flashcard.definition.trim(),
          `${lesson.id} has a blank flashcard definition`,
        ).not.toBe('')
      }
    }
  })

  it('uses only approved module and mapping enum values', () => {
    const validEcoMappings = new Set(
      questions.map((question) => `${question.eco_domain}\0${question.eco_task}`),
    )

    for (const lesson of conceptLessons) {
      expect(MODULES, `${lesson.id} has an unknown module`).toContain(lesson.module)

      for (const domain of lesson.pmbok8_domains) {
        expect(PMBOK_8_DOMAINS, `${lesson.id} has unknown PMBOK 8 domain "${domain}"`).toContain(
          domain,
        )
      }
      for (const focusArea of lesson.focus_areas) {
        expect(FOCUS_AREAS, `${lesson.id} has unknown focus area "${focusArea}"`).toContain(
          focusArea,
        )
      }
      for (const approach of lesson.approaches) {
        expect(APPROACHES, `${lesson.id} has unknown approach "${approach}"`).toContain(
          approach,
        )
      }
      for (const mapping of lesson.eco_mappings) {
        expect(
          validEcoMappings,
          `${lesson.id} has unknown ECO mapping "${mapping.domain} / ${mapping.task}"`,
        ).toContain(`${mapping.domain}\0${mapping.task}`)
      }
    }
  })

  it('keeps deferred reference-layer links intentionally empty until that layer ships', () => {
    for (const lesson of conceptLessons) {
      expect(lesson.glossary_refs, `${lesson.id} glossary refs`).toEqual([])
      expect(lesson.reference_sheet_refs, `${lesson.id} reference-sheet refs`).toEqual([])
      expect(lesson.formula_refs, `${lesson.id} formula refs`).toEqual([])
    }
  })

  it('has authored knowledge checks with valid single-best-answer shape', () => {
    for (const lesson of conceptLessons) {
      expect(
        Array.isArray(lesson.knowledge_checks) && lesson.knowledge_checks.length >= 2,
        `${lesson.id} must have at least two authored knowledge checks`,
      ).toBe(true)

      for (const [index, check] of lesson.knowledge_checks.entries()) {
        const label = `${lesson.id} knowledge check ${index + 1}`
        expect(check.question.trim(), `${label} question`).not.toBe('')
        expect(check.options.length, `${label} option count`).toBe(4)
        expect(new Set(check.options).size, `${label} option uniqueness`).toBe(4)
        expect(
          check.options.filter((option) => option === check.correct_answer).length,
          `${label} correct_answer must appear exactly once in options`,
        ).toBe(1)
        expect(
          check.explanation.trim().length,
          `${label} explanation must teach, not just mark`,
        ).toBeGreaterThan(40)
      }
    }
  })

  it('links related questions only to real bank questions', () => {
    const questionIds = new Set(questions.map((question) => question.id))

    for (const lesson of conceptLessons) {
      expect(
        new Set(lesson.related_question_ids).size,
        `${lesson.id} has duplicate related question ids`,
      ).toBe(lesson.related_question_ids.length)
      for (const questionId of lesson.related_question_ids) {
        expect(
          questionIds,
          `${lesson.id} references missing question "${questionId}"`,
        ).toContain(questionId)
      }
    }
  })

  it('keeps knowledge-check correct answers free of position and length cues', () => {
    const positionCounts = [0, 0, 0, 0]
    let checkTotal = 0

    for (const lesson of conceptLessons) {
      for (const check of lesson.knowledge_checks) {
        const correctIndex = check.options.indexOf(check.correct_answer)
        positionCounts[correctIndex] += 1
        checkTotal += 1

        const lengths = check.options.map((option) => [...option].length)
        const distractorLengths = lengths.filter((_, index) => index !== correctIndex)
        const ratio =
          lengths[correctIndex] /
          (distractorLengths.reduce((total, length) => total + length, 0) /
            distractorLengths.length)
        expect(
          ratio,
          `${lesson.id} knowledge check correct answer is conspicuously long (ratio ${ratio.toFixed(2)})`,
        ).toBeLessThanOrEqual(1.3)
      }
    }

    for (const [position, count] of positionCounts.entries()) {
      expect(
        count / checkTotal,
        `knowledge-check position ${position + 1} holds ${count}/${checkTotal} correct answers`,
      ).toBeLessThanOrEqual(0.4)
    }
  })

  it('references only sources in the committed source-topic index', () => {
    const sourceIds = new Set(sourceTopicIndex.sources.map((source) => source.id))

    for (const lesson of conceptLessons) {
      for (const sourceRef of lesson.source_refs) {
        expect(sourceIds, `${lesson.id} has unknown source ref "${sourceRef}"`).toContain(
          sourceRef,
        )
      }
    }
  })
})
