// src/lib/prompts/assembler.ts
// Assembles structured prompts for Claude from user profile and job data.
// This is the core of the AI integration — treat changes here carefully.
//
// The prompt system is based on a 9-prompt architecture:
//   Prompt 0 — Session context (skills inventory, constraints)
//   Prompt 1 — Job analysis
//   Prompt 2 — CV tailoring analysis
//   Prompt 3 — Professional statement
//   Prompt 4 — Transferable skills section
//   Prompt 5 — Technical skills section
//   Prompt 6 — Work experience section
//   Prompt 7 — Education and projects section
//   Prompt 8 — Full cover letter
//   Prompt 9 — Short cover letter (text box version)

import type { ProfileWithSkills, JobApplication, DocumentType, SkillItem } from '@/types'

// ============================================================
// PROMPT 0 — Session context
// Builds the skill inventory and constraints block.
// This is prepended to every generation request.
// ============================================================

export function buildContextPrompt(profile: ProfileWithSkills): string {
  const skillsByCategory = groupSkillsByCategory(profile.skill_items)
  const skillsBlock = formatSkillsInventory(skillsByCategory)
  const workBlock = formatWorkExperience(profile)
  const projectsBlock = formatProjects(profile)

  return `You are helping generate a tailored CV and cover letter for a specific job application.

Before we begin, here is the user's fixed context. Do not change, invent, or inflate anything beyond what is listed here.

## Personal Details
- Name: ${profile.full_name}
- Location: ${profile.location}
- Email: ${profile.email}
- Phone: ${profile.phone}
${profile.linkedin_url ? `- LinkedIn: ${profile.linkedin_url}` : ''}
${profile.github_url ? `- GitHub: ${profile.github_url}` : ''}

## Skills Inventory
${skillsBlock}

Rules for reading this inventory:
- Each skill entry includes its context (professional, academic, learning, or exposure).
- Do NOT reassign a skill to a different context than what is stated here.
- "Exposure" or "coursework" means theoretical or guided familiarity — NOT production or project-level experience.
- Skills marked [LEARNING] are currently being studied. They may only be mentioned if the job explicitly requires the technology AND they are framed honestly as in-progress.
- Never present [LEARNING] skills as existing competencies.

## Work Experience
${workBlock}

## Academic Projects
${projectsBlock}

## Education
${formatEducation(profile)}

## Volunteering
${formatVolunteering(profile)}

## Interests
${formatInterests(profile)}

## Constraints (apply to every output)
- Do NOT invent skills, tools, or responsibilities not listed above.
- Do NOT inflate experience or seniority.
- Do NOT copy job-ad wording directly.
- Do NOT reassign a skill to a context it does not belong to.
- Preserve a natural, human tone — concise, applied, non-repetitive.
- Prioritise professional experience over academic projects unless the job is research-focused.
- If any sentence sounds like an AI trying to sound professional, rewrite it before returning.
- NO EM-DASHES: Do not use — or -- anywhere in the output. Replace with a comma, connector word, or full stop.`
}

// ============================================================
// PROMPT 1 — Job analysis
// Extracts structured information from the raw job posting.
// ============================================================

export function buildJobAnalysisPrompt(jobAdText: string): string {
  return `Analyse the following job posting and return a structured JSON object. Return ONLY valid JSON, no markdown, no commentary.

The JSON must match this exact shape:
{
  "role_title": "exact role title from the posting",
  "company_name": "company name",
  "responsibilities": ["array of main responsibilities"],
  "required_skills": ["array of required technical skills"],
  "nice_to_have_skills": ["array of preferred but not required skills"],
  "culture_notes": "one sentence about team culture or working style if mentioned, otherwise empty string",
  "summary": "two sentence summary of what this role actually does"
}

Job posting:
---
${jobAdText}
---`
}

// ============================================================
// PROMPT 2 — Gap analysis
// Compares the user's skills against the job requirements.
// Returns which required skills are missing from the profile.
// ============================================================

export function buildGapAnalysisPrompt(
  profile: ProfileWithSkills,
  jobAnalysis: string
): string {
  const allSkillNames = profile.skill_items.map(s => s.name).join(', ')

  return `Given the job analysis below and the user's skill inventory, identify the gaps.

Return ONLY a JSON array of strings — the required skills from the job that are absent from the user's profile. If there are no gaps, return an empty array [].

User's skills: ${allSkillNames}

Job analysis:
${jobAnalysis}`
}

// ============================================================
// CV GENERATION PROMPT
// Builds the full CV tailoring prompt.
// ============================================================

export function buildCVPrompt(
  profile: ProfileWithSkills,
  jobApplication: JobApplication
): string {
  const context = buildContextPrompt(profile)
  const jobAnalysisText = jobApplication.job_analysis
    ? JSON.stringify(jobApplication.job_analysis, null, 2)
    : jobApplication.job_ad_text

  return `${context}

---

## Job Offer Analysis
${jobAnalysisText}

---

## Task: Generate a tailored CV

Using the context above and the job analysis, generate a complete tailored CV.

Structure:
1. Professional Statement (3-4 sentences, tailored to this specific role)
2. Transferable Skills (3-4 bullet points, each 1-2 sentences, most relevant to this job first)
3. Technical Skills (grouped by category, clusters where relevant, only skills present in the inventory)
4. Work Experience (full entries, bullets adapted to emphasise what's most relevant to this job)
5. Education (full entries with relevant projects)
6. Volunteering (if relevant)
7. Interests (brief)

Rules:
- Only include skills present in the inventory above.
- Do not invent or imply use of tools not listed.
- Adapt the language and emphasis for this specific job — do not use a generic CV.
- Technical skills section: group by category, use the categories from the inventory.
- For each work experience bullet: keep the core fact true, adapt phrasing to resonate with the job.
- Return the CV as clean plain text, using — for section headers and • for bullets.`
}

// ============================================================
// COVER LETTER PROMPT (full version)
// ============================================================

export function buildCoverLetterPrompt(
  profile: ProfileWithSkills,
  jobApplication: JobApplication
): string {
  const context = buildContextPrompt(profile)
  const jobAnalysisText = jobApplication.job_analysis
    ? JSON.stringify(jobApplication.job_analysis, null, 2)
    : jobApplication.job_ad_text

  return `${context}

---

## Job Offer Analysis
${jobAnalysisText}

---

## Task: Generate a cover letter

Using the context and job analysis above, generate a full cover letter body (no header, date, sign-off, or section labels).

Structure:
1. Opening paragraph — exactly 3 sentences: (a) what you are building toward and why, (b) one specific thing about what ${jobApplication.company_name} does that connects to that direction (max 20 words), (c) one academic specialisation that bridges your direction and this role
2. Professional experience paragraph — your most relevant professional experience, adapted to this job's requirements
3. Academic paragraph — exactly 4 sentences: the single most relevant project, its most relevant detail, coursework clause if any required skill is absent from your projects, GitHub link if dev role
4. Personal attributes — 2 sentences, human not corporate
5. Visa paragraph — mention your work authorisation in New Zealand honestly if the profile includes a location there
6. Closing — one sentence, max 25 words, name the company, express readiness to contribute

Constraints:
- 250-350 words total
- Human, natural, non-corporate tone throughout
- NO EM-DASHES anywhere
- Count sentences in the academic paragraph — must be exactly 4
- The opening paragraph sentence 2 must be max 20 words — count before returning
- Return only the cover letter body, no commentary`
}

// ============================================================
// COVER LETTER PROMPT (short version for text boxes)
// ============================================================

export function buildCoverLetterShortPrompt(
  profile: ProfileWithSkills,
  jobApplication: JobApplication
): string {
  const context = buildContextPrompt(profile)
  const jobAnalysisText = jobApplication.job_analysis
    ? JSON.stringify(jobApplication.job_analysis, null, 2)
    : jobApplication.job_ad_text

  return `${context}

---

## Job Offer Analysis
${jobAnalysisText}

---

## Task: Generate a short cover letter (for a text box field)

Write exactly 3 paragraphs, 150-200 words total.

Paragraph 1 — Why them (2 sentences max): Start with genuine interest or direction. Connect to one concrete detail about what ${jobApplication.company_name} does. Do NOT open by describing the company.

Paragraph 2 — What you bring (3 sentences max): Lead with professional experience in one clause. Follow with the single most relevant academic project. Add GitHub reference if dev-focused role and word count allows.

Paragraph 3 — Closing (max 20 words): Direct, confident, specific. Express what you are ready to contribute, not what you hope to receive.

Constraints:
- 150-200 words total
- NO EM-DASHES
- No header, date, sign-off, or labels
- Return only the letter body, no commentary`
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function groupSkillsByCategory(skills: SkillItem[]): Record<string, SkillItem[]> {
  return skills.reduce<Record<string, SkillItem[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})
}

function formatSkillsInventory(grouped: Record<string, SkillItem[]>): string {
  return Object.entries(grouped)
    .map(([category, skills]) => {
      const skillLines = skills.map(skill => {
        const tag = skill.is_learning ? '[LEARNING]' : `[${skill.context.toUpperCase()}]`
        const desc = skill.usage_description ? ` — ${skill.usage_description}` : ''
        return `  - ${skill.name} ${tag}${desc}`
      }).join('\n')
      return `### ${category}\n${skillLines}`
    })
    .join('\n\n')
}

function formatWorkExperience(profile: ProfileWithSkills): string {
  if (!profile.work_experience.length) return 'No work experience listed.'
  return profile.work_experience.map(exp => {
    const period = exp.is_current
      ? `${exp.start_date} – Present`
      : `${exp.start_date} – ${exp.end_date}`
    const tasks = exp.tasks.map(t => `  - ${t}`).join('\n')
    const tools = exp.tools.length ? `\n  Tools: ${exp.tools.join(', ')}` : ''
    return `${exp.title}, ${exp.company} (${period})\n${tasks}${tools}`
  }).join('\n\n')
}

function formatProjects(profile: ProfileWithSkills): string {
  if (!profile.projects.length) return 'No projects listed.'
  return profile.projects.map(proj => {
    const stack = `Stack: ${proj.stack.join(', ')}`
    const demonstrated = `Skills demonstrated: ${proj.skills_demonstrated.join(', ')}`
    const notIn = proj.not_in_project.length
      ? `NOT in this project: ${proj.not_in_project.join(', ')}`
      : ''
    const github = proj.github_url ? `GitHub: ${proj.github_url}` : ''
    return [proj.title, proj.description, stack, demonstrated, notIn, github]
      .filter(Boolean)
      .map(line => `  ${line}`)
      .join('\n')
  }).join('\n\n')
}

function formatEducation(profile: ProfileWithSkills): string {
  if (!profile.education.length) return 'No education listed.'
  return profile.education.map(edu => {
    const period = `${edu.start_date} – ${edu.end_date ?? 'Present'}`
    const spec = edu.specialisation ? `\n  Specialisation: ${edu.specialisation}` : ''
    const courses = edu.courses.length
      ? `\n  Relevant courses: ${edu.courses.join(', ')}`
      : ''
    return `${edu.degree}, ${edu.institution} (${period})${spec}${courses}`
  }).join('\n\n')
}

function formatVolunteering(profile: ProfileWithSkills): string {
  if (!profile.volunteering.length) return 'No volunteering listed.'
  return profile.volunteering.map(v =>
    `${v.role}, ${v.organisation} (${v.date})\n  ${v.description}`
  ).join('\n\n')
}

function formatInterests(profile: ProfileWithSkills): string {
  if (!profile.interests.length) return 'No interests listed.'
  return profile.interests.map(i => `- ${i.name}: ${i.description}`).join('\n')
}

// ============================================================
// PROMPT SELECTOR
// Returns the right prompt function for a given document type.
// ============================================================

export function getPromptForDocumentType(
  type: DocumentType,
  profile: ProfileWithSkills,
  jobApplication: JobApplication
): string {
  switch (type) {
    case 'cv':
      return buildCVPrompt(profile, jobApplication)
    case 'cover_letter':
      return buildCoverLetterPrompt(profile, jobApplication)
    case 'cover_letter_short':
      return buildCoverLetterShortPrompt(profile, jobApplication)
  }
}
