import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

function PortalHeader({ tag }) {
  const { profile, user, signOut } = useAuth()

  return (
    <header className="portal-header">
      <div className="portal-header-brand">
        <img src="/metlamarc-wordmark.svg" alt="Metlamarc wordmark" />
        <span className="portal-header-tag">{tag}</span>
      </div>
      <div className="portal-header-user">
        <Link className="portal-home-link" to="/">
          Main site
        </Link>
        <span>{profile?.full_name || user?.email}</span>
        <button className="portal-signout" type="button" onClick={signOut}>
          Sign out
        </button>
      </div>
    </header>
  )
}

export default PortalHeader
