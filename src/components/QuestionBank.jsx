import { useEffect, useRef } from 'react'
import questions from '../../data/questions.json'
import QuestionCard from './QuestionCard.jsx'

export default function QuestionBank({ focusQuestionId = null }) {
  const itemRefs = useRef(new Map())

  useEffect(() => {
    if (!focusQuestionId) return
    itemRefs.current.get(focusQuestionId)?.scrollIntoView?.({ block: 'center' })
  }, [focusQuestionId])

  return (
    <section className="question-bank" aria-label="Question bank">
      <p className="question-bank-count">
        {questions.length} questions loaded
      </p>
      <ol className="question-list">
        {questions.map((q) => (
          <li
            key={q.id}
            ref={(node) => {
              if (node) itemRefs.current.set(q.id, node)
              else itemRefs.current.delete(q.id)
            }}
            className={
              q.id === focusQuestionId ? 'question-list-item focused-item' : 'question-list-item'
            }
          >
            <QuestionCard question={q} defaultShowAnswer={q.id === focusQuestionId} />
          </li>
        ))}
      </ol>
    </section>
  )
}
