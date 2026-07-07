import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContentStudio from '../components/ContentStudio.jsx'
import questions from '../../data/questions.json'
import lessons from '../../data/lessons.json'

let consoleErrorSpy

beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error')
})

afterEach(() => {
  expect(consoleErrorSpy).not.toHaveBeenCalled()
  consoleErrorSpy.mockRestore()
})

const validQuestion = {
  id: 'q901',
  eco_domain: 'People',
  eco_task: 'Task 2: Lead a team',
  question: 'The team misses two standups in a row. What should the PM do first?',
  options: ['Mandate attendance', 'Ask the team why', 'Cancel standups'],
  correct_answer: 'Ask the team why',
  explanation: 'Servant leadership starts with understanding the impediment.',
}

const validLesson = {
  id: 'l901',
  eco_domain: 'Business Environment',
  eco_task: 'Task 1: Plan and manage project compliance',
  title: 'Compliance as a constraint, not an afterthought',
  body:
    'Compliance requirements — regulatory, legal, contractual, or organizational — are ' +
    'constraints that shape the plan from day one, not a checklist appended at closing. ' +
    'The project manager identifies which requirements apply, classifies them by ' +
    'consequence of breach, and builds the response into scope, schedule, and quality ' +
    'baselines. On the exam, answers that treat compliance as negotiable or deferrable ' +
    'are traps: escalation paths and audit trails exist precisely because these ' +
    'obligations outrank convenience. Measure compliance the way you measure any other ' +
    'requirement — with verifiable evidence, tracked continuously.',
  related_question_ids: [questions[0].id],
}

async function paste(user, text) {
  const input = screen.getByLabelText(/JSON/i)
  await user.clear(input)
  // paste() avoids userEvent.type's special-character parsing of { and [.
  await user.click(input)
  await user.paste(text)
}

describe('ContentStudio', () => {
  it('renders the type toggle, input, and validate button', () => {
    render(<ContentStudio />)
    expect(screen.getByRole('radio', { name: 'Question' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Lesson' })).not.toBeChecked()
    expect(screen.getByLabelText(/JSON/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Validate' })).toBeInTheDocument()
  })

  it('states up front that it never writes to the data files', () => {
    render(<ContentStudio />)
    expect(screen.getByText(/never writes to the data files/i)).toBeInTheDocument()
  })

  it('shows a specific parse error for malformed JSON', async () => {
    const user = userEvent.setup()
    render(<ContentStudio />)
    await paste(user, '{"id": oops}')
    await user.click(screen.getByRole('button', { name: 'Validate' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/not valid json/i)
  })

  it('names the exact missing field on invalid question input', async () => {
    const user = userEvent.setup()
    render(<ContentStudio />)
    const { explanation, ...missing } = validQuestion
    await paste(user, JSON.stringify(missing))
    await user.click(screen.getByRole('button', { name: 'Validate' }))
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Missing required field "explanation".',
    )
  })

  it('names a duplicate id against the existing bank', async () => {
    const user = userEvent.setup()
    render(<ContentStudio />)
    await paste(user, JSON.stringify({ ...validQuestion, id: questions[0].id }))
    await user.click(screen.getByRole('button', { name: 'Validate' }))
    expect(screen.getByRole('alert')).toHaveTextContent(
      `Duplicate id "${questions[0].id}"`,
    )
  })

  it('on a valid question: shows the snippet, the target file, and that nothing was saved', async () => {
    const user = userEvent.setup()
    render(<ContentStudio />)
    await paste(user, JSON.stringify(validQuestion))
    await user.click(screen.getByRole('button', { name: 'Validate' }))
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Nothing has been saved.')
    expect(status).toHaveTextContent('data/questions.json')
    expect(status.querySelector('.studio-snippet').textContent).toContain('"q901"')
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('validates lessons against lesson rules, pointing at data/lessons.json', async () => {
    const user = userEvent.setup()
    render(<ContentStudio />)
    await user.click(screen.getByRole('radio', { name: 'Lesson' }))
    await paste(user, JSON.stringify(validLesson))
    await user.click(screen.getByRole('button', { name: 'Validate' }))
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('data/lessons.json')
    expect(status).toHaveTextContent('Nothing has been saved.')
  })

  it('reports a dangling related_question_ids entry on lesson input', async () => {
    const user = userEvent.setup()
    render(<ContentStudio />)
    await user.click(screen.getByRole('radio', { name: 'Lesson' }))
    await paste(
      user,
      JSON.stringify({ ...validLesson, related_question_ids: ['q999'] }),
    )
    await user.click(screen.getByRole('button', { name: 'Validate' }))
    expect(screen.getByRole('alert')).toHaveTextContent(
      'related_question_ids references "q999", which does not exist in data/questions.json.',
    )
  })

  it('copies the snippet to the clipboard', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    render(<ContentStudio />)
    await paste(user, JSON.stringify(validQuestion))
    await user.click(screen.getByRole('button', { name: 'Validate' }))
    await user.click(screen.getByRole('button', { name: 'Copy snippet' }))
    expect(writeText).toHaveBeenCalledTimes(1)
    expect(JSON.parse(writeText.mock.calls[0][0])).toEqual(validQuestion)
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument()
  })

  it('clears a stale result when the input changes', async () => {
    const user = userEvent.setup()
    render(<ContentStudio />)
    await paste(user, JSON.stringify(validQuestion))
    await user.click(screen.getByRole('button', { name: 'Validate' }))
    expect(screen.getByRole('status')).toBeInTheDocument()
    await user.click(screen.getByLabelText(/JSON/i))
    await user.paste(' ')
    expect(screen.queryByRole('status')).toBeNull()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('does not touch existing data during validation (additive only)', async () => {
    const before = { q: JSON.stringify(questions), l: JSON.stringify(lessons) }
    const user = userEvent.setup()
    render(<ContentStudio />)
    await paste(user, JSON.stringify(validQuestion))
    await user.click(screen.getByRole('button', { name: 'Validate' }))
    expect(JSON.stringify(questions)).toBe(before.q)
    expect(JSON.stringify(lessons)).toBe(before.l)
  })
})
