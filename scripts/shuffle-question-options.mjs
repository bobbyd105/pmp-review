import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const DEFAULT_SEED = 'pmp-options-v1'

function hash(value) {
  let result = 0x811c9dc5

  for (const character of value) {
    result ^= character.codePointAt(0)
    result = Math.imul(result, 0x01000193)
  }

  return result >>> 0
}

function compareBySeed(seed, left, right) {
  const leftHash = hash(`${seed}\0${left}`)
  const rightHash = hash(`${seed}\0${right}`)
  return leftHash - rightHash || left.localeCompare(right)
}

export function reorderQuestions(questions, seed = DEFAULT_SEED) {
  const ids = questions.map((question) => question.id)
  if (new Set(ids).size !== ids.length) {
    throw new Error('Question ids must be unique before options can be reordered.')
  }

  const targetPositionById = new Map()
  const questionsByOptionCount = new Map()
  for (const question of questions) {
    const optionCount = question.options.length
    questionsByOptionCount.set(optionCount, [
      ...(questionsByOptionCount.get(optionCount) ?? []),
      question,
    ])
  }

  for (const [optionCount, group] of questionsByOptionCount) {
    if (optionCount < 2) {
      throw new Error('Every question must have at least two options.')
    }

    const seededOrder = [...group].sort((left, right) =>
      compareBySeed(`${seed}\0question`, left.id, right.id),
    )

    seededOrder.forEach((question, index) => {
      targetPositionById.set(question.id, index % optionCount)
    })
  }

  return questions.map((question) => {
    const correctMatches = question.options.filter(
      (option) => option === question.correct_answer,
    )
    if (correctMatches.length !== 1) {
      throw new Error(
        `${question.id} must contain its correct_answer exactly once in options.`,
      )
    }

    const distractors = question.options
      .filter((option) => option !== question.correct_answer)
      .sort((left, right) =>
        compareBySeed(`${seed}\0${question.id}\0distractor`, left, right),
      )

    const options = [...distractors]
    options.splice(targetPositionById.get(question.id), 0, question.correct_answer)

    return { ...question, options }
  })
}

export function getCorrectPositionCounts(questions) {
  return questions.reduce((counts, question) => {
    const position = question.options.indexOf(question.correct_answer)
    counts[position] = (counts[position] ?? 0) + 1
    return counts
  }, {})
}

function readSeed(args) {
  const equalsArgument = args.find((argument) => argument.startsWith('--seed='))
  if (equalsArgument) return equalsArgument.slice('--seed='.length)

  const seedIndex = args.indexOf('--seed')
  return seedIndex >= 0 ? args[seedIndex + 1] : DEFAULT_SEED
}

function main() {
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const questionsPath = path.join(repositoryRoot, 'data', 'questions.json')
  const seed = readSeed(process.argv.slice(2))

  if (!seed) throw new Error('The seed must not be empty.')

  const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'))
  const reordered = reorderQuestions(questions, seed)
  fs.writeFileSync(questionsPath, `${JSON.stringify(reordered, null, 2)}\n`)

  console.log(`Reordered ${reordered.length} questions with seed "${seed}".`)
  console.log(`Correct-answer positions: ${JSON.stringify(getCorrectPositionCounts(reordered))}`)
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
  main()
}
