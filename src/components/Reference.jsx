import { useEffect, useRef, useState } from 'react'
import formulaCatalog from '../../data/formula_catalog.json'
import glossaryCatalog from '../../data/glossary_catalog.json'

function FormulaCard({ formula, cardRef, focused }) {
  return (
    <article ref={cardRef} className={focused ? 'reference-card focused-item' : 'reference-card'}>
      <h4>{formula.name}</h4>
      <p className="reference-formula">
        <code>{formula.formula}</code>
      </p>
      <dl className="reference-variables">
        {formula.variables.map((variable) => (
          <div key={variable.symbol} className="reference-variable">
            <dt>{variable.symbol}</dt>
            <dd>{variable.meaning}</dd>
          </div>
        ))}
      </dl>
      <p>{formula.interpretation}</p>
      <ul className="reference-guidance">
        <li>
          <strong>Higher:</strong> {formula.comparison_guidance.greater_than}
        </li>
        <li>
          <strong>Lower:</strong> {formula.comparison_guidance.less_than}
        </li>
        {formula.memory_tips.map((tip) => (
          <li key={tip}>
            <strong>Remember:</strong> {tip}
          </li>
        ))}
        {formula.common_mistakes.map((mistake) => (
          <li key={mistake}>
            <strong>Watch out:</strong> {mistake}
          </li>
        ))}
      </ul>
    </article>
  )
}

function GlossaryCard({ entry, cardRef, focused }) {
  return (
    <article ref={cardRef} className={focused ? 'reference-card focused-item' : 'reference-card'}>
      <h4>{entry.term}</h4>
      <p>{entry.definition}</p>
      <ul className="reference-guidance">
        <li>
          <strong>Often confused:</strong> {entry.common_confusion}
        </li>
        <li>
          <strong>Exam trap:</strong> {entry.exam_trap}
        </li>
      </ul>
    </article>
  )
}

// focusEntry, when set, is { section: 'formulas' | 'glossary', id }. It
// switches to that section, clears any active filter that would hide the
// entry, and scrolls the matching card into view.
export default function Reference({ focusEntry = null }) {
  const [section, setSection] = useState('formulas')
  const [filter, setFilter] = useState('')
  const cardRefs = useRef(new Map())

  useEffect(() => {
    if (!focusEntry) return
    setSection(focusEntry.section)
    setFilter('')
  }, [focusEntry])

  useEffect(() => {
    if (!focusEntry) return
    cardRefs.current.get(focusEntry.id)?.scrollIntoView?.({ block: 'center' })
  }, [focusEntry, section, filter])

  const query = filter.trim().toLowerCase()

  const formulas = formulaCatalog.formulas.filter(
    (formula) =>
      query === '' ||
      formula.name.toLowerCase().includes(query) ||
      formula.formula.toLowerCase().includes(query),
  )
  const entries = glossaryCatalog.entries.filter(
    (entry) =>
      query === '' ||
      entry.term.toLowerCase().includes(query) ||
      entry.definition.toLowerCase().includes(query),
  )

  const selectSection = (next) => {
    setSection(next)
    setFilter('')
  }

  return (
    <section aria-label="Reference">
      <h2>Reference</h2>
      <p className="course-intro">
        Retrieval support for exam study: the formula sheet with interpretation
        and common mistakes, and a glossary of high-confusion terms. Everything
        here is also taught in context in the Course lessons.
      </p>
      <div className="reference-controls">
        <button
          type="button"
          className={section === 'formulas' ? 'nav-button active' : 'nav-button'}
          aria-pressed={section === 'formulas'}
          onClick={() => selectSection('formulas')}
        >
          Formulas ({formulaCatalog.formulas.length})
        </button>
        <button
          type="button"
          className={section === 'glossary' ? 'nav-button active' : 'nav-button'}
          aria-pressed={section === 'glossary'}
          onClick={() => selectSection('glossary')}
        >
          Glossary ({glossaryCatalog.entries.length})
        </button>
        <label className="reference-filter">
          Filter
          <input
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder={section === 'formulas' ? 'e.g. earned value' : 'e.g. reserve'}
          />
        </label>
      </div>
      {section === 'formulas' && (
        <div className="reference-list">
          {formulas.map((formula) => (
            <FormulaCard
              key={formula.id}
              formula={formula}
              focused={focusEntry?.id === formula.id}
              cardRef={(node) => {
                if (node) cardRefs.current.set(formula.id, node)
                else cardRefs.current.delete(formula.id)
              }}
            />
          ))}
          {formulas.length === 0 && <p>No formulas match the filter.</p>}
        </div>
      )}
      {section === 'glossary' && (
        <div className="reference-list">
          {entries.map((entry) => (
            <GlossaryCard
              key={entry.id}
              entry={entry}
              focused={focusEntry?.id === entry.id}
              cardRef={(node) => {
                if (node) cardRefs.current.set(entry.id, node)
                else cardRefs.current.delete(entry.id)
              }}
            />
          ))}
          {entries.length === 0 && <p>No glossary entries match the filter.</p>}
        </div>
      )}
    </section>
  )
}
