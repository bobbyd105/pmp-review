import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuestionBank from '../components/QuestionBank.jsx'
import questions from '../../data/questions.json'

let consoleErrorSpy

// Full-bank render tests scale with total option text; the 2026-07 length-bias
// remediation lengthened average distractor text, pushing renders past the
// previous 15s allowance.
vi.setConfig({ testTimeout: 30000 })

beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error')
})

afterEach(() => {
  expect(consoleErrorSpy).not.toHaveBeenCalled()
  consoleErrorSpy.mockRestore()
})

describe('QuestionBank', () => {
  it('renders every question prompt and all of its options', () => {
    render(<QuestionBank />)
    for (const q of questions) {
      const prompt = screen.getByText(q.question)
      expect(prompt).toBeInTheDocument()
      const card = prompt.closest('article')
      for (const option of q.options) {
        expect(within(card).getByText(option)).toBeInTheDocument()
      }
    }
  })

  it('shows the question count', () => {
    render(<QuestionBank />)
    expect(
      screen.getByText(`${questions.length} questions loaded`),
    ).toBeInTheDocument()
  })

  it('hides answers and explanations until toggled', () => {
    render(<QuestionBank />)
    for (const q of questions) {
      expect(screen.queryByText(q.explanation)).not.toBeInTheDocument()
    }
  })

  it('reveals the correct answer and explanation on toggle, and hides them again', async () => {
    const user = userEvent.setup()
    render(<QuestionBank />)

    const q = questions[0]
    const card = screen.getByText(q.question).closest('article')
    const toggle = within(card).getByRole('button', { name: 'Show answer' })

    await user.click(toggle)
    const answerBlock = card.querySelector('.question-answer')
    expect(answerBlock).toHaveTextContent(`Correct answer: ${q.correct_answer}`)
    expect(within(card).getByText(q.explanation)).toBeInTheDocument()
    expect(toggle).toHaveTextContent('Hide answer')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(toggle)
    expect(within(card).queryByText(q.explanation)).not.toBeInTheDocument()
    expect(toggle).toHaveTextContent('Show answer')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('toggles answers independently per question', async () => {
    const user = userEvent.setup()
    render(<QuestionBank />)

    const first = questions[0]
    const second = questions[1]
    const firstCard = screen.getByText(first.question).closest('article')

    await user.click(within(firstCard).getByRole('button', { name: 'Show answer' }))
    expect(within(firstCard).getByText(first.explanation)).toBeInTheDocument()
    expect(screen.queryByText(second.explanation)).not.toBeInTheDocument()
  })

  it('deep-links to a focused question: answer pre-expanded and item marked focused', () => {
    const target = questions[Math.min(5, questions.length - 1)]
    render(<QuestionBank focusQuestionId={target.id} />)

    const card = screen.getByText(target.question).closest('article')
    expect(within(card).getByText(target.explanation)).toBeInTheDocument()
    expect(within(card).getByRole('button', { name: 'Hide answer' })).toBeInTheDocument()
    expect(card.closest('.question-list-item')).toHaveClass('focused-item')
  })
})
