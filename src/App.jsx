import { useState } from 'react'
import QuestionBank from './components/QuestionBank.jsx'
import Quiz from './components/Quiz.jsx'
import Dashboard from './components/Dashboard.jsx'
import Course from './components/Course.jsx'
import Lessons from './components/Lessons.jsx'
import ContentStudio from './components/ContentStudio.jsx'
import PromptHelper from './components/PromptHelper.jsx'
import CurriculumCoverage from './components/CurriculumCoverage.jsx'

const VIEWS = [
  { id: 'quiz', label: 'Quiz' },
  { id: 'course', label: 'Course' },
  { id: 'browse', label: 'Browse questions' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'lessons', label: 'Lessons' },
  { id: 'studio', label: 'Content Studio' },
  { id: 'prompts', label: 'Prompt Helper' },
  { id: 'coverage', label: 'Curriculum Coverage' },
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
      {view === 'course' && <Course />}
      {view === 'browse' && <QuestionBank />}
      {view === 'dashboard' && <Dashboard />}
      {view === 'lessons' && <Lessons />}
      {view === 'studio' && <ContentStudio />}
      {view === 'prompts' && <PromptHelper />}
      {view === 'coverage' && <CurriculumCoverage />}
    </main>
  )
}
