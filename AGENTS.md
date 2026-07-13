# AGENTS.md

Before any implementation task, read in this order:
1. docs/ai_collaboration_agreement.md
2. docs/project_constitution.md
3. docs/progress.md
4. docs/app-map.html
5. The relevant .agent-skills/ file for this task (if one exists)

Steps 1-4 are lightweight orientation. Do not read the full codebase by
default — use docs/app-map.html to identify which specific files are
relevant to the current task, then read only those.

Before making any code changes, state:
- The current project state
- The slice being changed
- Files expected to be touched
- Risks or ambiguities
- Validation plan

No code changes may begin until this context load is complete.

Definition of Done order: Code -> Tests -> Docs -> Map -> Commit. Do not
commit until docs/progress.md and docs/app-map.html are updated to reflect
the change.

## Standard content batch checklist

Whenever new questions or lessons are added to data/questions.json or
data/lessons.json, run these steps in order without being asked for each
one individually:

1. Reformat both files to consistent 2-space JSON indentation:
   node -e "const fs=require('fs'); for (const f of ['data/questions.json','data/lessons.json']) { const d=JSON.parse(fs.readFileSync(f)); fs.writeFileSync(f, JSON.stringify(d,null,2)+'\n'); }"

2. Regenerate every lesson's related_question_ids by matching eco_domain +
   eco_task against the current questions.json — do not hand-maintain this:
   node -e "const fs=require('fs'); const q=JSON.parse(fs.readFileSync('data/questions.json')); const l=JSON.parse(fs.readFileSync('data/lessons.json')); for (const lesson of l) { lesson.related_question_ids = q.filter(x=>x.eco_domain===lesson.eco_domain&&x.eco_task===lesson.eco_task).map(x=>x.id).sort(); } fs.writeFileSync('data/lessons.json', JSON.stringify(l,null,2)+'\n');"

3. Run npm test. All data-contract and referential-integrity tests must
   pass with zero test-file changes. Report any failure rather than
   working around it.

4. Update docs/content_plan.md and docs/progress.md with real counts
   pulled directly from the files — never estimate or carry forward a
   stale number.

5. Commit with a message describing what content was added, push, and
   open a draft PR against main. Never leave a content batch as an
   unopened pushed branch.

This checklist applies every time content is added, regardless of how
briefly the request is phrased.
