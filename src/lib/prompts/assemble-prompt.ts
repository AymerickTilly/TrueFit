import type { ProfileWithSkills, JobApplication, SkillContext } from '@/types'

const CONTEXT_LABEL: Record<SkillContext, string> = {
  professional: 'professional experience',
  academic:     'academic work',
  learning:     'currently learning',
  exposure:     'brief exposure',
}

function formatSkills(skills: ProfileWithSkills['skill_items']): string {
  if (skills.length === 0) return 'None listed.'

  const grouped = skills.reduce<Record<SkillContext, string[]>>(
    (acc, s) => {
      acc[s.context].push(
        s.usage_description ? `${s.name} (${s.usage_description})` : s.name,
      )
      return acc
    },
    { professional: [], academic: [], learning: [], exposure: [] },
  )

  return (Object.entries(grouped) as [SkillContext, string[]][])
    .filter(([, items]) => items.length > 0)
    .map(([ctx, items]) => `${CONTEXT_LABEL[ctx]}: ${items.join(', ')}`)
    .join('\n')
}

function formatExperience(exp: ProfileWithSkills['work_experience']): string {
  if (exp.length === 0) return 'None listed.'
  return exp.map(e => {
    const dates = e.is_current
      ? `${e.start_date} — Present`
      : `${e.start_date}${e.end_date ? ` — ${e.end_date}` : ''}`
    const tasks = e.tasks.join('\n')
    const tools = e.tools.length > 0 ? `Tools: ${e.tools.join(', ')}` : ''
    return [`${e.title} at ${e.company} (${dates})`, tasks, tools].filter(Boolean).join('\n')
  }).join('\n\n')
}

function formatEducation(edu: ProfileWithSkills['education']): string {
  if (edu.length === 0) return 'None listed.'
  return edu.map(e => {
    const dates = e.end_date ? `${e.start_date} — ${e.end_date}` : `${e.start_date} — Ongoing`
    const spec = e.specialisation ? ` · ${e.specialisation}` : ''
    const courses = e.courses.length > 0 ? `Relevant courses: ${e.courses.join(', ')}` : ''
    return [`${e.degree}${spec} — ${e.institution} (${dates})`, courses].filter(Boolean).join('\n')
  }).join('\n\n')
}

function formatProjects(projects: ProfileWithSkills['projects']): string {
  if (projects.length === 0) return 'None listed.'
  return projects.map(p => {
    const stack = p.stack.length > 0 ? `Stack: ${p.stack.join(', ')}` : ''
    const skills = p.skills_demonstrated.length > 0
      ? `Demonstrates: ${p.skills_demonstrated.join(', ')}`
      : ''
    const url = p.github_url ? `GitHub: ${p.github_url}` : ''
    return [p.title, p.description, stack, skills, url].filter(Boolean).join('\n')
  }).join('\n\n')
}

export function assemblePrompt(
  profile: ProfileWithSkills,
  application: JobApplication,
): string {
  return `You are a professional CV writer. Your task is to generate a tailored, honest CV for a candidate applying to a specific role.

ABSOLUTE RULES — never violate these:
- Never invent, fabricate, or infer any skill, experience, or qualification not explicitly listed in the candidate profile below
- Never reassign a skill from one context to another (e.g. do not present a personal project skill as professional experience)
- If a skill required by the job is absent from the profile, omit it entirely — do not compensate or pad
- Never use em dashes, corporate buzzwords, or AI-sounding filler phrases
- Banned words and phrases: "proven track record", "passionate about", "dynamic", "leverage", "synergies", "spearheaded", "results-driven", "detail-oriented"
- Write in a clear, direct, human voice — active verbs, short sentences, concrete details where available

CANDIDATE PROFILE:
Name: ${profile.full_name || 'Not provided'}
Email: ${profile.email || 'Not provided'}
Phone: ${profile.phone || ''}
Location: ${profile.location || ''}
LinkedIn: ${profile.linkedin_url || ''}
GitHub: ${profile.github_url || ''}

Professional statement (use as context only, do not copy verbatim):
${profile.professional_statement || 'Not provided'}

SKILLS:
${formatSkills(profile.skill_items)}

WORK EXPERIENCE:
${formatExperience(profile.work_experience)}

EDUCATION:
${formatEducation(profile.education)}

PROJECTS:
${formatProjects(profile.projects)}

JOB POSTING — ${application.role_title} at ${application.company_name}:
${application.job_ad_text}

TASK:
Generate a tailored CV for this candidate for the above role. Select only the skills, experience, and projects most relevant to the job. Structure work experience tasks into 3–5 concise bullet points per role. Keep total content to approximately 1 page (400–600 words).

Output ONLY clean markdown in this exact structure — no preamble, no explanation, no commentary:

# [Full Name]
[email] · [phone] · [location] · [LinkedIn if present] · [GitHub if present]

## Summary
[2–3 sentences. Based on the profile. Not copied from the professional statement. No filler words.]

## Skills
[Relevant skills only. Grouped logically. No skill not in the profile.]

## Experience
[Selected roles. Most recent first. 3–5 bullet points each.]

## Education
[Degree, institution, dates. Relevant courses if any.]

## Projects
[Only include if relevant to the role. Skip section if none are relevant.]`
}
