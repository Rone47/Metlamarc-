import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

async function fetchAll() {
  const [clientsRes, projectsRes, invoicesRes, quotesRes] = await Promise.all([
    supabase.from('clients').select('*').order('company_name'),
    supabase.from('projects').select('*').order('created_at', { ascending: false }),
    supabase.from('invoices').select('*').order('due_date', { ascending: true }),
    supabase.from('quotes').select('*').order('created_at', { ascending: false }),
  ])

  const firstError = clientsRes.error || projectsRes.error || invoicesRes.error
  if (firstError) return { error: firstError.message }

  return {
    clients: clientsRes.data || [],
    projects: projectsRes.data || [],
    invoices: invoicesRes.data || [],
    // Quotes are a newer table (migration-v3.sql) — don't let a missing
    // table on an un-migrated database block the rest of the dashboard.
    quotes: quotesRes.error ? [] : quotesRes.data || [],
    quotesUnavailable: Boolean(quotesRes.error),
  }
}

export function useAdminData() {
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [invoices, setInvoices] = useState([])
  const [quotes, setQuotes] = useState([])
  const [quotesUnavailable, setQuotesUnavailable] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const applyResult = (result, setLoadingFalse) => {
    if (result.error) {
      setError(result.error)
    } else {
      setError(null)
      setClients(result.clients)
      setProjects(result.projects)
      setInvoices(result.invoices)
      setQuotes(result.quotes)
      setQuotesUnavailable(result.quotesUnavailable)
    }
    if (setLoadingFalse) setLoading(false)
  }

  const refresh = useCallback(async () => {
    const result = await fetchAll()
    applyResult(result, false)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function load() {
      const result = await fetchAll()
      if (!isMounted) return
      applyResult(result, true)
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  return { clients, projects, invoices, quotes, quotesUnavailable, loading, error, refresh }
}
