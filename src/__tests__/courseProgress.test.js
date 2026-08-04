import { describe, it, expect, beforeEach } from 'vitest'
import conceptLessons from '../../data/concept_lessons.json'
import {
  STORAGE_KEY,
  createProgress,
  isLessonComplete,
  toggleLessonComplete,
  getCheckResult,
  recordCheckResult,
  getCompletionSummary,
  saveProgress,
  loadProgress,
  clearProgress,
} from '../course/courseProgress.js'

beforeEach(() => {
  localStorage.clear()
})

describe('lesson completion', () => {
  it('toggles a lesson between complete and incomplete', () => {
    const lessonId = conceptLessons[0].id
    let progress = createProgress()
    expect(isLessonComplete(progress, lessonId)).toBe(false)

    progress = toggleLessonComplete(progress, lessonId)
    expect(isLessonComplete(progress, lessonId)).toBe(true)

    progress = toggleLessonComplete(progress, lessonId)
    expect(isLessonComplete(progress, lessonId)).toBe(false)
  })

  it('summarizes completion count against the full course', () => {
    let progress = createProgress()
    progress = toggleLessonComplete(progress, conceptLessons[0].id)
    progress = toggleLessonComplete(progress, conceptLessons[1].id)

    expect(getCompletionSummary(progress, conceptLessons)).toEqual({
      completed: 2,
      total: conceptLessons.length,
    })
  })
})

describe('knowledge-check results', () => {
  it('records a revealed answer and returns it by lesson and index', () => {
    const lesson = conceptLessons[0]
    const check = lesson.knowledge_checks[0]
    let progress = createProgress()

    expect(getCheckResult(progress, lesson.id, 0)).toBeNull()

    progress = recordCheckResult(progress, lesson.id, 0, check.correct_answer)
    expect(getCheckResult(progress, lesson.id, 0)).toEqual({
      selected: check.correct_answer,
      revealed: true,
    })
  })

  it('keeps results for different lessons and checks independent', () => {
    let progress = createProgress()
    progress = recordCheckResult(progress, conceptLessons[0].id, 0, 'a')
    progress = recordCheckResult(progress, conceptLessons[0].id, 1, 'b')
    progress = recordCheckResult(progress, conceptLessons[1].id, 0, 'c')

    expect(getCheckResult(progress, conceptLessons[0].id, 0).selected).toBe('a')
    expect(getCheckResult(progress, conceptLessons[0].id, 1).selected).toBe('b')
    expect(getCheckResult(progress, conceptLessons[1].id, 0).selected).toBe('c')
  })
})

describe('persistence', () => {
  it('round-trips completion and check results through localStorage', () => {
    let progress = createProgress()
    progress = toggleLessonComplete(progress, conceptLessons[0].id)
    progress = recordCheckResult(
      progress,
      conceptLessons[0].id,
      0,
      conceptLessons[0].knowledge_checks[0].correct_answer,
    )
    saveProgress(progress)

    const restored = loadProgress(conceptLessons)
    expect(restored).toEqual(progress)
  })

  it('returns fresh empty progress when nothing is stored', () => {
    expect(loadProgress(conceptLessons)).toEqual(createProgress())
  })

  it('rejects and clears corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not json{{{')
    expect(loadProgress(conceptLessons)).toEqual(createProgress())
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('rejects progress referencing a lesson id not in the course', () => {
    const stale = { completedLessonIds: ['deleted-lesson'], checkResults: {} }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stale))
    expect(loadProgress(conceptLessons)).toEqual(createProgress())
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('rejects a check result whose selected option is not among the check options', () => {
    const lesson = conceptLessons[0]
    const stale = {
      completedLessonIds: [],
      checkResults: { [lesson.id]: { 0: { selected: 'not-a-real-option', revealed: true } } },
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stale))
    expect(loadProgress(conceptLessons)).toEqual(createProgress())
  })

  it('rejects a check result at an index the lesson does not have', () => {
    const lesson = conceptLessons[0]
    const stale = {
      completedLessonIds: [],
      checkResults: { [lesson.id]: { 99: { selected: 'x', revealed: true } } },
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stale))
    expect(loadProgress(conceptLessons)).toEqual(createProgress())
  })

  it('clearProgress removes the stored state', () => {
    let progress = createProgress()
    progress = toggleLessonComplete(progress, conceptLessons[0].id)
    saveProgress(progress)
    clearProgress()
    expect(loadProgress(conceptLessons)).toEqual(createProgress())
  })
})
