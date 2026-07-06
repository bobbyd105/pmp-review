import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Dashboard from '../components/Dashboard.jsx'
import { HISTORY_KEY } from '../quiz/quizHistory.js'

let consoleErrorSpy

beforeEach(() => {
  localStorage.clear()
  consoleErrorSpy = vi.spyOn(console, 'error')
})

afterEach(() => {
  expect(consoleErrorSpy).not.toHaveBeenCalled()
  consoleErrorSpy.mockRestore()
})

const sampleHistory = [
  {
    completedAt: '2026-07-01T10:00:00.000Z',
    score: 2,
    total: 3,
    domains: {
      People: { correct: 1, total: 1 },
      Process: { correct: 1, total: 2 },
    },
    missedQuestionIds: ['q005'],
  },
  {
    completedAt: '2026-07-05T18:30:00.000Z',
    score: 1,
    total: 2,
    domains: {
      Process: { correct: 1, total: 1 },
      'Business Environment': { correct: 0, total: 1 },
    },
    missedQuestionIds: ['q010'],
  },
]

describe('Dashboard', () => {
  it('shows a clear empty state when no history exists', () => {
    render(<Dashboard />)
    expect(screen.getByText(/no quiz history yet/i)).toBeInTheDocument()
    expect(screen.queryByText(/overall accuracy/i)).not.toBeInTheDocument()
  })

  it('shows an empty state (not a crash) when stored history is corrupt', () => {
    localStorage.setItem(HISTORY_KEY, 'corrupt{{{')
    render(<Dashboard />)
    expect(screen.getByText(/no quiz history yet/i)).toBeInTheDocument()
  })

  it('shows total quizzes, overall accuracy, and per-domain accuracy', () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sampleHistory))
    render(<Dashboard />)

    expect(screen.getByText('Quizzes taken')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    // 3 correct of 5 answered = 60%
    expect(screen.getByText('Overall accuracy')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()

    // Per-domain rows: People 1/1 = 100%, Process 2/3 = 67%, BE 0/1 = 0%
    const table = screen.getByRole('table')
    expect(table).toHaveTextContent('People')
    expect(table).toHaveTextContent('100%')
    expect(table).toHaveTextContent('Process')
    expect(table).toHaveTextContent('67%')
    expect(table).toHaveTextContent('Business Environment')
    expect(table).toHaveTextContent('0%')
  })

  it('shows the most recent quiz result with its per-domain breakdown', () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sampleHistory))
    render(<Dashboard />)

    expect(screen.getByText('Most recent quiz')).toBeInTheDocument()
    // Latest entry is the second one: 1/2.
    expect(screen.getByText('Score: 1/2')).toBeInTheDocument()
    expect(screen.getByText(/Business Environment: 0\/1/)).toBeInTheDocument()
    expect(screen.getByText(/Process: 1\/1/)).toBeInTheDocument()
  })
})
