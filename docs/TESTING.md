# Testing

Automatic tests run on every push and pull request (GitHub Actions → **Tests**).

Elestio does **not** run these. A red GitHub check means do not merge.

## Commands

```sh
npm test          # unit (Vitest)
npm run test:watch
npm run test:e2e  # Playwright, starts Vite on :8080 and Express on :3001
```

First E2E on a machine: `npx playwright install chromium`

## What is covered

**Unit** (`src/utils/resumeRules.test.ts`) — download rules: personal, title case, education scores, skills (min 2), job vs internship overlap, future dates, awards, checklist Yes/NA.

**E2E** (`e2e/resume-builder.spec.ts`) — empty download blocked, happy-path popup, checklist gate, title case, GPA/Percentage in preview, job overlap blocked, internship overlap allowed, incomplete award blocked.

**Smoke export** — after the checklist is complete, Download PDF and Download Word each produce a file (`Jane_Doe_Resume.pdf` / `.docx`). Layout of the file is not checked. Needs Express on port 3001 (Playwright starts `server.cjs`).

Not covered: the six templates hidden in production.

## Adding a rule

1. Add the check in `src/utils/resumeRules.ts`.
2. Add a unit case in `src/utils/resumeRules.test.ts`.
3. If the user can hit it in the UI, add or extend a spec in `e2e/` and reuse `e2e/helpers/fillValidResume.ts`.

## Test IDs

- `header-download-pdf` / `header-download-word` — header buttons (open checklist)
- `checklist-download-pdf` / `checklist-download-word` — popup buttons (clicked only in the smoke export test)
