import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { useAuth } from '../context/auth-context'
import './portal.css'

function PortalLogin() {
  const { session, role, loading } = useAuth()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (!isSupabaseConfigured) {
    return (
      <div className="login-shell">
        <div className="login-card">
          <p className="form-error" style={{ marginBottom: 0 }}>
            The client/admin portal is not configured yet. Add VITE_SUPABASE_URL and
            VITE_SUPABASE_ANON_KEY (see .env.example) to enable it.
          </p>
        </div>
      </div>
    )
  }

  if (!loading && session && role === 'admin') return <Navigate to="/admin" replace />
  if (!loading && session && role === 'client') return <Navigate to="/client" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFeedback(null)
    setSubmitting(true)

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setFeedback({ type: 'error', text: error.message })
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) {
        setFeedback({ type: 'error', text: error.message })
      } else {
        setFeedback({
          type: 'success',
          text: 'Account created. If email confirmation is enabled on this project, check your inbox before signing in.',
        })
      }
    }

    setSubmitting(false)
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-card-header">
          <img src="/metlamarc-wordmark.svg" alt="Metlamarc wordmark" />
          <h2>Client &amp; Admin Portal</h2>
          <p>Sign in to manage projects, invoices, and site status.</p>
        </div>

        <div className="login-mode-switch">
          <button
            type="button"
            className={mode === 'signin' ? 'is-active' : ''}
            onClick={() => {
              setMode('signin')
              setFeedback(null)
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'is-active' : ''}
            onClick={() => {
              setMode('signup')
              setFeedback(null)
            }}
          >
            Create Client Account
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'signup' ? (
            <label>
              Full Name
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Jane Doe"
                required
              />
            </label>
          ) : null}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </label>

          {feedback ? (
            <p className={`login-feedback is-${feedback.type}`}>{feedback.text}</p>
          ) : null}

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

          {mode === 'signup' ? (
            <p className="form-note">
              New client accounts are linked to your company automatically if this email
              matches the contact email on file. If it doesn't show your projects after
              signing in, contact us to link your account.
            </p>
          ) : null}
        </form>

        <Link className="login-back-link" to="/">
          ← Back to the main site
        </Link>
      </div>
    </div>
  )
}

export default PortalLogin
