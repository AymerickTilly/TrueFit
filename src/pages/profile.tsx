import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { ProfileWizard } from '@/components/profile/profile-wizard'
import { Spinner } from '@/components/ui'

export default function ProfilePage() {
  const { user } = useAuth()
  const { profile, loading, save } = useProfile()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8 sm:py-10">
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
      </div>

      <ProfileWizard profile={profile} save={save} />
    </div>
  )
}
