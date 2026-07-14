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

  it('keeps deferred references and assessment assets intentionally empty', () => {
    for (const lesson of conceptLessons) {
      expect(lesson.glossary_refs, `${lesson.id} glossary refs`).toEqual([])
      expect(lesson.reference_sheet_refs, `${lesson.id} reference-sheet refs`).toEqual([])
      expect(lesson.formula_refs, `${lesson.id} formula refs`).toEqual([])
      expect(lesson.related_question_ids, `${lesson.id} related questions`).toEqual([])
      expect(lesson.knowledge_checks, `${lesson.id} knowledge-check status`).toEqual({
        status: 'pending',
      })
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
