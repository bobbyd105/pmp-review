import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CurriculumCoverage from '../components/CurriculumCoverage.jsx'

describe('CurriculumCoverage', () => {
  it('renders read-only summary counts and all units', () => {
    render(<CurriculumCoverage />)
    expect(screen.getByRole('heading', { name: 'Curriculum Coverage' })).toBeInTheDocument()
    expect(screen.getByText('Showing 59 of 59 concept units')).toBeInTheDocument()
    expect(screen.getByText(/broad ECO alignment/i)).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('shows mappings, lesson titles, source references, and derived counts', () => {
    render(<CurriculumCoverage />)
    const card = screen.getByRole('heading', { name: /C044 — Conflict Resolution/ }).closest('article')
    expect(within(card).getByText(/People — Task 2: Manage conflicts/)).toBeInTheDocument()
    expect(within(card).getByText(/l001 — Managing Team Conflict/)).toBeInTheDocument()
    expect(within(card).getByText(/S9 — 09_Agile\+Mindset/)).toBeInTheDocument()
    expect(within(card).getByText('33')).toBeInTheDocument()
  })

  it('filters by module, coverage strength, and lifecycle status', async () => {
    const user = userEvent.setup()
    render(<CurriculumCoverage />)
    await user.selectOptions(screen.getByLabelText('Module'), 'M13')
    await user.selectOptions(screen.getByLabelText('Coverage strength'), 'Missing')
    await user.selectOptions(screen.getByLabelText('Lifecycle status'), 'Planned')
    expect(screen.getByText('Showing 4 of 59 concept units')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /C056 — AI Foundations/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /C059 — AI Use Cases/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /C001 —/ })).toBeNull()
  })
})
