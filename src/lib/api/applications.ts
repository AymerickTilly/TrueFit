import { supabase } from '@/lib/api/supabase'
import type { JobApplication, JobApplicationInput, ApplicationStatus } from '@/types'

export async function getApplications(userId: string): Promise<JobApplication[]> {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data as JobApplication[]
}

export async function addApplication(
  userId: string,
  input: JobApplicationInput,
): Promise<{ data: JobApplication | null; error: string | null }> {
  const { data, error } = await supabase
    .from('job_applications')
    .insert({ ...input, user_id: userId })
    .select()
    .single()

  return { data: data as JobApplication | null, error: error?.message ?? null }
}

export async function deleteApplication(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('job_applications').delete().eq('id', id)
  return { error: error?.message ?? null }
}

export async function updateStatus(
  id: string,
  status: ApplicationStatus,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('job_applications')
    .update({ status })
    .eq('id', id)

  return { error: error?.message ?? null }
}
