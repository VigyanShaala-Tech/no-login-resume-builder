# Resume Builder — Plan

## Product roadmap requirements

### 1. Download & Export
- Allow download in **PDF** and **Word** formats.

### 2. Writing Assistance
- **Spellcheck & Grammar Assist** inside the editor for summary, descriptions, and other text fields.

### 3. Education section enhancements
- **“Ongoing / Currently Studying Here”** (same idea as “Currently Working Here” in Experience).

### 4. Date formatting consistency
- **Single format: Month/Year** everywhere.
- Apply in: Education, Experience, Achievements, Awards, Certifications (and any date in preview/export).

### 5. Mandatory fields (required for PDF download)
- **Validate only:** Personal required (Name, Email, Phone, Location). When any Education / Experience / Certification entry exists, that entry must be complete (no incomplete entries). No minimum skills; zero skills is allowed.

### Implementation mapping (where to build)
| # | Area | Likely place |
|---|------|---------------|
| 1 | PDF/Word export | Export service + ResumePreview (print/PDF); Word = docx generation or HTML copy |
| 2 | Spellcheck/grammar | Rich-text editor (summary/descriptions) or wrapper with spellcheck/grammar API |
| 3 | Education ongoing | ResumeData education model + form UI + ResumePreview (end date "Present" when currently studying) |
| 4 | Date format | All templates already use Month/Year in most places; only one or two spots are missing or wrong. Use the existing `formatDate()` / pattern there for those values. |
| 5 | Mandatory fields / PDF gate | Validation: Personal required; when any Education/Experience/Cert entry exists it must be complete. No skills validation. Block Download until valid; show errors in form. |

---

## ResumePreview.tsx — What it does
- **Component**: `ResumePreview({ resumeData, template })`
- Renders one of 8 resume layouts (modern, classic, minimal, professional, creative, executive, resumake-classic, resumake-classic-single) inside a Card.
- Shared helpers: `formatDate(dateString)`, `stripHtml(html)` (defined but unused).

## Data flow
- **Input**: `ResumeData` (personalInfo, experience, education, skills, projects, achievements, awards, certifications, publications) + template key.
- **Output**: Single template JSX; sections only render when the corresponding array/field has content.

## Structure (high level)
1. Helpers at top.
2. Eight large render functions (~100–400 lines each), each returning one full resume layout.
3. `templates` map from template id → render function.
4. Main return: Card → `TemplateComponent()`.

## Fixes / consistency
- **Optional chaining**: In `renderResumakeClassicSingleTemplate`, use `resumeData.projects?.length > 0` (and guard projects elsewhere) so missing `projects` doesn’t throw.
- **Duplicate contact blocks**: Professional and Executive templates show website (and sometimes LinkedIn) twice in the header; remove the duplicate block.
- **Dead code**: Remove `stripHtml` if not needed, or use it where HTML is rendered as plain text.

## Refactor (optional, for maintainability)
- Extract **shared section components** (e.g. ExperienceSection, EducationSection, SkillsSection) that take `resumeData` and optional template-specific class names / layout props.
- Extract **shared header block** (name, contact, photo) and pass layout variant (centered vs left-aligned vs dark, etc.).
- Keep one “template” component per design that composes these shared pieces and adds template-specific wrapper styles and section order.

## File size
- Single file ~2300 lines; splitting by template or by section would improve readability and diff/merge.

## Risks
- Changing one template’s section structure can drift from others if logic is duplicated; shared components reduce that risk.
- `dangerouslySetInnerHTML` is used for summary/descriptions; ensure content is sanitized upstream.
