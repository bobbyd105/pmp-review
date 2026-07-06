import { getScore, getMissed } from '../quiz/quizSession.js'

export default function QuizResults({ session, questions, onRestart }) {
  const score = getScore(session)
  const total = session.questionIds.length
  const missed = getMissed(session, questions)

  return (
    <section className="quiz-results" aria-label="Quiz results">
      <h2>Quiz complete</h2>
      <p className="quiz-score">
        Score: {score}/{total}
      </p>
      {missed.length === 0 ? (
        <p className="quiz-perfect">All questions answered correctly.</p>
      ) : (
        <>
          <h3>Review missed questions</h3>
          <ol className="quiz-missed-list">
            {missed.map(({ question, selected }) => (
              <li key={question.id} className="quiz-missed-item">
                <p className="question-prompt">{question.question}</p>
                <p className="missed-your-answer">
                  <strong>Your answer:</strong> {selected}
                </p>
                <p className="missed-correct-answer">
                  <strong>Correct answer:</strong> {question.correct_answer}
                </p>
                <p className="answer-explanation">{question.explanation}</p>
              </li>
            ))}
          </ol>
        </>
      )}
      <button type="button" className="quiz-start" onClick={onRestart}>
        Start new quiz
      </button>
    </section>
  )
}
