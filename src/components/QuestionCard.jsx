import { useState } from 'react'

export default function QuestionCard({ question }) {
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <article className="question-card">
      <p className="question-meta">
        <span className="question-domain">{question.eco_domain}</span>
        <span className="question-task">{question.eco_task}</span>
      </p>
      <p className="question-prompt">{question.question}</p>
      <ul className="question-options">
        {question.options.map((option) => (
          <li key={option}>{option}</li>
        ))}
      </ul>
      <button
        type="button"
        className="answer-toggle"
        aria-expanded={showAnswer}
        onClick={() => setShowAnswer((s) => !s)}
      >
        {showAnswer ? 'Hide answer' : 'Show answer'}
      </button>
      {showAnswer && (
        <div className="question-answer">
          <p className="answer-correct">
            <strong>Correct answer:</strong> {question.correct_answer}
          </p>
          <p className="answer-explanation">{question.explanation}</p>
        </div>
      )}
    </article>
  )
}
