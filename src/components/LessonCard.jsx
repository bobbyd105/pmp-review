// Renders the markdown subset the lesson schema commits to (decision_log.md
// #4): paragraphs separated by blank lines, "- " bullet lists, and **bold**.
// Everything is emitted as React elements — no HTML injection surface.

function renderInline(text, keyPrefix) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={`${keyPrefix}-${i}`}>{part}</strong> : part,
  )
}

function renderBody(body) {
  return body.split(/\n\n+/).map((block, blockIndex) => {
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
    return <p key={blockIndex}>{renderInline(block, `${blockIndex}`)}</p>
  })
}

export default function LessonCard({ lesson, relatedQuestions }) {
  return (
    <article className="lesson-card">
      <h3 className="lesson-title">{lesson.title}</h3>
      <p className="question-meta">
        <span className="question-domain">{lesson.eco_domain}</span>
        <span className="question-task">{lesson.eco_task}</span>
      </p>
      <div className="lesson-body">{renderBody(lesson.body)}</div>
      {relatedQuestions.length > 0 && (
        <div className="lesson-related">
          <h4>Practice questions for this lesson</h4>
          <ul>
            {relatedQuestions.map((q) => (
              <li key={q.id}>{q.question}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
