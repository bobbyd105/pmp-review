import { useState } from 'react'
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

const moduleById = new Map(coverage.modules.map((module) => [module.id, module]))
const sourceById = new Map(sourceIndex.sources.map((source) => [source.id, source]))
const validationErrors = validateCoverageCatalog(coverage, { questions, lessons, sourceIndex })

function displayMapping(mapping) {
  const [type, value] = mapping.split(/:(.+)/)
  return `${type}: ${value}`
}

export default function CurriculumCoverage() {
  const [moduleId, setModuleId] = useState('all')
  const [rating, setRating] = useState('all')
  const [status, setStatus] = useState('all')

  if (validationErrors.length > 0) {
    return (
      <section className="coverage" aria-label="Curriculum Coverage">
        <h2>Curriculum Coverage</h2>
        <div className="coverage-invalid" role="alert">
          <h3>Coverage data is invalid</h3>
          <ul>{validationErrors.map((error) => <li key={error}>{error}</li>)}</ul>
        </div>
      </section>
    )
  }

  const summary = getCoverageSummary(coverage)
  const visibleUnits = filterCoverageUnits(coverage, { moduleId, rating, status })

  return (
    <section className="coverage" aria-label="Curriculum Coverage">
      <h2>Curriculum Coverage</h2>
      <p className="coverage-intro">
        Read-only planning view for the 59-unit comprehensive course. Question counts
        show broad ECO alignment, not direct proof that every question tests the concept.
      </p>

      <dl className="coverage-summary">
        <div><dt>Modules</dt><dd>{summary.modules}</dd></div>
        <div><dt>Concept units</dt><dd>{summary.units}</dd></div>
        <div><dt>Strong</dt><dd>{summary.byRating.Strong}</dd></div>
        <div><dt>Missing</dt><dd>{summary.byRating.Missing}</dd></div>
        <div><dt>Planned</dt><dd>{summary.byStatus.Planned}</dd></div>
      </dl>

      <div className="coverage-filters" aria-label="Coverage filters">
        <label>
          Module
          <select value={moduleId} onChange={(event) => setModuleId(event.target.value)}>
            <option value="all">All modules</option>
            {coverage.modules.map((module) => (
              <option key={module.id} value={module.id}>{module.id} — {module.title}</option>
            ))}
          </select>
        </label>
        <label>
          Coverage strength
          <select value={rating} onChange={(event) => setRating(event.target.value)}>
            <option value="all">All strengths</option>
            {coverage.coverage_ratings.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          Lifecycle status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            {coverage.lifecycle_statuses.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="coverage-results" aria-live="polite">
        Showing {visibleUnits.length} of {summary.units} concept units
      </p>

      <ol className="coverage-list">
        {visibleUnits.map((unit) => {
          const existingLessons = getExistingLessons(unit, lessons)
          const questionCount = getEcoAlignedQuestions(unit, questions).length
          const module = moduleById.get(unit.module_id)
          return (
            <li key={unit.id}>
              <article className="coverage-card">
                <div className="coverage-card-heading">
                  <div>
                    <p className="coverage-module">{module.id} — {module.title}</p>
                    <h3>{unit.id} — {unit.title}</h3>
                  </div>
                  <div className="coverage-badges">
                    <span className={`coverage-rating rating-${unit.coverage_rating.toLowerCase()}`}>
                      {unit.coverage_rating}
                    </span>
                    <span className="coverage-status">{unit.lifecycle_status}</span>
                  </div>
                </div>

                <dl className="coverage-details">
                  <div>
                    <dt>ECO mappings</dt>
                    <dd><ul>{unit.eco_mappings.map((mapping) => (
                      <li key={`${mapping.domain}-${mapping.task}`}>{mapping.domain} — {mapping.task}</li>
                    ))}</ul></dd>
                  </div>
                  <div>
                    <dt>PMBOK mappings</dt>
                    <dd><ul>{unit.pmbok_mappings.map((mapping) => (
                      <li key={mapping}>{displayMapping(mapping)}</li>
                    ))}</ul></dd>
                  </div>
                  <div>
                    <dt>Existing lesson mappings</dt>
                    <dd>{existingLessons.length > 0 ? (
                      <ul>{existingLessons.map((lesson) => (
                        <li key={lesson.id}>{lesson.id} — {lesson.title}</li>
                      ))}</ul>
                    ) : 'None'}</dd>
                  </div>
                  <div>
                    <dt>Source references</dt>
                    <dd><ul>{unit.source_refs.map((sourceId) => (
                      <li key={sourceId}>{sourceId} — {sourceById.get(sourceId)?.file ?? 'Unknown source'}</li>
                    ))}</ul></dd>
                  </div>
                  <div>
                    <dt>ECO-aligned question count</dt>
                    <dd>{questionCount}</dd>
                  </div>
                </dl>
              </article>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
