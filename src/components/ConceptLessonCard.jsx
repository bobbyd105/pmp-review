import { useState } from 'react'

// Renders the concept-lesson content subset: paragraphs separated by blank
// lines, "- " bullet lists, numbered "1. " lists, **bold**, and *italic*.
// Everything is emitted as React elements — no HTML injection surface.

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

function KnowledgeCheck({ check, lessonId, index }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const groupName = `${lessonId}-check-${index}`

  return (
    <div className="knowledge-check">
      <p className="knowledge-check-question">{check.question}</p>
      <div role="radiogroup" aria-label={`Knowledge check ${index + 1}`}>
        {check.options.map((option) => (
          <label key={option} className="knowledge-check-option">
            <input
              type="radio"
              name={groupName}
              value={option}
              checked={selected === option}
              disabled={revealed}
              onChange={() => setSelected(option)}
            />
            <span
              className={
                revealed && option === check.correct_answer
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
          onClick={() => setRevealed(true)}
        >
          Check answer
        </button>
      )}
      {revealed && (
        <div className="knowledge-check-result" role="status">
          <p>
            <strong>{selected === check.correct_answer ? 'Correct.' : 'Not quite.'}</strong>{' '}
            {check.explanation}
          </p>
        </div>
      )}
    </div>
  )
}

export default function ConceptLessonCard({ lesson, relatedQuestions }) {
  const [expanded, setExpanded] = useState(false)

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
        <button
          type="button"
          className="secondary-button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Collapse lesson' : 'Open lesson'}
        </button>
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

          <section>
            <h4>Knowledge check</h4>
            {lesson.knowledge_checks.map((check, index) => (
              <KnowledgeCheck
                key={check.question}
                check={check}
                lessonId={lesson.id}
                index={index}
              />
            ))}
          </section>

          {relatedQuestions.length > 0 && (
            <section className="lesson-related">
              <h4>Practice questions covering this concept</h4>
              <ul>
                {relatedQuestions.map((question) => (
                  <li key={question.id}>{question.question}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </article>
  )
}
