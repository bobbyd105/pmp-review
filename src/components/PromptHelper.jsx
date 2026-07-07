import { useState } from 'react'
import prompts from '../../data/prompts.json'

// Static copy/paste prompt library (product brief: "copy/paste prompts
// only"). Prompts are local text data for the User to paste into an
// external AI chat — nothing here calls any API or generates content.
export default function PromptHelper() {
  const [copiedId, setCopiedId] = useState(null)

  async function handleCopy(prompt) {
    try {
      await navigator.clipboard.writeText(prompt.prompt)
      setCopiedId(prompt.id)
    } catch {
      // Clipboard unavailable — the full prompt text stays visible for
      // manual selection, so just skip the confirmation.
    }
  }

  return (
    <section className="prompt-helper" aria-label="Prompt Helper">
      <h2>Prompt Helper</h2>
      <p className="prompt-intro">
        {prompts.length} study prompts to copy into an AI chat of your choice. Replace
        the [bracketed] parts before sending. This app itself never calls an AI — these
        are plain text.
      </p>
      <ul className="prompt-list">
        {prompts.map((p) => (
          <li key={p.id}>
            <article className="prompt-card">
              <h3 className="prompt-title">{p.title}</h3>
              <p className="prompt-description">{p.description}</p>
              <pre className="prompt-text">{p.prompt}</pre>
              <button
                type="button"
                className="prompt-copy"
                onClick={() => handleCopy(p)}
              >
                {copiedId === p.id ? 'Copied!' : 'Copy prompt'}
              </button>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
