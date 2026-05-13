import { supabase } from '@/lib/api/supabase'
import type { SkillItem, SkillItemInput } from '@/types'

export async function getSkills(profileId: string): Promise<SkillItem[]> {
  const { data, error } = await supabase
    .from('skill_items')
    .select('*')
    .eq('profile_id', profileId)
    .order('sort_order', { ascending: true })

  if (error) return []
  return data as SkillItem[]
}

export async function addSkill(
  profileId: string,
  skill: SkillItemInput,
): Promise<{ data: SkillItem | null; error: string | null }> {
  const { data, error } = await supabase
    .from('skill_items')
    .insert({ ...skill, profile_id: profileId })
    .select()
    .single()

  return { data: data as SkillItem | null, error: error?.message ?? null }
}

export async function deleteSkill(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('skill_items').delete().eq('id', id)
  return { error: error?.message ?? null }
}
