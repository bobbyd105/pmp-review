import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Quiz from '../components/Quiz.jsx'
import questions from '../../data/questions.json'
import { STORAGE_KEY } from '../quiz/quizSession.js'
import { loadHistory } from '../quiz/quizHistory.js'

const bankById = new Map(questions.map((q) => [q.id, q]))

function storedSession() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY))
}

// The question currently on screen, resolved via the persisted session.
function questionOnScreen() {
  const session = storedSession()
  return bankById.get(session.questionIds[session.currentIndex])
}

let consoleErrorSpy

beforeEach(() => {
  localStorage.clear()
  consoleErrorSpy = vi.spyOn(console, 'error')
})

afterEach(() => {
  expect(consoleErrorSpy).not.toHaveBeenCalled()
  consoleErrorSpy.mockRestore()
})

async function startQuiz(user, count) {
  if (count !== undefined) {
    const input = screen.getByLabelText(/number of questions/i)
    await user.clear(input)
    await user.type(input, String(count))
  }
  await user.click(screen.getByRole('button', { name: 'Start quiz' }))
}

async function answerCurrent(user, { correctly }) {
  const q = questionOnScreen()
  const choice = correctly
    ? q.correct_answer
    : q.options.find((o) => o !== q.correct_answer)
  await user.click(screen.getByRole('radio', { name: choice }))
  await user.click(screen.getByRole('button', { name: 'Submit answer' }))
  return q
}

describe('Quiz', () => {
  it('starts with the default of 5 questions', async () => {
    const user = userEvent.setup()
    render(<Quiz />)
    expect(screen.getByLabelText(/number of questions/i)).toHaveValue(5)
    await startQuiz(user)
    expect(screen.getByText(/Question 1 of 5/)).toBeInTheDocument()
    expect(storedSession().questionIds).toHaveLength(5)
  })

  it('starts with a configurable question count and no repeats', async () => {
    const user = userEvent.setup()
    render(<Quiz />)
    await startQuiz(user, 3)
    expect(screen.getByText(/Question 1 of 3/)).toBeInTheDocument()
    const ids = storedSession().questionIds
    expect(ids).toHaveLength(3)
    expect(new Set(ids).size).toBe(3)
  })

  it('never shows the correct answer or explanation before submit', async () => {
    const user = userEvent.setup()
    render(<Quiz />)
    await startQuiz(user, 2)

    const q = questionOnScreen()
    expect(screen.queryByText(q.explanation)).not.toBeInTheDocument()
    expect(screen.queryByText(/correct answer/i)).not.toBeInTheDocument()

    // Selecting an option (without submitting) must not reveal anything.
    await user.click(screen.getByRole('radio', { name: q.options[0] }))
    expect(screen.queryByText(q.explanation)).not.toBeInTheDocument()
    expect(screen.queryByText(/correct answer/i)).not.toBeInTheDocument()
  })

  it('requires a selection before submitting', async () => {
    const user = userEvent.setup()
    render(<Quiz />)
    await startQuiz(user, 1)
    expect(screen.getByRole('button', { name: 'Submit answer' })).toBeDisabled()
  })

  it('records answers, advances, and shows the final score with missed-question review', async () => {
    const user = userEvent.setup()
    render(<Quiz />)
    await startQuiz(user, 3)

    await answerCurrent(user, { correctly: true })
    expect(screen.getByText(/Question 2 of 3/)).toBeInTheDocument()

    const missedQ = await answerCurrent(user, { correctly: false })
    expect(screen.getByText(/Question 3 of 3/)).toBeInTheDocument()

    await answerCurrent(user, { correctly: true })

    expect(screen.getByText('Score: 2/3')).toBeInTheDocument()
    expect(screen.getByText(missedQ.question)).toBeInTheDocument()
    expect(screen.getByText(missedQ.explanation)).toBeInTheDocument()
    expect(screen.getByText(/your answer/i)).toBeInTheDocument()

    // Only the missed question is reviewed.
    expect(screen.getAllByText(/^Correct answer:$/)).toHaveLength(1)
  })

  it('shows a perfect-score message with no review list when nothing was missed', async () => {
    const user = userEvent.setup()
    render(<Quiz />)
    await startQuiz(user, 2)
    await answerCurrent(user, { correctly: true })
    await answerCurrent(user, { correctly: true })
    expect(screen.getByText('Score: 2/2')).toBeInTheDocument()
    expect(screen.getByText(/all questions answered correctly/i)).toBeInTheDocument()
    expect(screen.queryByText(/review missed questions/i)).not.toBeInTheDocument()
  })

  it('persists question index and score across a reload (unmount/remount)', async () => {
    const user = userEvent.setup()
    render(<Quiz />)
    await startQuiz(user, 3)

    await answerCurrent(user, { correctly: true })
    await answerCurrent(user, { correctly: false })
    const expectedNext = questionOnScreen()

    // Simulate a page reload: unmount everything, then mount fresh.
    cleanup()
    render(<Quiz />)

    expect(screen.getByText(/Question 3 of 3/)).toBeInTheDocument()
    expect(screen.getByText(/Correct so far: 1/)).toBeInTheDocument()
    expect(screen.getByText(expectedNext.question)).toBeInTheDocument()
  })

  it('resumes at the results screen when a completed session is reloaded', async () => {
    const user = userEvent.setup()
    render(<Quiz />)
    await startQuiz(user, 1)
    await answerCurrent(user, { correctly: false })
    expect(screen.getByText('Score: 0/1')).toBeInTheDocument()

    cleanup()
    render(<Quiz />)
    expect(screen.getByText('Score: 0/1')).toBeInTheDocument()
  })

  it('appends one history entry per completed quiz, accumulating across quizzes', async () => {
    const user = userEvent.setup()
    render(<Quiz />)

    await startQuiz(user, 2)
    expect(loadHistory()).toHaveLength(0) // nothing recorded mid-quiz
    await answerCurrent(user, { correctly: true })
    expect(loadHistory()).toHaveLength(0)
    await answerCurrent(user, { correctly: false })
    let history = loadHistory()
    expect(history).toHaveLength(1)
    expect(history[0].score).toBe(1)
    expect(history[0].total).toBe(2)

    // Second quiz accumulates rather than overwriting.
    await user.click(screen.getByRole('button', { name: 'Start new quiz' }))
    await startQuiz(user, 1)
    await answerCurrent(user, { correctly: true })
    history = loadHistory()
    expect(history).toHaveLength(2)
    expect(history[1].score).toBe(1)
    expect(history[1].total).toBe(1)
  })

  it('does not re-record history when a completed session is reloaded', async () => {
    const user = userEvent.setup()
    render(<Quiz />)
    await startQuiz(user, 1)
    await answerCurrent(user, { correctly: true })
    expect(loadHistory()).toHaveLength(1)

    cleanup()
    render(<Quiz />)
    expect(screen.getByText('Score: 1/1')).toBeInTheDocument()
    expect(loadHistory()).toHaveLength(1)
  })

  it('starts fresh after "Start new quiz" clears the stored session', async () => {
    const user = userEvent.setup()
    render(<Quiz />)
    await startQuiz(user, 1)
    await answerCurrent(user, { correctly: true })
    await user.click(screen.getByRole('button', { name: 'Start new quiz' }))
    expect(screen.getByRole('button', { name: 'Start quiz' })).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
