import { describe, expect, it } from 'vitest'
import coverage from '../../data/content_coverage.json'
import questions from '../../data/questions.json'
import lessons from '../../data/lessons.json'
import sourceIndex from '../../docs/content/source_topic_index.json'
import {
  filterCoverageUnits,
  getCoverageSummary,
  getEcoAlignedQuestions,
  getExistingLessons,
  validateCoverageCatalog,
} from '../coverage/contentCoverage.js'

const dependencies = { questions, lessons, sourceIndex }

describe('content coverage data contract', () => {
  it('validates the real 59-unit coverage catalog', () => {
    expect(coverage.curriculum_units).toHaveLength(59)
    expect(validateCoverageCatalog(coverage, dependencies)).toEqual([])
  })

  it('rejects duplicate unit ids and missing mappings', () => {
    const copy = structuredClone(coverage)
    copy.curriculum_units[1].id = copy.curriculum_units[0].id
    copy.curriculum_units[0].source_refs = []
    const errors = validateCoverageCatalog(copy, dependencies)
    expect(errors).toContain(`Duplicate curriculum unit id "${copy.curriculum_units[0].id}".`)
    expect(errors).toContain(`${copy.curriculum_units[0].id} needs at least one source reference.`)
  })

  it('rejects unknown ECO, source, lesson, status, and module references', () => {
    const copy = structuredClone(coverage)
    const unit = copy.curriculum_units[0]
    unit.eco_mappings = [{ domain: 'People', task: 'Task 99: Invented' }]
    unit.source_refs = ['S999']
    unit.existing_lesson_ids = ['l999']
    unit.lifecycle_status = 'Drafting'
    unit.module_id = 'M99'
    const errors = validateCoverageCatalog(copy, dependencies).join('\n')
    expect(errors).toMatch(/unknown ECO mapping/)
    expect(errors).toMatch(/unknown source/)
    expect(errors).toMatch(/unknown lesson/)
    expect(errors).toMatch(/invalid lifecycle_status/)
    expect(errors).toMatch(/unknown module/)
  })
})

describe('coverage derivations', () => {
  it('derives unique question counts from all ECO mappings', () => {
    const unit = coverage.curriculum_units.find(({ id }) => id === 'C007')
    const aligned = getEcoAlignedQuestions(unit, questions)
    expect(aligned).toHaveLength(24)
    expect(new Set(aligned.map(({ id }) => id)).size).toBe(24)
  })

  it('resolves existing lesson ids without changing their order', () => {
    const unit = coverage.curriculum_units.find(({ id }) => id === 'C044')
    expect(getExistingLessons(unit, lessons).map(({ id }) => id)).toEqual(['l001', 'l004'])
  })

  it('derives summary totals and filters without mutating the catalog', () => {
    const before = JSON.stringify(coverage)
    const summary = getCoverageSummary(coverage)
    expect(summary).toMatchObject({ modules: 13, units: 59 })
    expect(summary.byRating.Missing).toBe(10)
    expect(summary.byStatus.Planned).toBe(29)
    const filtered = filterCoverageUnits(coverage, {
      moduleId: 'M13',
      rating: 'Missing',
      status: 'Planned',
    })
    expect(filtered.map(({ id }) => id)).toEqual(['C056', 'C057', 'C058', 'C059'])
    expect(JSON.stringify(coverage)).toBe(before)
  })
})
