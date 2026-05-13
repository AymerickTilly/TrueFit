// src/types/index.ts
// Central type definitions for CVGen.
// These mirror the Supabase database schema exactly.

// ============================================================
// SKILL TYPES
// ============================================================

export type SkillContext = 'professional' | 'academic' | 'learning' | 'exposure'

export interface SkillItem {
  id: string
  profile_id: string
  name: string
  category: string
  context: SkillContext
  usage_description: string
  is_learning: boolean
  sort_order: number
  created_at: string
}

export interface SkillItemInput {
  name: string
  category: string
  context: SkillContext
  usage_description: string
  is_learning: boolean
  sort_order?: number
}

// Skills grouped by category (for display)
export interface SkillGroup {
  category: string
  skills: SkillItem[]
}

// ============================================================
// PROFILE TYPES
// ============================================================

export interface WorkExperience {
  id: string                    // local UUID for list management
  title: string
  company: string
  start_date: string            // e.g. 'Apr 2023'
  end_date: string | null       // null if current
  is_current: boolean
  tasks: string[]               // bullet points describing responsibilities
  tools: string[]               // tools/technologies used in this role
}

export interface Education {
  id: string
  degree: string
  institution: string
  start_date: string
  end_date: string | null
  specialisation: string
  courses: string[]             // relevant courses
}

export interface Project {
  id: string
  title: string
  description: string
  stack: string[]               // technologies used
  skills_demonstrated: string[] // what this project proves
  github_url: string
  not_in_project: string[]      // explicitly what was NOT used (for prompt accuracy)
}

export interface Volunteering {
  id: string
  role: string
  organisation: string
  date: string
  description: string
}

export interface Interest {
  id: string
  name: string
  description: string
}

export interface Profile {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string
  location: string
  linkedin_url: string
  github_url: string
  professional_statement: string
  personal_attributes: string
  work_experience: WorkExperience[]
  education: Education[]
  projects: Project[]
  volunteering: Volunteering[]
  interests: Interest[]
  field: string
  created_at: string
  updated_at: string
}

// Profile with skills joined
export interface ProfileWithSkills extends Profile {
  skill_items: SkillItem[]
}

// ============================================================
// JOB APPLICATION TYPES
// ============================================================

export type ApplicationStatus = 'draft' | 'applied' | 'interviewing' | 'rejected' | 'offered'

// The structured output of the job analysis prompt
export interface JobAnalysis {
  role_title: string
  company_name: string
  responsibilities: string[]
  required_skills: string[]
  nice_to_have_skills: string[]
  gaps: string[]               // skills required but absent from the user's profile
  culture_notes: string
  summary: string
}

export interface JobApplication {
  id: string
  user_id: string
  company_name: string
  role_title: string
  job_ad_text: string
  job_url: string
  job_analysis: JobAnalysis | null
  status: ApplicationStatus
  notes: string
  applied_at: string | null
  created_at: string
  updated_at: string
}

export interface JobApplicationInput {
  company_name: string
  role_title: string
  job_ad_text: string
  job_url?: string
}

// ============================================================
// GENERATED DOCUMENT TYPES
// ============================================================

export type DocumentType = 'cv' | 'cover_letter' | 'cover_letter_short'

export interface GeneratedDocument {
  id: string
  application_id: string
  user_id: string
  document_type: DocumentType
  content: string
  prompt_used: string
  pdf_path: string | null
  model_used: string
  tokens_input: number
  tokens_output: number
  created_at: string
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// The payload sent to the Edge Function
export interface GenerateDocumentsRequest {
  profile: ProfileWithSkills
  job_application: JobApplication
  document_types: DocumentType[]
}

// The response from the Edge Function
export interface GenerateDocumentsResponse {
  documents: {
    type: DocumentType
    content: string
    tokens_input: number
    tokens_output: number
  }[]
  error?: string
}

// ============================================================
// UI STATE TYPES
// ============================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AppError {
  message: string
  code?: string
}
