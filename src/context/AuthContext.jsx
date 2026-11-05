import { useEffect, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const loadedUserId = useRef(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let isMounted = true

    async function loadProfile(nextSession) {
      if (!nextSession) {
        loadedUserId.current = null
        if (isMounted) setProfile(null)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', nextSession.user.id)
        .single()

      loadedUserId.current = nextSession.user.id
      if (isMounted) setProfile(error ? null : data)
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (!isMounted) return
      setSession(data.session)
      await loadProfile(data.session)
      if (isMounted) setLoading(false)
    })

    // Supabase re-fires this on tab refocus (token refresh) with the same
    // user — only reload the profile when the signed-in user actually
    // changes, and never flip `loading` back on after the initial mount, or
    // every protected route remounts and the dashboard appears to "reset".
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return
      setSession(nextSession)

      const nextUserId = nextSession?.user?.id ?? null
      if (nextUserId !== loadedUserId.current) {
        loadProfile(nextSession)
      }
    })

    return () => {
      isMounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    role: profile?.role ?? null,
    loading,
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
