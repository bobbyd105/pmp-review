import conceptLessons from '../../data/concept_lessons.json'
import questions from '../../data/questions.json'
import ConceptLessonCard from './ConceptLessonCard.jsx'

const questionsById = new Map(questions.map((question) => [question.id, question]))

function resolveRelated(lesson) {
  return lesson.related_question_ids
    .map((id) => questionsById.get(id))
    .filter(Boolean)
}

export default function Course() {
  // Preserve authored order (c001, c002, ...) and group consecutive lessons
  // by module so the course reads as a sequence, not an alphabetical list.
  const groups = []
  for (const lesson of conceptLessons) {
    const last = groups[groups.length - 1]
    if (last && last.module === lesson.module) {
      last.lessons.push(lesson)
    } else {
      groups.push({ module: lesson.module, lessons: [lesson] })
    }
  }

  return (
    <section aria-label="Course">
      <h2>Comprehensive Course — Foundation Block</h2>
      <p className="course-intro">
        {conceptLessons.length} concept lessons teaching the vocabulary and mental
        models the rest of PMP study builds on. Work through them in order: each
        lesson ends with a knowledge check, and linked practice questions from the
        question bank let you apply the concept under exam-style conditions.
      </p>
      {groups.map((group, index) => (
        <div key={`${group.module}-${index}`} className="course-module">
          <h3 className="course-module-title">{group.module}</h3>
          {group.lessons.map((lesson) => (
            <ConceptLessonCard
              key={lesson.id}
              lesson={lesson}
              relatedQuestions={resolveRelated(lesson)}
            />
          ))}
        </div>
      ))}
    </section>
  )
}
