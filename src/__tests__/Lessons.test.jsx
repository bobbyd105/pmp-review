import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Lessons from '../components/Lessons.jsx'
import lessons from '../../data/lessons.json'
import questions from '../../data/questions.json'

const questionsById = new Map(questions.map((q) => [q.id, q]))

let consoleErrorSpy

beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error')
})

afterEach(() => {
  expect(consoleErrorSpy).not.toHaveBeenCalled()
  consoleErrorSpy.mockRestore()
})

describe('Lessons', () => {
  it('renders every lesson with title and domain/task tags', () => {
    render(<Lessons />)
    for (const lesson of lessons) {
      const title = screen.getByText(lesson.title)
      expect(title).toBeInTheDocument()
      const card = title.closest('article')
      expect(within(card).getByText(lesson.eco_domain)).toBeInTheDocument()
      expect(within(card).getByText(lesson.eco_task)).toBeInTheDocument()
    }
  })

  it('shows the lesson count', () => {
    render(<Lessons />)
    expect(screen.getByText(`${lessons.length} lessons loaded`)).toBeInTheDocument()
  })

  it('renders body content for every lesson', () => {
    render(<Lessons />)
    for (const lesson of lessons) {
      const card = screen.getByText(lesson.title).closest('article')
      const body = card.querySelector('.lesson-body')
      // The rendered body must carry the lesson's actual text (markdown
      // markers stripped), not a summary or placeholder.
      const plain = lesson.body.replace(/\*\*/g, '').replace(/^- /gm, '')
      const firstSentence = plain.split(/[.!?]/)[0]
      expect(body.textContent).toContain(firstSentence)
      expect(body.textContent.length).toBeGreaterThan(plain.length * 0.9)
    }
  })

  it('renders the markdown subset: bold as <strong> and "- " blocks as list items', () => {
    render(<Lessons />)
    const lesson = lessons.find((l) => l.body.includes('**') && l.body.includes('\n- '))
    expect(lesson).toBeTruthy()
    const card = screen.getByText(lesson.title).closest('article')
    const body = card.querySelector('.lesson-body')
    expect(body.querySelectorAll('strong').length).toBeGreaterThan(0)
    expect(body.querySelectorAll('ul li').length).toBeGreaterThan(0)
    // No raw markdown markers leak into the rendered text.
    expect(body.textContent).not.toContain('**')
  })

  it('renders each related question as the actual prompt from questions.json', () => {
    render(<Lessons />)
    for (const lesson of lessons) {
      const card = screen.getByText(lesson.title).closest('article')
      const relatedIds = lesson.related_question_ids ?? []
      if (relatedIds.length === 0) {
        expect(card.querySelector('.lesson-related')).toBeNull()
        continue
      }
      const related = card.querySelector('.lesson-related')
      expect(related).not.toBeNull()
      expect(related.querySelectorAll('li')).toHaveLength(relatedIds.length)
      for (const id of relatedIds) {
        const question = questionsById.get(id)
        expect(question, `test setup: ${id} missing from bank`).toBeTruthy()
        expect(within(card).getByText(question.question)).toBeInTheDocument()
      }
    }
  })
})
