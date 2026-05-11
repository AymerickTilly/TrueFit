// src/lib/api/supabase.ts
// Supabase client and typed query helpers.

import { createClient } from '@supabase/supabase-js'
import type {
  Profile,
  ProfileWithSkills,
  SkillItem,
  SkillItemInput,
  JobApplication,
  JobApplicationInput,
  GeneratedDocument,
  DocumentType,
  ApiResponse,
} from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================
// PROFILE QUERIES
// ============================================================

export async function getProfile(userId: string): Promise<ApiResponse<ProfileWithSkills>> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (profileError) {
    if (profileError.code === 'PGRST116') {
      // No profile found — not an error, just no data yet
      return { data: null, error: null }
    }
    return { data: null, error: profileError.message }
  }

  const { data: skills, error: skillsError } = await supabase
    .from('skill_items')
    .select('*')
    .eq('profile_id', profile.id)
    .order('sort_order', { ascending: true })

  if (skillsError) {
    return { data: null, error: skillsError.message }
  }

  return {
    data: { ...profile, skill_items: skills ?? [] } as ProfileWithSkills,
    error: null,
  }
}

export async function upsertProfile(
  userId: string,
  profileData: Partial<Profile>
): Promise<ApiResponse<Profile>> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ ...profileData, user_id: userId })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as Profile, error: null }
}

// ============================================================
// SKILL QUERIES
// ============================================================

export async function upsertSkills(
  profileId: string,
  skills: SkillItemInput[]
): Promise<ApiResponse<SkillItem[]>> {
  // Delete existing skills for this profile and re-insert
  // This keeps the logic simple — replace the full list on save
  const { error: deleteError } = await supabase
    .from('skill_items')
    .delete()
    .eq('profile_id', profileId)

  if (deleteError) return { data: null, error: deleteError.message }

  if (skills.length === 0) return { data: [], error: null }

  const { data, error } = await supabase
    .from('skill_items')
    .insert(skills.map((s, i) => ({ ...s, profile_id: profileId, sort_order: i })))
    .select()

  if (error) return { data: null, error: error.message }
  return { data: data as SkillItem[], error: null }
}

// ============================================================
// JOB APPLICATION QUERIES
// ============================================================

export async function getJobApplications(userId: string): Promise<ApiResponse<JobApplication[]>> {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data: data as JobApplication[], error: null }
}

export async function createJobApplication(
  userId: string,
  input: JobApplicationInput
): Promise<ApiResponse<JobApplication>> {
  const { data, error } = await supabase
    .from('job_applications')
    .insert({ ...input, user_id: userId })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as JobApplication, error: null }
}

export async function updateJobApplication(
  id: string,
  updates: Partial<JobApplication>
): Promise<ApiResponse<JobApplication>> {
  const { data, error } = await supabase
    .from('job_applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as JobApplication, error: null }
}

// ============================================================
// GENERATED DOCUMENT QUERIES
// ============================================================

export async function saveGeneratedDocument(
  userId: string,
  applicationId: string,
  documentType: DocumentType,
  content: string,
  promptUsed: string,
  modelUsed: string,
  tokensInput: number,
  tokensOutput: number
): Promise<ApiResponse<GeneratedDocument>> {
  const { data, error } = await supabase
    .from('generated_documents')
    .insert({
      user_id: userId,
      application_id: applicationId,
      document_type: documentType,
      content,
      prompt_used: promptUsed,
      model_used: modelUsed,
      tokens_input: tokensInput,
      tokens_output: tokensOutput,
    })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as GeneratedDocument, error: null }
}

export async function getDocumentsForApplication(
  applicationId: string
): Promise<ApiResponse<GeneratedDocument[]>> {
  const { data, error } = await supabase
    .from('generated_documents')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data: data as GeneratedDocument[], error: null }
}

// ============================================================
// GENERATION — calls the Edge Function
// ============================================================

export async function callGenerateDocuments(
  prompts: { type: string; content: string }[]
): Promise<{ documents: { type: string; content: string; tokens_input: number; tokens_output: number; model_used: string }[] }> {
  const { data, error } = await supabase.functions.invoke('generate-documents', {
    body: { prompts },
  })

  if (error) throw new Error(error.message)
  return data
}
