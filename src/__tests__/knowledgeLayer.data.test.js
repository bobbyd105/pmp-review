import { describe, expect, it } from 'vitest'
import coverage from '../../data/content_coverage.json'
import formulas from '../../data/formula_catalog.json'
import glossary from '../../data/glossary_catalog.json'
import graph from '../../data/knowledge_graph.json'
import objectives from '../../data/learning_objectives.json'
import questions from '../../data/questions.json'
import referenceSheets from '../../data/reference_sheet_catalog.json'
import lessons from '../../data/lessons.json'
import conceptLessons from '../../data/concept_lessons.json'
import sourceIndex from '../../docs/content/source_topic_index.json'

const unique = (values) => new Set(values).size === values.length
const byId = (records) => new Map(records.map((record) => [record.id, record]))

const unitsById = byId(coverage.curriculum_units)
const conceptsById = byId(graph.concepts)
const glossaryById = byId(glossary.entries)
const formulasById = byId(formulas.formulas)
const referencesById = byId(referenceSheets.reference_sheets)
const knownSources = new Set(sourceIndex.sources.map(({ id }) => id))
const knownLessons = new Set(lessons.map(({ id }) => id))
const knownQuestions = new Set(questions.map(({ id }) => id))
const knownConceptLessons = new Set(conceptLessons.map(({ id }) => id))

function expectKnown(values, registry) {
  expect(values.every((value) => registry.has(value))).toBe(true)
  expect(unique(values)).toBe(true)
}

function hasPrerequisiteCycle() {
  const visiting = new Set()
  const visited = new Set()

  function visit(id) {
    if (visiting.has(id)) return true
    if (visited.has(id)) return false
    visiting.add(id)
    for (const prerequisiteId of conceptsById.get(id).prerequisite_concept_ids) {
      if (visit(prerequisiteId)) return true
    }
    visiting.delete(id)
    visited.add(id)
    return false
  }

  return graph.concepts.some(({ id }) => visit(id))
}

describe('knowledge graph data contract', () => {
  it('defines one synchronized graph node for every curriculum unit', () => {
    expect(graph.schema_version).toBe(1)
    expect(graph.concepts).toHaveLength(59)
    expect(unique(graph.concepts.map(({ id }) => id))).toBe(true)

    for (const concept of graph.concepts) {
      const unit = unitsById.get(concept.id)
      expect(unit).toBeDefined()
      expect(concept.title).toBe(unit.title)
      expect(concept.related_eco_tasks).toEqual(unit.eco_mappings)
      expect(concept.related_pmbok_mappings).toEqual(unit.pmbok_mappings)
      expect(concept.related_lesson_ids).toEqual([`PL-${concept.id}`])
      expect(concept.existing_lesson_ids).toEqual(unit.existing_lesson_ids)

      expectKnown(concept.parent_concept_ids, conceptsById)
      expectKnown(concept.child_concept_ids, conceptsById)
      expectKnown(concept.prerequisite_concept_ids, conceptsById)
      expectKnown(concept.related_concept_ids, conceptsById)
      expectKnown(concept.existing_lesson_ids, knownLessons)
      expectKnown(concept.related_glossary_ids, glossaryById)
      expectKnown(concept.related_formula_ids, formulasById)
      expectKnown(concept.related_reference_sheet_ids, referencesById)
      expect(concept.prerequisite_concept_ids).not.toContain(concept.id)
    }
  })

  it('keeps hierarchy and related links reciprocal and prerequisites acyclic', () => {
    for (const concept of graph.concepts) {
      for (const parentId of concept.parent_concept_ids) {
        expect(conceptsById.get(parentId).child_concept_ids).toContain(concept.id)
      }
      for (const childId of concept.child_concept_ids) {
        expect(conceptsById.get(childId).parent_concept_ids).toContain(concept.id)
      }
      for (const relatedId of concept.related_concept_ids) {
        expect(conceptsById.get(relatedId).related_concept_ids).toContain(concept.id)
      }
    }
    expect(hasPrerequisiteCycle()).toBe(false)
  })
})

describe('learning objective data contract', () => {
  it('defines two measurable objectives and mastery planning for all 59 lessons', () => {
    expect(objectives.status).toBe('planning')
    expect(objectives.planned_lessons).toHaveLength(59)
    expect(unique(objectives.planned_lessons.map(({ lesson_id }) => lesson_id))).toBe(true)

    const objectiveIds = []
    for (const plannedLesson of objectives.planned_lessons) {
      const concept = conceptsById.get(plannedLesson.curriculum_unit_id)
      expect(concept).toBeDefined()
      expect(plannedLesson.lesson_id).toBe(`PL-${plannedLesson.curriculum_unit_id}`)
      expect(plannedLesson.title).toBe(concept.title)
      expect(plannedLesson.learning_objectives).toHaveLength(2)
      expect(plannedLesson.expected_competencies).toEqual(
        plannedLesson.learning_objectives.map(({ statement }) => statement),
      )
      expect(plannedLesson.prerequisite_knowledge).toEqual(concept.prerequisite_concept_ids)
      expect(objectives.bloom_levels).toContain(plannedLesson.bloom_taxonomy_level)
      expect(objectives.difficulty_levels).toContain(plannedLesson.expected_difficulty)
      expect(plannedLesson.estimated_learning_time_minutes).toBeGreaterThan(0)
      expect(plannedLesson.mastery_threshold.minimum_score_percent).toBeGreaterThanOrEqual(0)
      expect(plannedLesson.mastery_threshold.minimum_score_percent).toBeLessThanOrEqual(100)
      expect(plannedLesson.mastery_threshold.minimum_distinct_evidence_items).toBeGreaterThan(1)

      for (const [index, objective] of plannedLesson.learning_objectives.entries()) {
        expect(objective.id).toBe(`${plannedLesson.curriculum_unit_id}-O${index + 1}`)
        expect(objective.statement.trim().length).toBeGreaterThan(20)
        objectiveIds.push(objective.id)
      }
    }

    expect(objectiveIds).toHaveLength(118)
    expect(unique(objectiveIds)).toBe(true)
  })
})

describe('shared knowledge asset contracts', () => {
  it('validates representative glossary entries and their relationships', () => {
    expect(glossary.entries.length).toBeGreaterThanOrEqual(10)
    expect(unique(glossary.entries.map(({ id }) => id))).toBe(true)

    for (const entry of glossary.entries) {
      expect(entry.id).toMatch(/^G-/)
      expect(entry.term.trim()).not.toBe('')
      for (const field of ['definition', 'common_confusion', 'exam_trap']) {
        expect(entry[field].trim().length).toBeGreaterThan(10)
      }
      expectKnown(entry.related_concept_ids, conceptsById)
      expect(entry.related_concept_ids.length).toBeGreaterThan(0)
      // related_lesson_ids points at the authored Course (concept_lessons.json),
      // not the planning-layer lesson ids in objectives.planned_lessons — see
      // conceptLessons.data.test.js for the bidirectional cross-reference check.
      expectKnown(entry.related_lesson_ids, knownConceptLessons)
      expectKnown(entry.related_question_ids, knownQuestions)
      expectKnown(entry.related_formula_ids, formulasById)
      expectKnown(entry.related_reference_sheet_ids, referencesById)
      expectKnown(entry.source_references.map(({ source_id }) => source_id), knownSources)
    }
  })

  it('validates representative formulas and interpretation guidance', () => {
    expect(formulas.formulas.length).toBeGreaterThanOrEqual(8)
    expect(unique(formulas.formulas.map(({ id }) => id))).toBe(true)

    for (const formula of formulas.formulas) {
      expect(formula.id).toMatch(/^F-/)
      expect(formula.name.trim()).not.toBe('')
      expect(formula.formula.trim()).not.toBe('')
      expect(formula.variables.length).toBeGreaterThan(0)
      expect(formula.interpretation.trim().length).toBeGreaterThan(20)
      expect(formula.comparison_guidance.greater_than.trim()).not.toBe('')
      expect(formula.comparison_guidance.less_than.trim()).not.toBe('')
      expect(formula.memory_tips.length).toBeGreaterThan(0)
      expect(formula.common_mistakes.length).toBeGreaterThan(0)
      // related_lesson_ids points at the authored Course (concept_lessons.json);
      // see conceptLessons.data.test.js for the bidirectional cross-reference check.
      expectKnown(formula.related_lesson_ids, knownConceptLessons)
      expectKnown(formula.related_question_ids, knownQuestions)
      expectKnown(formula.related_glossary_ids, glossaryById)
      expectKnown(formula.source_references.map(({ source_id }) => source_id), knownSources)
    }
  })

  it('defines every required reference-sheet family with valid relationships', () => {
    expect(referenceSheets.reference_sheets).toHaveLength(12)
    expect(unique(referenceSheets.reference_sheets.map(({ id }) => id))).toBe(true)
    expect(new Set(referenceSheets.reference_sheets.map(({ id }) => id))).toEqual(new Set([
      'R-PMBOK-PROCESS-MAP', 'R-ITTO-PATTERNS', 'R-ORG-STRUCTURES',
      'R-CONTRACT-COMPARISON', 'R-RISK-RESPONSES', 'R-STAKEHOLDER-MODELS',
      'R-AGILE-COMPARISON', 'R-SCRUM-QUICK-REFERENCE', 'R-LEADERSHIP-STYLES',
      'R-COMMUNICATION-METHODS', 'R-FORMULA-SHEET', 'R-RESPONSIBLE-AI-CHECKLIST',
    ]))

    for (const reference of referenceSheets.reference_sheets) {
      expect(referenceSheets.asset_types).toContain(reference.type)
      expect(reference.sections.length).toBeGreaterThan(1)
      expect(reference.lifecycle_status).toBe('Planned')
      expectKnown(reference.related_concept_ids, conceptsById)
      expectKnown(reference.related_glossary_ids, glossaryById)
      expectKnown(reference.related_formula_ids, formulasById)
      expectKnown(reference.source_refs, knownSources)
    }
  })

  it('resolves every asset ID referenced by the knowledge graph', () => {
    const graphGlossaryIds = graph.concepts.flatMap(({ related_glossary_ids }) => related_glossary_ids)
    const graphFormulaIds = graph.concepts.flatMap(({ related_formula_ids }) => related_formula_ids)
    const graphReferenceIds = graph.concepts.flatMap(({ related_reference_sheet_ids }) => related_reference_sheet_ids)
    expectKnown([...new Set(graphGlossaryIds)], glossaryById)
    expectKnown([...new Set(graphFormulaIds)], formulasById)
    expectKnown([...new Set(graphReferenceIds)], referencesById)
  })
})
