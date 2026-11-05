import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PortalHeader from '../components/PortalHeader'
import Icon from '../components/Icon'
import { useAuth } from '../context/auth-context'
import { supabase } from '../lib/supabaseClient'
import { computeClientStatus, formatDate, formatMoney, isInvoiceOverdue } from '../lib/billing'
import { PROJECT_STATUS_LABELS } from '../lib/projects'
import { QUOTE_STATUS_LABELS, isQuoteExpired } from '../lib/pricing'
import './portal.css'

function ClientPortal() {
  const { profile } = useAuth()
  const [client, setClient] = useState(null)
  const [projects, setProjects] = useState([])
  const [invoices, setInvoices] = useState([])
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!profile?.client_id) return

    let isMounted = true

    async function load() {
      const [clientRes, projectsRes, invoicesRes, quotesRes] = await Promise.all([
        supabase.from('clients').select('*').eq('id', profile.client_id).single(),
        supabase.from('projects').select('*').eq('client_id', profile.client_id).order('created_at', { ascending: false }),
        supabase.from('invoices').select('*').eq('client_id', profile.client_id).order('due_date', { ascending: true }),
        supabase.from('quotes').select('*').eq('client_id', profile.client_id).order('created_at', { ascending: false }),
      ])

      if (!isMounted) return

      const firstError = clientRes.error || projectsRes.error || invoicesRes.error
      if (firstError) {
        setError(firstError.message)
      } else {
        setClient(clientRes.data)
        setProjects(projectsRes.data || [])
        setInvoices(invoicesRes.data || [])
        // Quotes table may not exist yet on an un-migrated database — don't
        // block the rest of the portal if that query fails.
        setQuotes(quotesRes.error ? [] : quotesRes.data || [])
      }
      setLoading(false)
    }

    load()
    return () => {
      isMounted = false
    }
  }, [profile?.client_id])

  return (
    <div className="portal-shell">
      <PortalHeader tag="Client" />
      <main className="portal-main">
        <div className="portal-page-heading">
          <h1>Your Account</h1>
          <p>Track your project progress, site status, and invoices with Metlamarc.</p>
        </div>

        {!profile?.client_id ? (
          <div className="portal-card">
            <p>
              Your login isn't linked to a client company yet. This usually happens if you signed up before
              Metlamarc added your company record, or with a different email than the one on file. Contact us and
              we'll link your account.
            </p>
          </div>
        ) : loading ? (
          <p className="empty-state">Loading your account…</p>
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : (
          <>
            {(() => {
              const { isSuspended } = computeClientStatus(client, invoices)
              return isSuspended ? (
                <div className="status-banner status-banner-suspended">
                  <Icon type="alert" />
                  <div>
                    <h3>Your site is currently suspended</h3>
                    <p>
                      One or more invoices are past due. Please settle the outstanding balance below to restore
                      access. Contact Metlamarc if you've already paid and this hasn't updated yet.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="status-banner status-banner-active">
                  <Icon type="check" />
                  <div>
                    <h3>Your account is active</h3>
                    <p>Your site and services are running normally.</p>
                  </div>
                </div>
              )
            })()}

            <div className="portal-card" style={{ marginBottom: 24 }}>
              <div className="section-toolbar">
                <h2>Projects</h2>
              </div>
              {projects.length === 0 ? (
                <p className="empty-state">No projects on file yet.</p>
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Delivered</th>
                        <th>Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.id}>
                          <td>
                            <strong>{project.title}</strong>
                            {project.description ? <div>{project.description}</div> : null}
                          </td>
                          <td>
                            <span className={`badge badge-${project.status}`}>
                              {PROJECT_STATUS_LABELS[project.status]}
                            </span>
                          </td>
                          <td>{formatDate(project.delivered_date)}</td>
                          <td>
                            {project.live_url ? (
                              <a href={project.live_url} target="_blank" rel="noreferrer">
                                Visit live site
                              </a>
                            ) : project.subdomain_url ? (
                              <a href={project.subdomain_url} target="_blank" rel="noreferrer">
                                Preview (in progress)
                              </a>
                            ) : (
                              'Not yet live'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {quotes.length > 0 ? (
              <div className="portal-card" style={{ marginBottom: 24 }}>
                <div className="section-toolbar">
                  <h2>Price Quotes</h2>
                </div>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Quote</th>
                        <th>Valid Until</th>
                        <th>Status</th>
                        <th>Document</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.map((quote) => {
                        const expired = isQuoteExpired(quote)
                        return (
                          <tr key={quote.id}>
                            <td>
                              <strong>{quote.quote_number || quote.id.slice(0, 8)}</strong>
                            </td>
                            <td>{formatDate(quote.valid_until)}</td>
                            <td>
                              <span
                                className={`badge badge-${expired ? 'overdue' : quote.status === 'accepted' ? 'paid' : quote.status === 'declined' ? 'void' : 'unpaid'}`}
                              >
                                {expired ? 'Expired' : QUOTE_STATUS_LABELS[quote.status]}
                              </span>
                            </td>
                            <td>
                              <Link className="btn btn-ghost btn-sm" to={`/quotes/${quote.id}`} target="_blank">
                                View / Print
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            <div className="portal-card">
              <div className="section-toolbar">
                <h2>Invoices</h2>
              </div>
              {invoices.length === 0 ? (
                <p className="empty-state">No invoices on file yet.</p>
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Invoice</th>
                        <th>Amount</th>
                        <th>Due</th>
                        <th>Status</th>
                        <th>Document</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => {
                        const overdue = isInvoiceOverdue(invoice)
                        return (
                          <tr key={invoice.id}>
                            <td>
                              <strong>{invoice.invoice_number || invoice.id.slice(0, 8)}</strong>
                              {invoice.description ? <div>{invoice.description}</div> : null}
                            </td>
                            <td>{formatMoney(invoice.amount, invoice.currency)}</td>
                            <td>{formatDate(invoice.due_date)}</td>
                            <td>
                              <span className={`badge badge-${overdue ? 'overdue' : invoice.status}`}>
                                {overdue ? 'Overdue' : invoice.status}
                              </span>
                            </td>
                            <td>
                              <Link className="btn btn-ghost btn-sm" to={`/invoices/${invoice.id}`} target="_blank">
                                View / Print
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="form-note">
                To settle a balance, contact Metlamarc directly — payments are currently confirmed manually.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default ClientPortal
