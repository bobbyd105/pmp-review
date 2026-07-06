// Persistent quiz history + aggregate stats. Append-only record of completed
// quizzes, stored under its own localStorage key — fully separate from the
// active-session state in quizSession.js (see docs/decision_log.md #2/#3 and
// the Slice 3 evaluation in docs/progress.md).

export const HISTORY_KEY = 'pmp-quiz-history-v1'

// Builds one history entry from a completed session:
// { completedAt, score, total, domains: { [eco_domain]: {correct, total} },
//   missedQuestionIds: [] }
export function buildHistoryEntry(session, questions, now = () => new Date()) {
  const byId = new Map(questions.map((q) => [q.id, q]))
  const domains = {}
  const missedQuestionIds = []
  let score = 0

  for (const result of session.results) {
    const question = byId.get(result.questionId)
    if (!question) continue
    const tally = (domains[question.eco_domain] ??= { correct: 0, total: 0 })
    tally.total += 1
    if (result.correct) {
      tally.correct += 1
      score += 1
    } else {
      missedQuestionIds.push(result.questionId)
    }
  }

  return {
    completedAt: now().toISOString(),
    score,
    total: session.results.length,
    domains,
    missedQuestionIds,
  }
}

function isValidEntry(entry) {
  return (
    entry &&
    typeof entry.completedAt === 'string' &&
    Number.isInteger(entry.score) &&
    Number.isInteger(entry.total) &&
    entry.total > 0 &&
    entry.score >= 0 &&
    entry.score <= entry.total &&
    entry.domains &&
    typeof entry.domains === 'object' &&
    Object.values(entry.domains).every(
      (d) => d && Number.isInteger(d.correct) && Number.isInteger(d.total),
    ) &&
    Array.isArray(entry.missedQuestionIds)
  )
}

// Returns the stored history array; anything malformed degrades to [] so a
// bad stored value can never crash the Dashboard.
export function loadHistory() {
  const raw = localStorage.getItem(HISTORY_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every(isValidEntry)) return []
    return parsed
  } catch {
    return []
  }
}

export function appendHistoryEntry(entry) {
  const history = [...loadHistory(), entry]
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  return history
}

// The one call site for recording a finished quiz (Quiz.jsx, on the final
// submit). Appends exactly one entry per completed session.
export function recordCompletedQuiz(session, questions) {
  return appendHistoryEntry(buildHistoryEntry(session, questions))
}

// Aggregates across all history. Accuracy is summed correct / summed total
// (not an average of per-quiz percentages). Percentages are 0-100, rounded
// by the caller for display.
export function getAggregateStats(history) {
  let correct = 0
  let total = 0
  const domainTallies = {}

  for (const entry of history) {
    correct += entry.score
    total += entry.total
    for (const [domain, tally] of Object.entries(entry.domains)) {
      const agg = (domainTallies[domain] ??= { correct: 0, total: 0 })
      agg.correct += tally.correct
      agg.total += tally.total
    }
  }

  const domainAccuracy = {}
  for (const [domain, tally] of Object.entries(domainTallies)) {
    domainAccuracy[domain] = {
      ...tally,
      accuracy: tally.total === 0 ? 0 : (tally.correct / tally.total) * 100,
    }
  }

  return {
    totalQuizzes: history.length,
    correct,
    total,
    overallAccuracy: total === 0 ? 0 : (correct / total) * 100,
    domainAccuracy,
  }
}
