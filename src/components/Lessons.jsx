import lessons from '../../data/lessons.json'
import questions from '../../data/questions.json'
import LessonCard from './LessonCard.jsx'

const questionsById = new Map(questions.map((q) => [q.id, q]))

// Resolves a lesson's related_question_ids against the live question bank;
// unresolvable ids are skipped rather than crashing (the data-contract test
// makes a dangling id a test failure, so this only guards runtime).
function resolveRelated(lesson) {
  return (lesson.related_question_ids ?? [])
    .map((id) => questionsById.get(id))
    .filter(Boolean)
}

export default function Lessons() {
  return (
    <section className="lessons" aria-label="Lessons">
      <p className="lessons-count">{lessons.length} lessons loaded</p>
      <ol className="lesson-list">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <LessonCard lesson={lesson} relatedQuestions={resolveRelated(lesson)} />
          </li>
        ))}
      </ol>
    </section>
  )
}
