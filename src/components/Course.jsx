import { useEffect, useState } from 'react'
import conceptLessons from '../../data/concept_lessons.json'
import questions from '../../data/questions.json'
import ConceptLessonCard from './ConceptLessonCard.jsx'
import {
  loadProgress,
  saveProgress,
  toggleLessonComplete,
  isLessonComplete,
  getCheckResult,
  recordCheckResult,
  getCompletionSummary,
} from '../course/courseProgress.js'

const questionsById = new Map(questions.map((question) => [question.id, question]))

function resolveRelated(lesson) {
  return lesson.related_question_ids
    .map((id) => questionsById.get(id))
    .filter(Boolean)
}

export default function Course({ onOpenQuestion, onOpenReference }) {
  // Resume any stored completion/knowledge-check state (validated against the
  // current course) on first render, and persist every change so collapsing a
  // lesson, switching views, or refreshing the page never loses it.
  const [progress, setProgress] = useState(() => loadProgress(conceptLessons))

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

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

  const summary = getCompletionSummary(progress, conceptLessons)

  return (
    <section aria-label="Course">
      <h2>Comprehensive Course</h2>
      <p className="course-intro">
        {conceptLessons.length} concept lessons in teaching order, from foundations
        through delivery mechanics, agile, and AI. Work through them in sequence:
        each lesson ends with a knowledge check, and linked practice questions from
        the question bank let you apply the concept under exam-style conditions.
      </p>
      <p className="course-progress-summary" role="status">
        {summary.completed} of {summary.total} lessons marked complete. Progress and
        knowledge-check results are saved on this device.
      </p>
      {groups.map((group, index) => (
        <div key={`${group.module}-${index}`} className="course-module">
          <h3 className="course-module-title">{group.module}</h3>
          {group.lessons.map((lesson) => (
            <ConceptLessonCard
              key={lesson.id}
              lesson={lesson}
              relatedQuestions={resolveRelated(lesson)}
              completed={isLessonComplete(progress, lesson.id)}
              onToggleComplete={() =>
                setProgress((current) => toggleLessonComplete(current, lesson.id))
              }
              getCheckResult={(index) => getCheckResult(progress, lesson.id, index)}
              onAnswerCheck={(index, selected) =>
                setProgress((current) => recordCheckResult(current, lesson.id, index, selected))
              }
              onOpenQuestion={onOpenQuestion}
              onOpenReference={onOpenReference}
            />
          ))}
        </div>
      ))}
    </section>
  )
}
