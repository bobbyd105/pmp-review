import { useState } from 'react'
import QuestionBank from './components/QuestionBank.jsx'
import Quiz from './components/Quiz.jsx'

export default function App() {
  const [view, setView] = useState('quiz')

  return (
    <main className="app">
      <header className="app-header">
        <h1>PMP Study Platform</h1>
        <nav className="app-nav" aria-label="Main">
          <button
            type="button"
            className={view === 'quiz' ? 'nav-button active' : 'nav-button'}
            aria-pressed={view === 'quiz'}
            onClick={() => setView('quiz')}
          >
            Quiz
          </button>
          <button
            type="button"
            className={view === 'browse' ? 'nav-button active' : 'nav-button'}
            aria-pressed={view === 'browse'}
            onClick={() => setView('browse')}
          >
            Browse questions
          </button>
        </nav>
      </header>
      {view === 'quiz' ? <Quiz /> : <QuestionBank />}
    </main>
  )
}
