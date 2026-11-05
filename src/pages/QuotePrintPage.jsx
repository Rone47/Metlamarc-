import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { supabase } from '../lib/supabaseClient'
import { formatDate, formatDateTime, formatMoney } from '../lib/billing'
import { COMPANY, SIGNATORIES } from '../lib/company'
import { QUOTE_STATUS_LABELS, computeQuoteTotals, isQuoteExpired } from '../lib/pricing'
import './invoice-print.css'

function QuotePrintPage() {
  const { quoteId } = useParams()
  const { session, loading: authLoading } = useAuth()
  const [quote, setQuote] = useState(null)
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
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single()

      if (!isMounted) return

      if (quoteError || !quoteData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      const [{ data: clientData }, { data: itemsData }] = await Promise.all([
        quoteData.client_id
          ? supabase.from('clients').select('*').eq('id', quoteData.client_id).single()
          : Promise.resolve({ data: null }),
        supabase.from('quote_items').select('*').eq('quote_id', quoteId).order('position'),
      ])

      if (!isMounted) return

      setQuote(quoteData)
      setClient(clientData || null)
      setItems(itemsData || [])
      setLoading(false)
    }

    load()
    return () => {
      isMounted = false
    }
  }, [quoteId, session])

  if (!authLoading && !session) return <Navigate to="/portal/login" replace />

  if (authLoading || loading) {
    return (
      <div className="invoice-not-found">
        <p>Loading quote…</p>
      </div>
    )
  }

  if (notFound || !quote) {
    return (
      <div className="invoice-not-found">
        <div>
          <h2>Quote not found</h2>
          <p>It may have been deleted, or you don't have access to it.</p>
          <Link to="/">← Back to main site</Link>
        </div>
      </div>
    )
  }

  const [ceo, cofounder] = SIGNATORIES
  const generatedAt = formatDateTime(new Date())
  const totals = computeQuoteTotals(items, quote.discount_type, quote.discount_value)
  const expired = isQuoteExpired(quote)
  const recipientName = client?.company_name || quote.prospect_company || quote.prospect_name || 'Prospective Client'
  const contactName = client?.contact_name || quote.prospect_name

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
      pdf.save(`Quote-${quote.quote_number || quote.id.slice(0, 8)}.pdf`)
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
            <h1>PRICE QUOTE</h1>
            <dl>
              <div>
                <dt>No.</dt>
                <dd>{quote.quote_number || quote.id.slice(0, 8).toUpperCase()}</dd>
              </div>
              <div>
                <dt>Issued</dt>
                <dd>{formatDate(quote.issue_date)}</dd>
              </div>
              <div>
                <dt>Valid Until</dt>
                <dd>{formatDate(quote.valid_until)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="invoice-parties">
          <div>
            <h4>Prepared For</h4>
            <strong>{recipientName}</strong>
            {contactName && contactName !== recipientName ? <p>{contactName}</p> : null}
            {(client?.contact_email || quote.prospect_email) ? <p>{client?.contact_email || quote.prospect_email}</p> : null}
            {(client?.contact_phone || quote.prospect_phone) ? <p>{client?.contact_phone || quote.prospect_phone}</p> : null}
          </div>
          <div>
            <h4>From</h4>
            <strong>{COMPANY.tradingName}</strong>
            <p>{COMPANY.legalName}</p>
            <p>{COMPANY.email}</p>
          </div>
        </div>

        <div className="invoice-badges">
          <span className={`badge badge-${expired ? 'overdue' : quote.status === 'accepted' ? 'paid' : quote.status === 'declined' ? 'void' : 'unpaid'}`}>
            {expired ? 'Expired' : QUOTE_STATUS_LABELS[quote.status]}
          </span>
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
                <td colSpan={3}>No line items on file for this quote.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.category}</strong>
                  </td>
                  <td>{item.label || '—'}</td>
                  <td>{formatMoney(item.amount, quote.currency)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="invoice-total-row" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>Subtotal</span>
            <strong style={{ fontSize: '1rem' }}>{formatMoney(totals.subtotal, quote.currency)}</strong>
          </div>
          {totals.discountAmount > 0 ? (
            <div style={{ display: 'flex', gap: 20 }}>
              <span>
                Discount {quote.discount_type === 'percent' ? `(${quote.discount_value}%)` : ''}
              </span>
              <strong style={{ fontSize: '1rem', color: '#b91c1c' }}>
                −{formatMoney(totals.discountAmount, quote.currency)}
              </strong>
            </div>
          ) : null}
          <div style={{ display: 'flex', gap: 20 }}>
            <span>Total ({quote.currency})</span>
            <strong>{formatMoney(totals.total, quote.currency)}</strong>
          </div>
        </div>

        {quote.notes ? (
          <div className="invoice-notes">
            <strong>Notes:</strong> {quote.notes}
          </div>
        ) : null}

        <div className="invoice-notes" style={{ background: 'transparent', padding: '4px 0' }}>
          This is a price quote, not an invoice. Pricing is valid until the date shown above and is subject to change
          after that date.
        </div>

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
              QUOTE
              <span className="invoice-stamp-date">{formatDate(new Date())}</span>
            </div>
          </div>
        </div>

        <div className="invoice-footer">
          {COMPANY.legalName} · Generated {generatedAt} · Thank you for considering us.
        </div>
      </div>
    </div>
  )
}

export default QuotePrintPage
