import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getProfile, upsertProfile } from '@/lib/api/profile'
import type { Profile } from '@/types'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getProfile(user.id).then(data => {
      setProfile(data)
      setLoading(false)
    })
  }, [user])

  async function save(
    updates: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
  ): Promise<{ error: string | null }> {
    if (!user) return { error: 'Not authenticated' }
    const { error } = await upsertProfile(user.id, updates)
    if (!error) {
      setProfile(prev => (prev ? { ...prev, ...updates } : null))
    }
    return { error }
  }

  return { profile, loading, save }
}
