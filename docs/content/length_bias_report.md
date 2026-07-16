# Question Length-Bias Report

This report is generated from `data/questions.json` by
`npm run questions:report-length-bias`. It measures answer length only;
it does not change question wording.

## Summary

| Metric | Result |
|---|---:|
| Questions analyzed | 384 |
| Correct answer / average distractor ratio threshold | > 1.3 |
| Questions above ratio threshold | 110 |
| Correct answer is strictly longest | 170 (44.3%) |
| Strict-longest target | <= 40.0% |
| Status | **REMEDIATION REQUIRED** |

The strict-longest threshold is a measurement target, not a passing content
gate in this closeout. The current no-wording-edit scope requires an editorial
remediation pass before that target can be enforced as a hard regression gate.

## Flagged questions, worst first

| Question ID | Correct length | Average distractor length | Ratio | Correct is strictly longest |
|---|---:|---:|---:|---|
| q184 | 138 | 91.7 | 1.51 | Yes |
| q314 | 147 | 97.7 | 1.51 | Yes |
| q091 | 83 | 55.3 | 1.50 | Yes |
| q315 | 163 | 109.0 | 1.50 | Yes |
| q031 | 111 | 74.3 | 1.49 | Yes |
| q341 | 169 | 113.3 | 1.49 | Yes |
| q199 | 153 | 102.7 | 1.49 | Yes |
| q166 | 137 | 92.0 | 1.49 | Yes |
| q352 | 178 | 119.7 | 1.49 | Yes |
| q358 | 149 | 100.3 | 1.49 | Yes |
| q069 | 95 | 64.0 | 1.48 | Yes |
| q357 | 187 | 126.0 | 1.48 | Yes |
| q153 | 140 | 94.3 | 1.48 | Yes |
| q376 | 174 | 117.3 | 1.48 | Yes |
| q282 | 171 | 115.7 | 1.48 | Yes |
| q150 | 138 | 94.0 | 1.47 | Yes |
| q098 | 89 | 60.7 | 1.47 | Yes |
| q047 | 110 | 75.0 | 1.47 | Yes |
| q248 | 152 | 103.7 | 1.47 | Yes |
| q337 | 129 | 88.0 | 1.47 | Yes |
| q158 | 139 | 95.0 | 1.46 | Yes |
| q251 | 156 | 106.7 | 1.46 | Yes |
| q347 | 135 | 92.3 | 1.46 | Yes |
| q039 | 94 | 64.3 | 1.46 | Yes |
| q141 | 142 | 97.7 | 1.45 | Yes |
| q250 | 154 | 106.7 | 1.44 | Yes |
| q335 | 163 | 113.0 | 1.44 | Yes |
| q021 | 86 | 59.7 | 1.44 | Yes |
| q329 | 131 | 91.0 | 1.44 | Yes |
| q187 | 141 | 98.0 | 1.44 | Yes |
| q229 | 157 | 109.3 | 1.44 | Yes |
| q046 | 110 | 76.7 | 1.43 | Yes |
| q288 | 151 | 105.3 | 1.43 | Yes |
| q241 | 166 | 116.0 | 1.43 | Yes |
| q382 | 166 | 116.0 | 1.43 | Yes |
| q129 | 123 | 86.0 | 1.43 | Yes |
| q359 | 173 | 121.0 | 1.43 | Yes |
| q201 | 141 | 98.7 | 1.43 | Yes |
| q079 | 87 | 61.0 | 1.43 | Yes |
| q344 | 153 | 107.3 | 1.43 | Yes |
| q200 | 141 | 99.0 | 1.42 | Yes |
| q182 | 140 | 98.3 | 1.42 | Yes |
| q300 | 143 | 100.7 | 1.42 | Yes |
| q266 | 175 | 123.3 | 1.42 | Yes |
| q346 | 163 | 115.0 | 1.42 | Yes |
| q224 | 162 | 114.3 | 1.42 | Yes |
| q254 | 144 | 101.7 | 1.42 | Yes |
| q196 | 152 | 107.3 | 1.42 | Yes |
| q246 | 143 | 101.0 | 1.42 | Yes |
| q330 | 170 | 120.3 | 1.41 | Yes |
| q239 | 177 | 125.3 | 1.41 | Yes |
| q356 | 159 | 112.7 | 1.41 | Yes |
| q354 | 155 | 110.0 | 1.41 | Yes |
| q368 | 139 | 98.7 | 1.41 | Yes |
| q219 | 154 | 109.3 | 1.41 | Yes |
| q320 | 160 | 113.7 | 1.41 | Yes |
| q263 | 173 | 123.0 | 1.41 | Yes |
| q195 | 131 | 93.3 | 1.40 | Yes |
| q130 | 134 | 95.7 | 1.40 | Yes |
| q071 | 91 | 65.3 | 1.39 | Yes |
| q293 | 143 | 102.7 | 1.39 | Yes |
| q281 | 153 | 110.0 | 1.39 | Yes |
| q311 | 153 | 110.0 | 1.39 | Yes |
| q075 | 94 | 67.7 | 1.39 | Yes |
| q127 | 117 | 84.3 | 1.39 | Yes |
| q362 | 157 | 113.3 | 1.39 | Yes |
| q371 | 157 | 113.3 | 1.39 | Yes |
| q218 | 161 | 116.3 | 1.38 | Yes |
| q134 | 119 | 86.0 | 1.38 | Yes |
| q351 | 136 | 98.7 | 1.38 | Yes |
| q151 | 140 | 101.7 | 1.38 | Yes |
| q319 | 163 | 118.7 | 1.37 | Yes |
| q191 | 141 | 102.7 | 1.37 | Yes |
| q170 | 128 | 93.3 | 1.37 | Yes |
| q324 | 143 | 104.3 | 1.37 | Yes |
| q116 | 136 | 99.3 | 1.37 | Yes |
| q032 | 104 | 76.0 | 1.37 | Yes |
| q270 | 154 | 112.7 | 1.37 | Yes |
| q067 | 81 | 59.3 | 1.37 | Yes |
| q095 | 93 | 68.3 | 1.36 | Yes |
| q328 | 176 | 129.3 | 1.36 | Yes |
| q215 | 131 | 96.3 | 1.36 | Yes |
| q280 | 143 | 105.3 | 1.36 | Yes |
| q289 | 165 | 121.7 | 1.36 | Yes |
| q326 | 165 | 121.7 | 1.36 | Yes |
| q122 | 118 | 87.3 | 1.35 | Yes |
| q057 | 105 | 78.0 | 1.35 | Yes |
| q100 | 83 | 61.7 | 1.35 | Yes |
| q286 | 160 | 119.0 | 1.34 | Yes |
| q109 | 134 | 99.7 | 1.34 | Yes |
| q353 | 146 | 108.7 | 1.34 | Yes |
| q366 | 124 | 92.3 | 1.34 | Yes |
| q342 | 153 | 114.0 | 1.34 | Yes |
| q258 | 137 | 102.3 | 1.34 | Yes |
| q367 | 153 | 114.7 | 1.33 | Yes |
| q125 | 116 | 87.0 | 1.33 | No |
| q340 | 158 | 118.7 | 1.33 | Yes |
| q249 | 154 | 116.0 | 1.33 | Yes |
| q172 | 130 | 98.0 | 1.33 | Yes |
| q316 | 144 | 108.7 | 1.33 | Yes |
| q173 | 132 | 99.7 | 1.32 | Yes |
| q178 | 133 | 100.7 | 1.32 | Yes |
| q198 | 138 | 104.7 | 1.32 | Yes |
| q274 | 152 | 115.7 | 1.31 | Yes |
| q206 | 124 | 94.7 | 1.31 | Yes |
| q185 | 140 | 107.0 | 1.31 | Yes |
| q304 | 150 | 114.7 | 1.31 | Yes |
| q126 | 104 | 79.7 | 1.31 | Yes |
| q317 | 149 | 114.3 | 1.30 | Yes |
| q291 | 152 | 116.7 | 1.30 | Yes |
