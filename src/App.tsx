import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { AuthProvider } from '@/hooks/use-auth'
import { useAuth } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/layout/protected-route'
import { AppShell } from '@/components/layout/app-shell'
import LoginPage from '@/pages/login'
import SignupPage from '@/pages/signup'
import ForgotPasswordPage from '@/pages/forgot-password'
import ResetPasswordPage from '@/pages/reset-password'
import ProfilePage from '@/pages/profile'
import ApplicationsPage from '@/pages/applications'
import GeneratePage from '@/pages/generate'
import AccountPage from '@/pages/account'

// Registers the PASSWORD_RECOVERY redirect inside the router so useNavigate works.
function PasswordRecoveryHandler() {
  const { registerPasswordRecoveryHandler } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    registerPasswordRecoveryHandler(() => navigate('/reset-password', { replace: true }))
  }, [registerPasswordRecoveryHandler, navigate])

  return null
}

function AppLayout() {
  return (
    <AppShell>
      <Routes>
        <Route path="/profile"      element={<ProfilePage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/generate"     element={<GeneratePage />} />
        <Route path="/account"      element={<AccountPage />} />
        <Route path="*"             element={<Navigate to="/profile" replace />} />
      </Routes>
    </AppShell>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PasswordRecoveryHandler />
        <Routes>
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/signup"          element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ResetPasswordPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
