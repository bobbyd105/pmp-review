import { useState } from 'react'
import formulaCatalog from '../../data/formula_catalog.json'
import glossaryCatalog from '../../data/glossary_catalog.json'

// Renders the concept-lesson content subset: paragraphs separated by blank
// lines, "- " bullet lists, numbered "1. " lists, **bold**, and *italic*.
// Everything is emitted as React elements — no HTML injection surface.

const formulaById = new Map(formulaCatalog.formulas.map((formula) => [formula.id, formula]))
const glossaryById = new Map(glossaryCatalog.entries.map((entry) => [entry.id, entry]))

function renderInline(text, keyPrefix) {
  const boldParts = text.split(/\*\*(.+?)\*\*/g)
  return boldParts.flatMap((part, i) => {
    if (i % 2 === 1) return <strong key={`${keyPrefix}-b${i}`}>{part}</strong>
    const italicParts = part.split(/\*(.+?)\*/g)
    return italicParts.map((sub, j) =>
      j % 2 === 1 ? <em key={`${keyPrefix}-i${i}-${j}`}>{sub}</em> : sub,
    )
  })
}

function renderContent(content) {
  return content.split(/\n\n+/).map((block, blockIndex) => {
    const lines = block.split('\n')
    if (lines.every((line) => line.startsWith('- '))) {
      return (
        <ul key={blockIndex}>
          {lines.map((line, i) => (
            <li key={i}>{renderInline(line.slice(2), `${blockIndex}-${i}`)}</li>
          ))}
        </ul>
      )
    }
    if (lines.every((line) => /^\d+\.\s/.test(line))) {
      return (
        <ol key={blockIndex}>
          {lines.map((line, i) => (
            <li key={i}>
              {renderInline(line.replace(/^\d+\.\s/, ''), `${blockIndex}-${i}`)}
            </li>
          ))}
        </ol>
      )
    }
    return <p key={blockIndex}>{renderInline(block, `${blockIndex}`)}</p>
  })
}

// Shared answerable-question UI: a radiogroup, a locked-until-selected "Check
// answer" button, and a reveal showing correctness plus an explanation. Used
// both for authored knowledge checks (result persists via props) and for
// related practice questions pulled from the bank (result stays local to the
// card — see RelatedQuestionPractice).
function AnswerableQuestion({ prompt, options, correctAnswer, explanation, groupName, groupLabel, result, onAnswer }) {
  const [pendingSelection, setPendingSelection] = useState(null)
  const revealed = result?.revealed ?? false
  const selected = revealed ? result.selected : pendingSelection

  return (
    <div className="knowledge-check">
      <p className="knowledge-check-question">{prompt}</p>
      <div role="radiogroup" aria-label={groupLabel}>
        {options.map((option) => (
          <label key={option} className="knowledge-check-option">
            <input
              type="radio"
              name={groupName}
              value={option}
              checked={selected === option}
              disabled={revealed}
              onChange={() => setPendingSelection(option)}
            />
            <span
              className={
                revealed && option === correctAnswer
                  ? 'check-correct'
                  : revealed && option === selected
                    ? 'check-incorrect'
                    : undefined
              }
            >
              {option}
            </span>
          </label>
        ))}
      </div>
      {!revealed && (
        <button
          type="button"
          className="secondary-button"
          disabled={selected === null}
          onClick={() => onAnswer(selected)}
        >
          Check answer
        </button>
      )}
      {revealed && (
        <div className="knowledge-check-result" role="status">
          <p>
            <strong>{selected === correctAnswer ? 'Correct.' : 'Not quite.'}</strong> {explanation}
          </p>
        </div>
      )}
    </div>
  )
}

function KnowledgeCheck({ check, lessonId, index, result, onAnswer }) {
  return (
    <AnswerableQuestion
      prompt={check.question}
      options={check.options}
      correctAnswer={check.correct_answer}
      explanation={check.explanation}
      groupName={`${lessonId}-check-${index}`}
      groupLabel={`Knowledge check ${index + 1}`}
      result={result}
      onAnswer={(selected) => onAnswer(selected)}
    />
  )
}

// A related bank question rendered as a real, answerable question (not a
// static stem), plus a direct handoff into the Question Bank view.
function RelatedQuestionPractice({ question, onOpenQuestion }) {
  const [result, setResult] = useState(null)

  return (
    <li className="lesson-related-question">
      <AnswerableQuestion
        prompt={question.question}
        options={question.options}
        correctAnswer={question.correct_answer}
        explanation={question.explanation}
        groupName={`related-${question.id}`}
        groupLabel={`Practice question ${question.id}`}
        result={result}
        onAnswer={(selected) => setResult({ selected, revealed: true })}
      />
      {onOpenQuestion && (
        <button
          type="button"
          className="secondary-button"
          onClick={() => onOpenQuestion(question.id)}
        >
          Open in Question Bank
        </button>
      )}
    </li>
  )
}

export default function ConceptLessonCard({
  lesson,
  relatedQuestions,
  completed,
  onToggleComplete,
  getCheckResult,
  onAnswerCheck,
  onOpenQuestion,
  onOpenReference,
}) {
  const [expanded, setExpanded] = useState(false)
  const relatedFormulas = lesson.formula_refs.map((id) => formulaById.get(id)).filter(Boolean)
  const relatedGlossary = lesson.glossary_refs.map((id) => glossaryById.get(id)).filter(Boolean)

  return (
    <article className="concept-lesson-card">
      <header className="concept-lesson-header">
        <div>
          <h3 className="lesson-title">{lesson.title}</h3>
          <p className="question-meta">
            <span className="question-domain">{lesson.module}</span>
            {lesson.pmbok8_domains.map((domain) => (
              <span key={domain} className="question-task">
                {domain}
              </span>
            ))}
          </p>
        </div>
        <div className="concept-lesson-actions">
          <button
            type="button"
            className={completed ? 'secondary-button lesson-complete active' : 'secondary-button lesson-complete'}
            aria-pressed={completed}
            onClick={onToggleComplete}
          >
            {completed ? 'Completed ✓' : 'Mark complete'}
          </button>
          <button
            type="button"
            className="secondary-button"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'Collapse lesson' : 'Open lesson'}
          </button>
        </div>
      </header>

      {expanded && (
        <div className="concept-lesson-body">
          <section>
            <h4>What you will learn</h4>
            <ul>
              {lesson.learning_objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </section>

          {lesson.sections.map((section) => (
            <section key={section.title}>
              <h4>{section.title}</h4>
              {renderContent(section.content)}
            </section>
          ))}

          <section>
            <h4>Exam traps</h4>
            <ul>
              {lesson.exam_traps.map((trap) => (
                <li key={trap}>{trap}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4>Flashcards</h4>
            <dl className="concept-flashcards">
              {lesson.flashcards.map((card) => (
                <div key={card.term} className="concept-flashcard">
                  <dt>{card.term}</dt>
                  <dd>{card.definition}</dd>
                </div>
              ))}
            </dl>
          </section>

          {(relatedFormulas.length > 0 || relatedGlossary.length > 0) && (
            <section>
              <h4>Reference sheet</h4>
              <ul className="lesson-reference-links">
                {relatedFormulas.map((formula) => (
                  <li key={formula.id}>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => onOpenReference?.('formulas', formula.id)}
                    >
                      {formula.name}
                    </button>
                  </li>
                ))}
                {relatedGlossary.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => onOpenReference?.('glossary', entry.id)}
                    >
                      {entry.term}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h4>Knowledge check</h4>
            {lesson.knowledge_checks.map((check, index) => (
              <KnowledgeCheck
                key={check.question}
                check={check}
                lessonId={lesson.id}
                index={index}
                result={getCheckResult(index)}
                onAnswer={(selected) => onAnswerCheck(index, selected)}
              />
            ))}
          </section>

          {relatedQuestions.length > 0 && (
            <section className="lesson-related">
              <h4>Practice questions covering this concept</h4>
              <ul className="lesson-related-list">
                {relatedQuestions.map((question) => (
                  <RelatedQuestionPractice
                    key={question.id}
                    question={question}
                    onOpenQuestion={onOpenQuestion}
                  />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </article>
  )
}
