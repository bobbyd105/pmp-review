import { useState } from 'react'

// Presents one question with selectable options. Never renders the correct
// answer or explanation — the parent advances on submit, and explanations
// appear only in the completion review (QuizResults).
export default function QuizQuestion({ question, onSubmit }) {
  const [selected, setSelected] = useState(null)

  return (
    <article className="quiz-question">
      <p className="question-meta">
        <span className="question-domain">{question.eco_domain}</span>
        <span className="question-task">{question.eco_task}</span>
      </p>
      <p className="question-prompt">{question.question}</p>
      <fieldset className="quiz-options">
        <legend className="visually-hidden">Choose an answer</legend>
        {question.options.map((option) => (
          <label key={option} className="quiz-option">
            <input
              type="radio"
              name={`quiz-${question.id}`}
              value={option}
              checked={selected === option}
              onChange={() => setSelected(option)}
            />
            {option}
          </label>
        ))}
      </fieldset>
      <button
        type="button"
        className="quiz-submit"
        disabled={selected === null}
        onClick={() => onSubmit(selected)}
      >
        Submit answer
      </button>
    </article>
  )
}
