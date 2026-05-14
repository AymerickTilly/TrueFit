import type { ProfileWithSkills, JobApplication, SkillContext } from '@/types'

const CONTEXT_LABEL: Record<SkillContext, string> = {
  professional: 'professional',
  academic:     'academic (project or coursework)',
  learning:     'learning — in progress, not yet applied in a project',
  exposure:     'exposure — coursework or brief only',
}

export interface GapAnalysis {
  direct_matches: string[]
  partial_matches: Array<{ skill: string; bridge: string }>
  missing_required: string[]
  preferred_matches: string[]
  role_themes: string[]
  key_responsibilities: string[]
  company_focus: string
  what_matters_most: string
  tone_signal: string
  soft_skills_valued: string[]
}

function formatSkillsInventory(skills: ProfileWithSkills['skill_items']): string {
  if (skills.length === 0) return 'None listed.'
  return skills
    .map(s => {
      const desc = s.usage_description ? ` — ${s.usage_description}` : ''
      return `- ${s.name} [${CONTEXT_LABEL[s.context]}]${desc}`
    })
    .join('\n')
}

function formatExperience(exp: ProfileWithSkills['work_experience']): string {
  if (!exp || exp.length === 0) return 'None listed.'
  return exp
    .map(e => {
      const dates = e.is_current
        ? `${e.start_date} — Present`
        : `${e.start_date}${e.end_date ? ` — ${e.end_date}` : ''}`
      const tasks   = e.tasks.map(t => `  - ${t}`).join('\n')
      const toolStr = e.tools.length > 0 ? `  Tools: ${e.tools.join(', ')}` : ''
      return [`${e.title} at ${e.company} (${dates})`, tasks, toolStr].filter(Boolean).join('\n')
    })
    .join('\n\n')
}

function formatEducation(edu: ProfileWithSkills['education']): string {
  if (!edu || edu.length === 0) return 'None listed.'
  return edu
    .map(e => {
      const dates   = e.end_date ? `${e.start_date} — ${e.end_date}` : `${e.start_date} — Ongoing`
      const spec    = e.specialisation ? `  Specialisation: ${e.specialisation}` : ''
      const courses = e.courses.length > 0 ? `  Courses: ${e.courses.join(', ')}` : ''
      return [`${e.degree} — ${e.institution} (${dates})`, spec, courses].filter(Boolean).join('\n')
    })
    .join('\n\n')
}

function formatProjects(projects: ProfileWithSkills['projects']): string {
  if (!projects || projects.length === 0) return 'None listed.'
  return projects
    .map(p => {
      const lines = [`${p.title}`, `  ${p.description}`]
      if (p.stack.length > 0)               lines.push(`  Stack: ${p.stack.join(', ')}`)
      if (p.skills_demonstrated.length > 0) lines.push(`  Skills demonstrated: ${p.skills_demonstrated.join(', ')}`)
      if (p.not_in_project.length > 0)      lines.push(`  NOT in this project: ${p.not_in_project.join(', ')}`)
      if (p.github_url)                     lines.push(`  GitHub: ${p.github_url}`)
      return lines.join('\n')
    })
    .join('\n\n')
}

function formatVolunteering(vol: ProfileWithSkills['volunteering']): string {
  if (!vol || vol.length === 0) return 'None listed.'
  return vol
    .map(v => {
      const date = v.date ? ` (${v.date})` : ''
      const desc = v.description ? `  ${v.description}` : ''
      return [`${v.role}, ${v.organisation}${date}`, desc].filter(Boolean).join('\n')
    })
    .join('\n\n')
}

function formatInterests(interests: ProfileWithSkills['interests']): string {
  if (!interests || interests.length === 0) return 'None listed.'
  return interests
    .map(i => i.description ? `${i.name}: ${i.description}` : i.name)
    .join('\n')
}

// ============================================================
// STAGE 1 — Gap analysis prompt
// Returns a structured JSON analysis of skill match tiers.
// ============================================================

export function assembleAnalysisPrompt(
  profile: ProfileWithSkills,
  application: JobApplication,
): string {
  return `You are analyzing a job posting against a candidate's skill profile.

CANDIDATE SKILLS (context is fixed — do not reassign):
${formatSkillsInventory(profile.skill_items)}

JOB POSTING — ${application.role_title} at ${application.company_name}:
${application.job_ad_text}

TASK:
Read the job posting carefully. Extract the following and return as a single JSON object.

Skill matching — compare each required skill against the candidate inventory:
- direct_matches: candidate has this skill at [professional] level
- partial_matches: candidate has a related or adjacent skill, or the skill at [academic]/[exposure] level. Include a "bridge" explaining the connection.
- missing_required: skill genuinely absent from the candidate profile
- preferred_matches: preferred/nice-to-have skills the candidate has at any level

Job context — read beyond the skills list:
- role_themes: 3-5 recurring technical themes (e.g. "automation", "data pipelines", "system reliability")
- key_responsibilities: the 3-4 main things this person will actually do day-to-day
- company_focus: one sentence — what does this company or team care about most (e.g. "delivering reliable data infrastructure for fintech clients", "shipping fast in a startup environment")
- what_matters_most: the single most important thing the hiring manager is looking for beyond a skill list (e.g. "production reliability mindset", "ability to work independently", "clean code in a team setting")
- tone_signal: the register of this role — one of: "formal/enterprise", "technical/precise", "collaborative/startup", "academic/research"
- soft_skills_valued: 2-4 soft skills or behaviours explicitly or implicitly valued in the posting

Return ONLY a valid JSON object. No markdown fences, no preamble, no explanation.

{"direct_matches":[],"partial_matches":[{"skill":"","bridge":""}],"missing_required":[],"preferred_matches":[],"role_themes":[],"key_responsibilities":[],"company_focus":"","what_matters_most":"","tone_signal":"","soft_skills_valued":[]}`
}

// ============================================================
// STAGE 2 — CV generation prompt
// Uses the gap analysis to drive section order and prioritisation.
// Follows the exact section structure of a real professional CV.
// ============================================================

export function assembleGenerationPrompt(
  profile: ProfileWithSkills,
  application: JobApplication,
  analysis: GapAnalysis,
): string {
  const directList   = analysis.direct_matches.join(', ')                                               || 'none identified'
  const partialList  = analysis.partial_matches.map(p => `${p.skill} (bridge: ${p.bridge})`).join(', ') || 'none'
  const missingList  = analysis.missing_required.join(', ')                                             || 'none'
  const themeList    = analysis.role_themes.join(', ')                                                  || 'not identified'
  const respList     = analysis.key_responsibilities.join('; ')                                        || 'not specified'
  const softList     = analysis.soft_skills_valued.join(', ')                                          || 'not specified'

  const hasVolunteering = profile.volunteering && profile.volunteering.length > 0
  const hasInterests    = profile.interests && profile.interests.length > 0

  return `You are an expert CV writer. Generate a complete, tailored, honest CV.
Writing tone for this role is: ${analysis.tone_signal || 'technical/precise'}. Calibrate confidence level, sentence density, and vocabulary to match — "formal/enterprise" is measured and precise, "collaborative/startup" is direct and energetic, "academic/research" is methodical, "technical/precise" is concrete and tool-specific.

=== ABSOLUTE RULES — NEVER VIOLATE ===
1. Never invent, fabricate, or infer any skill, experience, or qualification not listed in the profile below.
2. Never reassign a skill from one context to another. A skill listed as [academic] must never appear as professional experience.
3. [learning] skills: mention only if the job explicitly requires the technology, framed as "currently building familiarity with [skill] through self-directed study — not yet applied in a project."
4. [exposure] skills: frame as coursework or brief academic exposure only. Never as demonstrated competency.
5. If a required skill is absent from the profile, omit it entirely. Do not compensate or pad.
6. "NOT in this project" fields are authoritative — never attribute those skills to that project.
7. Banned words and phrases: "proven track record", "passionate about", "dynamic", "leverage", "synergies", "spearheaded", "results-driven", "detail-oriented", "demonstrating", "showcasing", "utilizing", "strong foundation", "strong understanding".
8. No em-dashes (— or --) anywhere in the output. Replace with a comma, a connector word, or a full stop.
9. Write in a clear, direct, human voice. Active verbs. Concrete details. Short sentences. No AI-pattern rhythm.
10. Do NOT add editorial comments, notes, or explanations inside the CV output.

=== GAP ANALYSIS — USE THIS TO DRIVE PRIORITISATION ===
Role: ${application.role_title} at ${application.company_name}
Direct matches (candidate has professionally): ${directList}
Partial matches (academic or adjacent): ${partialList}
Missing required skills: ${missingList}
Role themes: ${themeList}
Key responsibilities (what this person will actually do): ${respList}
Company/team focus: ${analysis.company_focus || 'not identified'}
What matters most to the hiring manager: ${analysis.what_matters_most || 'not identified'}
Soft skills valued: ${softList}
Writing tone for this role: ${analysis.tone_signal || 'technical/precise'}

=== CANDIDATE PROFILE ===
Name: ${profile.full_name || 'Not provided'}
Email: ${profile.email || ''}
Phone: ${profile.phone || ''}
Location: ${profile.location || ''}
${profile.linkedin_url ? `LinkedIn: ${profile.linkedin_url}` : ''}
${profile.github_url ? `GitHub: ${profile.github_url}` : ''}

SKILLS INVENTORY (context is fixed — do not reassign):
${formatSkillsInventory(profile.skill_items)}

WORK EXPERIENCE:
${formatExperience(profile.work_experience)}

EDUCATION:
${formatEducation(profile.education)}

PROJECTS (embed under relevant education entry, do not create a separate Projects section):
${formatProjects(profile.projects)}

${hasVolunteering ? `VOLUNTEERING:\n${formatVolunteering(profile.volunteering)}` : ''}
${hasInterests    ? `INTERESTS:\n${formatInterests(profile.interests)}`           : ''}

=== WRITING QUALITY REFERENCE ===
Your output must match the quality and style of these examples exactly. Study the phrasing, density, and structure before writing.

Professional Statement example:
"I'm a Master of Computer and Information Sciences based in Auckland, applying for the Junior DevOps Engineer position at Datacom. I bring professional experience as a Junior System and Database Administrator, where I deployed and maintained Linux/CentOS servers, automated operational workflows using Bash and Ansible, and managed SQL databases in production environments. I also have academic experience with React and TypeScript, built through a full-stack cloud-based e-commerce platform. I'm motivated to contribute to Datacom by applying my automation background to support reliable, production-grade delivery pipelines."

Transferable Skills examples (study the format — no "I", bridge language mandatory):
"• Production accuracy: banking databases where errors had real downstream consequences built a zero-tolerance approach to data quality, which transfers directly into validation and integrity work.
• Debugging mindset: tracing failures across live servers, data layers, and scheduled workflows builds the same systematic approach needed to isolate and fix pipeline or application issues quickly.
• Cross-stack context: working at the infrastructure layer gives a practical understanding of what sits below the application, which makes collaborating with developers and understanding system-wide consequences more intuitive."

Technical Skills cluster examples (skill-first, context included):
"• Automation (Ansible, Bash, cron): used professionally to automate Linux server and database deployments and schedule operational banking workflows, reducing manual intervention and error risk across recurring tasks.
• SQL (MySQL, PostgreSQL): managed and queried production databases at the Bank of French Polynesia, maintaining data integrity and reliable access; also applied academically in data analysis projects."

Work Experience bullet examples (active verb, concrete action, light outcome):
"• Automated deployments and operational workflows using Bash, Ansible, and cron, reducing manual intervention across recurring tasks and minimising human error risk in production.
• Managed and queried SQL databases (MySQL/PostgreSQL), maintaining data accuracy, integrity, and availability for ongoing operations and downstream processing.
• Collaborated with infrastructure and data teams across incidents, translating findings between technical and non-technical stakeholders to keep resolution moving."

=== SECTION-BY-SECTION RULES ===

PROFESSIONAL STATEMENT (first section after the header):
- 3-4 sentences. First person. Under 95 words total.
- Sentence 1: "I'm a [MOST RECENT / HIGHEST degree + field] based in [location], applying for the [role] position at [company]." Use the most recent degree from the education list, not the oldest.
- Sentence 2: Professional experience sentence — what they did professionally, which tools they used, what environment. Draw ONLY from work experience. Use the actual job titles and tools listed. Do not add skills not in the profile.
- Sentence 3: Academic/technical match — 1-3 academic skills that best match the role requirements. Name the actual project. Frame explicitly as academic or project-based.
  If a skill was used both professionally and academically, say so clearly: "I have both professional and academic experience with [skill]."
- Sentence 4: Motivation — "I'm motivated to contribute to [company] by [specific contribution tied to the company focus: '${analysis.company_focus || 'role themes'}'. Connect what the candidate brings professionally or academically to that specific company/team mission. Not generic phrases like 'managing data with attention to detail'.]"
- No filler, no corporate language, no em-dashes.

TRANSFERABLE SKILLS (second section):
Generate exactly 4 bullet points that bridge the candidate's past experience to the value they bring to this specific role.
- What matters most to the hiring manager: "${analysis.what_matters_most || 'not identified'}". At least one bullet must directly address this.
- Soft skills valued in this role: ${softList}. Where supported by the candidate's actual experience, incorporate these into your bullet selection.
- For each bullet, first assess relevance to the role: HIGH (directly supports a required/preferred skill or the what_matters_most signal), MEDIUM (supports role themes or valued soft skills), LOW (no connection). Select 4 bullets ranked HIGH first, then MEDIUM. Never include LOW bullets.
- Derive the transferable skills from the candidate's actual work experience, environment, and background. Do not invent.
- Possible angles: systems-level thinking, production accuracy standards, cross-stack context, self-directed learning, cross-functional communication, data quality mindset, etc. Select only what is genuinely supported by the profile.
- Each bullet format: "• Skill name: one sentence connecting past experience to future role value."
- CRITICAL FORMAT RULES for transferable skills bullets:
  - Do NOT use first person at all — no "I", "me", "my", "has taught me", "will help me"
  - Do NOT use future tense — no "will help", "can be applied", "I can apply", "I can facilitate"
  - Each bullet describes a QUALITY or CAPABILITY built from past experience, then bridges it to the role. Past tense or present tense only.
  - Correct: "Production accuracy: banking databases where errors had real downstream consequences built a zero-tolerance approach to data quality, which transfers directly into validation and integrity work."
  - Correct: "Systematic approach: decomposing recurring deployment failures into isolated causes builds the same fault-isolation discipline needed to track discrepancies across large data sets."
  - Wrong: "Automation expertise: I can bring value to the role by applying my experience in automating workflows."
  - Wrong: "Systematic approach: experience with automated deployments has taught me to break down complex tasks, which will help in reviewing large volumes of records."
- Each bullet must be ONE sentence only. No em-dashes. Bridge language is mandatory in every bullet.
- Vary sentence openings and structure across all 4 bullets.
- Do NOT restate tools or tasks that will already appear in the Technical Skills or Work Experience sections.

TECHNICAL SKILLS (third section):
- Organise into 2-3 subsections with short headers (e.g. "Software Development", "Cloud & Systems", "Data Engineering & Analytics", "Tools & Engineering Practices").
- Lead with subsections containing direct match skills.
- Within each subsection, group tools into capability clusters.
- Cluster format: "Cluster label (tools): description and context."
- ALWAYS include ALL skills marked [professional] — professional experience is never omitted regardless of job match.
- [professional] skills: state confidently, no hedging.
- [academic] skills: frame as "academic" or "project-based". Include only if they match the role.
- [exposure] skills: "coursework familiarity" or "academic exposure" only. Include only if directly relevant.
- [learning] skills: append as a short clause on the most relevant cluster only. Never standalone.
- No skill not present in the inventory above.
- 3-4 bullets per subsection maximum.

WORK EXPERIENCE (fourth section):
- Most recent role first. 3-5 bullets per role.
- Key responsibilities for this role: ${respList}. Prioritise bullets that speak to these responsibilities over generic task descriptions.
- Put bullets with direct match skills first within each role.
- Active verbs and concrete actions.
- Where a bullet describes only a task with no outcome, add a light consequence clause without inventing numbers.
- Avoid repeating the same contextual phrase across bullets.
- Optional Achievements subsection: if there is a clear, notable achievement in the tasks (e.g. hired after internship, delivered a project on time, specific measurable outcome), add an "Achievements" subsection with 1-2 bullets. Do not invent achievements.

EDUCATION (fifth section):
- Most recent degree first.
- For each degree: FULL degree name (e.g. "Master of Computer and Information Sciences", not "Master"), institution, date range. Never abbreviate the degree name.
- Specialisation on a separate bullet if present.
- Projects: embed relevant academic projects directly under the degree they belong to, under a "Projects:" label.
  Lead project: maximum 3 bullets. Frame as demonstrated capability, not narration.
  Correct: "Applied React and TypeScript to integrate REST APIs end-to-end."
  Wrong: "Developed a frontend using React and TypeScript."
  Other projects: 1 sentence each covering scope and key technologies.
  Respect all "NOT in this project" fields.
  Only include projects with at least one direct or partial match to the role.

${hasVolunteering ? `VOLUNTEERING (sixth section):
- List each entry with role, organisation, date.
- One short bullet per entry describing the contribution.` : ''}

${hasInterests ? `INTERESTS (last section):
- List as short bullets: "Interest name: brief note."
- Only include if present in the profile.` : ''}

=== OUTPUT FORMAT ===
Return ONLY clean markdown. No preamble, no explanation, no commentary, no editorial notes inside the output.

# [Full Name]
[email] • [phone] • [location][ • LinkedIn if present][ • GitHub if present]

## Professional Statement
[...]

## Transferable Skills
[4 bullets]

## Technical Skills
### [Subsection header]
[bullets]
### [Subsection header if needed]
[bullets]

## Work Experience
### [Job Title], [Company] ([date range])
[bullets]
Achievements
[bullets — only if a notable achievement exists]

## Education
### [Degree] — [Institution] ([date range])
[specialisation bullet if present]
Projects:
**[Project Title]** ([stack summary])
[bullets]

${hasVolunteering ? `## Volunteering\n[...]` : ''}
${hasInterests    ? `## Interests\n[...]`    : ''}`
}
