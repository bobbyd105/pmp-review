const PMBOK_MAPPING_PATTERN = /^(domain|focus|process|principle|approach|reference):\S.+/

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== ''
}

function duplicateValues(values) {
  const seen = new Set()
  const duplicates = new Set()
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value)
    seen.add(value)
  }
  return [...duplicates]
}

function ecoKey(mapping) {
  return `${mapping.domain}|||${mapping.task}`
}

export function validateCoverageCatalog(catalog, { questions, lessons, sourceIndex }) {
  const errors = []

  if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog)) {
    return ['Coverage catalog must be a JSON object.']
  }
  if (!Number.isInteger(catalog.schema_version) || catalog.schema_version < 1) {
    errors.push('schema_version must be a positive integer.')
  }
  if (!Array.isArray(catalog.coverage_ratings) || catalog.coverage_ratings.length === 0) {
    errors.push('coverage_ratings must be a non-empty array.')
  }
  if (!Array.isArray(catalog.lifecycle_statuses) || catalog.lifecycle_statuses.length === 0) {
    errors.push('lifecycle_statuses must be a non-empty array.')
  }
  if (!Array.isArray(catalog.modules) || catalog.modules.length === 0) {
    errors.push('modules must be a non-empty array.')
  }
  if (!Array.isArray(catalog.curriculum_units) || catalog.curriculum_units.length === 0) {
    errors.push('curriculum_units must be a non-empty array.')
  }
  if (errors.length > 0) return errors

  const moduleIds = catalog.modules.map((module) => module.id)
  for (const id of duplicateValues(moduleIds)) errors.push(`Duplicate module id "${id}".`)
  const sequences = catalog.modules.map((module) => module.sequence)
  for (const value of duplicateValues(sequences)) {
    errors.push(`Duplicate module sequence "${value}".`)
  }
  for (const module of catalog.modules) {
    if (!isNonEmptyString(module.id) || !isNonEmptyString(module.title)) {
      errors.push('Every module needs a non-empty id and title.')
    }
    if (!Number.isInteger(module.sequence) || module.sequence < 1) {
      errors.push(`${module.id || 'A module'} has an invalid sequence.`)
    }
  }

  const knownModules = new Set(moduleIds)
  const knownEcoMappings = new Set(questions.map((question) => ecoKey({
    domain: question.eco_domain,
    task: question.eco_task,
  })))
  const knownLessonIds = new Set(lessons.map((lesson) => lesson.id))
  const knownSourceIds = new Set(sourceIndex.sources.map((source) => source.id))
  const unitIds = catalog.curriculum_units.map((unit) => unit.id)

  for (const id of duplicateValues(unitIds)) errors.push(`Duplicate curriculum unit id "${id}".`)

  for (const unit of catalog.curriculum_units) {
    const label = unit.id || 'A curriculum unit'
    if (!isNonEmptyString(unit.id) || !isNonEmptyString(unit.title)) {
      errors.push('Every curriculum unit needs a non-empty id and title.')
    }
    if (!knownModules.has(unit.module_id)) {
      errors.push(`${label} references unknown module "${unit.module_id}".`)
    }
    if (!catalog.coverage_ratings.includes(unit.coverage_rating)) {
      errors.push(`${label} has invalid coverage_rating "${unit.coverage_rating}".`)
    }
    if (!catalog.lifecycle_statuses.includes(unit.lifecycle_status)) {
      errors.push(`${label} has invalid lifecycle_status "${unit.lifecycle_status}".`)
    }
    if (unit.lesson_type !== 'concept') {
      errors.push(`${label} has unsupported lesson_type "${unit.lesson_type}".`)
    }

    if (!Array.isArray(unit.eco_mappings) || unit.eco_mappings.length === 0) {
      errors.push(`${label} needs at least one ECO mapping.`)
    } else {
      const keys = unit.eco_mappings.map(ecoKey)
      for (const key of duplicateValues(keys)) {
        errors.push(`${label} has duplicate ECO mapping "${key}".`)
      }
      for (const mapping of unit.eco_mappings) {
        if (!isNonEmptyString(mapping.domain) || !isNonEmptyString(mapping.task)) {
          errors.push(`${label} has an incomplete ECO mapping.`)
        } else if (!knownEcoMappings.has(ecoKey(mapping))) {
          errors.push(`${label} has unknown ECO mapping "${mapping.domain} / ${mapping.task}".`)
        }
      }
    }

    if (!Array.isArray(unit.pmbok_mappings) || unit.pmbok_mappings.length === 0) {
      errors.push(`${label} needs at least one PMBOK mapping.`)
    } else {
      for (const mapping of unit.pmbok_mappings) {
        if (!isNonEmptyString(mapping) || !PMBOK_MAPPING_PATTERN.test(mapping)) {
          errors.push(`${label} has invalid PMBOK mapping "${mapping}".`)
        }
      }
      for (const mapping of duplicateValues(unit.pmbok_mappings)) {
        errors.push(`${label} has duplicate PMBOK mapping "${mapping}".`)
      }
    }

    if (!Array.isArray(unit.source_refs) || unit.source_refs.length === 0) {
      errors.push(`${label} needs at least one source reference.`)
    } else {
      for (const sourceId of unit.source_refs) {
        if (!knownSourceIds.has(sourceId)) {
          errors.push(`${label} references unknown source "${sourceId}".`)
        }
      }
      for (const sourceId of duplicateValues(unit.source_refs)) {
        errors.push(`${label} has duplicate source reference "${sourceId}".`)
      }
    }

    if (!Array.isArray(unit.existing_lesson_ids)) {
      errors.push(`${label} existing_lesson_ids must be an array.`)
    } else {
      for (const lessonId of unit.existing_lesson_ids) {
        if (!knownLessonIds.has(lessonId)) {
          errors.push(`${label} references unknown lesson "${lessonId}".`)
        }
      }
      for (const lessonId of duplicateValues(unit.existing_lesson_ids)) {
        errors.push(`${label} has duplicate lesson reference "${lessonId}".`)
      }
    }
  }

  for (const moduleId of knownModules) {
    if (!catalog.curriculum_units.some((unit) => unit.module_id === moduleId)) {
      errors.push(`Module "${moduleId}" has no curriculum units.`)
    }
  }

  return errors
}

export function getEcoAlignedQuestions(unit, questions) {
  const mappingKeys = new Set(unit.eco_mappings.map(ecoKey))
  return questions.filter((question) => mappingKeys.has(ecoKey({
    domain: question.eco_domain,
    task: question.eco_task,
  })))
}

export function getExistingLessons(unit, lessons) {
  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]))
  return unit.existing_lesson_ids.map((id) => byId.get(id)).filter(Boolean)
}

export function getCoverageSummary(catalog) {
  return {
    modules: catalog.modules.length,
    units: catalog.curriculum_units.length,
    byRating: Object.fromEntries(catalog.coverage_ratings.map((rating) => [
      rating,
      catalog.curriculum_units.filter((unit) => unit.coverage_rating === rating).length,
    ])),
    byStatus: Object.fromEntries(catalog.lifecycle_statuses.map((status) => [
      status,
      catalog.curriculum_units.filter((unit) => unit.lifecycle_status === status).length,
    ])),
  }
}

export function filterCoverageUnits(catalog, filters) {
  return catalog.curriculum_units.filter((unit) =>
    (filters.moduleId === 'all' || unit.module_id === filters.moduleId) &&
    (filters.rating === 'all' || unit.coverage_rating === filters.rating) &&
    (filters.status === 'all' || unit.lifecycle_status === filters.status),
  )
}
