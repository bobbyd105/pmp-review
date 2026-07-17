import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Course from '../components/Course.jsx'
import conceptLessons from '../../data/concept_lessons.json'
import questions from '../../data/questions.json'

describe('Course', () => {
  let errorSpy

  beforeEach(() => {
    localStorage.clear()
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('renders every concept lesson title grouped under its module', () => {
    render(<Course />)

    for (const lesson of conceptLessons) {
      expect(screen.getByText(lesson.title)).toBeInTheDocument()
    }
    for (const module of new Set(conceptLessons.map((lesson) => lesson.module))) {
      expect(screen.getAllByText(module).length).toBeGreaterThan(0)
    }
  })

  it('keeps lesson bodies collapsed until opened, then shows objectives, sections, traps, and flashcards', async () => {
    const user = userEvent.setup()
    render(<Course />)
    const lesson = conceptLessons[0]

    expect(screen.queryByText(lesson.learning_objectives[0])).not.toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: 'Open lesson' })[0])

    expect(screen.getByText(lesson.learning_objectives[0])).toBeInTheDocument()
    for (const section of lesson.sections) {
      // Section titles can also appear as flashcard terms (e.g. "Operations"),
      // so assert on the heading role specifically.
      expect(
        screen.getByRole('heading', { level: 4, name: section.title }),
      ).toBeInTheDocument()
    }
    expect(screen.getByText(lesson.exam_traps[0])).toBeInTheDocument()
    expect(screen.getAllByText(lesson.flashcards[0].term).length).toBeGreaterThan(0)
    expect(screen.getByText(lesson.flashcards[0].definition)).toBeInTheDocument()
  })

  it('runs a knowledge check: answer locked until selection, reveal shows explanation and correctness', async () => {
    const user = userEvent.setup()
    render(<Course />)
    const lesson = conceptLessons[0]
    const check = lesson.knowledge_checks[0]

    await user.click(screen.getAllByRole('button', { name: 'Open lesson' })[0])

    const checkGroup = screen.getByRole('radiogroup', { name: 'Knowledge check 1' })
    const checkContainer = checkGroup.closest('.knowledge-check')
    const checkButton = within(checkContainer).getByRole('button', {
      name: 'Check answer',
    })
    expect(checkButton).toBeDisabled()

    await user.click(within(checkGroup).getByLabelText(check.correct_answer))
    expect(checkButton).toBeEnabled()
    await user.click(checkButton)

    expect(within(checkContainer).getByText('Correct.')).toBeInTheDocument()
    expect(
      within(checkContainer).getByText(check.explanation, { exact: false }),
    ).toBeInTheDocument()
  })

  it('marks a wrong knowledge-check selection as incorrect while still teaching', async () => {
    const user = userEvent.setup()
    render(<Course />)
    const lesson = conceptLessons[0]
    const check = lesson.knowledge_checks[0]
    const wrongOption = check.options.find((option) => option !== check.correct_answer)

    await user.click(screen.getAllByRole('button', { name: 'Open lesson' })[0])
    const checkGroup = screen.getByRole('radiogroup', { name: 'Knowledge check 1' })
    const checkContainer = checkGroup.closest('.knowledge-check')

    await user.click(within(checkGroup).getByLabelText(wrongOption))
    await user.click(
      within(checkContainer).getByRole('button', { name: 'Check answer' }),
    )

    expect(within(checkContainer).getByText('Not quite.')).toBeInTheDocument()
    expect(
      within(checkContainer).getByText(check.explanation, { exact: false }),
    ).toBeInTheDocument()
  })

  it('resolves related questions to their actual bank prompts and makes them answerable', async () => {
    const user = userEvent.setup()
    render(<Course />)
    const lessonWithLinks = conceptLessons.find(
      (lesson) => lesson.related_question_ids.length > 0,
    )
    const lessonIndex = conceptLessons.indexOf(lessonWithLinks)
    const question = questions.find(
      (entry) => entry.id === lessonWithLinks.related_question_ids[0],
    )

    await user.click(
      screen.getAllByRole('button', { name: 'Open lesson' })[lessonIndex],
    )

    for (const questionId of lessonWithLinks.related_question_ids) {
      const relatedQuestion = questions.find((entry) => entry.id === questionId)
      expect(screen.getByText(relatedQuestion.question)).toBeInTheDocument()
    }

    // The first related question is answerable in place, not just readable.
    const practiceGroup = screen.getByRole('radiogroup', {
      name: `Practice question ${question.id}`,
    })
    const practiceContainer = practiceGroup.closest('.knowledge-check')
    const practiceButton = within(practiceContainer).getByRole('button', {
      name: 'Check answer',
    })
    expect(practiceButton).toBeDisabled()

    await user.click(within(practiceGroup).getByLabelText(question.correct_answer))
    await user.click(practiceButton)

    expect(within(practiceContainer).getByText('Correct.')).toBeInTheDocument()
    expect(
      within(practiceContainer).getByText(question.explanation, { exact: false }),
    ).toBeInTheDocument()
  })

  it('opens a related question directly in the Question Bank via the provided callback', async () => {
    const user = userEvent.setup()
    const onOpenQuestion = vi.fn()
    render(<Course onOpenQuestion={onOpenQuestion} />)
    const lessonWithLinks = conceptLessons.find(
      (lesson) => lesson.related_question_ids.length > 0,
    )
    const lessonIndex = conceptLessons.indexOf(lessonWithLinks)

    await user.click(
      screen.getAllByRole('button', { name: 'Open lesson' })[lessonIndex],
    )
    await user.click(screen.getAllByRole('button', { name: 'Open in Question Bank' })[0])

    expect(onOpenQuestion).toHaveBeenCalledWith(lessonWithLinks.related_question_ids[0])
  })

  it('surfaces linked formula and glossary entries with navigation into Reference', async () => {
    const user = userEvent.setup()
    const onOpenReference = vi.fn()
    const lessonWithFormula = conceptLessons.find((lesson) => lesson.formula_refs.length > 0)
    render(<Course onOpenReference={onOpenReference} />)
    const lessonIndex = conceptLessons.indexOf(lessonWithFormula)

    await user.click(screen.getAllByRole('button', { name: 'Open lesson' })[lessonIndex])

    const section = screen
      .getByRole('heading', { level: 4, name: 'Reference sheet' })
      .closest('section')
    const links = within(section).getAllByRole('button')
    expect(links.length).toBe(
      lessonWithFormula.formula_refs.length + lessonWithFormula.glossary_refs.length,
    )
    await user.click(links[0])
    expect(onOpenReference).toHaveBeenCalledWith('formulas', lessonWithFormula.formula_refs[0])
  })

  it('marks a lesson complete and shows the running completion count', async () => {
    const user = userEvent.setup()
    render(<Course />)

    expect(screen.getByText(`0 of ${conceptLessons.length} lessons marked complete.`, {
      exact: false,
    })).toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: 'Mark complete' })[0])

    expect(screen.getByText(`1 of ${conceptLessons.length} lessons marked complete.`, {
      exact: false,
    })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Completed ✓' })[0]).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('persists lesson completion and knowledge-check results across collapse, remount, and reload', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Course />)
    const lesson = conceptLessons[0]
    const check = lesson.knowledge_checks[0]

    await user.click(screen.getAllByRole('button', { name: 'Open lesson' })[0])
    await user.click(screen.getAllByRole('button', { name: 'Mark complete' })[0])

    const checkGroup = screen.getByRole('radiogroup', { name: 'Knowledge check 1' })
    await user.click(within(checkGroup).getByLabelText(check.correct_answer))
    await user.click(
      within(checkGroup.closest('.knowledge-check')).getByRole('button', {
        name: 'Check answer',
      }),
    )

    // Collapse and reopen within the same mount: state must not reset.
    await user.click(screen.getAllByRole('button', { name: 'Collapse lesson' })[0])
    await user.click(screen.getAllByRole('button', { name: 'Open lesson' })[0])
    expect(
      within(screen.getByRole('radiogroup', { name: 'Knowledge check 1' }).closest('.knowledge-check'))
        .getByText('Correct.'),
    ).toBeInTheDocument()

    // Simulate a full page refresh: unmount and render a fresh Course.
    unmount()
    render(<Course />)

    expect(screen.getAllByRole('button', { name: 'Completed ✓' })[0]).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Open lesson' })[0])
    expect(
      within(screen.getByRole('radiogroup', { name: 'Knowledge check 1' }).closest('.knowledge-check'))
        .getByText('Correct.'),
    ).toBeInTheDocument()
  })
})
