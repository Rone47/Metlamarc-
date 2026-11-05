import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { supabase } from '../lib/supabaseClient'
import { BILLING_TYPE_LABELS, formatDate, formatDateTime, formatMoney } from '../lib/billing'
import { COMPANY, SIGNATORIES } from '../lib/company'
import './invoice-print.css'

function InvoicePrintPage() {
  const { invoiceId } = useParams()
  const { session, loading: authLoading } = useAuth()
  const [invoice, setInvoice] = useState(null)
  const [client, setClient] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const sheetRef = useRef(null)

  useEffect(() => {
    if (!session) return
    let isMounted = true

    async function load() {
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single()

      if (!isMounted) return

      if (invoiceError || !invoiceData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      const [{ data: clientData }, { data: itemsData }] = await Promise.all([
        supabase.from('clients').select('*').eq('id', invoiceData.client_id).single(),
        supabase.from('invoice_items').select('*').eq('invoice_id', invoiceId).order('position'),
      ])

      if (!isMounted) return

      setInvoice(invoiceData)
      setClient(clientData || null)
      setItems(itemsData || [])
      setLoading(false)
    }

    load()
    return () => {
      isMounted = false
    }
  }, [invoiceId, session])

  if (!authLoading && !session) return <Navigate to="/portal/login" replace />

  if (authLoading || loading) {
    return (
      <div className="invoice-not-found">
        <p>Loading invoice…</p>
      </div>
    )
  }

  if (notFound || !invoice) {
    return (
      <div className="invoice-not-found">
        <div>
          <h2>Invoice not found</h2>
          <p>It may have been deleted, or you don't have access to it.</p>
          <Link to="/">← Back to main site</Link>
        </div>
      </div>
    )
  }

  const [ceo, cofounder] = SIGNATORIES
  const generatedAt = formatDateTime(new Date())

  const handleDownloadPdf = async () => {
    if (!sheetRef.current || downloading) return
    setDownloading(true)
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      if (document.fonts?.ready) await document.fonts.ready

      const canvas = await html2canvas(sheetRef.current, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'l' : 'p',
        unit: 'px',
        format: [canvas.width, canvas.height],
        compress: true,
      })
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, canvas.width, canvas.height)
      pdf.save(`Invoice-${invoice.invoice_number || invoice.id.slice(0, 8)}.pdf`)
    } catch {
      alert("Couldn't generate the PDF. Try the Print button instead and choose \"Save as PDF\".")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="invoice-page">
      <div className="invoice-toolbar no-print">
        <Link to="/">← Back</Link>
        <div className="btn-row">
          <button className="btn btn-ghost" type="button" onClick={() => window.print()}>
            Print
          </button>
          <button className="btn btn-primary" type="button" onClick={handleDownloadPdf} disabled={downloading}>
            {downloading ? 'Preparing PDF…' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="invoice-sheet" ref={sheetRef}>
        <div className="invoice-letterhead">
          <div className="invoice-letterhead-brand">
            <img src="/metlamarc-wordmark.svg" alt="" />
            <strong>{COMPANY.tradingName}</strong>
            <span>{COMPANY.tagline}</span>
            <div className="invoice-letterhead-contact">
              {COMPANY.email}
              <br />
              {ceo.phone} (Kenya)
            </div>
          </div>
          <div className="invoice-letterhead-meta">
            <h1>INVOICE</h1>
            <dl>
              <div>
                <dt>No.</dt>
                <dd>{invoice.invoice_number || invoice.id.slice(0, 8).toUpperCase()}</dd>
              </div>
              <div>
                <dt>Issued</dt>
                <dd>{formatDate(invoice.issue_date)}</dd>
              </div>
              <div>
                <dt>Due</dt>
                <dd>{formatDate(invoice.due_date)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="invoice-parties">
          <div>
            <h4>Billed To</h4>
            <strong>{client?.company_name || 'Client'}</strong>
            {client?.contact_name ? <p>{client.contact_name}</p> : null}
            {client?.contact_email ? <p>{client.contact_email}</p> : null}
            {client?.contact_phone ? <p>{client.contact_phone}</p> : null}
          </div>
          <div>
            <h4>From</h4>
            <strong>{COMPANY.tradingName}</strong>
            <p>{COMPANY.legalName}</p>
            <p>{COMPANY.email}</p>
          </div>
        </div>

        <div className="invoice-badges">
          <span className={`badge badge-${invoice.status === 'paid' ? 'paid' : 'unpaid'}`}>{invoice.status}</span>
          <span className="badge badge-in_progress">{BILLING_TYPE_LABELS[invoice.billing_type] || 'One-Time'}</span>
        </div>

        <table className="invoice-items-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={3}>No line items on file for this invoice.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.category}</strong>
                  </td>
                  <td>{item.label || '—'}</td>
                  <td>{formatMoney(item.amount, invoice.currency)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="invoice-total-row">
          <span>Total Due ({invoice.currency})</span>
          <strong>{formatMoney(invoice.amount, invoice.currency)}</strong>
        </div>

        {invoice.description ? (
          <div className="invoice-notes">
            <strong>Notes:</strong> {invoice.description}
          </div>
        ) : null}

        <div className="invoice-signoff">
          <div className="invoice-signature">
            <strong className="signature-script">{ceo.name}</strong>
            <div className="signature-line">
              <div className="signature-name">{ceo.name}</div>
              <div className="signature-title">{ceo.title}</div>
              <div className="signature-contact">
                {ceo.email} · {ceo.phone}
              </div>
            </div>
          </div>

          <div className="invoice-signature">
            <strong className="signature-script">{cofounder.name}</strong>
            <div className="signature-line">
              <div className="signature-name">{cofounder.name}</div>
              <div className="signature-title">{cofounder.title}</div>
              <div className="signature-contact">{cofounder.phone}</div>
            </div>
          </div>

          <div className="invoice-stamp" aria-hidden="true">
            <div className="invoice-stamp-inner">
              <span className="invoice-stamp-brand">Metlamarc Tech Solutions</span>
              OFFICIAL
              <span className="invoice-stamp-date">{formatDate(new Date())}</span>
            </div>
          </div>
        </div>

        <div className="invoice-footer">
          {COMPANY.legalName} · Generated {generatedAt} · Thank you for your business.
        </div>
      </div>
    </div>
  )
}

export default InvoicePrintPage
