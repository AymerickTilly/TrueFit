import { supabase } from '@/lib/api/supabase'
import type { Profile } from '@/types'

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data as Profile
}

export async function upsertProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
): Promise<{ data: Profile | null; error: string | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ ...updates, user_id: userId }, { onConflict: 'user_id' })
    .select()
    .single()

  return { data: data as Profile | null, error: error?.message ?? null }
}
