import { describe, it, expect } from 'vitest'
import prompts from '../../data/prompts.json'

const REQUIRED_FIELDS = ['id', 'title', 'description', 'prompt']

describe('prompts.json data contract', () => {
  it('contains at least 5 prompts', () => {
    expect(prompts.length).toBeGreaterThanOrEqual(5)
  })

  it('has every required field populated as a non-empty string', () => {
    for (const p of prompts) {
      for (const field of REQUIRED_FIELDS) {
        expect(p[field], `${p.id} is missing "${field}"`).toBeTruthy()
        expect(typeof p[field]).toBe('string')
        expect(p[field].trim()).not.toBe('')
      }
    }
  })

  it('has unique prompt ids', () => {
    const ids = prompts.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has substantive prompt text, not placeholders for the library itself', () => {
    for (const p of prompts) {
      expect(p.prompt.length, `${p.id} prompt is too short to be useful`).toBeGreaterThan(100)
      expect(p.prompt.toLowerCase()).not.toContain('lorem ipsum')
    }
  })

  it('is static text only — no URLs or API endpoints to call', () => {
    for (const p of prompts) {
      expect(p.prompt, `${p.id} must not embed a URL`).not.toMatch(/https?:\/\//)
    }
  })
})
