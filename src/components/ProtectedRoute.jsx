import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import '../pages/portal.css'

function ProtectedRoute({ role, children }) {
  const { session, role: userRole, loading } = useAuth()

  if (!isSupabaseConfigured) return <Navigate to="/portal/login" replace />

  if (loading) {
    return (
      <div className="portal-loading">
        <p>Loading your portal…</p>
      </div>
    )
  }

  if (!session) return <Navigate to="/portal/login" replace />

  if (userRole !== role) {
    return (
      <div className="portal-denied">
        <div>
          <h2>Account not linked yet</h2>
          <p>
            Your login doesn't have {role} access. If you believe this is a mistake,
            contact Metlamarc to link your account to the right company or role.
          </p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
