import { useState } from 'react'
import questions from '../../data/questions.json'
import lessons from '../../data/lessons.json'
import {
  parseEntry,
  validateNewQuestion,
  validateNewLesson,
  toSnippet,
  QUESTION_FIELDS,
  LESSON_FIELDS,
} from '../studio/contentValidator.js'

const CONTENT_TYPES = {
  question: {
    label: 'Question',
    file: 'data/questions.json',
    validate: (entry) => validateNewQuestion(entry, { questions, lessons }),
    fieldOrder: QUESTION_FIELDS,
    placeholder: `Paste one question as a JSON object, e.g.
{
  "id": "q013",
  "eco_domain": "People",
  "eco_task": "Task 1: Manage conflict",
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "correct_answer": "...",
  "explanation": "..."
}`,
  },
  lesson: {
    label: 'Lesson',
    file: 'data/lessons.json',
    validate: (entry) => validateNewLesson(entry, { questions, lessons }),
    fieldOrder: LESSON_FIELDS,
    placeholder: `Paste one lesson as a JSON object, e.g.
{
  "id": "l004",
  "eco_domain": "Process",
  "eco_task": "Task 5: Plan and manage budget and resources",
  "title": "...",
  "body": "... (more than 500 characters)",
  "related_question_ids": ["q001"]
}`,
  },
}

export default function ContentStudio() {
  const [contentType, setContentType] = useState('question')
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const config = CONTENT_TYPES[contentType]

  function reset() {
    setResult(null)
    setCopied(false)
  }

  function handleValidate() {
    setCopied(false)
    const parsed = parseEntry(text)
    if (parsed.parseError) {
      setResult({ status: 'invalid', errors: [parsed.parseError] })
      return
    }
    const errors = config.validate(parsed.entry)
    if (errors.length > 0) {
      setResult({ status: 'invalid', errors })
    } else {
      setResult({ status: 'valid', snippet: toSnippet(parsed.entry, config.fieldOrder) })
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.snippet)
      setCopied(true)
    } catch {
      // Clipboard unavailable (e.g. insecure context) — the snippet stays
      // visible for manual selection, so just skip the confirmation.
    }
  }

  return (
    <section className="content-studio" aria-label="Content Studio">
      <h2>Content Studio</h2>
      <p className="studio-intro">
        Validates a new {config.label.toLowerCase()} against the same rules as the data
        tests. This tool never writes to the data files — on success it gives you a
        snippet to paste into <code>{config.file}</code> yourself.
      </p>
      <fieldset className="studio-type">
        <legend>Content type</legend>
        {Object.entries(CONTENT_TYPES).map(([id, { label }]) => (
          <label key={id}>
            <input
              type="radio"
              name="content-type"
              value={id}
              checked={contentType === id}
              onChange={() => {
                setContentType(id)
                reset()
              }}
            />
            {label}
          </label>
        ))}
      </fieldset>
      <label className="studio-input-label" htmlFor="studio-input">
        New {config.label.toLowerCase()} JSON
      </label>
      <textarea
        id="studio-input"
        className="studio-input"
        rows={12}
        placeholder={config.placeholder}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          reset()
        }}
      />
      <button type="button" className="studio-validate" onClick={handleValidate}>
        Validate
      </button>

      {result?.status === 'invalid' && (
        <div className="studio-errors" role="alert">
          <h3>Not valid — fix these and validate again</h3>
          <ul>
            {result.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {result?.status === 'valid' && (
        <div className="studio-valid" role="status">
          <h3>Valid {config.label.toLowerCase()} — ready to paste</h3>
          <p className="studio-not-saved">
            <strong>Nothing has been saved.</strong> Copy the snippet below and add it as
            a new entry at the end of the array in <code>{config.file}</code>, then run
            the tests. Existing entries are never touched.
          </p>
          <pre className="studio-snippet">{result.snippet}</pre>
          <button type="button" className="studio-copy" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy snippet'}
          </button>
        </div>
      )}
    </section>
  )
}
