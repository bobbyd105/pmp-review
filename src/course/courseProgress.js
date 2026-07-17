// Pure course-progress logic + localStorage persistence, mirroring
// quiz/quizSession.js: no React in here so persistence can be unit-tested
// without rendering, and a bad stored value can never crash the Course view.

export const STORAGE_KEY = 'pmp-course-progress-v1'

export function createProgress() {
  return { completedLessonIds: [], checkResults: {} }
}

export function isLessonComplete(progress, lessonId) {
  return progress.completedLessonIds.includes(lessonId)
}

export function toggleLessonComplete(progress, lessonId) {
  const complete = isLessonComplete(progress, lessonId)
  return {
    ...progress,
    completedLessonIds: complete
      ? progress.completedLessonIds.filter((id) => id !== lessonId)
      : [...progress.completedLessonIds, lessonId],
  }
}

export function getCheckResult(progress, lessonId, checkIndex) {
  return progress.checkResults[lessonId]?.[checkIndex] ?? null
}

// Records a revealed knowledge-check answer. Once revealed, a check stays
// locked (see ConceptLessonCard), so this only ever writes once per check.
export function recordCheckResult(progress, lessonId, checkIndex, selected) {
  const lessonResults = progress.checkResults[lessonId] ?? {}
  return {
    ...progress,
    checkResults: {
      ...progress.checkResults,
      [lessonId]: {
        ...lessonResults,
        [checkIndex]: { selected, revealed: true },
      },
    },
  }
}

export function getCompletionSummary(progress, conceptLessons) {
  return {
    completed: progress.completedLessonIds.length,
    total: conceptLessons.length,
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEY)
}

// Loads and validates stored progress against the current course. Returns a
// fresh, empty progress object (and clears storage) on anything malformed or
// stale, so outdated or corrupted state can never crash the Course view.
export function loadProgress(conceptLessons) {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return createProgress()

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    clearProgress()
    return createProgress()
  }

  const lessonsById = new Map(conceptLessons.map((lesson) => [lesson.id, lesson]))

  const validCompleted =
    parsed &&
    Array.isArray(parsed.completedLessonIds) &&
    parsed.completedLessonIds.every((id) => lessonsById.has(id))

  const validCheckResults =
    parsed &&
    parsed.checkResults &&
    typeof parsed.checkResults === 'object' &&
    !Array.isArray(parsed.checkResults) &&
    Object.entries(parsed.checkResults).every(([lessonId, byIndex]) => {
      const lesson = lessonsById.get(lessonId)
      if (!lesson || typeof byIndex !== 'object' || byIndex === null || Array.isArray(byIndex)) {
        return false
      }
      return Object.entries(byIndex).every(([indexKey, result]) => {
        const check = lesson.knowledge_checks[Number(indexKey)]
        return (
          check &&
          result &&
          typeof result.selected === 'string' &&
          check.options.includes(result.selected) &&
          result.revealed === true
        )
      })
    })

  if (!validCompleted || !validCheckResults) {
    clearProgress()
    return createProgress()
  }

  return {
    completedLessonIds: [...new Set(parsed.completedLessonIds)],
    checkResults: parsed.checkResults,
  }
}
