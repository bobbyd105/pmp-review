import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Reference from '../components/Reference.jsx'
import formulaCatalog from '../../data/formula_catalog.json'
import glossaryCatalog from '../../data/glossary_catalog.json'

describe('Reference', () => {
  let errorSpy

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('renders every formula with its equation, variables, and guidance by default', () => {
    render(<Reference />)

    for (const formula of formulaCatalog.formulas) {
      expect(screen.getByText(formula.name)).toBeInTheDocument()
      expect(screen.getByText(formula.formula)).toBeInTheDocument()
      expect(screen.getByText(formula.interpretation)).toBeInTheDocument()
    }
  })

  it('switches to the glossary and renders every term with confusion and trap guidance', async () => {
    const user = userEvent.setup()
    render(<Reference />)

    await user.click(
      screen.getByRole('button', {
        name: `Glossary (${glossaryCatalog.entries.length})`,
      }),
    )

    for (const entry of glossaryCatalog.entries) {
      expect(screen.getByText(entry.term)).toBeInTheDocument()
      expect(screen.getByText(entry.definition)).toBeInTheDocument()
      expect(screen.getByText(entry.common_confusion)).toBeInTheDocument()
      expect(screen.getByText(entry.exam_trap)).toBeInTheDocument()
    }
  })

  it('filters formulas by name', async () => {
    const user = userEvent.setup()
    render(<Reference />)

    await user.type(screen.getByLabelText('Filter'), 'to-complete')

    expect(screen.getByText('To-complete performance index')).toBeInTheDocument()
    expect(screen.queryByText('Net present value')).not.toBeInTheDocument()
  })

  it('shows an empty-state message when no entry matches the filter', async () => {
    const user = userEvent.setup()
    render(<Reference />)

    await user.type(screen.getByLabelText('Filter'), 'zzzznomatch')

    expect(screen.getByText('No formulas match the filter.')).toBeInTheDocument()
  })
})
