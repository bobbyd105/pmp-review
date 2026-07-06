import questions from '../../data/questions.json'
import QuestionCard from './QuestionCard.jsx'

export default function QuestionBank() {
  return (
    <section className="question-bank" aria-label="Question bank">
      <p className="question-bank-count">
        {questions.length} questions loaded
      </p>
      <ol className="question-list">
        {questions.map((q) => (
          <li key={q.id}>
            <QuestionCard question={q} />
          </li>
        ))}
      </ol>
    </section>
  )
}
