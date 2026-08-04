import { useState } from 'react'
import QuestionBank from './components/QuestionBank.jsx'
import Quiz from './components/Quiz.jsx'
import Dashboard from './components/Dashboard.jsx'
import Course from './components/Course.jsx'
import Lessons from './components/Lessons.jsx'
import ContentStudio from './components/ContentStudio.jsx'
import PromptHelper from './components/PromptHelper.jsx'
import CurriculumCoverage from './components/CurriculumCoverage.jsx'
import Reference from './components/Reference.jsx'

const VIEWS = [
  { id: 'quiz', label: 'Quiz' },
  { id: 'course', label: 'Course' },
  { id: 'reference', label: 'Reference' },
  { id: 'browse', label: 'Browse questions' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'lessons', label: 'Lessons' },
  { id: 'studio', label: 'Content Studio' },
  { id: 'prompts', label: 'Prompt Helper' },
  { id: 'coverage', label: 'Curriculum Coverage' },
]

export default function App() {
  const [view, setView] = useState('quiz')
  // A real handoff from the Course into the existing quiz/question-bank
  // experience: opening a related practice question or reference entry from
  // a lesson switches views and scrolls straight to it.
  const [focusQuestionId, setFocusQuestionId] = useState(null)
  const [focusReference, setFocusReference] = useState(null)

  const navigateTo = (id) => {
    setView(id)
    if (id !== 'browse') setFocusQuestionId(null)
    if (id !== 'reference') setFocusReference(null)
  }

  const openQuestion = (questionId) => {
    setFocusQuestionId(questionId)
    setView('browse')
  }

  const openReference = (section, id) => {
    setFocusReference({ section, id })
    setView('reference')
  }

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
              onClick={() => navigateTo(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>
      {view === 'quiz' && <Quiz />}
      {view === 'course' && <Course onOpenQuestion={openQuestion} onOpenReference={openReference} />}
      {view === 'reference' && <Reference focusEntry={focusReference} />}
      {view === 'browse' && <QuestionBank focusQuestionId={focusQuestionId} />}
      {view === 'dashboard' && <Dashboard />}
      {view === 'lessons' && <Lessons />}
      {view === 'studio' && <ContentStudio />}
      {view === 'prompts' && <PromptHelper />}
      {view === 'coverage' && <CurriculumCoverage />}
    </main>
  )
}
