import { useEffect, useState } from 'react'
import questions from '../../data/questions.json'
import {
  DEFAULT_QUESTION_COUNT,
  createSession,
  currentQuestion,
  isComplete,
  loadSession,
  saveSession,
  clearSession,
  submitAnswer,
  getScore,
} from '../quiz/quizSession.js'
import { recordCompletedQuiz } from '../quiz/quizHistory.js'
import QuizQuestion from './QuizQuestion.jsx'
import QuizResults from './QuizResults.jsx'

export default function Quiz() {
  // Resume any stored session (validated against the bank) on first render.
  const [session, setSession] = useState(() => loadSession(questions))
  // Kept as a string so the field can be cleared while typing; parsed and
  // clamped only when the quiz starts.
  const [requestedCount, setRequestedCount] = useState(String(DEFAULT_QUESTION_COUNT))

  useEffect(() => {
    if (session) saveSession(session)
  }, [session])

  const startQuiz = () => {
    const parsed = Number.parseInt(requestedCount, 10)
    const count = Number.isNaN(parsed) ? DEFAULT_QUESTION_COUNT : parsed
    const fresh = createSession(questions, count)
    saveSession(fresh)
    setSession(fresh)
  }

  const restart = () => {
    clearSession()
    setSession(null)
  }

  if (!session) {
    return (
      <section className="quiz" aria-label="Quiz">
        <h2>Start a quiz</h2>
        <label className="quiz-count-label">
          Number of questions:{' '}
          <input
            type="number"
            min="1"
            max={questions.length}
            value={requestedCount}
            onChange={(e) => setRequestedCount(e.target.value)}
          />
        </label>
        <p className="quiz-count-hint">
          {questions.length} questions available. No repeats within a session.
        </p>
        <button type="button" className="quiz-start" onClick={startQuiz}>
          Start quiz
        </button>
      </section>
    )
  }

  if (isComplete(session)) {
    return (
      <QuizResults session={session} questions={questions} onRestart={restart} />
    )
  }

  const question = currentQuestion(session, questions)
  return (
    <section className="quiz" aria-label="Quiz">
      <p className="quiz-progress">
        Question {session.currentIndex + 1} of {session.questionIds.length}
        <span className="quiz-running-score">
          Correct so far: {getScore(session)}
        </span>
      </p>
      <QuizQuestion
        key={question.id}
        question={question}
        onSubmit={(selected) => {
          const next = submitAnswer(session, questions, selected)
          // Record history exactly at the transition into the completed
          // state, so reloading a finished session never re-records it.
          if (isComplete(next)) recordCompletedQuiz(next, questions)
          setSession(next)
        }}
      />
    </section>
  )
}
