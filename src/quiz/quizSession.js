// Pure quiz-session logic + localStorage persistence. No React in here so
// scoring and persistence can be unit-tested without rendering.

export const STORAGE_KEY = 'pmp-quiz-session-v1'
export const DEFAULT_QUESTION_COUNT = 5

// Fisher-Yates shuffle over a copy; rng injectable for deterministic tests.
function shuffle(items, rng) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function selectQuestionIds(questions, count, rng = Math.random) {
  const capped = Math.max(1, Math.min(count, questions.length))
  return shuffle(questions.map((q) => q.id), rng).slice(0, capped)
}

export function createSession(questions, count = DEFAULT_QUESTION_COUNT, rng = Math.random) {
  return {
    questionIds: selectQuestionIds(questions, count, rng),
    currentIndex: 0,
    // one entry per submitted question: { questionId, selected, correct }
    results: [],
  }
}

export function isComplete(session) {
  return session.currentIndex >= session.questionIds.length
}

export function currentQuestion(session, questions) {
  if (isComplete(session)) return null
  const id = session.questionIds[session.currentIndex]
  return questions.find((q) => q.id === id) ?? null
}

// Records the submitted answer and advances. Returns a new session object.
export function submitAnswer(session, questions, selectedOption) {
  const question = currentQuestion(session, questions)
  if (!question) return session
  return {
    ...session,
    currentIndex: session.currentIndex + 1,
    results: [
      ...session.results,
      {
        questionId: question.id,
        selected: selectedOption,
        correct: selectedOption === question.correct_answer,
      },
    ],
  }
}

export function getScore(session) {
  return session.results.filter((r) => r.correct).length
}

export function getMissed(session, questions) {
  return session.results
    .filter((r) => !r.correct)
    .map((r) => ({
      question: questions.find((q) => q.id === r.questionId),
      selected: r.selected,
    }))
    .filter((m) => m.question)
}

export function saveSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}

// Loads and validates a stored session against the current question bank.
// Returns null (and clears storage) on anything malformed or stale, so a
// bad stored state can never crash the quiz.
export function loadSession(questions) {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  let session
  try {
    session = JSON.parse(raw)
  } catch {
    clearSession()
    return null
  }
  const knownIds = new Set(questions.map((q) => q.id))
  const valid =
    session &&
    Array.isArray(session.questionIds) &&
    session.questionIds.length > 0 &&
    session.questionIds.every((id) => knownIds.has(id)) &&
    Number.isInteger(session.currentIndex) &&
    session.currentIndex >= 0 &&
    session.currentIndex <= session.questionIds.length &&
    Array.isArray(session.results) &&
    session.results.length === Math.min(session.currentIndex, session.questionIds.length) &&
    session.results.every(
      (r) => r && knownIds.has(r.questionId) && typeof r.correct === 'boolean',
    )
  if (!valid) {
    clearSession()
    return null
  }
  return session
}
