import { useState } from 'react'
import QuestionBank from './components/QuestionBank.jsx'
import Quiz from './components/Quiz.jsx'
import Dashboard from './components/Dashboard.jsx'

const VIEWS = [
  { id: 'quiz', label: 'Quiz' },
  { id: 'browse', label: 'Browse questions' },
  { id: 'dashboard', label: 'Dashboard' },
]

export default function App() {
  const [view, setView] = useState('quiz')

  return (
    <main className="app">
      <header className="app-header">
        <h1>PMP Study Platform</h1>
        <nav className="app-nav" aria-label="Main">
          {VIEWS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={view === id ? 'nav-button active' : 'nav-button'}
              aria-pressed={view === id}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>
      {view === 'quiz' && <Quiz />}
      {view === 'browse' && <QuestionBank />}
      {view === 'dashboard' && <Dashboard />}
    </main>
  )
}
