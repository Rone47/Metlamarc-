import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import {
  BILLING_TYPE_LABELS,
  INVOICE_CATEGORIES,
  computeItemsTotal,
  formatDate,
  formatMoney,
  isInvoiceOverdue,
} from '../../lib/billing'

const emptyInvoice = {
  client_id: '',
  project_id: '',
  invoice_number: '',
  description: '',
  billing_type: 'one_time',
  issue_date: '',
  due_date: '',
}

const emptyItem = () => ({ key: crypto.randomUUID(), category: INVOICE_CATEGORIES[0], label: '', amount: '' })

function InvoicesTab({ clients, projects, invoices, onChanged }) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyInvoice)
  const [items, setItems] = useState([emptyItem()])
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loadingItems, setLoadingItems] = useState(false)
  const [clientFilter, setClientFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const clientName = (clientId) => clients.find((c) => c.id === clientId)?.company_name || 'Unknown client'

  const buildInvoiceMailto = (invoice) => {
    const client = clients.find((c) => c.id === invoice.client_id)
    if (!client?.contact_email) return null

    const label = invoice.invoice_number || invoice.id.slice(0, 8)
    const subject = `Invoice ${label} from Metlamarc Tech Solutions`
    const lines = [
      `Hello ${client.contact_name || client.company_name},`,
      '',
      `Here are the details for invoice ${label}:`,
      '',
      `Amount due: ${formatMoney(invoice.amount, invoice.currency)}`,
      `Billing type: ${BILLING_TYPE_LABELS[invoice.billing_type] || 'One-Time'}`,
      `Issue date: ${formatDate(invoice.issue_date)}`,
      `Due date: ${formatDate(invoice.due_date)}`,
      invoice.description ? `Description: ${invoice.description}` : null,
      '',
      'You can view and print/download the full itemized invoice from your client portal.',
      '',
      'Please let us know once payment has been made, or reach out if you have any questions.',
      '',
      'Thank you,',
      'Metlamarc Tech Solutions',
    ].filter((line) => line !== null)

    return `mailto:${client.contact_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
  }

  const startAdd = () => {
    const today = new Date().toISOString().slice(0, 10)
    const due = new Date()
    due.setDate(due.getDate() + 14)
    setForm({
      ...emptyInvoice,
      client_id: clients[0]?.id || '',
      issue_date: today,
      due_date: due.toISOString().slice(0, 10),
    })
    setItems([emptyItem()])
    setEditingId(null)
    setFormOpen(true)
    setError(null)
  }

  const startEdit = async (invoice) => {
    setForm({
      client_id: invoice.client_id,
      project_id: invoice.project_id || '',
      invoice_number: invoice.invoice_number || '',
      description: invoice.description || '',
      billing_type: invoice.billing_type || 'one_time',
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
    })
    setEditingId(invoice.id)
    setFormOpen(true)
    setError(null)
    setLoadingItems(true)

    const { data, error: itemsError } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoice.id)
      .order('position')

    if (itemsError) {
      setError(itemsError.message)
      setItems([emptyItem()])
    } else {
      setItems(
        data.length
          ? data.map((item) => ({
              key: item.id,
              category: item.category,
              label: item.label || '',
              amount: item.amount,
            }))
          : [emptyItem()],
      )
    }
    setLoadingItems(false)
  }

  const startDuplicateForNextMonth = async (invoice) => {
    setLoadingItems(true)
    const { data, error: itemsError } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoice.id)
      .order('position')

    if (itemsError) {
      alert(itemsError.message)
      setLoadingItems(false)
      return
    }

    const nextIssue = new Date(invoice.issue_date)
    nextIssue.setMonth(nextIssue.getMonth() + 1)
    const nextDue = new Date(invoice.due_date)
    nextDue.setMonth(nextDue.getMonth() + 1)

    setForm({
      client_id: invoice.client_id,
      project_id: invoice.project_id || '',
      invoice_number: '',
      description: invoice.description || '',
      billing_type: 'recurring',
      issue_date: nextIssue.toISOString().slice(0, 10),
      due_date: nextDue.toISOString().slice(0, 10),
    })
    setItems(
      data.length
        ? data.map((item) => ({ key: crypto.randomUUID(), category: item.category, label: item.label || '', amount: item.amount }))
        : [emptyItem()],
    )
    setEditingId(null)
    setFormOpen(true)
    setError(null)
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

  const itemsTotal = computeItemsTotal(items)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const validItems = items
      .map((item, index) => ({ ...item, amount: Number(item.amount) || 0, position: index }))
      .filter((item) => item.amount > 0 || item.label.trim())

    if (validItems.length === 0) {
      setError('Add at least one line item with an amount.')
      setSaving(false)
      return
    }

    const payload = {
      client_id: form.client_id,
      project_id: form.project_id || null,
      invoice_number: form.invoice_number || null,
      description: form.description,
      billing_type: form.billing_type,
      currency: 'USD',
      amount: computeItemsTotal(validItems),
      issue_date: form.issue_date,
      due_date: form.due_date,
    }

    let invoiceId = editingId

    if (editingId) {
      const { error: updateError } = await supabase.from('invoices').update(payload).eq('id', editingId)
      if (updateError) {
        setError(updateError.message)
        setSaving(false)
        return
      }
      const { error: deleteItemsError } = await supabase.from('invoice_items').delete().eq('invoice_id', editingId)
      if (deleteItemsError) {
        setError(deleteItemsError.message)
        setSaving(false)
        return
      }
    } else {
      const { data: inserted, error: insertError } = await supabase.from('invoices').insert(payload).select().single()
      if (insertError) {
        setError(insertError.message)
        setSaving(false)
        return
      }
      invoiceId = inserted.id
    }

    const itemRows = validItems.map((item) => ({
      invoice_id: invoiceId,
      category: item.category,
      label: item.label || null,
      amount: item.amount,
      position: item.position,
    }))

    const { error: itemsError } = await supabase.from('invoice_items').insert(itemRows)
    setSaving(false)

    if (itemsError) {
      setError(itemsError.message)
      return
    }

    setFormOpen(false)
    onChanged()
  }

  const handleDelete = async (invoice) => {
    if (!confirm(`Delete invoice ${invoice.invoice_number || invoice.id.slice(0, 8)}?`)) return
    const { error: deleteError } = await supabase.from('invoices').delete().eq('id', invoice.id)
    if (deleteError) {
      alert(deleteError.message)
      return
    }
    onChanged()
  }

  const toggleStatus = async (invoice) => {
    const nextStatus = invoice.status === 'paid' ? 'unpaid' : 'paid'
    const { error: updateError } = await supabase
      .from('invoices')
      .update({ status: nextStatus, paid_at: nextStatus === 'paid' ? new Date().toISOString() : null })
      .eq('id', invoice.id)
    if (updateError) {
      alert(updateError.message)
      return
    }
    onChanged()
  }

  const visibleInvoices = invoices
    .filter((invoice) => clientFilter === 'all' || invoice.client_id === clientFilter)
    .filter((invoice) => {
      if (statusFilter === 'all') return true
      if (statusFilter === 'overdue') return isInvoiceOverdue(invoice)
      return invoice.status === statusFilter
    })

  const clientProjects = projects.filter((p) => p.client_id === form.client_id)

  return (
    <div>
      <div className="section-toolbar">
        <h2>Invoices</h2>
        <div className="btn-row">
          <select value={clientFilter} onChange={(event) => setClientFilter(event.target.value)}>
            <option value="all">All clients</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.company_name}
              </option>
            ))}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="void">Void</option>
          </select>
          <button
            className="btn btn-primary"
            type="button"
            onClick={startAdd}
            disabled={clients.length === 0}
            title={clients.length === 0 ? 'Add a client first, then you can create an invoice for them' : undefined}
          >
            + Add Invoice
          </button>
        </div>
      </div>

      {clients.length === 0 ? (
        <p className="empty-state">
          The "Add Invoice" button is disabled because there are no clients yet — go to the Clients tab and add one
          first, then come back here.
        </p>
      ) : null}

      {formOpen ? (
        <form className="portal-card form-panel" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit invoice' : 'New invoice'}</h3>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="form-grid">
            <label>
              Client
              <select
                name="client_id"
                value={form.client_id}
                onChange={(event) => setForm((c) => ({ ...c, client_id: event.target.value, project_id: '' }))}
                required
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company_name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Related project (optional)
              <select name="project_id" value={form.project_id} onChange={handleField}>
                <option value="">None</option>
                {clientProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Invoice number
              <input
                name="invoice_number"
                value={form.invoice_number}
                onChange={handleField}
                placeholder="INV-2026-001"
              />
            </label>
            <label>
              Billing type
              <select name="billing_type" value={form.billing_type} onChange={handleField}>
                <option value="one_time">One-time charge</option>
                <option value="recurring">Monthly recurring charge</option>
              </select>
            </label>
            <label>
              Issue date
              <input type="date" name="issue_date" value={form.issue_date} onChange={handleField} required />
            </label>
            <label>
              Due date
              <input type="date" name="due_date" value={form.due_date} onChange={handleField} required />
            </label>
            <label className="field-span">
              Notes (optional)
              <textarea
                name="description"
                rows="2"
                value={form.description}
                onChange={handleField}
                placeholder="Anything else the client should know about this invoice"
              />
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
            <span className="invoice-items-total">Total: {formatMoney(itemsTotal, 'USD')}</span>
          </div>

          <div className="btn-row">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save Invoice'}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setFormOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="portal-card">
        {visibleInvoices.length === 0 ? (
          <p className="empty-state">No invoices match this filter yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleInvoices.map((invoice) => {
                  const overdue = isInvoiceOverdue(invoice)
                  const mailtoHref = buildInvoiceMailto(invoice)
                  return (
                    <tr key={invoice.id}>
                      <td>
                        <strong>{invoice.invoice_number || invoice.id.slice(0, 8)}</strong>
                        {invoice.description ? <div>{invoice.description}</div> : null}
                      </td>
                      <td>{clientName(invoice.client_id)}</td>
                      <td>{BILLING_TYPE_LABELS[invoice.billing_type] || 'One-Time'}</td>
                      <td>{formatMoney(invoice.amount, invoice.currency)}</td>
                      <td>{formatDate(invoice.due_date)}</td>
                      <td>
                        <span className={`badge badge-${overdue ? 'overdue' : invoice.status}`}>
                          {overdue ? 'Overdue' : invoice.status}
                        </span>
                      </td>
                      <td>
                        <div className="btn-row">
                          {invoice.status !== 'void' ? (
                            <button
                              className={`btn btn-sm ${invoice.status === 'paid' ? 'btn-ghost' : 'btn-success'}`}
                              type="button"
                              onClick={() => toggleStatus(invoice)}
                            >
                              {invoice.status === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
                            </button>
                          ) : null}
                          <Link className="btn btn-ghost btn-sm" to={`/invoices/${invoice.id}`} target="_blank">
                            View / Print
                          </Link>
                          {mailtoHref ? (
                            <a className="btn btn-ghost btn-sm" href={mailtoHref}>
                              Email
                            </a>
                          ) : null}
                          {invoice.billing_type === 'recurring' ? (
                            <button
                              className="btn btn-ghost btn-sm"
                              type="button"
                              onClick={() => startDuplicateForNextMonth(invoice)}
                            >
                              Bill Next Month
                            </button>
                          ) : null}
                          <button className="btn btn-ghost btn-sm" type="button" onClick={() => startEdit(invoice)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" type="button" onClick={() => handleDelete(invoice)}>
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

export default InvoicesTab
