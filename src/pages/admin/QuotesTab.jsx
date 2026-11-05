import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { INVOICE_CATEGORIES, formatDate, formatMoney } from '../../lib/billing'
import { QUOTE_STATUS_LABELS, computeQuoteTotals, isQuoteExpired } from '../../lib/pricing'

const emptyQuote = {
  targetType: 'client',
  client_id: '',
  prospect_name: '',
  prospect_company: '',
  prospect_email: '',
  prospect_phone: '',
  quote_number: '',
  status: 'draft',
  issue_date: '',
  valid_until: '',
  notes: '',
  discount_type: 'none',
  discount_value: '',
}

const emptyItem = () => ({ key: crypto.randomUUID(), category: INVOICE_CATEGORIES[0], label: '', amount: '' })

function QuotesTab({ clients, quotes, quotesUnavailable, onChanged }) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyQuote)
  const [items, setItems] = useState([emptyItem()])
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loadingItems, setLoadingItems] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  const recipientName = (quote) =>
    clients.find((c) => c.id === quote.client_id)?.company_name || quote.prospect_company || quote.prospect_name || 'Untitled'

  const recipientEmail = (quote) => clients.find((c) => c.id === quote.client_id)?.contact_email || quote.prospect_email

  const buildQuoteMailto = (quote) => {
    const email = recipientEmail(quote)
    if (!email) return null
    const label = quote.quote_number || quote.id.slice(0, 8)
    const subject = `Price Quote ${label} from Metlamarc Tech Solutions`
    const body = [
      `Hello ${recipientName(quote)},`,
      '',
      `Please find your price quote ${label} attached/linked below.`,
      quote.valid_until ? `This quote is valid until ${formatDate(quote.valid_until)}.` : null,
      '',
      'You can view and download the full itemized quote using the link we shared separately, or ask us to resend it.',
      '',
      'Let us know if you have any questions or would like to proceed.',
      '',
      'Thank you,',
      'Metlamarc Tech Solutions',
    ].filter((line) => line !== null)
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.join('\n'))}`
  }

  const startAdd = () => {
    const today = new Date().toISOString().slice(0, 10)
    const valid = new Date()
    valid.setDate(valid.getDate() + 14)
    setForm({ ...emptyQuote, client_id: clients[0]?.id || '', issue_date: today, valid_until: valid.toISOString().slice(0, 10) })
    setItems([emptyItem()])
    setEditingId(null)
    setFormOpen(true)
    setError(null)
  }

  const startEdit = async (quote) => {
    setForm({
      targetType: quote.client_id ? 'client' : 'prospect',
      client_id: quote.client_id || '',
      prospect_name: quote.prospect_name || '',
      prospect_company: quote.prospect_company || '',
      prospect_email: quote.prospect_email || '',
      prospect_phone: quote.prospect_phone || '',
      quote_number: quote.quote_number || '',
      status: quote.status,
      issue_date: quote.issue_date,
      valid_until: quote.valid_until || '',
      notes: quote.notes || '',
      discount_type: quote.discount_type || 'none',
      discount_value: quote.discount_value || '',
    })
    setEditingId(quote.id)
    setFormOpen(true)
    setError(null)
    setLoadingItems(true)

    const { data, error: itemsError } = await supabase
      .from('quote_items')
      .select('*')
      .eq('quote_id', quote.id)
      .order('position')

    if (itemsError) {
      setError(itemsError.message)
      setItems([emptyItem()])
    } else {
      setItems(
        data.length
          ? data.map((item) => ({ key: item.id, category: item.category, label: item.label || '', amount: item.amount }))
          : [emptyItem()],
      )
    }
    setLoadingItems(false)
  }

  const handleField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleItemChange = (key, field, value) => {
    setItems((current) => current.map((item) => (item.key === key ? { ...item, [field]: value } : item)))
  }

  const addItemRow = () => setItems((current) => [...current, emptyItem()])
  const removeItemRow = (key) => setItems((current) => (current.length > 1 ? current.filter((item) => item.key !== key) : current))

  const validItems = items
    .map((item, index) => ({ ...item, amount: Number(item.amount) || 0, position: index }))
    .filter((item) => item.amount > 0 || item.label.trim())
  const totals = computeQuoteTotals(
    validItems,
    form.discount_type === 'none' ? null : form.discount_type,
    form.discount_value,
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    if (validItems.length === 0) {
      setError('Add at least one line item with an amount.')
      return
    }
    if (form.targetType === 'client' && !form.client_id) {
      setError('Choose a client, or switch to "New prospect" and fill in their details.')
      return
    }
    if (form.targetType === 'prospect' && !form.prospect_name.trim()) {
      setError("Enter the prospect's name.")
      return
    }

    setSaving(true)

    const payload = {
      client_id: form.targetType === 'client' ? form.client_id : null,
      prospect_name: form.targetType === 'prospect' ? form.prospect_name : null,
      prospect_company: form.targetType === 'prospect' ? form.prospect_company || null : null,
      prospect_email: form.targetType === 'prospect' ? form.prospect_email || null : null,
      prospect_phone: form.targetType === 'prospect' ? form.prospect_phone || null : null,
      quote_number: form.quote_number || null,
      status: form.status,
      issue_date: form.issue_date,
      valid_until: form.valid_until || null,
      notes: form.notes,
      discount_type: form.discount_type === 'none' ? null : form.discount_type,
      discount_value: form.discount_type === 'none' ? 0 : Number(form.discount_value) || 0,
      currency: 'USD',
    }

    let quoteId = editingId
    const save = (table, data, id) => (id ? supabase.from(table).update(data).eq('id', id) : supabase.from(table).insert(data))

    if (editingId) {
      const { error: updateError } = await save('quotes', payload, editingId)
      if (updateError) {
        setError(updateError.message)
        setSaving(false)
        return
      }
      const { error: deleteItemsError } = await supabase.from('quote_items').delete().eq('quote_id', editingId)
      if (deleteItemsError) {
        setError(deleteItemsError.message)
        setSaving(false)
        return
      }
    } else {
      const { data: inserted, error: insertError } = await supabase.from('quotes').insert(payload).select().single()
      if (insertError) {
        setError(insertError.message)
        setSaving(false)
        return
      }
      quoteId = inserted.id
    }

    const itemRows = validItems.map((item) => ({
      quote_id: quoteId,
      category: item.category,
      label: item.label || null,
      amount: item.amount,
      position: item.position,
    }))

    const { error: itemsError } = await supabase.from('quote_items').insert(itemRows)
    setSaving(false)

    if (itemsError) {
      setError(itemsError.message)
      return
    }

    setFormOpen(false)
    onChanged()
  }

  const handleDelete = async (quote) => {
    if (!confirm(`Delete quote ${quote.quote_number || quote.id.slice(0, 8)}?`)) return
    const { error: deleteError } = await supabase.from('quotes').delete().eq('id', quote.id)
    if (deleteError) {
      alert(deleteError.message)
      return
    }
    onChanged()
  }

  const setStatus = async (quote, status) => {
    const { error: updateError } = await supabase.from('quotes').update({ status }).eq('id', quote.id)
    if (updateError) {
      alert(updateError.message)
      return
    }
    onChanged()
  }

  const convertToInvoice = async (quote) => {
    if (!quote.client_id) {
      alert('Link this quote to an existing client first (edit it and switch to "Existing client") before converting it to an invoice.')
      return
    }
    if (!confirm('Create an invoice from this quote?')) return

    const { data: quoteItems, error: itemsError } = await supabase
      .from('quote_items')
      .select('*')
      .eq('quote_id', quote.id)
      .order('position')

    if (itemsError) {
      alert(itemsError.message)
      return
    }

    const { discountAmount } = computeQuoteTotals(quoteItems || [], quote.discount_type, quote.discount_value)

    const today = new Date().toISOString().slice(0, 10)
    const due = new Date()
    due.setDate(due.getDate() + 14)

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        client_id: quote.client_id,
        invoice_number: null,
        description: `Converted from quote ${quote.quote_number || quote.id.slice(0, 8)}`,
        billing_type: 'one_time',
        currency: 'USD',
        amount: 0,
        issue_date: today,
        due_date: due.toISOString().slice(0, 10),
      })
      .select()
      .single()

    if (invoiceError) {
      alert(invoiceError.message)
      return
    }

    const rows = (quoteItems || []).map((item, index) => ({
      invoice_id: invoice.id,
      category: item.category,
      label: item.label,
      amount: item.amount,
      position: index,
    }))

    if (discountAmount > 0) {
      rows.push({
        invoice_id: invoice.id,
        category: 'Other',
        label: 'Discount applied from quote',
        amount: -discountAmount,
        position: rows.length,
      })
    }

    const { error: insertItemsError } = await supabase.from('invoice_items').insert(rows)
    if (insertItemsError) {
      alert(insertItemsError.message)
      return
    }

    const total = rows.reduce((sum, row) => sum + Number(row.amount), 0)
    await supabase.from('invoices').update({ amount: total }).eq('id', invoice.id)

    alert('Invoice created from this quote — find it in the Invoices tab.')
    onChanged()
  }

  const visibleQuotes = quotes.filter((quote) => statusFilter === 'all' || quote.status === statusFilter)

  if (quotesUnavailable) {
    return (
      <div className="portal-card">
        <h2>Pricing &amp; Quotes</h2>
        <p className="form-error">
          Your database is missing the quotes table. Run supabase/migration-v3.sql in the Supabase SQL Editor to enable
          this tab.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="section-toolbar">
        <h2>Pricing &amp; Quotes</h2>
        <div className="btn-row">
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            {Object.entries(QUOTE_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" type="button" onClick={startAdd}>
            + New Quote
          </button>
        </div>
      </div>

      {formOpen ? (
        <form className="portal-card form-panel" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit quote' : 'New quote'}</h3>
          {error ? <p className="form-error">{error}</p> : null}

          <div className="login-mode-switch" style={{ maxWidth: 360, marginBottom: 18 }}>
            <button
              type="button"
              className={form.targetType === 'client' ? 'is-active' : ''}
              onClick={() => setForm((c) => ({ ...c, targetType: 'client' }))}
            >
              Existing client
            </button>
            <button
              type="button"
              className={form.targetType === 'prospect' ? 'is-active' : ''}
              onClick={() => setForm((c) => ({ ...c, targetType: 'prospect' }))}
            >
              New prospect
            </button>
          </div>

          <div className="form-grid">
            {form.targetType === 'client' ? (
              <label>
                Client
                <select name="client_id" value={form.client_id} onChange={handleField}>
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.company_name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <>
                <label>
                  Prospect name
                  <input name="prospect_name" value={form.prospect_name} onChange={handleField} placeholder="Jane Doe" />
                </label>
                <label>
                  Company
                  <input name="prospect_company" value={form.prospect_company} onChange={handleField} />
                </label>
                <label>
                  Email
                  <input type="email" name="prospect_email" value={form.prospect_email} onChange={handleField} />
                </label>
                <label>
                  Phone
                  <input name="prospect_phone" value={form.prospect_phone} onChange={handleField} />
                </label>
              </>
            )}

            <label>
              Quote number
              <input name="quote_number" value={form.quote_number} onChange={handleField} placeholder="QT-2026-001" />
            </label>
            <label>
              Status
              <select name="status" value={form.status} onChange={handleField}>
                {Object.entries(QUOTE_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Issue date
              <input type="date" name="issue_date" value={form.issue_date} onChange={handleField} required />
            </label>
            <label>
              Valid until
              <input type="date" name="valid_until" value={form.valid_until} onChange={handleField} />
            </label>
            <label>
              Discount
              <select name="discount_type" value={form.discount_type} onChange={handleField}>
                <option value="none">No discount</option>
                <option value="percent">Percentage off</option>
                <option value="fixed">Fixed amount off</option>
              </select>
            </label>
            {form.discount_type !== 'none' ? (
              <label>
                {form.discount_type === 'percent' ? 'Discount %' : 'Discount amount (USD)'}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="discount_value"
                  value={form.discount_value}
                  onChange={handleField}
                />
              </label>
            ) : null}
            <label className="field-span">
              Notes (optional)
              <textarea name="notes" rows="2" value={form.notes} onChange={handleField} />
            </label>
          </div>

          <h3>Line items {loadingItems ? '(loading…)' : ''}</h3>
          <div className="invoice-items-editor">
            {items.map((item) => (
              <div className="invoice-item-row" key={item.key}>
                <select value={item.category} onChange={(event) => handleItemChange(item.key, 'category', event.target.value)}>
                  {INVOICE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={item.label}
                  onChange={(event) => handleItemChange(item.key, 'label', event.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={item.amount}
                  onChange={(event) => handleItemChange(item.key, 'amount', event.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeItemRow(item.key)}
                  disabled={items.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="btn-row" style={{ marginBottom: 16 }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={addItemRow}>
              + Add line item
            </button>
            <span className="invoice-items-total">
              Subtotal {formatMoney(totals.subtotal)}
              {totals.discountAmount > 0 ? ` − ${formatMoney(totals.discountAmount)} discount = ` : ' · Total '}
              {totals.discountAmount > 0 ? formatMoney(totals.total) : null}
            </span>
          </div>

          <div className="btn-row">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save Quote'}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setFormOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="portal-card">
        {visibleQuotes.length === 0 ? (
          <p className="empty-state">No quotes match this filter yet. Create one for the next prospect who reaches out.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Quote</th>
                  <th>For</th>
                  <th>Valid Until</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleQuotes.map((quote) => {
                  const expired = isQuoteExpired(quote)
                  const mailtoHref = buildQuoteMailto(quote)
                  return (
                    <tr key={quote.id}>
                      <td>
                        <strong>{quote.quote_number || quote.id.slice(0, 8)}</strong>
                      </td>
                      <td>{recipientName(quote)}</td>
                      <td>{formatDate(quote.valid_until)}</td>
                      <td>
                        <span className={`badge badge-${expired ? 'overdue' : quote.status === 'accepted' ? 'paid' : quote.status === 'declined' ? 'void' : 'unpaid'}`}>
                          {expired ? 'Expired' : QUOTE_STATUS_LABELS[quote.status]}
                        </span>
                      </td>
                      <td>
                        <div className="btn-row">
                          <Link className="btn btn-ghost btn-sm" to={`/quotes/${quote.id}`} target="_blank">
                            View / Print
                          </Link>
                          {mailtoHref ? (
                            <a className="btn btn-ghost btn-sm" href={mailtoHref}>
                              Email
                            </a>
                          ) : null}
                          {quote.status === 'sent' ? (
                            <button className="btn btn-success btn-sm" type="button" onClick={() => setStatus(quote, 'accepted')}>
                              Mark Accepted
                            </button>
                          ) : null}
                          {quote.status === 'accepted' ? (
                            <button className="btn btn-primary btn-sm" type="button" onClick={() => convertToInvoice(quote)}>
                              Convert to Invoice
                            </button>
                          ) : null}
                          <button className="btn btn-ghost btn-sm" type="button" onClick={() => startEdit(quote)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" type="button" onClick={() => handleDelete(quote)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuotesTab
