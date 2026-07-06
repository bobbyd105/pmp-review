import { useState } from 'react'
import { loadHistory, getAggregateStats } from '../quiz/quizHistory.js'

function formatPercent(value) {
  return `${Math.round(value)}%`
}

function formatDate(isoString) {
  const date = new Date(isoString)
  return Number.isNaN(date.getTime()) ? isoString : date.toLocaleString()
}

export default function Dashboard() {
  // History is read once per mount; completing a quiz and navigating here
  // remounts the view, so the data is always current.
  const [history] = useState(loadHistory)

  if (history.length === 0) {
    return (
      <section className="dashboard" aria-label="Dashboard">
        <h2>Dashboard</h2>
        <p className="dashboard-empty">
          No quiz history yet. Complete a quiz and your results will show up
          here.
        </p>
      </section>
    )
  }

  const stats = getAggregateStats(history)
  const latest = history[history.length - 1]

  return (
    <section className="dashboard" aria-label="Dashboard">
      <h2>Dashboard</h2>

      <dl className="dashboard-stats">
        <div className="dashboard-stat">
          <dt>Quizzes taken</dt>
          <dd>{stats.totalQuizzes}</dd>
        </div>
        <div className="dashboard-stat">
          <dt>Overall accuracy</dt>
          <dd>{formatPercent(stats.overallAccuracy)}</dd>
        </div>
        <div className="dashboard-stat">
          <dt>Questions answered</dt>
          <dd>{stats.total}</dd>
        </div>
      </dl>

      <h3>Accuracy by ECO domain</h3>
      <table className="dashboard-domains">
        <thead>
          <tr>
            <th>Domain</th>
            <th>Correct</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(stats.domainAccuracy).map(([domain, tally]) => (
            <tr key={domain}>
              <td>{domain}</td>
              <td>
                {tally.correct}/{tally.total}
              </td>
              <td>{formatPercent(tally.accuracy)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Most recent quiz</h3>
      <div className="dashboard-latest">
        <p>
          <strong>
            Score: {latest.score}/{latest.total}
          </strong>{' '}
          — {formatDate(latest.completedAt)}
        </p>
        <ul className="dashboard-latest-domains">
          {Object.entries(latest.domains).map(([domain, tally]) => (
            <li key={domain}>
              {domain}: {tally.correct}/{tally.total}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
