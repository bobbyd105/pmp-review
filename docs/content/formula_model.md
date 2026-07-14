# Formula Model

## Purpose

Formulas are shared knowledge objects with interpretation, assumptions, and
decision guidance. A formula record is not complete when it merely stores an
equation. It must help a learner choose the formula, apply compatible units,
interpret the result, and avoid common mistakes.

`data/formula_catalog.json` contains representative formulas for schema and
relationship validation. It is not a complete formula sheet and every record
requires independent technical review before production use.

## Formula contract

```json
{
  "id": "F-CPI",
  "name": "Cost performance index",
  "formula": "EV / AC",
  "variables": [
    { "symbol": "EV", "meaning": "earned value" },
    { "symbol": "AC", "meaning": "actual cost" }
  ],
  "interpretation": "Cost efficiency at the status date.",
  "comparison_guidance": {
    "greater_than": "Above 1.0 is favorable.",
    "less_than": "Below 1.0 is unfavorable."
  },
  "memory_tips": ["Cost compares earned value with actual cost."],
  "common_mistakes": ["Reversing the numerator and denominator."],
  "related_lesson_ids": ["PL-C038"],
  "related_question_ids": [],
  "related_glossary_ids": ["G-EARNED-VALUE"]
}
```

Production records should add units, rounding rules, formula family/variant,
selection assumptions, worked-example IDs, source-review metadata, status,
version, edition scope, and reviewer history.

## Required interpretation dimensions

1. **Selection** — when this formula is appropriate.
2. **Variables** — names, units, and status-date meaning.
3. **Direction** — what higher, lower, positive, negative, or zero means.
4. **Assumptions** — especially for EAC variants and stable-flow formulas.
5. **Decision implication** — what evidence suggests, without prescribing a
   context-free action.
6. **Common mistakes** — reversed ratios, sign errors, unit mixing, and
   choosing a variant without reading assumptions.

## Formula families

- schedule networks, float, and PERT;
- earned value, variance, and forecasts;
- project-selection and financial metrics;
- risk and decision-tree measures;
- communication channels;
- adaptive flow metrics.

Variants must have independent IDs when their assumptions materially differ.
For example, multiple EAC formulas should not be hidden in one ambiguous
record.

## Greater-than / less-than guidance

Direction guidance is required but must be contextual. CPI above 1.0 is
favorable cost efficiency; an EAC above BAC forecasts an overrun. “Higher is
better” is not a reusable rule across formulas.

## Worked examples

Worked examples are separate instructional assets linked to a formula and an
objective. Each uses original values, explicit units, visible steps, a result,
interpretation, decision implication, and independently verified arithmetic.
The representative catalog does not create production worked examples.

## Validation and review

Automated checks can validate IDs, fields, variable uniqueness, relationship
integrity, and formula/reference coverage. Technical review must verify the
equation, assumptions, units, rounding, variants, and interpretation. Source
review confirms terminology and edition alignment; User review controls
approval.
