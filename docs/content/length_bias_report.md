# Question Length-Bias Report

This report is generated from `data/questions.json` by
`npm run questions:report-length-bias`. It measures answer length only;
it does not change question wording.

## Summary

| Metric | Result |
|---|---:|
| Questions analyzed | 424 |
| Correct answer / average distractor ratio threshold | > 1.3 |
| Questions above ratio threshold | 0 |
| Correct answer is strictly longest | 78 (18.4%) |
| Strict-longest target | <= 40.0% |
| Status | **WITHIN TARGET** |

The strict-longest target is enforced as a hard regression gate by
`src/__tests__/lengthBias.test.js` following the 2026-07 editorial
remediation pass: no future content batch may push the bank back above it,
and no question may exceed the correct/average-distractor ratio threshold.

## Flagged questions, worst first

| Question ID | Correct length | Average distractor length | Ratio | Correct is strictly longest |
|---|---:|---:|---:|---|
| None | - | - | - | - |
