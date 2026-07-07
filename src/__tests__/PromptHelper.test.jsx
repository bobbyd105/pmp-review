import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PromptHelper from '../components/PromptHelper.jsx'
import prompts from '../../data/prompts.json'

let consoleErrorSpy

beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error')
})

afterEach(() => {
  expect(consoleErrorSpy).not.toHaveBeenCalled()
  consoleErrorSpy.mockRestore()
})

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue()
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
  return writeText
}

describe('PromptHelper', () => {
  it('renders every prompt with title, description, and full text', () => {
    render(<PromptHelper />)
    for (const p of prompts) {
      const card = screen.getByText(p.title).closest('article')
      expect(within(card).getByText(p.description)).toBeInTheDocument()
      expect(card.querySelector('.prompt-text').textContent).toBe(p.prompt)
    }
  })

  it('shows the prompt count and the no-AI-call disclosure', () => {
    render(<PromptHelper />)
    expect(
      screen.getByText(new RegExp(`${prompts.length} study prompts`)),
    ).toBeInTheDocument()
    expect(screen.getByText(/never calls an AI/i)).toBeInTheDocument()
  })

  it('has one copy button per prompt', () => {
    render(<PromptHelper />)
    expect(screen.getAllByRole('button', { name: 'Copy prompt' })).toHaveLength(
      prompts.length,
    )
  })

  it('copies the exact prompt text to the clipboard with feedback', async () => {
    // setup() first: userEvent installs its own clipboard stub, which the
    // mock must override, not the other way around.
    const user = userEvent.setup()
    const writeText = mockClipboard()
    render(<PromptHelper />)
    const card = screen.getByText(prompts[1].title).closest('article')
    await user.click(within(card).getByRole('button', { name: 'Copy prompt' }))
    expect(writeText).toHaveBeenCalledExactlyOnceWith(prompts[1].prompt)
    expect(within(card).getByRole('button', { name: 'Copied!' })).toBeInTheDocument()
  })

  it('moves the Copied! feedback when a different prompt is copied', async () => {
    const user = userEvent.setup()
    mockClipboard()
    render(<PromptHelper />)
    const first = screen.getByText(prompts[0].title).closest('article')
    const second = screen.getByText(prompts[1].title).closest('article')
    await user.click(within(first).getByRole('button', { name: 'Copy prompt' }))
    await user.click(within(second).getByRole('button', { name: 'Copy prompt' }))
    expect(within(second).getByRole('button', { name: 'Copied!' })).toBeInTheDocument()
    expect(within(first).getByRole('button', { name: 'Copy prompt' })).toBeInTheDocument()
  })
})
