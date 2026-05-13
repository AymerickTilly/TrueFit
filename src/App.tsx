import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/layout/protected-route'
import { AppShell } from '@/components/layout/app-shell'
import LoginPage from '@/pages/login'
import SignupPage from '@/pages/signup'
import ProfilePage from '@/pages/profile'
import ApplicationsPage from '@/pages/applications'
import GeneratePage from '@/pages/generate'

function AppLayout() {
  return (
    <AppShell>
      <Routes>
        <Route path="/profile"      element={<ProfilePage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/generate"     element={<GeneratePage />} />
        <Route path="*"             element={<Navigate to="/profile" replace />} />
      </Routes>
    </AppShell>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
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
